import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BookingModal.css";
import { useTranslation } from "react-i18next";
import PaymentModal from "../PaymentModal/PaymentModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function BookingModal({ doctor, onClose, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [consultationType, setConsultationType] = useState("in-person");
  const [error, setError] = useState("");
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Reset modal state when doctor changes
  useEffect(() => {
    if (doctor) {
      setDate("");
      setTime("");
      setReason("");
      setConsultationType("in-person");
      setError("");
      setShowPaymentModal(false);
      setBookingData(null);
      setIsLoading(false);
    }
  }, [doctor]);

  // Pricing configuration (you can move this to props or a config file)
  const pricingConfig = {
    "in-person": { price: 300, label: "In-person consultation" },
    "video": { price: 200, label: "Video consultation" },
    "home": { price: 450, label: "Home visit" }
  };

  const platformFee = 20;
  const selectedPrice = pricingConfig[consultationType]?.price || 300;
  const totalPrice = selectedPrice + platformFee;

  // Helper to generate 30-min slots between 09:00 and 17:00
  function generateTimeSlots() {
    const slots = [];
    let start = 9 * 60; // 09:00 in minutes
    let end = 17 * 60; // 17:00 in minutes
    for (let mins = start; mins <= end - 30; mins += 30) {
      const h = String(Math.floor(mins / 60)).padStart(2, "0");
      const m = String(mins % 60).padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
    return slots;
  }

  // Fetch booked consultations for the doctor on the selected date
  useEffect(() => {
    if (!date || !doctor?.id) {
      setBookedSlots([]);
      setSlots(generateTimeSlots());
      return;
    }
    
    fetch(`https://tabib-c9pp.onrender.com//api/consultations/doctor/${doctor.id}`)
      .then((res) => res.json())
      .then((consultations) => {
        const booked = consultations
          .filter((c) => {
            if (!c.dateConsultation) return false;
            const d = new Date(c.dateConsultation);
            return d.toISOString().slice(0, 10) === date;
          })
          .map((c) => {
            const d = new Date(c.dateConsultation);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
          });
        setBookedSlots(booked);
        setSlots(generateTimeSlots());
      })
      .catch(() => {
        setBookedSlots([]);
        setSlots(generateTimeSlots());
      });
  }, [date, doctor]);

  const handleConfirm = async () => {
    setError("");
    if (!date || !time || !reason || !consultationType) {
      setError(t('responseSearch.error.fillAllFields'));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check for real user info
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      if (!userEmail || !userName) {
        setError("User information missing. Please log in again.");
        return;
      }
      // Create consultation first
      const consultationData = {
        docteurId: doctor.id,
        patientId: 1, // This should come from user context/authentication
        dateConsultation: `${date}T${time}:00`,
        reason: reason,
        consultationType: consultationType,
        price: selectedPrice,
        totalPrice: totalPrice
      };

      const response = await fetch('https://tabib-c9pp.onrender.com//api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData)
      });

      if (!response.ok) {
        throw new Error('Failed to create consultation');
      }

      const consultation = await response.json();

      // Prepare booking data with consultation ID
      const bookingData = {
        consultationId: consultation.id,
        doctorId: doctor.id,
        patientId: consultation.patient?.id || 1,
        date,
        time,
        reason,
        consultationType,
        price: selectedPrice,
        totalPrice: totalPrice,
        patientEmail: userEmail, // Use real email from user context
        patientName: userName // Use real name from user context
      };

      setBookingData(bookingData);
      setShowPaymentModal(true);
    } catch (error) {
      setError('Failed to create consultation: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful');
    setShowPaymentModal(false);
    // You can also call onConfirm here if needed
    if (onConfirm) {
      onConfirm(bookingData);
    }
  };

  console.log('BookingModal render');
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="booking-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
            <div className="modal-header">
              <h2>{t('responseSearch.bookConsultation')}</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>

            {/* Doctor Info with Current Price */}
            <div className="doctor-info-section">
              <div className="doctor-details">
                <div className="doctor-avatar">
                  {doctor.prenom?.charAt(0) || "D"}
                </div>
                <div>
                  <strong>{doctor.nom} {doctor.prenom}</strong>
                  <div className="specialty">{doctor.specialite}</div>
                </div>
              </div>
              <div className="current-price">
                <div className="price-amount">{selectedPrice} MAD</div>
                <div className="price-type">{pricingConfig[consultationType]?.label}</div>
              </div>
            </div>

            {/* Consultation Type Selection */}
            <div className="form-group">
              <label>Consultation Type:</label>
              <div className="consultation-types">
                {Object.entries(pricingConfig).map(([type, config]) => (
                  <button
                    key={type}
                    className={`consultation-type-btn ${consultationType === type ? 'selected' : ''}`}
                    onClick={() => setConsultationType(type)}
                  >
                    <div className="type-name">
                      {type === 'in-person' ? 'In-Person' : 
                       type === 'video' ? 'Video Call' : 'Home Visit'}
                    </div>
                    <div className="type-price">{config.price} MAD</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="form-group">
              <label>Date:</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => { setDate(e.target.value); setTime(""); }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Slots */}
            <div className="form-group">
              <label>Available Time Slots:</label>
              <div className="time-slots-container">
                {slots.length === 0 ? (
                  <div className="no-slots">
                    {t('bookingModal.noAvailableSlots') || 'No available time slots for this date.'}
                  </div>
                ) : (
                  slots.map((slot) => (
                    <button
                      key={slot}
                      className={`time-slot-btn${time === slot ? " selected" : ""} ${bookedSlots.includes(slot) ? " disabled" : ""}`}
                      onClick={() => !bookedSlots.includes(slot) && setTime(slot)}
                      disabled={bookedSlots.includes(slot)}
                    >
                      {slot}
                      {bookedSlots.includes(slot) && <span className="booked-indicator">Booked</span>}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="form-group">
              <label>{t('search.reason.label')}:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('search.reason.placeholder')}
                rows="4"
              />
            </div>

            {/* Pricing Summary */}
            <div className="pricing-summary">
              <h4>Booking Summary</h4>
              <div className="pricing-row">
                <span>{pricingConfig[consultationType]?.label}</span>
                <span>{selectedPrice} MAD</span>
              </div>
              <div className="pricing-row">
                <span>Platform fee</span>
                <span>{platformFee} MAD</span>
              </div>
              <div className="pricing-row total">
                <span>Total</span>
                <span>{totalPrice} MAD</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button className="cancel-button" onClick={onClose} disabled={isLoading}>
                {t('bookingModal.cancel')}
              </button>
              <button className="confirm-button" onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingData={bookingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </motion.div>
    </div>
  );
}