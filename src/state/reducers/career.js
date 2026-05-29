import { simulateTicks } from './time.js';
import { getProjectsForTrackAndTier, CAREER_TRACKS, JOB_SEARCH_OPTIONS, CAREER_ACTIVITY_WINDOWS } from '../../data/projects.js';
import { getWorkEventsForContext } from '../../data/workEvents.js';
import { gigs, sideHustles } from '../../data/gigs.js';
import { describeElapsedDuration, describeTimePassage, getTimeWindowStatus } from '../../sim/time.js';
import { getBusinessById, getJobOpeningsForSettlement } from '../../data/businesses.js';
import { getBusinessStaff } from '../../data/workforceNpcs.js';
import { createScheduleTemplate, getShiftAttendanceStatus, getShiftForDay, withAttendanceRecord } from '../../sim/workSchedule.js';

const getCurrentSettlementId = (state) => (
  state.activeLocation === 'home' ? 'Endleigh' : state.activeLocation
);

const selectOpening = (openings, state, optionId) => {
  if (openings.length === 0) return null;
  const seed = (state.time.day * 7) + optionId.length + (state.stats.socialIq || 0);
  return openings[seed % openings.length];
};

const getOutcomeText = (text, context) => (
  typeof text === 'function' ? text(context) : text
);

export const careerReducer = (state, action) => {
  switch (action.type) {
    case 'JOB_HUNT': {
      const { optionId } = action.payload;
      const option = JOB_SEARCH_OPTIONS[optionId];
      if (!option || state.career.activeTrack) return state;

      if (option.requiresItem && !state.inventory?.[option.requiresItem]) {
        return {
          ...state,
          logs: [`You need ${option.requiresItem.replaceAll('_', ' ')} for ${option.name}.`, ...state.logs].slice(0, 20)
        };
      }

      const timeStatus = getTimeWindowStatus(state.time, option.availableWindow, option.durationTicks);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`${option.name} is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      const settlementId = getCurrentSettlementId(state);
      const openings = getJobOpeningsForSettlement(settlementId, option.id);
      const opening = selectOpening(openings, state, option.id);
      if (!opening) {
        return {
          ...state,
          logs: [`No ${option.name.toLowerCase()} openings are listed in ${settlementId} right now. Try another town.`, ...state.logs].slice(0, 20)
        };
      }

      let nextState = simulateTicks(state, option.durationTicks);
      const timePassage = describeTimePassage(
        state.time,
        nextState.time,
        option.activityText || option.name.toLowerCase()
      );
      nextState.needs.energy = Math.max(0, nextState.needs.energy - option.energyCost);
      if (option.moodCost) nextState.needs.mood = Math.max(0, nextState.needs.mood - option.moodCost);
      if (option.hygieneCost) nextState.needs.hygiene = Math.max(0, nextState.needs.hygiene - option.hygieneCost);
      const outcomeContext = {
        option,
        opening,
        settlementId,
        startTime: state.time,
        endTime: nextState.time,
        durationLabel: describeElapsedDuration(state.time, nextState.time),
      };

      const score = (nextState.stats[option.primaryStat] || 0) +
        Math.floor((nextState.stats[option.secondaryStat] || 0) / 2) +
        option.scoreBonus;

      if (score < option.minimumScore) {
        const failLog = getOutcomeText(option.failLog, outcomeContext);
        return {
          ...nextState,
          logs: [`${timePassage} ${failLog} (${score}/${option.minimumScore})`, ...nextState.logs].slice(0, 20)
        };
      }

      const trackData = CAREER_TRACKS[opening.track];
      const startingTitle = trackData?.levels[0]?.title || 'Starter Role';
      const employer = getBusinessById(opening.businessId);
      const staff = getBusinessStaff(employer);
      const successLog = getOutcomeText(option.successLog, { ...outcomeContext, employer });

      return {
        ...nextState,
        career: {
          ...nextState.career,
          activeTrack: opening.track,
          employerId: opening.businessId,
          jobTitle: opening.title,
          currentProject: null,
          projectProgress: 0,
          promotionPoints: 0,
          titleLevel: 1,
          supervisorNpcId: staff?.supervisor?.id || null,
          supervisorName: staff?.supervisor?.name || null,
          supervisorRole: staff?.supervisor?.role || null,
          coworkerNpcIds: staff?.coworkers?.map((worker) => worker.id) || [],
          workScheduleTemplate: createScheduleTemplate(opening.track),
          attendance: {
            records: {},
            consecutiveMisses: 0,
            totalMissed: 0,
            totalLate: 0,
          },
        },
        logs: [`${timePassage} ${successLog} ${employer?.name || opening.businessName} hired you as ${opening.title}. Supervisor: ${staff?.supervisor?.name || 'TBD'} (${staff?.supervisor?.role || 'Shift Lead'}). Career ladder: ${startingTitle}.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'SWITCH_TRACK': {
      const { trackId } = action.payload;
      const trackData = CAREER_TRACKS[trackId];
      if (!trackData || state.career.activeTrack === trackId) return state;

      const timeStatus = getTimeWindowStatus(state.time, CAREER_ACTIVITY_WINDOWS.interview);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Career interviews are not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      const interviewTicks = 12;
      const nextState = simulateTicks(state, interviewTicks);
      const timePassage = describeTimePassage(state.time, nextState.time, `interviewed for ${trackData.name}`);

      // Job Interview Stat Check!
      // Require at least 20 in the track's primary stat (rough proxy)
      let primaryStat = 'intelligence';
      if (trackId === 'corporate') primaryStat = 'corporate';
      if (trackId === 'creative') primaryStat = 'creativity';
      if (trackId === 'tech') primaryStat = 'programming';
      if (trackId === 'service') primaryStat = 'socialIq';

      if ((state.stats[primaryStat] || 0) < 20) {
         nextState.needs.energy = Math.max(0, nextState.needs.energy - 10);
         return {
           ...nextState,
           logs: [`${timePassage} Failed the interview for ${trackData.name}. Need at least 20 ${primaryStat}.`, ...nextState.logs].slice(0, 20)
         };
      }

      return {
        ...nextState,
        career: {
          ...nextState.career,
          activeTrack: trackId,
          employerId: null,
          jobTitle: null,
          currentProject: null,
          projectProgress: 0,
          promotionPoints: 0, // Reset progress on track switch
          titleLevel: 1,
          supervisorNpcId: null,
          supervisorName: null,
          supervisorRole: null,
          coworkerNpcIds: [],
          workScheduleTemplate: [],
          attendance: {
            records: {},
            consecutiveMisses: 0,
            totalMissed: 0,
            totalLate: 0,
          },
        },
        logs: [`${timePassage} Passed the interview and ${state.career.activeTrack ? 'switched tracks' : 'started work'} in ${trackData.name}.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'START_PROJECT': {
      const { projectId } = action.payload;
      const trackId = state.career.activeTrack;
      const projectData = getProjectsForTrackAndTier(trackId, state.career.titleLevel).find(p => p.id === projectId);
      
      if (!projectData) return state;

      const timeStatus = getTimeWindowStatus(state.time, CAREER_ACTIVITY_WINDOWS.projectWork, 2);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Starting a shift plan is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, `planned your shift for ${projectData.name}`);

      return {
        ...nextState,
        career: {
          ...nextState.career,
          currentProject: projectId,
          projectProgress: 0,
        },
        logs: [`${timePassage} Started project: ${projectData.name}.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'WORK_ON_PROJECT': {
      const { energyCost } = action.payload;
      
      if (!state.career.currentProject) return state;

      const trackId = state.career.activeTrack;
      const trackData = CAREER_TRACKS[trackId];
      const currentLevelData = trackData.levels[state.career.titleLevel - 1];
      
      const projectData = getProjectsForTrackAndTier(trackId, state.career.titleLevel).find(p => p.id === state.career.currentProject);
      if (!projectData) return state;

      const todayShift = getShiftForDay(state.career, state.time.day);
      if (todayShift) {
        const attendanceStatus = getShiftAttendanceStatus(state.time, todayShift);
        if (!attendanceStatus?.allowed) {
          const updatedCareer = withAttendanceRecord(state.career, state.time.day, 'missed');
          const terminated = updatedCareer.attendance.consecutiveMisses >= 3;
          if (terminated) {
            return {
              ...state,
              career: {
                ...updatedCareer,
                activeTrack: null,
                employerId: null,
                jobTitle: null,
                currentProject: null,
                projectProgress: 0,
                supervisorNpcId: null,
                supervisorName: null,
                supervisorRole: null,
                coworkerNpcIds: [],
                workScheduleTemplate: [],
              },
              logs: [`You missed another shift and were fired from ${state.career.jobTitle || 'your role'}.`, ...state.logs].slice(0, 20),
            };
          }
          return {
            ...state,
            career: updatedCareer,
            logs: [`You missed today's shift (${todayShift.startHour}:00-${todayShift.endHour}:00). ${attendanceStatus.reason}`, ...state.logs].slice(0, 20),
          };
        }
      }

      const timeStatus = getTimeWindowStatus(state.time, CAREER_ACTIVITY_WINDOWS.projectWork, 32);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Work shift is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      // Work takes 8 hours
      let nextState = simulateTicks(state, 32);
      const timePassage = describeTimePassage(state.time, nextState.time, `worked on ${projectData.name}`);

      // Random Work Event check (15% chance if not already in an event)
      if (Math.random() < 0.15) {
        const employer = getBusinessById(state.career.employerId);
        const candidateEvents = getWorkEventsForContext(employer?.type);
        const randomEvent = candidateEvents[Math.floor(Math.random() * candidateEvents.length)];
        return {
          ...nextState,
          gamePhase: 'work_event',
          activeWorkEvent: {
            ...randomEvent,
            supervisorName: state.career.supervisorName || 'Shift Lead',
            employerName: employer?.name || 'Your workplace',
          },
          logs: [`⚠️ WORK EVENT: ${randomEvent.title} (${employer?.name || 'Workplace'})`, ...nextState.logs].slice(0, 20)
        };
      }

      // Consume energy & hygiene
      nextState.needs.energy = Math.max(0, nextState.needs.energy - energyCost);
      nextState.needs.hygiene = Math.max(0, nextState.needs.hygiene - 20);
      
      const healthPenalty = nextState.needs.health < 50;
      if (nextState.needs.energy === 0) {
        nextState.needs.health = Math.max(0, nextState.needs.health - 5);
      }

      // Calculate progress contribution based on required stats
      let statContribution = 0;
      let totalWeight = 0;
      if (projectData.requirements && projectData.requirements.stats) {
        for (const [stat, weight] of Object.entries(projectData.requirements.stats)) {
          statContribution += (nextState.stats[stat] || 0); // Add raw stat value
          totalWeight += weight; // Use weight as a target threshold sum
        }
      } else {
        statContribution = 10;
        totalWeight = 10;
      }
      
      // Base progress + stat scaling
      let progressGain = 10 + (statContribution / totalWeight) * 5;
      if (healthPenalty) progressGain *= 0.5;

      const newProgress = Math.min(100, nextState.career.projectProgress + progressGain);
      
      let newCareerState = {
        ...nextState.career,
        projectProgress: newProgress
      };
      
      let logs = [...nextState.logs];
      
      if (newProgress >= 100) {
        // Gain rewards (salary is paid per project completion as a simplified model)
        const payout = currentLevelData.salary;
        nextState.stats.money += payout;
        newCareerState.promotionPoints += projectData.rewardPoints;
        newCareerState.currentProject = null;
        newCareerState.projectProgress = 0;
        
        logs.unshift(`${timePassage} Project completed! Earned $${payout} and ${projectData.rewardPoints} Promotion Points.`);

        // Promotion Check
        if (state.career.titleLevel < trackData.levels.length) {
          const nextLevelData = trackData.levels[state.career.titleLevel]; // Next level (0-indexed array)
          if (newCareerState.promotionPoints >= nextLevelData.reqPoints) {
            newCareerState.titleLevel = nextLevelData.level;
            logs.unshift(`PROMOTED! You are now a ${nextLevelData.title}!`);
          }
        }
      } else {
        logs.unshift(`${timePassage} Progress: ${newProgress.toFixed(1)}%`);
      }

      const onTimeStatus = todayShift
        ? (state.time.hour < todayShift.startHour || (state.time.hour === todayShift.startHour && state.time.minute === 0) ? 'on_time' : 'late')
        : null;
      const updatedCareerForAttendance = onTimeStatus
        ? withAttendanceRecord(newCareerState, state.time.day, onTimeStatus)
        : newCareerState;
      const lateNote = onTimeStatus === 'late' ? ` ${state.career.supervisorName || 'Your supervisor'} noted that you arrived late.` : '';

      return {
        ...nextState,
        career: updatedCareerForAttendance,
        logs: logs.map((line, index) => (index === 0 ? `${line}${lateNote}` : line)).slice(0, 20)
      };
    }

    case 'TAKE_GIG': {
      const { gigId } = action.payload;
      const gig = gigs[gigId];
      if (!gig) return state;

      const timeStatus = getTimeWindowStatus(state.time, gig.availableWindow, gig.durationTicks);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`${gig.name} is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      // Check requirements
      if (gig.requirements.credentials) {
        for (const reqCert of gig.requirements.credentials) {
          if (!state.stats.credentials.includes(reqCert)) {
             return {
               ...state,
               logs: [`Missing credential: ${reqCert} for gig ${gig.name}`, ...state.logs].slice(0, 20)
             }
          }
        }
      }

      // Simulate time taken
      let nextState = simulateTicks(state, gig.durationTicks);
      const timePassage = describeTimePassage(state.time, nextState.time, `completed ${gig.name}`);

      // Energy/Stress drain
      nextState.needs.energy = Math.max(0, nextState.needs.energy - 30);
      nextState.needs.mood = Math.max(0, nextState.needs.mood - (gig.rewards.stress || 0));

      // Rewards
      nextState.stats.money += gig.rewards.money;
      nextState.career.gigReputation = (nextState.career.gigReputation || 0) + (gig.rewards.rep || 0);

      return {
        ...nextState,
        logs: [`${timePassage} Earned $${gig.rewards.money} and +${gig.rewards.rep || 0} Rep.`, ...nextState.logs].slice(0, 20)
      }
    }

    case 'WORK_SIDE_HUSTLE': {
      const { hustleId } = action.payload;
      const hustle = sideHustles[hustleId];
      if (!hustle) return state;

      const timeStatus = getTimeWindowStatus(state.time, hustle.availableWindow, 6);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`${hustle.name} is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      // Check requirements (e.g., vehicles, stats)
      if (hustle.requirements.vehicles) {
        for (const reqVeh of hustle.requirements.vehicles) {
          if (!state.properties.vehicles.includes(reqVeh)) {
             return {
               ...state,
               logs: [`Missing vehicle: ${reqVeh} for side hustle ${hustle.name}`, ...state.logs].slice(0, 20)
             }
          }
        }
      }
      if (hustle.requirements.stats) {
        for (const [stat, reqVal] of Object.entries(hustle.requirements.stats)) {
          if ((state.stats[stat] || 0) < reqVal) {
             return {
               ...state,
               logs: [`Missing stat requirement: ${stat} >= ${reqVal} for side hustle ${hustle.name}`, ...state.logs].slice(0, 20)
             }
          }
        }
      }

      // Work takes 1 hour (6 ticks) per click
      let nextState = simulateTicks(state, 6);
      const timePassage = describeTimePassage(state.time, nextState.time, `worked on ${hustle.name}`);
      const energyDrained = hustle.energyCostPerTick * 6;
      const moneyEarned = hustle.moneyPerTick * 6;

      if (nextState.needs.energy < energyDrained) {
         return { ...state, logs: [`Not enough energy to work on ${hustle.name}.`, ...state.logs].slice(0, 20) };
      }

      nextState.needs.energy = Math.max(0, nextState.needs.energy - energyDrained);
      nextState.stats.money += moneyEarned;
      
      // Update followers for simtube
      if (hustleId === 'simtube') {
        nextState.simstagram.followers += 50;
      }

      return {
        ...nextState,
        logs: [`${timePassage} Earned $${moneyEarned}.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'RESOLVE_WORK_EVENT': {
      const { optionIndex } = action.payload;
      const event = state.activeWorkEvent;
      if (!event) return state;

      const choice = event.choices[optionIndex];
      let success = true;

      if (choice.statCheck && choice.statCheck !== "none") {
        success = (state.stats[choice.statCheck] || 10) >= choice.threshold;
      }

      const logMsg = success ? choice.successLog : choice.failLog;
      const rewards = success ? choice.successRewards : choice.failRewards;

      let newStats = { ...state.stats };
      let newNeeds = { ...state.needs };
      let newCareer = { ...state.career };

      if (rewards.money) newStats.money = Math.max(0, newStats.money + rewards.money);
      if (rewards.promotionPoints) newCareer.promotionPoints += rewards.promotionPoints;
      
      if (rewards.energy) newNeeds.energy = Math.max(0, Math.min(100, newNeeds.energy + rewards.energy));
      if (rewards.mood) newNeeds.mood = Math.max(0, Math.min(100, newNeeds.mood + rewards.mood));
      if (rewards.health) newNeeds.health = Math.max(0, Math.min(100, newNeeds.health + rewards.health));

      return {
        ...state,
        gamePhase: 'living',
        activeWorkEvent: null,
        stats: newStats,
        needs: newNeeds,
        career: newCareer,
        logs: [`[Work Event] ${logMsg}`, ...state.logs].slice(0, 20)
      };
    }

    default:
      return state;
  }
};
