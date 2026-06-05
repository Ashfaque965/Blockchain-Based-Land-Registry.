import React, { useState } from 'react';
import { verificationService } from '../services/api';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../styles/verification.css';

const VerificationPage = () => {
  const [activeTab, setActiveTab] = useState('verify-ownership');
  const [formData, setFormData] = useState({
    propertyId: '',
    owner: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerifyOwnership = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verificationService.verifyOwnership(formData);
      setVerificationResult(response.data.data);
      toast.success('Ownership verified!');
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verificationService.generateCertificate(formData.propertyId);
      setCertificate(response.data.data);
      toast.success('Certificate generated!');
    } catch (error) {
      toast.error('Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAuditTrail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verificationService.getAuditTrail(formData.propertyId);
      setAuditTrail(response.data.data);
      toast.success('Audit trail retrieved!');
    } catch (error) {
      toast.error('Failed to retrieve audit trail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <h1><FaShieldAlt /> Verification & Certificates</h1>

      <div className="verification-tabs">
        <button
          className={`tab-button ${activeTab === 'verify-ownership' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify-ownership')}
        >
          Verify Ownership
        </button>
        <button
          className={`tab-button ${activeTab === 'certificate' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificate')}
        >
          Digital Certificate
        </button>
        <button
          className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Trail
        </button>
      </div>

      <div className="verification-content">
        {activeTab === 'verify-ownership' && (
          <div className="verification-card">
            <h2>Verify Property Ownership</h2>
            <form onSubmit={handleVerifyOwnership}>
              <div className="form-row">
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
                  <label>Owner Name</label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Verifying...' : 'Verify Ownership'}
              </button>
            </form>

            {verificationResult && (
              <div className="verification-result">
                <h3>Verification Result</h3>
                <div className={`result-box ${verificationResult.isVerified ? 'verified' : 'not-verified'}`}>
                  {verificationResult.isVerified ? (
                    <>
                      <FaCheckCircle className="result-icon verified" />
                      <p className="result-text">✓ Ownership Verified</p>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="result-icon not-verified" />
                      <p className="result-text">✗ Ownership Not Verified</p>
                    </>
                  )}
                </div>
                <div className="result-details">
                  <p><strong>On-Chain Owner:</strong> {verificationResult.onChain?.currentOwner}</p>
                  <p><strong>Verified Owner:</strong> {verificationResult.onChain?.owner}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificate' && (
          <div className="certificate-card">
            <h2>Generate Digital Certificate</h2>
            <form onSubmit={handleGenerateCertificate}>
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
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Generating...' : 'Generate Certificate'}
              </button>
            </form>

            {certificate && (
              <div className="certificate-display">
                <h3>Digital Ownership Certificate</h3>
                <div className="certificate-content">
                  <div className="cert-section">
                    <h4>Certificate Details</h4>
                    <p><strong>Certificate ID:</strong> {certificate.certificateId}</p>
                    <p><strong>Property ID:</strong> {certificate.propertyId}</p>
                    <p><strong>Owner:</strong> {certificate.owner}</p>
                  </div>
                  <div className="cert-section">
                    <h4>Property Information</h4>
                    <p><strong>Location:</strong> {certificate.location}</p>
                    <p><strong>Area:</strong> {certificate.area?.toLocaleString()} sq. ft</p>
                    <p><strong>Registration Date:</strong> {new Date(certificate.registrationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="cert-section">
                    <h4>Certificate Validity</h4>
                    <p><strong>Issued:</strong> {new Date(certificate.issuanceDate).toLocaleDateString()}</p>
                    <p><strong>Valid Until:</strong> {new Date(certificate.expiryDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span className="badge badge-success">{certificate.status}</span></p>
                  </div>
                  <div className="cert-section">
                    <h4>Blockchain Hash</h4>
                    <code className="hash-display">{certificate.blockchainHash}</code>
                  </div>
                </div>
                <button className="btn btn-primary">Download Certificate</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-card">
            <h2>Audit Trail</h2>
            <form onSubmit={handleGetAuditTrail}>
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
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Loading...' : 'Get Audit Trail'}
              </button>
            </form>

            {auditTrail && (
              <div className="audit-results">
                <h3>Audit Trail - {auditTrail.totalTransactions} Transaction(s)</h3>
                <div className="timeline">
                  {auditTrail.auditTrail.map((entry, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{entry.type.toUpperCase()}</h4>
                        <p><strong>From:</strong> {entry.from} <strong>To:</strong> {entry.to}</p>
                        <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                        {entry.details?.price && (
                          <p><strong>Amount:</strong> {entry.details.price} {entry.details.currency}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
