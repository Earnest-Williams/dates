import { useGameStore } from '../state/store';
import './Intro.css';

const Intro = () => {
  const completeIntro = useGameStore(state => state.completeIntro);

  return (
    <div className="intro-shell animate-fade-in">
      <section className="intro-panel glass-panel">
        <div className="intro-kicker">Day 1 • Age 18 • Endleigh</div>
        <h1>First Morning Out</h1>
        <p className="intro-copy">
          High school ended yesterday. This morning, Mom and Dad helped carry the last box up the stairs to your flat above the fried chicken shop.
        </p>
        <p className="intro-copy">
          They paid the rent for one year, stocked the fridge, left you with 2500 in cash, and told you to go make a place for yourself in the world.
        </p>

        <div className="intro-state-grid">
          <div>
            <span>Home</span>
            <strong>Tiny Endleigh starter flat</strong>
          </div>
          <div>
            <span>Money</span>
            <strong>2500</strong>
          </div>
          <div>
            <span>Rent</span>
            <strong>Paid through Day 365</strong>
          </div>
          <div>
            <span>Life</span>
            <strong>No job, no partner, no plan yet</strong>
          </div>
        </div>

        <div className="intro-note">
          You have a bed, a hot plate, some clothes, and enough time to make the first move before the bills get serious.
        </div>

        <div className="intro-actions">
          <button className="btn-primary" onClick={completeIntro}>Start Day One</button>
          <button className="btn-secondary" onClick={completeIntro}>Skip Intro</button>
        </div>
      </section>
    </div>
  );
};

export default Intro;
