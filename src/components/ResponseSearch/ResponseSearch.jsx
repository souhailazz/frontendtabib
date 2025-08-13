import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Star, MapPin, Building, Phone, Calendar, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import DoctorMap from "../DoctorMap/DoctorMap";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./ResponseSearch.css";
import BookingModal from "../BookingModal/BookingModal";
import { useAuth } from "../../contexts/AuthContext";
import { BookingSessionUtils } from "../../utils/BookingSessionUtils";

export default function ResponseSearch() {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const selectedDateTime = date && time ? `${date}T${time}:00` : null;
  const reason = searchParams.get("reason");

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

  useEffect(() => {
    const checkPendingBooking = () => {
      if (!BookingSessionUtils.hasPendingBooking() || !isLoggedIn) {
        return;
      }

      const savedSession = BookingSessionUtils.getSavedBookingData();
      if (!savedSession) {
        return;
      }

      const { bookingData } = savedSession;
      
      // Find the doctor from the current doctors list or use saved doctor data
      let doctorToBook = doctors.find(d => d.id === bookingData.doctorId);
      
      // If doctor not found in current list, use saved doctor data
      if (!doctorToBook && bookingData.doctorData) {
        doctorToBook = bookingData.doctorData;
      }
      
      if (doctorToBook) {
        // Store the booking data temporarily in a different key for the modal to read
        sessionStorage.setItem('modalBookingData', JSON.stringify(bookingData));
        
        // Open modal immediately - the modal will handle the data loading
        setModalDoctor(doctorToBook);
        setShowBookingModal(true);
      } else {
        // Clear invalid booking data using utility
        BookingSessionUtils.clearBookingSession();
      }
    };

    // Check for pending booking when component mounts and when doctors are loaded
    if (doctors.length > 0) {
      // Add a small delay to ensure all state updates are complete
      const timeoutId = setTimeout(checkPendingBooking, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [doctors, isLoggedIn]);

  // Original booking modal handlers
  const handleOpenBookingModal = (doctor) => {
    setModalDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setModalDoctor(null);
  };

  const handleModalConfirm = async (bookingData) => {
    return true;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!specialty) {
        setError(t('responseSearch.error.noSpecialty'));
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `https://tabiblife.zeabur.app/api/docteurs/search?${searchParams.toString()}`;
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });

        if (response.status === 204) {
          setDoctors([]);
          setError(null);
          return;
        }

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`${t('responseSearch.error.httpError')} ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error(t('responseSearch.error.invalidResponse'));
        }

        setDoctors(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchParams, specialty, t]);

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

                  <button onClick={() => handleOpenBookingModal(doctor)} className="book-consultation">
                    {t('responseSearch.bookConsultation')}
                  </button>
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