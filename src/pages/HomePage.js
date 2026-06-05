import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaShieldAlt, FaExchangeAlt, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import '../styles/home.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Blockchain-Based Land Registry</h1>
          <p>Immutable, transparent, and secure property ownership records</p>
          <Link to="/register" className="btn btn-large btn-primary">
            Get Started <FaArrowRight />
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaFileContract className="feature-icon" />
            <h3>Digital Ownership Certificates</h3>
            <p>Blockchain-verified certificates for complete property ownership records</p>
          </div>

          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>Immutable Records</h3>
            <p>Property records stored on blockchain ensure transparency and security</p>
          </div>

          <div className="feature-card">
            <FaExchangeAlt className="feature-icon" />
            <h3>Smart Transfers</h3>
            <p>Automated ownership transfer via smart contracts with full audit trail</p>
          </div>

          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>Real-Time Verification</h3>
            <p>Instant verification of property ownership and transaction history</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register Your Property</h3>
            <p>Add your property details to the blockchain network securely</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Digital Certificate</h3>
            <p>Receive blockchain-verified ownership certificate</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Execute Transfers</h3>
            <p>Transfer ownership via smart contracts automatically</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Verify Anytime</h3>
            <p>Verify ownership and view complete transaction history</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Key Benefits</h2>
        <ul className="benefits-list">
          <li>✓ Eliminates property disputes with immutable records</li>
          <li>✓ Reduces fraud and unauthorized claims</li>
          <li>✓ Speeds up property transfers and registrations</li>
          <li>✓ Provides transparent transaction history</li>
          <li>✓ Ensures data security with blockchain technology</li>
          <li>✓ 24/7 availability for record verification</li>
        </ul>
      </section>

      <section className="cta">
        <h2>Ready to Secure Your Property?</h2>
        <p>Join thousands of users who trust our blockchain-based land registry</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Create Account</Link>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
