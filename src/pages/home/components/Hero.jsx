// Hero.jsx
import { Link } from "react-router-dom";

  
export default function Hero() {
  return (
    <section className="intro">
      <div className="badge">
        <span className="badge-dot" />
        DSA Daily Tracker
      </div>

      <h1 className="title">
        Track your <span className="highlight">DSA & CP</span> journey in one place
      </h1>

      <p className="text">
        Track your submissions, monitor progress, and stay consistent —
        everything you need to ace your next interview.
      </p>

      <div className="actions">
        <Link to="/register">
          <button className="btn primary">
            Sign up free
          </button>
        </Link>
        <Link to="/login">
          <button className="btn secondary">
            Log in →
          </button>
        </Link>
      </div>
    </section>
  );
}
