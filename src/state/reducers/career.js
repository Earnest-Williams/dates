import { simulateTicks } from './time';
import { getProjectsForTrackAndTier, CAREER_TRACKS } from '../../data/projects';
import { WORK_EVENTS } from '../../data/workEvents';
import { gigs, sideHustles } from '../../data/gigs';

export const careerReducer = (state, action) => {
  switch (action.type) {
    case 'SWITCH_TRACK': {
      const { trackId } = action.payload;
      const trackData = CAREER_TRACKS[trackId];
      if (!trackData || state.career.activeTrack === trackId) return state;

      // Job Interview Stat Check!
      // Require at least 20 in the track's primary stat (rough proxy)
      let primaryStat = 'intelligence';
      if (trackId === 'corporate') primaryStat = 'corporate';
      if (trackId === 'creative') primaryStat = 'creativity';
      if (trackId === 'tech') primaryStat = 'programming';

      if ((state.stats[primaryStat] || 0) < 20) {
         return {
           ...state,
           needs: { ...state.needs, energy: Math.max(0, state.needs.energy - 10) },
           logs: [`Failed the job interview for the ${trackData.name} track. Need at least 20 ${primaryStat}.`, ...state.logs].slice(0, 20)
         };
      }

      return {
        ...state,
        career: {
          ...state.career,
          activeTrack: trackId,
          currentProject: null,
          projectProgress: 0,
          promotionPoints: 0, // Reset progress on track switch
          titleLevel: 1,
        },
        logs: [`Passed the interview! Switched career track to ${trackData.name}!`, ...state.logs].slice(0, 20)
      };
    }

    case 'START_PROJECT': {
      const { projectId } = action.payload;
      const trackId = state.career.activeTrack;
      const projectData = getProjectsForTrackAndTier(trackId, state.career.titleLevel).find(p => p.id === projectId);
      
      if (!projectData) return state;

      return {
        ...state,
        career: {
          ...state.career,
          currentProject: projectId,
          projectProgress: 0,
        },
        logs: [`Started new project: ${projectData.name}`, ...state.logs].slice(0, 20)
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

      // Work takes 8 hours
      let nextState = simulateTicks(state, 32);

      // Random Work Event check (15% chance if not already in an event)
      if (Math.random() < 0.15) {
        const randomEvent = WORK_EVENTS[Math.floor(Math.random() * WORK_EVENTS.length)];
        return {
          ...nextState,
          gamePhase: 'work_event',
          activeWorkEvent: randomEvent,
          logs: [`⚠️ WORK EVENT: ${randomEvent.title}`, ...nextState.logs].slice(0, 20)
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
        
        logs.unshift(`Project ${projectData.name} completed! Earned $${payout} and ${projectData.rewardPoints} Promotion Points.`);

        // Promotion Check
        if (state.career.titleLevel < trackData.levels.length) {
          const nextLevelData = trackData.levels[state.career.titleLevel]; // Next level (0-indexed array)
          if (newCareerState.promotionPoints >= nextLevelData.reqPoints) {
            newCareerState.titleLevel = nextLevelData.level;
            logs.unshift(`PROMOTED! You are now a ${nextLevelData.title}!`);
          }
        }
      } else {
        logs.unshift(`Worked on ${projectData.name}. Progress: ${newProgress.toFixed(1)}%`);
      }

      return {
        ...nextState,
        career: newCareerState,
        logs: logs.slice(0, 20)
      };
    }

    case 'TAKE_GIG': {
      const { gigId } = action.payload;
      const gig = gigs[gigId];
      if (!gig) return state;

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

      // Energy/Stress drain
      nextState.needs.energy = Math.max(0, nextState.needs.energy - 30);
      nextState.needs.mood = Math.max(0, nextState.needs.mood - (gig.rewards.stress || 0));

      // Rewards
      nextState.stats.money += gig.rewards.money;
      nextState.career.gigReputation = (nextState.career.gigReputation || 0) + (gig.rewards.rep || 0);

      return {
        ...nextState,
        logs: [`Completed gig: ${gig.name}! Earned $${gig.rewards.money} and +${gig.rewards.rep || 0} Rep.`, ...nextState.logs].slice(0, 20)
      }
    }

    case 'WORK_SIDE_HUSTLE': {
      const { hustleId } = action.payload;
      const hustle = sideHustles[hustleId];
      if (!hustle) return state;

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
        logs: [`Worked on ${hustle.name} for an hour. Earned $${moneyEarned}.`, ...nextState.logs].slice(0, 20)
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
