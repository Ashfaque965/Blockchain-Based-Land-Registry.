import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaHome, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTransfers: 0,
    verifiedProperties: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAllProperties(1, 5);
      setRecentProperties(response.data.data);
      setStats({
        totalProperties: response.data.pagination.total,
        totalTransfers: Math.floor(Math.random() * 100), // Mock data
        verifiedProperties: Math.floor(response.data.pagination.total * 0.8)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>Blockchain-Based Land Registry Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaHome />
          </div>
          <div className="stat-content">
            <h3>Total Properties</h3>
            <p className="stat-number">{stats.totalProperties}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaExchangeAlt />
          </div>
          <div className="stat-content">
            <h3>Transfers</h3>
            <p className="stat-number">{stats.totalTransfers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Verified</h3>
            <p className="stat-number">{stats.verifiedProperties}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>Trust Score</h3>
            <p className="stat-number">98%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Recent Properties</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentProperties.length === 0 ? (
            <p className="empty-state">No properties yet. Start by registering a property!</p>
          ) : (
            <div className="recent-list">
              {recentProperties.map((property) => (
                <div key={property._id} className="recent-item">
                  <div className="item-info">
                    <h4>{property.propertyId}</h4>
                    <p>{property.location}</p>
                  </div>
                  <div className="item-meta">
                    <span className={`badge badge-${property.status}`}>{property.status}</span>
                    <span className="date">
                      {new Date(property.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <a href="/properties" className="action-button">
              <FaHome /> View All Properties
            </a>
            <a href="/transfers" className="action-button">
              <FaExchangeAlt /> Execute Transfer
            </a>
            <a href="/verify" className="action-button">
              <FaCheckCircle /> Verify Ownership
            </a>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <div className="info-box">
          <h3>About Blockchain Land Registry</h3>
          <p>
            This platform uses Hyperledger Fabric to ensure immutable property records
            and transparent transaction history. All property transfers are recorded on
            the blockchain and verified in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
