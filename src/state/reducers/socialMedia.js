import { simulateTicks } from './time.js';
import { describeTimePassage } from '../../sim/time.js';

export const socialMediaReducer = (state, action) => {
  switch (action.type) {
    case 'POST_SIMSTAGRAM': {
      const { contentType, statRequirements, baseFollowers, energyCost } = action.payload;
      
      // Post takes 1 hour (4 ticks)
      let nextState = simulateTicks(state, 4);
      const timePassage = describeTimePassage(state.time, nextState.time, `posted ${contentType} on Simstagram`);

      // Consume energy
      nextState.needs.energy = Math.max(0, nextState.needs.energy - energyCost);
      if (nextState.needs.energy === 0) {
        nextState.needs.health = Math.max(0, nextState.needs.health - 5);
      }

      // Calculate followers gained
      let statMultiplier = 1.0;
      let totalStats = 0;
      let requiredTotal = 0;
      
      for (const [stat, weight] of Object.entries(statRequirements)) {
        totalStats += (nextState.stats[stat] || 0) * weight;
        requiredTotal += 100 * weight; // 100 is max stat
      }

      if (requiredTotal > 0) {
        statMultiplier = 0.5 + (totalStats / requiredTotal) * 2.0; // scales from 0.5x to 2.5x
      }

      // Apply active buffs (e.g. foodie, gym_pump)
      let buffMultiplier = 1.0;
      if (contentType === 'Food Review' && nextState.simstagram.activeBuffs.includes('foodie')) {
        buffMultiplier = 1.5;
        // remove buff
        nextState.simstagram.activeBuffs = nextState.simstagram.activeBuffs.filter(b => b !== 'foodie');
      }
      if (contentType === 'Gym Flex' && nextState.simstagram.activeBuffs.includes('gym_pump')) {
        buffMultiplier = 1.5;
        nextState.simstagram.activeBuffs = nextState.simstagram.activeBuffs.filter(b => b !== 'gym_pump');
      }

      // RPG Perks
      let viralChance = 0.05;
      if ((nextState.stats.marketing || 0) >= 50) viralChance += 0.10; // Influencer perk
      if ((nextState.stats.style || 0) >= 50) buffMultiplier *= 1.2; // Trendsetter perk

      // Random viral chance
      const isViral = Math.random() < viralChance;
      if (isViral) buffMultiplier *= 3.0;

      const gainedFollowers = Math.floor(baseFollowers * statMultiplier * buffMultiplier);
      const newFollowers = nextState.simstagram.followers + gainedFollowers;
      
      const postRecord = {
        type: contentType,
        followersGained: gainedFollowers,
        viral: isViral,
        timestamp: `${nextState.time.day}d ${nextState.time.hour}h`
      };

      const newPosts = [postRecord, ...nextState.simstagram.posts].slice(0, 10);

      // Check sponsorships
      let sponsorships = [...nextState.simstagram.sponsorships];
      let gainedSponsorship = null;
      if (newFollowers >= 1000 && !sponsorships.includes('local_brand')) {
        sponsorships.push('local_brand');
        gainedSponsorship = 'Local Brand Deal unlocked!';
      }
      if (newFollowers >= 10000 && !sponsorships.includes('national_brand')) {
        sponsorships.push('national_brand');
        gainedSponsorship = 'National Brand Deal unlocked!';
      }

      const logMsg = isViral 
        ? `${timePassage} It went VIRAL! Gained ${gainedFollowers} followers.`
        : `${timePassage} Gained ${gainedFollowers} followers.`;
      
      const allLogs = gainedSponsorship 
        ? [gainedSponsorship, logMsg, ...nextState.logs] 
        : [logMsg, ...nextState.logs];

      return {
        ...nextState,
        simstagram: {
          ...nextState.simstagram,
          followers: newFollowers,
          posts: newPosts,
          sponsorships
        },
        logs: allLogs.slice(0, 20)
      };
    }

    case 'ADD_SIMSTAGRAM_BUFF': {
      const { buffName } = action.payload;
      const buffs = new Set(state.simstagram.activeBuffs);
      buffs.add(buffName);
      return {
        ...state,
        simstagram: {
          ...state.simstagram,
          activeBuffs: Array.from(buffs)
        }
      };
    }

    default:
      return state;
  }
};
