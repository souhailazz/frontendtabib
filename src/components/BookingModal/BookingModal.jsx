import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./BookingModal.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentModal from "../PaymentModal/PaymentModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { BookingSessionUtils } from "../../utils/BookingSessionUtils";

export default function BookingModal({ doctor, onClose, onConfirm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, isLoggedIn } = useAuth();

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
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  // guards to avoid double-restore loops in fast HMR/renders
  const hasRestoredRef = useRef(false);

  // Pricing configuration
  const pricingConfig = {
    "in-person": { price: 300, label: "In-person consultation" },
    "video": { price: 200, label: "Video consultation" },
    "home": { price: 450, label: "Home visit" }
  };

  const platformFee = 20;
  const selectedPrice = pricingConfig[consultationType]?.price ?? 300;
  const totalPrice = selectedPrice + platformFee;

  // Helpers
  function generateTimeSlots() {
    const out = [];
    let start = 9 * 60; // 09:00
    let end = 17 * 60;  // 17:00
    for (let mins = start; mins <= end - 30; mins += 30) {
      const h = String(Math.floor(mins / 60)).padStart(2, "0");
      const m = String(mins % 60).padStart(2, "0");
      out.push(`${h}:${m}`);
    }
    return out;
  }

  function resetForm() {
    setDate("");
    setTime("");
    setReason("");
    setConsultationType("in-person");
  }

  function clearBookingSession() {
    // Keep this centralized to avoid accidentally wiping data too soon elsewhere
    BookingSessionUtils.clearBookingSession();
    sessionStorage.removeItem("modalBookingData");
  }

  // Restore saved booking data when modal opens for a doctor
  useEffect(() => {
    if (!doctor) return;

    // Prevent multiple restores in a single open cycle
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    let savedBookingData = sessionStorage.getItem("modalBookingData");
    let source = "modalBookingData";

    if (!savedBookingData) {
      savedBookingData = sessionStorage.getItem("bookingFormData");
      source = "bookingFormData";
    }

    if (!savedBookingData) {
      resetForm();
    } else {
      try {
        const parsed = JSON.parse(savedBookingData);

        if (parsed.doctorId === doctor.id) {
          setDate(parsed.date || "");
          setTime(parsed.time || "");
          setReason(parsed.reason || "");
          setConsultationType(parsed.consultationType || "in-person");
        } else {
          resetForm();
        }
      } catch (e) {
        resetForm();
      }
    }

    // Reset other state on open
    setError("");
    setShowPaymentModal(false);
    setBookingData(null);
    setIsLoading(false);

    // Generate slots initially
    setSlots(generateTimeSlots());

    // Cleanup on unmount: allow restoration next time it opens
    return () => {
      hasRestoredRef.current = false;
    };
  }, [doctor?.id]); // run when doctor changes / modal re-opens for a new doctor

  // Fetch booked consultations for the doctor on the selected date
  useEffect(() => {
    if (!date || !doctor?.id) {
      setBookedSlots([]);
      setSlots(generateTimeSlots());
      return;
    }

    fetch(`https://tabib.zeabur.app/api/consultations/doctor/${doctor.id}`)
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
  }, [date, doctor?.id]);

  // Save the current form state into session (used when redirecting to login)
  const saveBookingDataToSession = () => {
    const formData = {
      date,
      time,
      reason,
      consultationType,
    };

    const bookingDataObject = BookingSessionUtils.createBookingDataObject(
      doctor,
      formData,
      location
    );

    BookingSessionUtils.saveBookingData(bookingDataObject);
  };

  // Confirm -> If not logged in, save and redirect; if logged in, create consultation then show PaymentModal
  const handleConfirm = async () => {
    setError("");

    if (!date || !time || !reason || !consultationType) {
      setError(t("responseSearch.error.fillAllFields"));
      return;
    }

    if (!isLoggedIn || !userId) {
      // Save draft + show redirect modal
      saveBookingDataToSession();
      setShowRedirectModal(true);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userEmail = sessionStorage.getItem("userEmail");
      const userName = sessionStorage.getItem("userName");
      if (!userEmail || !userName) {
        setError("User information missing. Please log in again.");
        setIsLoading(false);
        return;
      }

      // Create consultation first
      const consultationPayload = {
        docteurId: doctor.id,
        patientId: parseInt(userId, 10),
        dateConsultation: `${date}T${time}:00`,
        reason,
        consultationType,
        price: selectedPrice,
        totalPrice: totalPrice,
      };

      const response = await fetch("https://tabib.zeabur.app/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultationPayload),
      });

      if (!response.ok) throw new Error("Failed to create consultation");
      const consultation = await response.json();

      // Prepare booking payload for payment
      const prepared = {
        consultationId: consultation.id,
        doctorId: doctor.id,
        patientId: consultation.patient?.id || parseInt(userId, 10),
        date,
        time,
        reason,
        consultationType,
        price: selectedPrice,
        totalPrice: totalPrice,
        patientEmail: userEmail,
        patientName: userName,
      };

      setBookingData(prepared);
      setShowPaymentModal(true);
    } catch (e) {
      setError("Failed to create consultation: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    clearBookingSession(); // finally clear
    if (onConfirm) onConfirm(bookingData);
  };

  const handleClose = () => {
    // Consider clearing only the modal-specific data, keep pendingBooking draft if you prefer
    // Here we clear everything to avoid ghost restores unless you want to keep drafts on cancel
    clearBookingSession();
    onClose?.();
  };

  // Add this function to handle the navigation after showing the modal
  const handleRedirectToLogin = () => {
    setShowRedirectModal(false);
    setTimeout(() => navigate("/login"), 300);
  };

  // Render
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <motion.div
        className="booking-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{t("responseSearch.bookConsultation")}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        {/* Doctor Info with Current Price */}
        <div className="doctor-info-section">
          <div className="doctor-details">
            <div className="doctor-avatar">
              {doctor?.prenom?.charAt(0) || "D"}
            </div>
            <div>
              <strong>{doctor?.nom} {doctor?.prenom}</strong>
              <div className="specialty">{doctor?.specialite}</div>
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
                className={`consultation-type-btn ${consultationType === type ? "selected" : ""}`}
                onClick={() => setConsultationType(type)}
              >
                <div className="type-name">
                  {type === "in-person" ? "In-Person" : type === "video" ? "Video Call" : "Home Visit"}
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
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Time Slots */}
        <div className="form-group">
          <label>Available Time Slots:</label>
          <div className="time-slots-container">
            {slots.length === 0 ? (
              <div className="no-slots">
                {t("bookingModal.noAvailableSlots") || "No available time slots for this date."}
              </div>
            ) : (
              slots.map((slot) => {
                const disabled = bookedSlots.includes(slot);
                const selected = time === slot;
                return (
                  <button
                    key={slot}
                    className={`time-slot-btn${selected ? " selected" : ""} ${disabled ? " disabled" : ""}`}
                    onClick={() => !disabled && setTime(slot)}
                    disabled={disabled}
                  >
                    {slot}
                    {disabled && <span className="booked-indicator">Booked</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="form-group">
          <label>{t("search.reason.label")}:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("search.reason.placeholder")}
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
          <button className="cancel-button" onClick={handleClose} disabled={isLoading}>
            {t("bookingModal.cancel")}
          </button>
          <button className="confirm-button" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner size="small" color="white" />
            ) : !isLoggedIn ? (
              "Login to Continue"
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Redirect Modal */}
        {showRedirectModal && (
          <div className="redirect-modal-overlay">
            <div className="redirect-modal">
              <h3>Redirecting to Login</h3>
              <p>Please log in to continue with your booking. You'll be redirected shortly...</p>
              <div className="modal-actions" style={{justifyContent: 'center', marginTop: '20px'}}>
                <button 
                  className="confirm-button" 
                  onClick={handleRedirectToLogin}
                  style={{padding: '8px 20px'}}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        )}
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
