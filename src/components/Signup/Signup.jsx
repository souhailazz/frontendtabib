import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "./Signup.css";

export default function Signup() {
  const { t } = useTranslation();
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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
    numeroProfessionnel: '',  // Changed from numeroIdentification to match database column name
    specialite: '',
    hopital: '',
    city: ''  // Add city field for doctors
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
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
        ? 'https://tabiblife.zeabur.app/api/patients'
        : 'https://tabiblife.zeabur.app/api/docteurs';
      
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

  return (
    <div className="signup-container">
      <h1 className="signup-title">{t('signup.title')}</h1>
      <p className="signup-subtitle">{t('signup.subtitle')}</p>
      
      {/* User Type Selection */}
      <div className="user-type-container">
        <button
          type="button"
          className={`user-type-btn doctor-btn ${userType === 'doctor' ? 'active' : ''}`}
          onClick={() => setUserType('doctor')}
        >
          {t('signup.userType.doctor')}
        </button>
        <button
          type="button"
          className={`user-type-btn patient-btn ${userType === 'patient' ? 'active' : ''}`}
          onClick={() => setUserType('patient')}
        >
          {t('signup.userType.patient')}
        </button>
      </div>

      {success ? (
        <div className="success-message">
          {t('signup.success', { userType: userType === 'patient' ? t('signup.userType.patient') : t('signup.userType.doctor') })}
          <div className="login-link-container">
            <a href="/Login" className="login-link">{t('signup.goToLogin')}</a>
          </div>
        </div>
      ) : (
        <div className="signup-form">
          <div className="name-fields-container">
            {/* First Name */}
            <div className="form-group first-name-container">
              <label className="form-label">{t('signup.firstName.label')}</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="form-input first-name-input"
                placeholder={t('signup.firstName.placeholder')}
                required
              />
            </div>
            
            {/* Last Name */}
            <div className="form-group last-name-container">
              <label className="form-label">{t('signup.lastName.label')}</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="form-input last-name-input"
                placeholder={t('signup.lastName.placeholder')}
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="form-group email-container">
            <label className="form-label">{t('signup.email.label')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input email-input"
              placeholder={t('signup.email.placeholder')}
              required
            />
          </div>
          
          {/* Password */}
          <div className="form-group password-container">
            <label className="form-label">{t('signup.password.label')}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className="form-input password-input"
                placeholder={t('signup.password.placeholder')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
              >
                {showPassword ? t('common.hide') : t('common.show')}
              </button>
            </div>
          </div>
          
          {/* Phone */}
          <div className="form-group phone-container">
            <label className="form-label">{t('signup.phone.label')}</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="form-input phone-input"
              placeholder={t('signup.phone.placeholder')}
            />
          </div>
          
          {/* Address */}
          <div className="form-group address-container">
            <label className="form-label">{t('signup.address.label')}</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="form-input address-input"
              placeholder={t('signup.address.placeholder')}
            />
          </div>
          
          {/* City */}
          <div className="form-group city-container">
            <label className="form-label">{t('signup.city.label')}</label>
            <div className="city-select-wrapper">
              <select 
                className="form-select city-select"
                name={userType === 'patient' ? 'ville' : 'city'}
                value={userType === 'patient' ? formData.ville : formData.city}
                onChange={handleChange}
                required
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
          </div>
          
          {/* Conditional fields based on user type */}
          {userType === 'patient' ? (
            // Patient specific fields
            <>
              {/* Birth Date */}
              <div className="form-group birthdate-container">
                <label className="form-label">{t('signup.birthDate.label')}</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="form-input birthdate-input"
                />
              </div>
              
              {/* Social Security Number */}
              <div className="form-group ssn-container">
                <label className="form-label">{t('signup.socialSecurity.label')}</label>
                <input
                  type="text"
                  name="numeroSecuriteSociale"
                  value={formData.numeroSecuriteSociale}
                  onChange={handleChange}
                  className="form-input ssn-input"
                  placeholder={t('signup.socialSecurity.placeholder')}
                />
              </div>
              
              {/* Medical History */}
              <div className="form-group medical-history-container">
                <label className="form-label">{t('signup.medicalHistory.label')}</label>
                <textarea
                  name="historiqueMedical"
                  value={formData.historiqueMedical}
                  onChange={handleChange}
                  className="form-textarea medical-history-input"
                  rows="3"
                  placeholder={t('signup.medicalHistory.placeholder')}
                ></textarea>
              </div>
            </>
          ) : (
            // Doctor specific fields
            <>
              {/* Professional Number */}
              <div className="form-group professional-number-container">
                <label className="form-label">{t('signup.professionalNumber.label')}</label>
                <input
                  type="text"
                  name="numeroProfessionnel"
                  value={formData.numeroProfessionnel}
                  onChange={handleChange}
                  className="form-input professional-number-input"
                  placeholder={t('signup.professionalNumber.placeholder')}
                  required
                />
              </div>
              
              {/* Specialty */}
              <div className="form-group specialty-container">
                <label className="form-label">{t('signup.specialty.label')}</label>
                <select
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                  className="form-select specialty-select"
                  required
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
              </div>
              
              {/* Hospital */}
              <div className="form-group hospital-container">
                <label className="form-label">{t('signup.hospital.label')}</label>
                <select
                  name="hopital"
                  value={formData.hopital}
                  onChange={handleChange}
                  className="form-select hospital-select"
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
              </div>
            </>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? t('signup.creating') : t('signup.button')}
          </button>
          
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