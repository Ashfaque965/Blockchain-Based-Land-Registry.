import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import '../styles/properties.css';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    owner: '',
    location: '',
    area: '',
    metadata: {}
  });

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAllProperties(page, 20);
      setProperties(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await propertyService.registerProperty(formData);
      toast.success('Property registered successfully!');
      setShowForm(false);
      setFormData({
        propertyId: '',
        owner: '',
        location: '',
        area: '',
        metadata: {}
      });
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register property');
    }
  };

  const filteredProperties = properties.filter(prop =>
    prop.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="properties-container">
      <div className="properties-header">
        <h1>Properties</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> Register New Property
        </button>
      </div>

      {showForm && (
        <div className="property-form-card">
          <h2>Register New Property</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Property ID</label>
                <input
                  type="text"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleFormChange}
                  required
                  placeholder="PROP-001"
                />
              </div>
              <div className="form-group">
                <label>Owner</label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleFormChange}
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                  placeholder="123 Main St, City"
                />
              </div>
              <div className="form-group">
                <label>Area (sq. ft)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleFormChange}
                  required
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Register Property</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by property ID, location, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : (
        <>
          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <div key={property._id} className="property-card">
                <div className="property-header">
                  <h3>{property.propertyId}</h3>
                  <span className={`status status-${property.status}`}>{property.status}</span>
                </div>
                <div className="property-details">
                  <p><strong>Owner:</strong> {property.owner}</p>
                  <p><strong>Location:</strong> {property.location}</p>
                  <p><strong>Area:</strong> {property.area.toLocaleString()} sq. ft</p>
                  <p><strong>Registered:</strong> {new Date(property.registrationDate).toLocaleDateString()}</p>
                </div>
                <button className="btn btn-small">View Details</button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-small"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn btn-small"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
