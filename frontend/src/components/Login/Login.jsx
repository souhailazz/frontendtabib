"use client"

import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"
import "./Login.css"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url =
        userType === "patient"
          ? "https://tabib-c9pp.onrender.com//api/patients/login"
          : "https://tabib-c9pp.onrender.com//api/docteurs/login"

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

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Server returned JSON
        data = await response.json();
        console.log("Login Response Data:", data);
      } else {
        // Server returned plain text or other format
        const errorText = await response.text();
        console.log("Server returned plain text error:", errorText);
        
        if (!response.ok) {
          // Show user-friendly error message
          throw new Error(t('login.error.invalidCredentials'));
        }
      }

      if (!response.ok) {
        throw new Error(data?.message || t('login.error.invalidCredentials'));
      }

      // Use the AuthContext login method to update global state
      const userData = {
        id: data.id, // Keep as original type, AuthContext will convert to string
        userType: userType,
        email: data.email,
        name: `${data.prenom} ${data.nom}`
      }
      
      login(userData)
      
      console.log("Stored User Data:", {
        userId: userData.id,
        userType: userData.userType
      })

      toast.success(t('common.success'), { 
        autoClose: 1500,
        onClose: () => {
          navigate("/search")
        }
      })
    } catch (error) {
      console.error("Login error:", error)
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
