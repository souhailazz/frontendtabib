import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import "./Signup.css";
import SimpleCaptcha from './SimpleCaptcha';
import { isRateLimited, recordAttempt, getRateLimitResetTime, formatTimeRemaining } from '../../utils/rateLimitUtils';

export default function Signup() {
  const { t } = useTranslation();
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [step, setStep] = useState(1);
  const [tooltip, setTooltip] = useState({ show: false, field: '', message: '' });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [rateLimitError, setRateLimitError] = useState('');
  const stepRefs = useRef([]);
  
  // Form data with all possible fields for both doctor and patient
  const [formData, setFormData] = useState({
    // Common fields
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    adresse: '',
    ville: '',
    
    // Patient specific fields
    dateNaissance: '',
    numeroSecuriteSociale: '',
    historiqueMedical: '',
    
    // Doctor specific fields
    numeroProfessionnel: '',
    specialite: '',
    hopital: '',
    city: ''
  });

  // Calculate progress percentage
  const progress = (step / 3) * 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const showTooltip = (field, message) => {
    setTooltip({ show: true, field, message });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, field: '', message: '' });
  };

  const validateStep = (stepNum) => {
    const errors = {};
    
    switch (stepNum) {
      case 1: // Basic information
        if (!formData.prenom.trim()) {
          errors.prenom = t('signup.error.required');
        }
        
        if (!formData.nom.trim()) {
          errors.nom = t('signup.error.required');
        }
        
        if (!formData.email.trim()) {
          errors.email = t('signup.error.required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = t('common.error.invalidEmail');
        }
        
        if (!formData.motDePasse) {
          errors.motDePasse = t('signup.error.required');
        } else if (formData.motDePasse.length < 6) {
          errors.motDePasse = t('signup.error.passwordTooShort');
        }
        break;
        
      case 2: // Contact details
        if (!formData.telephone.trim()) {
          errors.telephone = t('signup.error.required');
        } else if (!/^\d{10,15}$/.test(formData.telephone)) {
          errors.telephone = t('common.error.invalidPhone');
        }
        
        if (!formData.adresse.trim()) {
          errors.adresse = t('signup.error.required');
        }
        
        // Validate city based on user type
        if (userType === 'patient') {
          if (!formData.ville) {
            errors.ville = t('signup.error.required');
          }
        } else {
          if (!formData.city) {
            errors.city = t('signup.error.required');
          }
        }
        break;
        
      case 3: // Type-specific information
        if (userType === 'patient') {
          if (!formData.dateNaissance) {
            errors.dateNaissance = t('signup.error.required');
          }
        } else {
          if (!formData.numeroProfessionnel.trim()) {
            errors.numeroProfessionnel = t('signup.error.required');
          } else if (!/^\d{8}$/.test(formData.numeroProfessionnel)) {
            errors.numeroProfessionnel = t('signup.error.professionalNumberFormat');
          }
          
          if (!formData.specialite) {
            errors.specialite = t('signup.error.required');
          }
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setStep(step + 1);
    setFieldErrors({});
  };

  const prevStep = () => {
    setStep(step - 1);
    setFieldErrors({});
  };

  // Focus management when navigating steps
  useEffect(() => {
    if (stepRefs.current[step - 1]) {
      stepRefs.current[step - 1].focus();
    }
  }, [step]);

  // Check rate limit on component mount
  useEffect(() => {
    if (isRateLimited()) {
      const resetTime = getRateLimitResetTime();
      if (resetTime) {
        const timeRemaining = formatTimeRemaining(resetTime);
        setRateLimitError(t('rateLimit.error', { time: timeRemaining }));
      }
    }
  }, [t]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    // Check rate limit before submitting
    if (isRateLimited()) {
      const resetTime = getRateLimitResetTime();
      if (resetTime) {
        const timeRemaining = formatTimeRemaining(resetTime);
        setRateLimitError(t('rateLimit.error', { time: timeRemaining }));
      } else {
        setRateLimitError(t('rateLimit.blocked'));
      }
      setLoading(false);
      return;
    }
    
    // Validate CAPTCHA
    if (!captchaVerified) {
      setError(t('captcha.required'));
      setLoading(false);
      return;
    }
    
    // Validate current step before submitting
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(t('signup.error.required'));
      setLoading(false);
      return;
    }
    
    try {
      // Validate required fields based on user type
      if (userType === 'doctor' && !formData.numeroProfessionnel) {
        throw new Error(t('signup.error.professionalNumberRequired'));
      }
      
      // Validate that city is selected
      if (!formData.ville && !formData.city) {
        throw new Error(t('signup.error.cityRequired'));
      }
      
      // Determine which API endpoint to use based on user type
      const endpoint = userType === 'patient' 
        ? 'https://api.tabib.life/api/patients'
        : 'https://api.tabib.life/api/docteurs';
      
      // Create a payload with only the relevant fields for the user type
      const payload = { ...formData };
      
      // Remove fields that aren't needed for the current user type
      if (userType === 'patient') {
        delete payload.numeroProfessionnel;
        delete payload.specialite;
        delete payload.hopital;
        delete payload.city;
      } else {
        delete payload.dateNaissance;
        delete payload.numeroSecuriteSociale;
        delete payload.historiqueMedical;
        delete payload.ville;
        // Ensure city is properly set for doctors
        if (formData.ville) {
          payload.city = formData.ville;
        }
      }
      
      console.log('Submitting data:', payload);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Record the attempt
      recordAttempt();
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          t('signup.error.general', { userType: userType === 'patient' ? t('signup.userType.patient') : t('signup.userType.doctor') })
        );
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Render step indicators
  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        {[1, 2, 3].map((stepNum) => (
          <div 
            key={stepNum} 
            className={`step ${step === stepNum ? 'active' : step < stepNum ? 'inactive' : 'completed'}`}
            ref={el => stepRefs.current[stepNum - 1] = el}
            tabIndex={-1}
            aria-current={step === stepNum ? 'step' : undefined}
          >
            <div className="step-number">{stepNum}</div>
            <div className="step-label">
              {stepNum === 1 && t('signup.step.personalInfo')}
              {stepNum === 2 && t('signup.step.contactInfo')}
              {stepNum === 3 && userType === 'patient' ? t('signup.step.medicalInfo') : t('signup.step.professionalInfo')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content-inner">
            <div className="name-fields-container">
              {/* First Name */}
              <div className="form-group first-name-container">
                <label className="form-label" htmlFor="prenom">
                  {t('signup.firstName.label')}
                </label>
                <div className="input-with-tooltip">
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`form-input first-name-input ${fieldErrors.prenom ? 'error' : ''}`}
                    placeholder={t('signup.firstName.placeholder')}
                    required
                    aria-describedby={fieldErrors.prenom ? "prenom-error" : undefined}
                  />
                  <button
                    type="button"
                    className="tooltip-icon"
                    onMouseEnter={() => showTooltip('prenom', t('signup.tooltip.firstName'))}
                    onMouseLeave={hideTooltip}
                    aria-label={t('common.help')}
                  >
                    ?
                  </button>
                </div>
                {fieldErrors.prenom && <div id="prenom-error" className="error-message">{fieldErrors.prenom}</div>}
              </div>
              
              {/* Last Name */}
              <div className="form-group last-name-container">
                <label className="form-label" htmlFor="nom">
                  {t('signup.lastName.label')}
                </label>
                <div className="input-with-tooltip">
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`form-input last-name-input ${fieldErrors.nom ? 'error' : ''}`}
                    placeholder={t('signup.lastName.placeholder')}
                    required
                    aria-describedby={fieldErrors.nom ? "nom-error" : undefined}
                  />
                  <button
                    type="button"
                    className="tooltip-icon"
                    onMouseEnter={() => showTooltip('nom', t('signup.tooltip.lastName'))}
                    onMouseLeave={hideTooltip}
                    aria-label={t('common.help')}
                  >
                    ?
                  </button>
                </div>
                {fieldErrors.nom && <div id="nom-error" className="error-message">{fieldErrors.nom}</div>}
              </div>
            </div>
            
            {/* Email */}
            <div className="form-group email-container">
              <label className="form-label" htmlFor="email">
                {t('signup.email.label')}
              </label>
              <div className="input-with-tooltip">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input email-input ${fieldErrors.email ? 'error' : ''}`}
                  placeholder={t('signup.email.placeholder')}
                  required
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                <button
                  type="button"
                  className="tooltip-icon"
                  onMouseEnter={() => showTooltip('email', t('signup.tooltip.email'))}
                  onMouseLeave={hideTooltip}
                  aria-label={t('common.help')}
                >
                  ?
                </button>
              </div>
              {fieldErrors.email && <div id="email-error" className="error-message">{fieldErrors.email}</div>}
            </div>
            
            {/* Password */}
            <div className="form-group password-container">
              <label className="form-label" htmlFor="motDePasse">
                {t('signup.password.label')}
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="motDePasse"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className={`form-input password-input ${fieldErrors.motDePasse ? 'error' : ''}`}
                  placeholder={t('signup.password.placeholder')}
                  required
                  aria-describedby={fieldErrors.motDePasse ? "motDePasse-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                  aria-label={showPassword ? t('common.hide') : t('common.show')}
                >
                  {showPassword ? t('common.hide') : t('common.show')}
                </button>
              </div>
              {fieldErrors.motDePasse && <div id="motDePasse-error" className="error-message">{fieldErrors.motDePasse}</div>}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content-inner">
            {/* Phone */}
            <div className="form-group phone-container">
              <label className="form-label" htmlFor="telephone">
                {t('signup.phone.label')}
              </label>
              <div className="input-with-tooltip">
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`form-input phone-input ${fieldErrors.telephone ? 'error' : ''}`}
                  placeholder={t('signup.phone.placeholder')}
                  required
                  aria-describedby={fieldErrors.telephone ? "telephone-error" : undefined}
                />
                <button
                  type="button"
                  className="tooltip-icon"
                  onMouseEnter={() => showTooltip('telephone', t('signup.tooltip.phone'))}
                  onMouseLeave={hideTooltip}
                  aria-label={t('common.help')}
                >
                  ?
                </button>
              </div>
              {fieldErrors.telephone && <div id="telephone-error" className="error-message">{fieldErrors.telephone}</div>}
            </div>
            
            {/* Address */}
            <div className="form-group address-container">
              <label className="form-label" htmlFor="adresse">
                {t('signup.address.label')}
              </label>
              <div className="input-with-tooltip">
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className={`form-input address-input ${fieldErrors.adresse ? 'error' : ''}`}
                  placeholder={t('signup.address.placeholder')}
                  required
                  aria-describedby={fieldErrors.adresse ? "adresse-error" : undefined}
                />
                <button
                  type="button"
                  className="tooltip-icon"
                  onMouseEnter={() => showTooltip('adresse', t('signup.tooltip.address'))}
                  onMouseLeave={hideTooltip}
                  aria-label={t('common.help')}
                >
                  ?
                </button>
              </div>
              {fieldErrors.adresse && <div id="adresse-error" className="error-message">{fieldErrors.adresse}</div>}
            </div>
            
            {/* City */}
            <div className="form-group city-container">
              <label className="form-label" htmlFor={userType === 'patient' ? 'ville' : 'city'}>
                {t('signup.city.label')}
              </label>
              <div className="city-select-wrapper">
                <select 
                  id={userType === 'patient' ? 'ville' : 'city'}
                  className={`form-select city-select ${userType === 'patient' ? (fieldErrors.ville ? 'error' : '') : (fieldErrors.city ? 'error' : '')}`}
                  name={userType === 'patient' ? 'ville' : 'city'}
                  value={userType === 'patient' ? formData.ville : formData.city}
                  onChange={handleChange}
                  required
                  aria-describedby={userType === 'patient' ? (fieldErrors.ville ? "ville-error" : undefined) : (fieldErrors.city ? "city-error" : undefined)}
                >
                  <option value="">{t('signup.city.placeholder')}</option>
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
              {userType === 'patient' && fieldErrors.ville && <div id="ville-error" className="error-message">{fieldErrors.ville}</div>}
              {userType === 'doctor' && fieldErrors.city && <div id="city-error" className="error-message">{fieldErrors.city}</div>}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content-inner">
            {userType === 'patient' ? (
              // Patient specific fields
              <>
                {/* Birth Date */}
                <div className="form-group birthdate-container">
                  <label className="form-label" htmlFor="dateNaissance">
                    {t('signup.birthDate.label')}
                  </label>
                  <div className="input-with-tooltip">
                    <input
                      type="date"
                      id="dateNaissance"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleChange}
                      className={`form-input birthdate-input ${fieldErrors.dateNaissance ? 'error' : ''}`}
                      required
                      aria-describedby={fieldErrors.dateNaissance ? "dateNaissance-error" : undefined}
                    />
                    <button
                      type="button"
                      className="tooltip-icon"
                      onMouseEnter={() => showTooltip('dateNaissance', t('signup.tooltip.birthDate'))}
                      onMouseLeave={hideTooltip}
                      aria-label={t('common.help')}
                    >
                      ?
                    </button>
                  </div>
                  {fieldErrors.dateNaissance && <div id="dateNaissance-error" className="error-message">{fieldErrors.dateNaissance}</div>}
                </div>
                
                {/* Social Security Number */}
                <div className="form-group ssn-container">
                  <label className="form-label" htmlFor="numeroSecuriteSociale">
                    {t('signup.socialSecurity.label')}
                  </label>
                  <div className="input-with-tooltip">
                    <input
                      type="text"
                      id="numeroSecuriteSociale"
                      name="numeroSecuriteSociale"
                      value={formData.numeroSecuriteSociale}
                      onChange={handleChange}
                      className="form-input ssn-input"
                      placeholder={t('signup.socialSecurity.placeholder')}
                      aria-describedby={fieldErrors.numeroSecuriteSociale ? "numeroSecuriteSociale-error" : undefined}
                    />
                    <button
                      type="button"
                      className="tooltip-icon"
                      onMouseEnter={() => showTooltip('numeroSecuriteSociale', t('signup.tooltip.socialSecurity'))}
                      onMouseLeave={hideTooltip}
                      aria-label={t('common.help')}
                    >
                      ?
                    </button>
                  </div>
                  {fieldErrors.numeroSecuriteSociale && <div id="numeroSecuriteSociale-error" className="error-message">{fieldErrors.numeroSecuriteSociale}</div>}
                </div>
                
                {/* Medical History */}
                <div className="form-group medical-history-container">
                  <label className="form-label" htmlFor="historiqueMedical">
                    {t('signup.medicalHistory.label')}
                  </label>
                  <div className="input-with-tooltip">
                    <textarea
                      id="historiqueMedical"
                      name="historiqueMedical"
                      value={formData.historiqueMedical}
                      onChange={handleChange}
                      className="form-textarea medical-history-input"
                      rows="3"
                      placeholder={t('signup.medicalHistory.placeholder')}
                      aria-describedby={fieldErrors.historiqueMedical ? "historiqueMedical-error" : undefined}
                    ></textarea>
                    <button
                      type="button"
                      className="tooltip-icon"
                      onMouseEnter={() => showTooltip('historiqueMedical', t('signup.tooltip.medicalHistory'))}
                      onMouseLeave={hideTooltip}
                      aria-label={t('common.help')}
                    >
                      ?
                    </button>
                  </div>
                  {fieldErrors.historiqueMedical && <div id="historiqueMedical-error" className="error-message">{fieldErrors.historiqueMedical}</div>}
                </div>
              </>
            ) : (
              // Doctor specific fields
              <>
                {/* Professional Number */}
                <div className="form-group professional-number-container">
                  <label className="form-label" htmlFor="numeroProfessionnel">
                    {t('signup.professionalNumber.label')}
                  </label>
                  <div className="input-with-tooltip">
                    <input
                      type="text"
                      id="numeroProfessionnel"
                      name="numeroProfessionnel"
                      value={formData.numeroProfessionnel}
                      onChange={handleChange}
                      className={`form-input professional-number-input ${fieldErrors.numeroProfessionnel ? 'error' : ''}`}
                      placeholder={t('signup.professionalNumber.placeholder')}
                      required
                      aria-describedby={fieldErrors.numeroProfessionnel ? "numeroProfessionnel-error" : undefined}
                    />
                    <button
                      type="button"
                      className="tooltip-icon"
                      onMouseEnter={() => showTooltip('numeroProfessionnel', t('signup.tooltip.professionalNumber'))}
                      onMouseLeave={hideTooltip}
                      aria-label={t('common.help')}
                    >
                      ?
                    </button>
                  </div>
                  {fieldErrors.numeroProfessionnel && <div id="numeroProfessionnel-error" className="error-message">{fieldErrors.numeroProfessionnel}</div>}
                </div>
                
                {/* Specialty */}
                <div className="form-group specialty-container">
                  <label className="form-label" htmlFor="specialite">
                    {t('signup.specialty.label')}
                  </label>
                  <div className="input-with-tooltip">
                    <select
                      id="specialite"
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      className={`form-select specialty-select ${fieldErrors.specialite ? 'error' : ''}`}
                      required
                      aria-describedby={fieldErrors.specialite ? "specialite-error" : undefined}
                    >
                      <option value="">{t('signup.specialty.placeholder')}</option>
                      <option value="Cardiologie">{t('specialties.cardiology')}</option>
                      <option value="Dermatologie">{t('specialties.dermatology')}</option>
                      <option value="Neurologie">{t('specialties.neurology')}</option>
                      <option value="Orthopedie">{t('specialties.orthopedics')}</option>
                      <option value="Pediatrice">{t('specialties.pediatrics')}</option>
                      <option value="Psychiatre">{t('specialties.psychiatry')}</option>
                      <option value="Medecin General">{t('specialties.general')}</option>
                    </select>
                    <button
                      type="button"
                      className="tooltip-icon"
                      onMouseEnter={() => showTooltip('specialite', t('signup.tooltip.specialty'))}
                      onMouseLeave={hideTooltip}
                      aria-label={t('common.help')}
                    >
                      ?
                    </button>
                  </div>
                  {fieldErrors.specialite && <div id="specialite-error" className="error-message">{fieldErrors.specialite}</div>}
                </div>
                
                {/* Hospital */}
                <div className="form-group hospital-container">
                  <label className="form-label" htmlFor="hopital">
                    {t('signup.hospital.label')}
                  </label>
                  <div className="input-with-tooltip">
                    <select
                      id="hopital"
                      name="hopital"
                      value={formData.hopital}
                      onChange={handleChange}
                      className="form-select hospital-select"
                      aria-describedby={fieldErrors.hopital ? "hopital-error" : undefined}
                    >
                      <option value="">{t('signup.hospital.placeholder')}</option>

                      <optgroup label={t('cities.casablanca')}>
                        <option value="chu-ibn-rochd-casablanca">CHU Ibn Rochd</option>
                        <option value="hopital-cheikh-khalifa-casablanca">Hôpital Cheikh Khalifa</option>
                        <option value="hopital-20-aout-casablanca">Hôpital 20 Août</option>
                        <option value="hopital-abdelatif-bni-hamdane-casablanca">Hôpital Abdelatif Bni Hamdane</option>
                        <option value="clinique-anfa-casablanca">Clinique Anfa</option>
                      </optgroup>

                      <optgroup label={t('cities.rabat')}>
                        <option value="chu-ibn-sina-rabat">CHU Ibn Sina</option>
                        <option value="hopital-moulay-youssef-rabat">Hôpital Moulay Youssef</option>
                        <option value="hopital-militaire-mohammed-v-rabat">Hôpital Militaire Mohammed V</option>
                        <option value="hopital-pediatrique-rabat">Hôpital d'Enfants</option>
                        <option value="clinique-agdal-rabat">Clinique Agdal</option>
                      </optgroup>

                      <optgroup label={t('cities.fes')}>
                        <option value="chu-hassan-ii-fes">CHU Hassan II</option>
                        <option value="hopital-ghassani-fes">Hôpital El Ghassani</option>
                        <option value="clinique-atlas-fes">Clinique Atlas</option>
                      </optgroup>

                      <optgroup label={t('cities.marrakech')}>
                        <option value="chu-mohammed-vi-marrakech">CHU Mohammed VI</option>
                        <option value="hopital-ibn-tofail-marrakech">Hôpital Ibn Tofail</option>
                      </optgroup>

                      <optgroup label={t('cities.tangier')}>
                        <option value="chu-mohammed-vi-tanger">CHU Mohammed VI</option>
                        <option value="hopital-regional-tanger">Hôpital Régional</option>
                      </optgroup>

                      <optgroup label={t('cities.agadir')}>
                        <option value="hopital-hassan-ii-agadir">Hôpital Hassan II</option>
                        <option value="chu-agadir">CHU Agadir</option>
                      </optgroup>

                      <optgroup label={t('cities.meknes')}>
                        <option value="hopital-mohammed-v-meknes">Hôpital Mohammed V</option>
                      </optgroup>

                      <optgroup label={t('cities.oujda')}>
                        <option value="chu-oujda">CHU Mohammed VI</option>
                        <option value="hopital-el-farabi-oujda">Hôpital Al Farabi</option>
                      </optgroup>

                      <optgroup label={t('cities.kenitra')}>
                        <option value="hopital-el-idrissi-kenitra">Hôpital El Idrissi</option>
                      </optgroup>

                      <optgroup label={t('cities.tetouan')}>
                        <option value="hopital-saniat-ramel-tetouan">Hôpital Saniat Rmel</option>
                      </optgroup>

                      <optgroup label={t('cities.safi')}>
                        <option value="hopital-mohammed-v-safi">Hôpital Mohammed V</option>
                      </optgroup>

                      <optgroup label={t('cities.elJadida')}>
                        <option value="hopital-mohammed-v-eljadida">Hôpital Mohammed V</option>
                      </optgroup>

                      <optgroup label={t('cities.beniMellal')}>
                        <option value="hopital-regional-beni-mellal">Hôpital Régional</option>
                      </optgroup>

                      <optgroup label={t('cities.nador')}>
                        <option value="hopital-hassani-nador">Hôpital El Hassani</option>
                      </optgroup>

                      <optgroup label={t('cities.taza')}>
                        <option value="hopital-ibn-baja-taza">Hôpital Ibn Baja</option>
                      </optgroup>
                    </select>
                    <button
                      type="button"
                      className="tooltip-icon"
                      onMouseEnter={() => showTooltip('hopital', t('signup.tooltip.hospital'))}
                      onMouseLeave={hideTooltip}
                      aria-label={t('common.help')}
                    >
                      ?
                    </button>
                  </div>
                  {fieldErrors.hopital && <div id="hopital-error" className="error-message">{fieldErrors.hopital}</div>}
                </div>
              </>
            )}
            
            {/* CAPTCHA */}
            <div className="form-group captcha-container">
              <label className="form-label">{t('captcha.label')}</label>
              <SimpleCaptcha 
                onVerify={(verified) => setCaptchaVerified(verified)}
              />
              {!captchaVerified && error === t('captcha.required') && (
                <div className="error-message">{t('captcha.required')}</div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">{t('signup.title')}</h1>
      <p className="signup-subtitle">{t('signup.subtitle')}</p>
      
      {/* Progress bar */}
      <div className="progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* User Type Selection */}
      <div className="user-type-container">
        <button
          type="button"
          className={`user-type-btn doctor-btn ${userType === 'doctor' ? 'active' : ''}`}
          onClick={() => setUserType('doctor')}
          aria-pressed={userType === 'doctor'}
        >
          {t('signup.userType.doctor')}
        </button>
        <button
          type="button"
          className={`user-type-btn patient-btn ${userType === 'patient' ? 'active' : ''}`}
          onClick={() => setUserType('patient')}
          aria-pressed={userType === 'patient'}
        >
          {t('signup.userType.patient')}
        </button>
      </div>

      {success ? (
        <div className="success-message" role="alert">
          {t('signup.success', { userType: userType === 'patient' ? t('signup.userType.patient') : t('signup.userType.doctor') })}
          <div className="login-link-container">
            <a href="/Login" className="login-link">{t('signup.goToLogin')}</a>
          </div>
        </div>
      ) : (
        <div className="signup-form">
          {/* Rate limit error */}
          {rateLimitError && (
            <div className="error-message" role="alert">
              {rateLimitError}
            </div>
          )}
          
          {/* Step Indicator */}
          {renderStepIndicator()}
          
          {/* Tooltip */}
          {tooltip.show && (
            <div className="tooltip" role="tooltip">
              {tooltip.message}
            </div>
          )}
          
          {/* Step Content */}
          <div className="step-content">
            {renderStepContent()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="form-navigation">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="nav-btn prev-btn"
                aria-label={t('common.previous')}
              >
                {t('common.previous')}
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="nav-btn next-btn"
                aria-label={t('common.next')}
              >
                {t('common.next')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !!rateLimitError}
                className="submit-btn"
                aria-busy={loading}
              >
                {loading ? t('signup.creating') : t('signup.button')}
              </button>
            )}
          </div>
          
          {error && !fieldErrors.email && !fieldErrors.motDePasse && !fieldErrors.prenom && !fieldErrors.nom && !fieldErrors.telephone && !fieldErrors.adresse && error !== t('captcha.required') && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          {/* Login Link */}
          <p className="login-prompt">
            {t('signup.haveAccount')} 
            <a href="/Login" className="login-link"> {t('signup.login')}</a>
          </p>
        </div>
      )}
    </div>
  );
}