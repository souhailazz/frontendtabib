"use client";

import { useState } from "react";
import { Search, Stethoscope, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Search/healthcare-search.css";

// Simple Card component for consistent styling
function Card({ children, className = "" }) {
  return (
    <div className={`card ${className}`.trim()}>{children}</div>
  );
}

export default function HealthcareSearch() {
  const [city, setCity] = useState("");
  // Only city and specialty are needed

  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!specialty) {
      setError(t('search.error.selectSpecialty'));
      return;
    }

    // Build the query params
    const params = new URLSearchParams();
    params.append('specialite', specialty);
    if (city) {
      params.append('city', city);
    }

    // Navigate to the response search page with the query parameters
    navigate(`/response-search?${params.toString()}`);
  };

  return (
    <div className="page-background">
      <div className="search-card">
        <div className="search-header">
          <Search size={28} className="search-icon" />
          <h1 className="search-title">{t('search.title')}</h1>
          <p className="search-subtitle">{t('search.subtitle')}</p>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="city" className="form-label">{t('search.city.label')}</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="select-input"
            >
              <option value="">{t('search.city.placeholder')}</option>
              <option value="casablanca">{t('cities.casablanca')}</option>
              <option value="rabat">{t('cities.rabat')}</option>
              <option value="fes">{t('cities.fes')}</option>
              <option value="marrakech">{t('cities.marrakech')}</option>
              <option value="tangier">{t('cities.tangier')}</option>
              <option value="agadir">{t('cities.agadir')}</option>
              <option value="meknes">{t('cities.meknes')}</option>
              <option value="oujda">{t('cities.oujda')}</option>
              <option value="kenitra">{t('cities.kenitra')}</option>
              <option value="tetouan">{t('cities.tetouan')}</option>
              <option value="safi">{t('cities.safi')}</option>
              <option value="el-jadida">{t('cities.elJadida')}</option>
              <option value="beni-mellal">{t('cities.beniMellal')}</option>
              <option value="nador">{t('cities.nador')}</option>
              <option value="taza">{t('cities.taza')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="specialty" className="form-label">{t('search.specialty.label')}</label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="select-input"
            >
              <option value="">{t('search.specialty.placeholder')}</option>
              <option value="Cardiologie">{t('specialties.cardiology')}</option>
              <option value="Dermatologie">{t('specialties.dermatology')}</option>
              <option value="Neurologie">{t('specialties.neurology')}</option>
              <option value="Orthopedie">{t('specialties.orthopedics')}</option>
              <option value="Pediatrice">{t('specialties.pediatrics')}</option>
              <option value="Psychiatre">{t('specialties.psychiatry')}</option>
              <option value="Medecin General">{t('specialties.general')}</option>
            </select>
          </div>
          <button type="submit" className="search-button">
            <Search size={18} />
            {t('search.button')}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
      {/* Feature Cards Section */}
      <div className="feature-cards">
        <Card className="feature-card">
          <div className="feature-icon search-feature-icon">
            <Search className="icon" />
          </div> 
          <h3 className="feature-title">{t('search.feature.easy')}</h3>
          <p className="feature-description">{t('search.feature.easyDesc')}</p>
        </Card>
        <Card className="feature-card">
          <div className="feature-icon verified-feature-icon">
            <Stethoscope className="icon" />
          </div>
          <h3 className="feature-title">{t('search.feature.verified')}</h3>
          <p className="feature-description">{t('search.feature.verifiedDesc')}</p>
        </Card>
        <Card className="feature-card">
          <div className="feature-icon location-feature-icon">
            <MapPin className="icon" />
          </div>
          <h3 className="feature-title">{t('search.feature.locations')}</h3>
          <p className="feature-description">{t('search.feature.locationsDesc')}</p>
        </Card>
      </div>
    </div>
  );
}