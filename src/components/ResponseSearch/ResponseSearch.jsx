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
    const fetchDoctors = async (retryCount = 0) => {
      if (!specialty) {
        setError(t('responseSearch.error.noSpecialty'));
        setLoading(false);
        return;
      }

      try {
        // Construct URL with search parameters
        const params = new URLSearchParams();
        if (specialty) params.append('specialite', specialty);
        if (city) params.append('city', city);
        if (date) params.append('date', date);
        if (time) params.append('time', time);
        if (reason) params.append('reason', reason);

        const apiUrl = `https://tabib-c9pp.onrender.com/api/docteurs/search?${params.toString()}`;
        console.log('Fetching doctors from:', apiUrl);

        let response;
        try {
          response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
          });
        } catch (fetchError) {
          console.error('Network fetch error:', fetchError);
          throw new Error(t('responseSearch.error.networkError', { 
            details: fetchError.message || 'Could not connect to the server'
          }));
        }

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.text();
            console.error('API Error Response:', errorData);
            // Try to parse as JSON if possible
            try {
              errorData = JSON.parse(errorData);
            } catch (e) {
              // If not JSON, keep as text
            }
          } catch (e) {
            console.error('Error reading error response:', e);
            errorData = 'Could not read error response';
          }
          
          const errorMessage = errorData?.message || 
                             errorData?.error || 
                             errorData || 
                             `HTTP ${response.status} ${response.statusText}`;
          
          throw new Error(t('responseSearch.error.httpError', { 
            status: response.status,
            message: errorMessage
          }));
        }

        let data;
        try {
          data = await response.json();
          console.log('API Response:', data);
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          throw new Error(t('responseSearch.error.invalidResponse'));
        }
        
        if (!Array.isArray(data)) {
          console.error('Unexpected response format:', data);
          throw new Error(t('responseSearch.error.invalidResponse'));
        }

        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error('Error in fetchDoctors:', {
          error: err,
          message: err.message,
          stack: err.stack,
          retryCount
        });
        
        // Retry logic (max 2 retries with exponential backoff)
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${delay}ms... (Attempt ${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchDoctors(retryCount + 1);
        }
        
        setError(err.message || t('responseSearch.error.networkError'));
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    
    // Cleanup function
    return () => {
      // Add any cleanup if needed
    };
  }, [specialty, city, date, time, reason, t]);

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
