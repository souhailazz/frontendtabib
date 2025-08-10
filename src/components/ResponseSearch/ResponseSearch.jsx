import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, MapPin, Building, Phone, Calendar, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import DoctorMap from "../DoctorMap/DoctorMap";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./ResponseSearch.css";
import BookingModal from "../BookingModal/BookingModal";

export default function ResponseSearch() {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date"); // e.g. "2025-07-22"
  const time = searchParams.get("time"); // e.g. "14:30"
  const selectedDateTime = date && time ? `${date}T${time}:00` : null;
  const reason = searchParams.get("reason"); // add this line

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [modalDoctor, setModalDoctor] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const specialty = searchParams.get("specialite");
  const city = searchParams.get("city");

  // Replace inline booking logic with modal logic
  const handleOpenBookingModal = (doctor) => {
    setModalDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setModalDoctor(null);
  };

  // Updated handleModalConfirm function in ResponseSearch.js

const handleModalConfirm = async (bookingData) => {
  // The consultation is already created in BookingModal
  // This function is called after successful payment
  // We don't need to create another consultation here
  console.log('Booking confirmed with data:', bookingData);
  return true;
};
  


  useEffect(() => {
    const fetchDoctors = async () => {
      if (!specialty) {
        setError('Please select a specialty');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Simple test URL without parameters first
        const testUrl = 'https://tabib-c9pp.onrender.com/api/docteurs/test';
        console.log('Testing connection to:', testUrl);
        
        // First try a simple fetch to test the connection
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors'
        });

        console.log('Test response status:', testResponse.status);
        
        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('Test request failed:', errorText);
          throw new Error(`Server responded with status: ${testResponse.status}`);
        }

        // If test passes, make the actual request
        const params = new URLSearchParams();
        if (specialty) params.append('specialite', specialty);
        if (city) params.append('city', city);
        if (date) params.append('date', date);
        if (time) params.append('time', time);
        if (reason) params.append('reason', reason);

        const apiUrl = `https://tabib-c9pp.onrender.com/api/docteurs/search?${params.toString()}`;
        
        // Log the full API URL for debugging
        console.log('Full API URL:', apiUrl);
        console.log('You can test this URL directly in your browser or Postman');
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'same-origin' // Try 'same-origin' instead of 'include'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Error ${response.status}: ${errorText || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format from server');
        }

        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', {
          error: error.toString(),
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setError(`Could not load doctors: ${error.message}`);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty, city, date, time, reason]);

  const formatSearchCriteria = () => {
    let criteria = specialty || t('responseSearch.allSpecialties');
    if (city) {
      criteria += ` ${t('responseSearch.in')} ${city}`;
    }
    return criteria;
  };

  return (
    <div className="response-container">
      <div className="results-header">
        <Link to="/search" className="back-to-search">
          <ArrowLeft size={16} />
          {t('responseSearch.backToSearch')}
        </Link>
        <h1>{t('responseSearch.title')}</h1>
        <p className="search-criteria">
          {t('responseSearch.showingResultsFor')} <strong>{formatSearchCriteria()}</strong>
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="large" color="primary" text={t('responseSearch.loading')} />
      ) : error ? (
        <div className="error-message">
          <p>{t('responseSearch.error.label')}: {error}</p>
          <Link to="/search" className="try-again-button">
            {t('responseSearch.tryAnotherSearch')}
          </Link>
        </div>
      ) : doctors.length === 0 ? (
        <div className="no-results">
          <h2>{t('responseSearch.noResults.title')}</h2>
          <p>{t('responseSearch.noResults.description')}</p>
          <Link to="/search" className="try-again-button">
            {t('responseSearch.tryAnotherSearch')}
          </Link>
        </div>
      ) : (
        <div className="results-content">
          <div className="results-count">
            <h2>{t('responseSearch.doctorsFound', { count: doctors.length })}</h2>
          </div>
          <div className="results-layout">
            <div className="doctors-list">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">
                    <span>{doctor.prenom?.charAt(0) || "D"}</span>
                  </div>
                  <div className="doctor-info">
                    <h3 className="doctor-name">
                      {t('responseSearch.doctor.title')} {doctor.nom} {doctor.prenom}
                    </h3>
                    <div className="doctor-specialty">
                      <span>{doctor.specialite}</span>
                      <div className="rating">
                        <Star size={16} className="star-icon" />
                        <span>{doctor.rating || "4.5"}</span>
                      </div>
                      <div className="consultations">
                        <Calendar size={16} />
                        <span>{doctor.nombreConsultations || 0} {t('responseSearch.consultations')}</span>
                      </div>
                    </div>
                    <div className="doctor-location">
                      <div className="clinic">
                        <Building size={16} />
                        <span>{doctor.hopital || t('responseSearch.notSpecified')}</span>
                      </div>
                      <div className="address">
                        <MapPin size={16} />
                        <span>{doctor.city || t('responseSearch.notSpecified')}</span>
                      </div>
                      {doctor.telephone && (
                        <div className="phone">
                          <Phone size={16} />
                          <span>{doctor.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button onClick={() => handleOpenBookingModal(doctor)} className="book-consultation">
                    {t('responseSearch.bookConsultation')}
                  </button>

                  {/* Remove inline booking form */}
                </div>
              ))}

            </div>
            <div className="map-container">
              {doctors.length > 0 ? (
                <DoctorMap
                  doctors={doctors}
                  onDoctorSelect={(doctor) => {
                    // Optional: Handle doctor selection from map
                  }}
                />
              ) : (
                <div className="map-placeholder">
                  <h3>{t('responseSearch.mapView')}</h3>
                  <p>{t('responseSearch.noDoctorsForMap')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && modalDoctor && (
        <BookingModal
          doctor={modalDoctor}
          onClose={handleCloseBookingModal}
          onConfirm={handleModalConfirm}
        />
      )}

      
    </div>
  );
  
}
