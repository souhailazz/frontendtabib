import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { FaCreditCard, FaMobileAlt, FaPaypal, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./PaymentModal.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const stripePromise = loadStripe("pk_test_51RskHGCy2oKKGIcSG3XHWFwHli0leVfq0sawfo0hH9MtSkBToSYCqA3rRPMNZzaWj7JBS3jep7oIM6gB1qqSG05j004ZssOGux");

// Payment Method Component
const PaymentMethodSelector = ({ selectedMethod, onMethodChange, paymentMethods }) => {
  const { t } = useTranslation();

  return (
    <div className="payment-method-selector">
      <h3>{t('payment.selectMethod') || 'Select Payment Method'}</h3>
      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="method-icon">
              {method.id === 'credit_card' && <FaCreditCard />}
              {method.id === 'mobile_money' && <FaMobileAlt />}
              {method.id === 'paypal' && <FaPaypal />}
            </div>
            <div className="method-info">
              <h4>{method.name}</h4>
              <p>{method.description}</p>
            </div>
            <div className="method-check">
              {selectedMethod === method.id && <FaCheckCircle />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Credit Card Payment Form
const CreditCardForm = ({ amount, onPaymentSuccess, onPaymentError, bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create payment intent
      const response = await fetch("https://tabib-c9pp.onrender.com//api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultationId: bookingData?.consultationId || 1,
          paymentMethod: "credit_card",
          amount: amount,
          currency: "MAD",
          customerEmail: bookingData?.patientEmail,
          customerName: bookingData?.patientName
        }),
      });

      const data = await response.json();

      if (data.status === "failed") {
        throw new Error(data.errorMessage || t('payment.error.paymentIntentFailed'));
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || t('payment.error.paymentFailed'));
      }

      if (paymentIntent.status === "succeeded") {
        // Confirm payment with backend
        const confirmResponse = await fetch(`https://tabib-c9pp.onrender.com//api/payments/confirm-payment?paymentIntentId=${paymentIntent.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const confirmData = await confirmResponse.json();

        if (confirmData.status === "succeeded") {
          onPaymentSuccess(confirmData);
        } else {
          throw new Error(confirmData.errorMessage || t('payment.error.confirmationFailed'));
        }
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="credit-card-form">
      <div className="form-group">
        <label>{t('payment.cardDetails') || 'Card Details'}</label>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaTimesCircle />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="payment-button"
      >
        {loading ? (
          <LoadingSpinner size="small" color="white" />
        ) : (
          <>
            <FaLock />
            {t('payment.pay') || 'Pay'} {amount} MAD
          </>
        )}
      </button>
    </form>
  );
};

// Mobile Money Form
const MobileMoneyForm = ({ amount, onPaymentSuccess, onPaymentError, bookingData }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState("orange_money");

  const providers = [
    { id: "orange_money", name: t('payment.providers.orangeMoney'), color: "#ff6600" },
    { id: "inwi_money", name: t('payment.providers.inwiMoney'), color: "#0066cc" },
    { id: "barid_mob", name: t('payment.providers.baridMob'), color: "#cc0000" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!phoneNumber) {
      setError(t('payment.error.phoneRequired'));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://tabib-c9pp.onrender.com//api/payments/mobile-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultationId: bookingData?.consultationId || 1,
          paymentMethod: "mobile_money",
          amount: amount,
          currency: "MAD",
          phoneNumber: phoneNumber,
          mobileMoneyProvider: provider,
          customerEmail: bookingData?.patientEmail,
          customerName: bookingData?.patientName
        }),
      });

      const data = await response.json();

      if (data.status === "succeeded") {
        onPaymentSuccess(data);
      } else {
        throw new Error(data.errorMessage || t('payment.error.mobileMoneyFailed'));
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mobile-money-form">
      <div className="form-group">
        <label>{t('payment.phoneNumber') || 'Phone Number'}</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="06XXXXXXXX"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>{t('payment.provider') || 'Mobile Money Provider'}</label>
        <div className="provider-buttons">
          {providers.map((prov) => (
            <button
              key={prov.id}
              type="button"
              className={`provider-btn ${provider === prov.id ? 'selected' : ''}`}
              onClick={() => setProvider(prov.id)}
              style={{ '--provider-color': prov.color }}
            >
              {prov.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaTimesCircle />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="payment-button"
      >
        {loading ? (
          <LoadingSpinner size="small" color="white" />
        ) : (
          <>
            <FaMobileAlt />
            {t('payment.pay') || 'Pay'} {amount} MAD
          </>
        )}
      </button>
    </form>
  );
};

// PayPal Form
const PayPalForm = ({ amount, onPaymentSuccess, onPaymentError, bookingData }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayPalPayment = async () => {
    setLoading(true);
    setError("");

    try {
      // In a real implementation, you would integrate with PayPal SDK
      // For now, we'll simulate the payment
      const response = await fetch("https://tabib-c9pp.onrender.com//api/payments/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultationId: bookingData?.consultationId || 1,
          paymentMethod: "paypal",
          amount: amount,
          currency: "MAD",
          paypalOrderId: "PP_" + Date.now(), // This would come from PayPal
          customerEmail: bookingData?.patientEmail,
          customerName: bookingData?.patientName
        }),
      });

      const data = await response.json();

      if (data.status === "succeeded") {
        onPaymentSuccess(data);
      } else {
        throw new Error(data.errorMessage || t('payment.error.paypalFailed'));
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paypal-form">
      <div className="paypal-info">
        <FaPaypal className="paypal-icon" />
        <p>{t('payment.paypalInfo') || 'You will be redirected to PayPal to complete your payment securely.'}</p>
      </div>

      {error && (
        <div className="error-message">
          <FaTimesCircle />
          {error}
        </div>
      )}

      <button
        onClick={handlePayPalPayment}
        disabled={loading}
        className="payment-button paypal-button"
      >
        {loading ? (
          <LoadingSpinner size="small" color="white" />
        ) : (
          <>
            <FaPaypal />
            {t('payment.payWithPayPal') || 'Pay with PayPal'} - {amount} MAD
          </>
        )}
      </button>
    </div>
  );
};

// Main Payment Modal Component
const PaymentModal = ({ isOpen, onClose, bookingData, onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState("credit_card");
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, error
  const [paymentError, setPaymentError] = useState("");

  const paymentMethods = [
    {
      id: "credit_card",
      name: t('payment.creditCard') || "Credit Card",
      description: t('payment.creditCardDesc') || "Pay securely with your credit or debit card",
      enabled: true
    },
    {
      id: "mobile_money",
      name: t('payment.mobileMoney') || "Mobile Money",
      description: t('payment.mobileMoneyDesc') || "Pay with Orange Money, Inwi Money, or Barid Mob",
      enabled: true
    },
    {
      id: "paypal",
      name: t('payment.paypal') || "PayPal",
      description: t('payment.paypalDesc') || "Pay with your PayPal account",
      enabled: true
    }
  ];

  const handlePaymentSuccess = (paymentData) => {
    setPaymentStatus("success");
    setTimeout(() => {
      onPaymentSuccess(paymentData);
      onClose();
    }, 5000); 
  };

  const handlePaymentError = (error) => {
    setPaymentStatus("error");
    setPaymentError(error);
  };

  const handleMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    setPaymentStatus("pending");
    setPaymentError("");
  };

  const renderPaymentForm = () => {
    if (selectedMethod === "credit_card") {
      return (
        <Elements stripe={stripePromise}>
          <CreditCardForm
            amount={bookingData?.totalPrice || 0}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            bookingData={bookingData}
          />
        </Elements>
      );
    } else if (selectedMethod === "mobile_money") {
      return (
        <MobileMoneyForm
          amount={bookingData?.totalPrice || 0}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          bookingData={bookingData}
        />
      );
    } else if (selectedMethod === "paypal") {
      return (
        <PayPalForm
          amount={bookingData?.totalPrice || 0}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          bookingData={bookingData}
        />
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <motion.div
        className="payment-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-modal-header">
          <h2>{t('payment.title')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {paymentStatus === "success" ? (
          <div className="payment-success">
            <FaCheckCircle className="success-icon" />
            <h3>{t('payment.success')}</h3>
            <p>{t('payment.successMessage')}</p>
          </div>
        ) : (
          <>
            <div className="payment-summary">
              <h3>{t('payment.summary')}</h3>
                              <div className="summary-item">
                  <span>{t('payment.consultation')}</span>
                  <span>{bookingData?.price || 0} MAD</span>
                </div>
                <div className="summary-item">
                  <span>{t('payment.platformFee')}</span>
                  <span>20 MAD</span>
                </div>
                <div className="summary-item total">
                  <span>{t('payment.total')}</span>
                  <span>{bookingData?.totalPrice || 0} MAD</span>
                </div>
            </div>

            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onMethodChange={handleMethodChange}
              paymentMethods={paymentMethods}
            />

            <div className="payment-form-container">
              {renderPaymentForm()}
            </div>

            {paymentError && (
              <div className="payment-error">
                <FaTimesCircle />
                {paymentError}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentModal; 