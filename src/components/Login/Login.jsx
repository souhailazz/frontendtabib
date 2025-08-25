"use client"

import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"
import "./Login.css"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import BookingModal from "../BookingModal/BookingModal"
import { BookingSessionUtils } from "../../utils/BookingSessionUtils"

function LoginForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login } = useAuth()
  const [userType, setUserType] = useState("patient")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    numeroProfessionnel: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handlePostLoginRedirect = () => {
    if (BookingSessionUtils.hasPendingBooking()) {
      const savedSession = BookingSessionUtils.getSavedBookingData();
      
      if (savedSession && savedSession.returnPath) {
        navigate(savedSession.returnPath);
        return;
      }
    }
    
    navigate("/search");
  }

  // Key changes to your Login component's handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const payload =
      userType === "patient"
        ? {
            email: formData.email,
            motDePasse: formData.password,
          }
        : {
            numeroProfessionnel: formData.numeroProfessionnel,
            motDePasse: formData.password,
          }

    const url = userType === "patient"
      ? "https://api.tabib.life/api/patients/login"
      : "https://api.tabib.life/api/docteurs/login"

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: userType === "patient" ? "include" : "omit",
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(t('login.error.invalidCredentials'));
    }

    const data = await response.json();

    // Make sure we're extracting the right data from the response
    const userData = {
      id: data.id, 
      userType: userType, // Use the userType from the form, not from response
      email: data.email,
      name: `${data.prenom} ${data.nom}`
    }
    
    console.log('Login successful, user data:', userData); // Debug log
    
    login(userData)

    toast.success(t('common.success'), { 
      autoClose: 1500,
      onClose: () => {
        handlePostLoginRedirect();
      }
    })
  } catch (error) {
    console.error('Login error:', error); // Debug log
    toast.error(error.message || t('login.error.invalidCredentials'), { autoClose: 1500 })
  }
}

  return (
    <div className="login-container">
      <ToastContainer />
      <h1 className="login-title">{t('login.title')}</h1>
      <p className="login-subtitle">
        {userType === "patient" 
          ? t('login.subtitle.patient') 
          : t('login.subtitle.doctor')
        }
      </p>

      <div className="user-type-toggle">
        <button
          type="button"
          onClick={() => setUserType("patient")}
          className={`toggle-btn ${userType === "patient" ? "active" : ""}`}
        >
          {t('signup.userType.patient')}
        </button>
        <button
          type="button"
          onClick={() => setUserType("docteur")}
          className={`toggle-btn ${userType === "docteur" ? "active" : ""}`}
        >
          {t('signup.userType.doctor')}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {userType === "patient" ? (
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('login.email.label')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('login.email.placeholder')}
              className="form-input"
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="numeroProfessionnel" className="form-label">
              {t('login.professionalNumber.label')}
            </label>
            <input
              type="text"
              id="numeroProfessionnel"
              name="numeroProfessionnel"
              value={formData.numeroProfessionnel}
              onChange={handleChange}
              placeholder={t('login.professionalNumber.placeholder')}
              className="form-input"
              required
            />
          </div>
        )}

        <div className="form-group">
          <div className="password-header">
            <label htmlFor="password" className="form-label">
              {t('login.password.label')}
            </label>
           
          </div>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('login.password.placeholder')}
              className="form-input"
              required
            />
            <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
              {showPassword ? (
                <i className="eye-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </i>
              ) : (
                <i className="eye-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </i>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn">
          {t('login.button')}
        </button>
      </form>

      <p className="signup-text">
        {t('login.noAccount')}{" "}
        <a href="/Signup" className="signup-link">
          {t('login.signup')}
        </a>
      </p>
    </div>
  )
}

export default LoginForm