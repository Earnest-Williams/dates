import { useGame } from '../state/GameContext';
import './ChildhoodRaising.css';

const PARENTING_STEPS = [
  {
    age: 3,
    title: "Toddler Development (Ages 2-4)",
    description: "Your child is starting to walk, talk, and explore. How do you direct their early development?",
    choices: [
      {
        text: "Elite Early Learning Preschool",
        cost: 500,
        gains: { intelligence: 15, corporate: 5 },
        description: "Enroll in an academic preschool. Focus on early reading and foreign languages. Cost: $500. Grants +15 Intelligence, +5 Corporate on child."
      },
      {
        text: "Quality Time Playing & Learning at Home",
        cost: 0,
        gains: { charisma: 10, style: 5, confidence: 10, culinary: 10 },
        description: "Engage in social games, kitchen cooking play, and storytelling. Free. Grants +10 Charisma, +5 Style, +10 Confidence, +10 Culinary."
      },
      {
        text: "Toddler Gymnastics and Swim Classes",
        cost: 300,
        gains: { fitness: 15, style: 5 },
        description: "Build early coordination, motor skills, and physical health. Cost: $300. Grants +15 Fitness, +5 Style."
      }
    ]
  },
  {
    age: 8,
    title: "Primary School Activities (Ages 5-10)",
    description: "Your child is starting grade school. Where do you guide their after-school interests?",
    choices: [
      {
        text: "Private Academics & Math Tutors",
        cost: 1000,
        gains: { intelligence: 20, corporate: 10, finance: 10 },
        description: "Enroll in science courses, logic puzzles, and basic math tutors. Cost: $1,000. Grants +20 Intelligence, +10 Corporate, +10 Finance."
      },
      {
        text: "Theater Guild & Creative Arts",
        cost: 200,
        gains: { charisma: 15, style: 15, creativity: 10 },
        description: "Drama programs, acting workshops, and sketching. Cost: $200. Grants +15 Charisma, +15 Style, +10 Creativity."
      },
      {
        text: "Sports Leagues & Martial Arts",
        cost: 400,
        gains: { fitness: 20, charisma: 5 },
        description: "Soccer leagues, running clubs, and karate discipline. Cost: $400. Grants +20 Fitness, +5 Charisma."
      }
    ]
  },
  {
    age: 12,
    title: "Middle School Growth (Ages 11-13)",
    description: "Hormones, new friendships, and growing independence. What area do you support?",
    choices: [
      {
        text: "Coding & Science Computer Kit",
        cost: 1500,
        gains: { intelligence: 25, corporate: 15, programming: 20 },
        description: "Buy a high-end personal computer for programming and electronics kits. Cost: $1,500. Grants +25 Intelligence, +15 Corporate, +20 Programming."
      },
      {
        text: "Social Event & Fashion Budgets",
        cost: 500,
        gains: { style: 20, charisma: 20, socialIq: 15 },
        description: "Let them buy trendy clothes, host sleepovers, and attend concerts. Cost: $500. Grants +20 Style, +20 Charisma, +15 Social IQ."
      },
      {
        text: "Elite Youth Athletics Training",
        cost: 600,
        gains: { fitness: 25, corporate: 5 },
        description: "Dedicated athletic trainers, tournament registration, and training gear. Cost: $600. Grants +25 Fitness, +5 Corporate."
      }
    ]
  },
  {
    age: 15,
    title: "High School Ambitions (Ages 14-16)",
    description: "Teenage years! They are thinking about their identity and potential future corporate.",
    choices: [
      {
        text: "Corporate Internships & College Prep",
        cost: 800,
        gains: { corporate: 25, intelligence: 15, negotiation: 15 },
        description: "A summer assistant role at OmniCorp and college entrance prep sessions. Cost: $800. Grants +25 Corporate, +15 Intelligence, +15 Negotiation."
      },
      {
        text: "Rock Band & Design Portfolio",
        cost: 400,
        gains: { charisma: 25, style: 25, creativity: 20 },
        description: "Provide musical instruments, design software, and high fashion freedoms. Cost: $400. Grants +25 Charisma, +25 Style, +20 Creativity."
      },
      {
        text: "Varsity Sports Captain Training",
        cost: 500,
        gains: { fitness: 30, charisma: 10, confidence: 15 },
        description: "High school varsity team leadership camp and advanced workshops. Cost: $500. Grants +30 Fitness, +10 Charisma, +15 Confidence."
      }
    ]
  },
  {
    age: 18,
    title: "Launchpad Decisions (Ages 17-18)",
    description: "The final step! Graduation is here. How do you launch them into adulthood?",
    choices: [
      {
        text: "Ivy League Tuition Deposit",
        cost: 3000,
        gains: { intelligence: 30, corporate: 25, finance: 20 },
        description: "Secure their entry into a world-class academic institution. Cost: $3,000. Grants +30 Intelligence, +25 Corporate, +20 Finance."
      },
      {
        text: "Boutique Fashion Studio Fund",
        cost: 1500,
        gains: { style: 25, charisma: 25, marketing: 20 },
        description: "Launch a personal fashion label or creative agency startup fund. Cost: $1,500. Grants +25 Style, +25 Charisma, +20 Marketing."
      },
      {
        text: "Elite Athletic Academy Placement",
        cost: 2000,
        gains: { fitness: 30, corporate: 10, confidence: 20 },
        description: "Secure a placement in a professional league training academy. Cost: $2,000. Grants +30 Fitness, +10 Corporate, +20 Confidence."
      }
    ]
  }
];

const ChildhoodRaising = () => {
  const { gameState, selectParentingChoice, beginLegacy } = useGame();
  const { money: parentMoney } = gameState.stats;
  const childName = gameState.family.childName || 'Heir';
  const step = gameState.parentingGame.currentStep;
  const heirStats = gameState.parentingGame.heirStats;

  // Active step
  const activeStep = PARENTING_STEPS[step];

  const handleMakeChoice = (cost, gains) => {
    if (parentMoney < cost) return;
    selectParentingChoice(cost, gains);
  };

  // Calculations for summary page
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

  const inheritedCash = Math.floor(parentMoney * 0.5);
  const vehicles = gameState.properties.vehicles || [];

  if (step >= PARENTING_STEPS.length) {
    // Summary view
    return (
      <div className="glass-panel parenting-container animate-fade-in">
        <div className="parenting-card glass-panel text-center">
          <header className="parenting-header">
            <span className="celebration-icon">🌱</span>
            <h1 className="text-gradient">{childName} is Ready!</h1>
            <p className="parenting-subtitle">
              Your parenting era is complete. {childName} is now 18 years old and ready to start their own journey.
              Here is their legacy setup:
            </p>
          </header>

          <div className="summary-split-grid">
            {/* Stat Build */}
            <div className="summary-box glass-panel" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              <h3>Heir Starting Stats</h3>
              <div className="stats-comparison-table">
                <div className="compare-row header">
                  <span>Stat</span>
                  <span>Childhood</span>
                  <span>Legacy (+10%)</span>
                  <span>Total Starting</span>
                </div>
                <StatCompareRow label="Fitness" child={heirStats.fitness || 10} parentBonus={parentBonus.fitness} total={finalStats.fitness} color="var(--accent-pink)" />
                <StatCompareRow label="Corporate" child={heirStats.corporate || 10} parentBonus={parentBonus.corporate} total={finalStats.corporate} color="var(--accent-blue)" />
                <StatCompareRow label="Intelligence" child={heirStats.intelligence || 10} parentBonus={parentBonus.intelligence} total={finalStats.intelligence} color="var(--accent-purple)" />
                <StatCompareRow label="Charisma" child={heirStats.charisma || 10} parentBonus={parentBonus.charisma} total={finalStats.charisma} color="#f472b6" />
                <StatCompareRow label="Style" child={heirStats.style || 10} parentBonus={parentBonus.style} total={finalStats.style} color="#a78bfa" />
                <StatCompareRow label="Confidence" child={heirStats.confidence || 10} parentBonus={parentBonus.confidence} total={finalStats.confidence} color="#fbbf24" />
                <StatCompareRow label="Creativity" child={heirStats.creativity || 10} parentBonus={parentBonus.creativity} total={finalStats.creativity} color="#ec4899" />
                <StatCompareRow label="Social IQ" child={heirStats.socialIq || 10} parentBonus={parentBonus.socialIq} total={finalStats.socialIq} color="#3b82f6" />
                <StatCompareRow label="Culinary Skill" child={heirStats.culinary || 10} parentBonus={parentBonus.culinary} total={finalStats.culinary} color="#10b981" />
                <StatCompareRow label="Programming" child={heirStats.programming || 10} parentBonus={parentBonus.programming} total={finalStats.programming} color="#8b5cf6" />
                <StatCompareRow label="Negotiation" child={heirStats.negotiation || 10} parentBonus={parentBonus.negotiation} total={finalStats.negotiation} color="#06b6d4" />
                <StatCompareRow label="Marketing" child={heirStats.marketing || 10} parentBonus={parentBonus.marketing} total={finalStats.marketing} color="#f97316" />
                <StatCompareRow label="Finance" child={heirStats.finance || 10} parentBonus={parentBonus.finance} total={finalStats.finance} color="#14b8a6" />
                <StatCompareRow label="Empathy" child={heirStats.empathy || 10} parentBonus={parentBonus.empathy} total={finalStats.empathy} color="#fce7f3" />
                <StatCompareRow label="Gaming" child={heirStats.gaming || 10} parentBonus={parentBonus.gaming} total={finalStats.gaming} color="#8b5cf6" />
                <StatCompareRow label="Music" child={heirStats.music || 10} parentBonus={parentBonus.music} total={finalStats.music} color="#f43f5e" />
              </div>
            </div>

            {/* Inheritance Build */}
            <div className="summary-box glass-panel">
              <h3>Inherited Assets</h3>
              <div className="inheritance-list">
                <div className="inheritance-item">
                  <span className="item-label">Cash Inherited (50%):</span>
                  <span className="item-value highlight">${inheritedCash}</span>
                </div>
                <div className="inheritance-item">
                  <span className="item-label">Vehicles Transferred:</span>
                  <span className="item-value">
                    {vehicles.length === 0 ? "None" : vehicles.join(', ').replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="inheritance-item">
                  <span className="item-label">Default Housing:</span>
                  <span className="item-value">Parents' Couch (Free)</span>
                </div>
                <div className="inheritance-note">
                  Note: All placed and stored furniture from the parent generation has been safely consolidated into storage. You can place it once you rent your own apartment!
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary start-legacy-btn" onClick={beginLegacy}>
            🚀 Start Generation {gameState.family.generation + 1} as {childName}!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel parenting-container animate-fade-in">
      <div className="parenting-card glass-panel">
        <header className="parenting-header">
          <div className="step-tracker">Step {step + 1} of {PARENTING_STEPS.length}</div>
          <h1 className="text-gradient">{activeStep.title}</h1>
          <p className="parenting-subtitle">{activeStep.description}</p>
        </header>

        {/* Current status bar */}
        <div className="parenting-status-bar glass-panel">
          <div>Parent Bank Balance: <strong className="money-display">${parentMoney}</strong></div>
          <div className="heir-mini-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.2rem', fontSize: '0.75rem' }}>
            <span>Int: {heirStats.intelligence || 10}</span>
            <span>Fit: {heirStats.fitness || 10}</span>
            <span>Cor: {heirStats.corporate || 10}</span>
            <span>Cha: {heirStats.charisma || 10}</span>
            <span>Sty: {heirStats.style || 10}</span>
            <span>Con: {heirStats.confidence || 10}</span>
            <span>Cre: {heirStats.creativity || 10}</span>
            <span>Soc: {heirStats.socialIq || 10}</span>
            <span>Cul: {heirStats.culinary || 10}</span>
            <span>Prg: {heirStats.programming || 10}</span>
          </div>
        </div>

        {/* Choices Column */}
        <div className="parenting-choices-list">
          {activeStep.choices.map((choice, idx) => {
            const isAffordable = parentMoney >= choice.cost;
            return (
              <div 
                key={idx}
                className={`choice-option-card glass-panel ${!isAffordable ? 'disabled' : ''}`}
              >
                <div className="choice-details">
                  <h4>{choice.text}</h4>
                  <p>{choice.description}</p>
                  <div className="gains-badges">
                    {Object.entries(choice.gains).map(([stat, val]) => (
                      <span key={stat} className="gain-badge">
                        +{val} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="choice-action-panel">
                  <div className="choice-cost">{choice.cost > 0 ? `$${choice.cost}` : 'FREE'}</div>
                  <button
                    className="btn-primary select-choice-btn"
                    disabled={!isAffordable}
                    onClick={() => handleMakeChoice(choice.cost, choice.gains)}
                  >
                    {isAffordable ? 'Select Path' : 'Too Expensive'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCompareRow = ({ label, child, parentBonus, total, color }) => (
  <div className="compare-row">
    <span className="compare-label" style={{ color }}>{label}</span>
    <span>{child}</span>
    <span>+{parentBonus}</span>
    <span className="compare-total">{total}</span>
  </div>
);

export default ChildhoodRaising;
