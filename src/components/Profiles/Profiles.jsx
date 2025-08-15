import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Profile.css';

// MUI Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

const Profiles = () => {
  const { userId, userType, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const isDoctor = userType === 'docteur';
  const apiBaseUrl = 'https://tabiblife.zeabur.app/api';

  const profileEndpoint = isDoctor ? `/docteurs/${userId}` : `/patients/${userId}`;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { withCredentials: !isDoctor };
        const response = await axios.get(`${apiBaseUrl}${profileEndpoint}`, config);
        setProfile(response.data);
        setFormData(response.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 404) {
          setError('Authentication failed. Please login again.');
          logout();
          navigate('/login');
        } else {
          setError('Failed to fetch profile data');
        }
      }
    };
    if (userId) fetchProfile();
  }, [userId, apiBaseUrl, profileEndpoint, logout, navigate, isDoctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { withCredentials: !isDoctor };
      const response = await axios.put(`${apiBaseUrl}${profileEndpoint}`, formData, config);
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        const config = { withCredentials: !isDoctor };
        await axios.delete(`${apiBaseUrl}${profileEndpoint}`, config);
        logout();
        navigate('/');
      } catch {
        setError('Failed to delete profile');
      }
    }
  };

  if (!userId) {
    navigate('/login');
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  if (!profile) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-card">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <PersonOutlineIcon fontSize="large" />
        </div>
        <div>
          <h2 className="profile-name">{profile.prenom} {profile.nom}</h2>
          <p className="profile-email"><EmailOutlinedIcon /> {profile.email}</p>
          <span className="profile-role">{isDoctor ? 'Doctor' : 'Patient'}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Common fields */}
          <div className="form-group">
            <label><PersonOutlineIcon /> First Name:</label>
            <input type="text" name="prenom" value={formData.prenom || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label><PersonOutlineIcon /> Last Name:</label>
            <input type="text" name="nom" value={formData.nom || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label><EmailOutlinedIcon /> Email:</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label><PhoneOutlinedIcon /> Phone:</label>
            <input type="tel" name="telephone" value={formData.telephone || ''} onChange={handleChange} />
          </div>

          {/* Role-specific fields */}
          {isDoctor ? (
            <>
              <div className="form-group">
                <label><NumbersOutlinedIcon /> Professional Number:</label>
                <input type="text" name="numeroProfessionnel" value={formData.numeroProfessionnel || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><WorkOutlineOutlinedIcon /> Specialty:</label>
                <input type="text" name="specialite" value={formData.specialite || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><LocalHospitalOutlinedIcon /> Hospital:</label>
                <input type="text" name="hopital" value={formData.hopital || ''} onChange={handleChange} />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label><HomeOutlinedIcon /> Address:</label>
                <textarea name="adresse" value={formData.adresse || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><CakeOutlinedIcon /> Date of Birth:</label>
                <input type="date" name="dateNaissance" value={formData.dateNaissance || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><CreditCardOutlinedIcon /> Social Security Number:</label>
                <input type="text" name="numeroSecuriteSociale" value={formData.numeroSecuriteSociale || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><HistoryEduOutlinedIcon /> Medical History:</label>
                <textarea name="historiqueMedical" value={formData.historiqueMedical || ''} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="button-group">
            <button type="submit" className="save-button"><SaveOutlinedIcon /> Save</button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}><CancelOutlinedIcon /> Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="info-section">
            {isDoctor ? (
              <>
                <div className="info-row"><NumbersOutlinedIcon /> <span>Professional Number:</span> {profile.numeroProfessionnel}</div>
                <div className="info-row"><WorkOutlineOutlinedIcon /> <span>Specialty:</span> {profile.specialite}</div>
                <div className="info-row"><LocalHospitalOutlinedIcon /> <span>Hospital:</span> {profile.hopital}</div>
              </>
            ) : (
              <>
                <div className="info-row"><PhoneOutlinedIcon /> <span>Phone:</span> {profile.telephone}</div>
                <div className="info-row"><HomeOutlinedIcon /> <span>Address:</span> {profile.adresse}</div>
                <div className="info-row"><CakeOutlinedIcon /> <span>Date of Birth:</span> {profile.dateNaissance}</div>
                <div className="info-row"><CreditCardOutlinedIcon /> <span>Social Security Number:</span> {profile.numeroSecuriteSociale}</div>
                <div className="info-row"><HistoryEduOutlinedIcon /> <span>Medical History:</span> {profile.historiqueMedical}</div>
              </>
            )}
          </div>

          <div className="button-group">
            <button onClick={() => setIsEditing(true)} className="edit-button"><EditOutlinedIcon /> Edit Profile</button>
            <button onClick={handleDelete} className="delete-button"><DeleteOutlineOutlinedIcon /> Delete Profile</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profiles;
