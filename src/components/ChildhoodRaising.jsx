import React from 'react';
import { useGameStore } from '../state/store';
import { calculateTraits, TRAITS } from '../data/traits';
import './ChildhoodRaising.css';

const PARENTING_STEPS = [
  {
    age: 3,
    title: "Toddler Development (Ages 2-4)",
    description: "Your child is starting to walk, talk, and explore. How do you direct their early development?",
    choices: [
      { text: "Elite Early Learning Preschool", cost: 500, gains: { intelligence: 15, corporate: 5 }, stressIncrease: 20, description: "Enroll in an academic preschool. Cost: $500. Gains Int/Corp. (+20 Stress)" },
      { text: "Quality Time Playing", cost: 0, gains: { charisma: 10, confidence: 10 }, stressIncrease: 5, description: "Engage in social games. Free. Gains Cha/Con. (+5 Stress)" },
      { text: "Toddler Gymnastics", cost: 300, gains: { fitness: 15 }, stressIncrease: 10, description: "Build physical health. Cost: $300. Gains Fit. (+10 Stress)" }
    ]
  },
  {
    age: 8,
    title: "Primary School Activities (Ages 5-10)",
    description: "Your child is starting grade school. Where do you guide their after-school interests?",
    choices: [
      { text: "Private Academics", cost: 1000, gains: { intelligence: 20, finance: 10 }, stressIncrease: 30, description: "Logic puzzles and math tutors. Cost: $1000. Gains Int/Fin. (+30 Stress)" },
      { text: "Theater Guild", cost: 200, gains: { charisma: 15, creativity: 10 }, stressIncrease: 15, description: "Drama programs. Cost: $200. Gains Cha/Cre. (+15 Stress)" },
      { text: "Sports Leagues", cost: 400, gains: { fitness: 20 }, stressIncrease: 20, description: "Soccer and martial arts. Cost: $400. Gains Fit. (+20 Stress)" }
    ]
  },
  {
    age: 12,
    title: "Middle School Growth (Ages 11-13)",
    description: "Hormones, new friendships, and growing independence. What area do you support?",
    choices: [
      { text: "Coding & Science Kit", cost: 1500, gains: { intelligence: 25, programming: 20 }, stressIncrease: 30, description: "High-end PC and electronics. Cost: $1500. Gains Int/Prg. (+30 Stress)" },
      { text: "Social Event Budgets", cost: 500, gains: { style: 20, socialIq: 15 }, stressIncrease: 10, description: "Clothes and concerts. Cost: $500. Gains Sty/Soc. (+10 Stress)" },
      { text: "Elite Athletics", cost: 600, gains: { fitness: 25 }, stressIncrease: 25, description: "Dedicated trainers. Cost: $600. Gains Fit. (+25 Stress)" }
    ]
  },
  {
    age: 15,
    title: "High School Ambitions (Ages 14-16)",
    description: "Teenage years! They are thinking about their identity and potential future.",
    choices: [
      { text: "Corporate Internships", cost: 800, gains: { corporate: 25, negotiation: 15 }, stressIncrease: 35, description: "Summer assistant at OmniCorp. Cost: $800. Gains Cor/Neg. (+35 Stress)" },
      { text: "Rock Band", cost: 400, gains: { charisma: 25, music: 20 }, stressIncrease: 15, description: "Provide musical instruments. Cost: $400. Gains Cha/Mus. (+15 Stress)" },
      { text: "Varsity Sports Captain", cost: 500, gains: { fitness: 30, confidence: 15 }, stressIncrease: 30, description: "Varsity leadership camp. Cost: $500. Gains Fit/Con. (+30 Stress)" }
    ]
  },
  {
    age: 18,
    title: "Launchpad Decisions (Ages 17-18)",
    description: "The final step! Graduation is here. How do you launch them into adulthood?",
    choices: [
      { text: "Ivy League Tuition", cost: 3000, gains: { intelligence: 30, corporate: 25 }, stressIncrease: 40, description: "World-class academic institution. Cost: $3000. Gains Int/Cor. (+40 Stress)" },
      { text: "Boutique Fashion Studio", cost: 1500, gains: { style: 25, marketing: 20 }, stressIncrease: 25, description: "Creative agency startup fund. Cost: $1500. Gains Sty/Mar. (+25 Stress)" },
      { text: "Athletic Placement", cost: 2000, gains: { fitness: 30, confidence: 20 }, stressIncrease: 35, description: "Pro league training academy. Cost: $2000. Gains Fit/Con. (+35 Stress)" }
    ]
  }
];

const ChildhoodRaising = () => {
  const { gameState, selectParentingChoice, reduceChildStress, beginLegacy } = useGameStore();
  const { money: parentMoney, energy: parentEnergy } = gameState.stats;
  const childName = gameState.family.childName || 'Heir';
  const { currentStep: step, heirStats, stress } = gameState.parentingGame;

  const activeStep = PARENTING_STEPS[step];

  const handleMakeChoice = (cost, gains, stressIncrease) => {
    if (parentMoney < cost) return;
    selectParentingChoice(cost, gains, stressIncrease);
  };

  const handleReduceStress = () => {
    if (gameState.needs.energy < 20) return;
    reduceChildStress(20, 25);
  };

  const parentBonus = {
    fitness: Math.floor((gameState.stats.fitness || 0) * 0.1),
    corporate: Math.floor((gameState.stats.corporate || 0) * 0.1),
    intelligence: Math.floor((gameState.stats.intelligence || 0) * 0.1),
    charisma: Math.floor((gameState.stats.charisma || 0) * 0.1),
    style: Math.floor((gameState.stats.style || 0) * 0.1),
    confidence: Math.floor((gameState.stats.confidence || 0) * 0.1),
    creativity: Math.floor((gameState.stats.creativity || 0) * 0.1),
    socialIq: Math.floor((gameState.stats.socialIq || 0) * 0.1),
    culinary: Math.floor((gameState.stats.culinary || 0) * 0.1),
    programming: Math.floor((gameState.stats.programming || 0) * 0.1),
    negotiation: Math.floor((gameState.stats.negotiation || 0) * 0.1),
    marketing: Math.floor((gameState.stats.marketing || 0) * 0.1),
    finance: Math.floor((gameState.stats.finance || 0) * 0.1),
    empathy: Math.floor((gameState.stats.empathy || 0) * 0.1),
    gaming: Math.floor((gameState.stats.gaming || 0) * 0.1),
    music: Math.floor((gameState.stats.music || 0) * 0.1),
  };

  const finalStats = {
    money: Math.floor(parentMoney * 0.5),
    fitness: (heirStats.fitness || 10) + parentBonus.fitness,
    corporate: (heirStats.corporate || 10) + parentBonus.corporate,
    intelligence: (heirStats.intelligence || 10) + parentBonus.intelligence,
    charisma: (heirStats.charisma || 10) + parentBonus.charisma,
    style: (heirStats.style || 10) + parentBonus.style,
    confidence: (heirStats.confidence || 10) + parentBonus.confidence,
    creativity: (heirStats.creativity || 10) + parentBonus.creativity,
    socialIq: (heirStats.socialIq || 10) + parentBonus.socialIq,
    culinary: (heirStats.culinary || 10) + parentBonus.culinary,
    programming: (heirStats.programming || 10) + parentBonus.programming,
    negotiation: (heirStats.negotiation || 10) + parentBonus.negotiation,
    marketing: (heirStats.marketing || 10) + parentBonus.marketing,
    finance: (heirStats.finance || 10) + parentBonus.finance,
    empathy: (heirStats.empathy || 10) + parentBonus.empathy,
    gaming: (heirStats.gaming || 10) + parentBonus.gaming,
    music: (heirStats.music || 10) + parentBonus.music,
  };

  const generatedTraits = calculateTraits(finalStats, stress);

  if (step >= PARENTING_STEPS.length) {
    return (
      <div className="glass-panel parenting-container animate-fade-in" style={{ padding: '20px', color: 'white' }}>
        <div className="parenting-card glass-panel text-center">
          <header className="parenting-header">
            <h1 className="text-gradient">{childName} is Ready!</h1>
            <p className="parenting-subtitle">Final Stress Level: {stress}%</p>
          </header>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
            <h3 style={{ color: '#f39c12' }}>Acquired Traits</h3>
            {generatedTraits.length === 0 ? (
              <p>No special traits acquired.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {generatedTraits.map(tId => (
                  <li key={tId} style={{ marginBottom: '10px' }}>
                    <strong>{TRAITS[tId].name}</strong>: {TRAITS[tId].description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="btn-primary start-legacy-btn" onClick={beginLegacy}>
            🚀 Start Generation {gameState.family.generation + 1} as {childName}!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel parenting-container animate-fade-in" style={{ padding: '20px', color: 'white' }}>
      <div className="parenting-card glass-panel">
        <header className="parenting-header text-center">
          <div className="step-tracker">Step {step + 1} of {PARENTING_STEPS.length}</div>
          <h1 className="text-gradient">{activeStep.title}</h1>
          <p className="parenting-subtitle">{activeStep.description}</p>
        </header>

        <div className="parenting-status-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', padding: '15px' }}>
          <div>Parent Bank: <strong>${parentMoney}</strong> | Energy: <strong>{gameState.needs.energy}%</strong></div>
          <div style={{ color: stress > 70 ? '#e74c3c' : 'white' }}>
            Child Stress: <strong>{stress}%</strong>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            className="btn-primary" 
            style={{ backgroundColor: '#2ecc71', color: 'black', padding: '10px', border: 'none', borderRadius: '5px', cursor: gameState.needs.energy >= 20 && stress > 0 ? 'pointer' : 'not-allowed' }}
            disabled={gameState.needs.energy < 20 || stress === 0}
            onClick={handleReduceStress}
          >
            Bond with Child (-20 Energy, -25% Stress)
          </button>
          <p style={{ fontSize: '0.8em', marginTop: '5px' }}>Keep stress low to avoid Burnout trait!</p>
        </div>

        <div className="parenting-choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeStep.choices.map((choice, idx) => {
            const isAffordable = parentMoney >= choice.cost;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{choice.text}</h4>
                  <p style={{ fontSize: '0.9em', color: '#ccc' }}>{choice.description}</p>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '10px 20px', backgroundColor: isAffordable ? '#3498db' : '#95a5a6', border: 'none', borderRadius: '5px', color: 'white', cursor: isAffordable ? 'pointer' : 'not-allowed' }}
                  disabled={!isAffordable}
                  onClick={() => handleMakeChoice(choice.cost, choice.gains, choice.stressIncrease)}
                >
                  {isAffordable ? `Select ($${choice.cost})` : 'Too Expensive'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChildhoodRaising;
