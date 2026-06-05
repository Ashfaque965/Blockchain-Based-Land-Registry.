import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/api';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import '../styles/profile.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || ''
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      fetchUserProperties();
    }
  }, [user]);

  const fetchUserProperties = async () => {
    try {
      const response = await propertyService.getPropertiesByOwner(user.fullName);
      setProperties(response.data.data);
    } catch (error) {
      console.error('Failed to fetch properties', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>
        <div className="profile-info">
          <h1>{user?.fullName}</h1>
          <p>@{user?.username}</p>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button
              className="btn btn-small"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FaEdit /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{user?.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Address:</span>
                <span className="value">{user?.address || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Document ID:</span>
                <span className="value">{user?.documentId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Role:</span>
                <span className="value badge badge-info">{user?.role}</span>
              </div>
              <div className="detail-item">
                <span className="label">Member Since:</span>
                <span className="value">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h2>My Properties ({properties.length})</h2>
          {properties.length === 0 ? (
            <p className="empty-state">No properties registered yet</p>
          ) : (
            <div className="properties-list">
              {properties.map((property) => (
                <div key={property._id} className="property-item">
                  <div className="property-item-header">
                    <h4>{property.propertyId}</h4>
                    <span className={`status status-${property.status}`}>{property.status}</span>
                  </div>
                  <p><strong>Location:</strong> {property.location}</p>
                  <p><strong>Area:</strong> {property.area?.toLocaleString()} sq. ft</p>
                  <p><strong>Registered:</strong> {new Date(property.registrationDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
