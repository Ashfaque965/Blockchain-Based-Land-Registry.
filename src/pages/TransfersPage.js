import React, { useState } from 'react';
import { transferService } from '../services/api';
import { toast } from 'react-toastify';
import { FaExchangeAlt } from 'react-icons/fa';
import '../styles/transfers.css';

const TransfersPage = () => {
  const [formData, setFormData] = useState({
    propertyId: '',
    newOwner: '',
    transferDetails: {
      price: '',
      currency: 'USD',
      description: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('transferDetails.')) {
      const key = name.replace('transferDetails.', '');
      setFormData(prev => ({
        ...prev,
        transferDetails: {
          ...prev.transferDetails,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await transferService.transferProperty(formData);
      toast.success('Property transferred successfully!');
      setFormData({
        propertyId: '',
        newOwner: '',
        transferDetails: {
          price: '',
          currency: 'USD',
          description: ''
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async () => {
    if (!formData.propertyId) {
      toast.error('Please enter property ID');
      return;
    }

    try {
      const response = await transferService.getTransactionHistory(formData.propertyId);
      setTransactions(response.data.data);
      setShowHistory(true);
    } catch (error) {
      toast.error('Failed to fetch transaction history');
    }
  };

  return (
    <div className="transfers-container">
      <h1><FaExchangeAlt /> Property Transfer</h1>

      <div className="transfers-content">
        <div className="transfer-form-card">
          <h2>Initiate Transfer</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Property ID</label>
              <input
                type="text"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                required
                placeholder="PROP-001"
              />
            </div>

            <div className="form-group">
              <label>New Owner</label>
              <input
                type="text"
                name="newOwner"
                value={formData.newOwner}
                onChange={handleChange}
                required
                placeholder="New Owner Name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="transferDetails.price"
                  value={formData.transferDetails.price}
                  onChange={handleChange}
                  placeholder="500000"
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  name="transferDetails.currency"
                  value={formData.transferDetails.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="transferDetails.description"
                value={formData.transferDetails.description}
                onChange={handleChange}
                placeholder="Transfer details..."
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Processing...' : 'Execute Transfer'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleViewHistory}
              >
                View History
              </button>
            </div>
          </form>
        </div>

        {showHistory && (
          <div className="history-card">
            <h2>Transaction History</h2>
            {transactions.length === 0 ? (
              <p>No transactions found</p>
            ) : (
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td>{tx.fromOwner}</td>
                        <td>{tx.toOwner}</td>
                        <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${tx.status}`}>{tx.status}</span></td>
                        <td>{tx.details?.price ? `${tx.details.price} ${tx.details.currency}` : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransfersPage;
