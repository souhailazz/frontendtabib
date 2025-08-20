import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './MyConsultation.css';
import { MessageSquare, Calendar, Clock, User, Stethoscope, Video, Plus, FileText, Check, X, List, Calendar as CalendarIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ChatOrdonnanceEditor from '../ChatOrdonnanceEditor/ChatOrdonnanceEditor';
import ConsultationCalendar from '../ConsultationCalendar/ConsultationCalendar';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
 
// Component
const MyConsultation = () => {
  const { t } = useTranslation();
  const [consultations, setConsultations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showOrdonnanceModal, setShowOrdonnanceModal] = useState(false);
  const [ordonnanceContent, setOrdonnanceContent] = useState('');
  const [isEditingOrdonnance, setIsEditingOrdonnance] = useState(false);
  const [editingOrdonnanceId, setEditingOrdonnanceId] = useState(null);
  const [showOrdonnanceEditor, setShowOrdonnanceEditor] = useState(false);
  const [loadingOrdonnance, setLoadingOrdonnance] = useState(false);
  const [showOrdonnance, setShowOrdonnance] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
 
  // Use refs to store current values for callbacks
  const consultationsRef = useRef([]);
  const selectedConsultationRef = useRef(null);
 
  const userId = sessionStorage.getItem('userId');
  const userType = sessionStorage.getItem('userType');
 
  const safeText = (value, fallback = 'N/A') => (value && value.trim() !== '' ? value : fallback);
 
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
 
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
 
  // Function to fetch ordonnance for a specific consultation
  const fetchOrdonnance = async (consultationId) => {
    if (!consultationId) return null;
 
    setLoadingOrdonnance(true);
    try {
      const response = await axios.get(`https://tabib.zeabur.app/api/ordonnances/consultation/${consultationId}`);
      setLoadingOrdonnance(false);
      return response.data;
    } catch (error) {
      console.log(`No ordonnance found for consultation ${consultationId}:`, error);
      setLoadingOrdonnance(false);
      return null;
    }
  };
 
  // Memoized function to fetch consultations
  const fetchConsultations = useCallback(async () => {
    if (!userId || !userType) {
      setError(t('myConsultation.error.userSessionNotFound'));
      setLoading(false);
      return;
    }
 
    const url = userType === 'patient'
      ? `https://tabib.zeabur.app/api/consultations/patient/${userId}`
      : `https://tabib.zeabur.app/api/consultations/doctor/${userId}`;
 
    try {
      const response = await axios.get(`${url}?t=${Date.now()}`, { 
        headers: { 'Cache-Control': 'no-cache' } 
      });
 
      // Ensure we have an array of consultations
      const consultationsData = Array.isArray(response.data) ? response.data : [];
 
      // Fetch ordonnance for each consultation
      const consultationsWithOrdonnance = await Promise.all(
        consultationsData.map(async (consultation) => {
          const ordonnance = await fetchOrdonnance(consultation.id);
          return {
            ...consultation,
            ordonnance: ordonnance
          };
        })
      );
 
      console.log('Fetched consultations:', consultationsWithOrdonnance.length, consultationsWithOrdonnance);
 
      // Update consultations and ref
      setConsultations(consultationsWithOrdonnance);
      consultationsRef.current = consultationsWithOrdonnance;
 
      // Handle selected consultation
      if (consultationsWithOrdonnance.length > 0) {
        setSelectedConsultation(prev => {
          const currentSelected = prev || selectedConsultationRef.current;
          if (!currentSelected) {
            const newSelected = consultationsWithOrdonnance[0];
            selectedConsultationRef.current = newSelected;
            return newSelected;
          }
 
          // Find the updated version of the currently selected consultation
          const stillExists = consultationsWithOrdonnance.find(c => c.id === currentSelected.id);
          if (stillExists) {
            selectedConsultationRef.current = stillExists;
            return stillExists;
          } else {
            const newSelected = consultationsWithOrdonnance[0];
            selectedConsultationRef.current = newSelected;
            return newSelected;
          }
        });
      } else {
        setSelectedConsultation(null);
        selectedConsultationRef.current = null;
      }
 
      setLoading(false);
    } catch (err) {
      console.error('Error loading consultations:', err);
      setError(t('myConsultation.error.loadConsultationsFailed'));
      setConsultations([]);
      consultationsRef.current = [];
      setLoading(false);
    }
  }, [userId, userType, t]);
 
  const fetchMessages = useCallback(() => {
    const currentSelected = selectedConsultationRef.current;
    if (currentSelected) {
      const patientId = currentSelected.patient?.id;
      const doctorId = currentSelected.docteur?.id;
 
      if (patientId && doctorId) {
        axios
          .get(`https://tabib.zeabur.app/api/messages/between?docteurId=${doctorId}&patientId=${patientId}`)
          .then((res) => setMessages(res.data))
          .catch((err) => {
            console.error('Error loading messages:', err);
            setError(t('myConsultation.error.loadMessagesFailed'));
          });
      }
    }
  }, [t]);
 
  // Update refs when state changes
  useEffect(() => {
    consultationsRef.current = consultations;
  }, [consultations]);
 
  useEffect(() => {
    selectedConsultationRef.current = selectedConsultation;
  }, [selectedConsultation]);
 
  // Initial fetch and polling setup
  useEffect(() => {
    let intervalId;
 
    // Initial fetch
    fetchConsultations();
 
    // Set up polling for doctors only
    if (userType === 'docteur') {
      intervalId = setInterval(() => {
        console.log('Polling for new consultations...');
        fetchConsultations();
      }, 3000); // Poll every 3 seconds
    }
 
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchConsultations, userType]);
 
  // Reset messages and fetch when consultation changes
  useEffect(() => {
    setMessages([]);
    fetchMessages();
    setIframeLoaded(false);
  }, [selectedConsultation, fetchMessages]);
 
  // Message polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchMessages]);
 
  // Auto-scroll chat
  useEffect(() => {
    const chatBox = document.querySelector('.chat-messages');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);
 
  function exportOrdonnanceAsPDF() {
    const input = document.getElementById('ordonnance-content');
    if (!input) {
      alert("Ordonnance content not found!");
      return;
    }
 
    const exportBtn = input.querySelector('.export-button');
    if (exportBtn) exportBtn.style.display = 'none';
 
    html2canvas(input, { scale: 2 }).then((canvas) => {
      if (exportBtn) exportBtn.style.display = '';
 
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
 
      // Add image of ordonnance content
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
 
      // Add footer (doctor signature)
      const doctor = selectedConsultation?.ordonnance?.docteur;
      const doctorName = doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : "Doctor";
      const footerText = `${doctorName} — Signature`;
 
      pdf.save('ordonnance.pdf');
    });
  }
 
  const handleSendMessage = async () => {
    if (!message.trim()) return;
 
    let consultation = selectedConsultation;
 
    try {
      if (!consultation) {
        const newConsultation = {
          docteurId: userType === 'patient' ? 'targetDoctorId' : userId,
          patientId: userType === 'patient' ? userId : 'targetPatientId',
          reason: 'Message Initiated Chat',
          status: 'pending',
          dateConsultation: new Date().toISOString()
        };
 
        const res = await axios.post('https://tabib.zeabur.app/api/consultations', newConsultation);
        consultation = res.data;
        setConsultations((prev) => [...prev, consultation]);
        setSelectedConsultation(consultation);
      }
 
      let ordonnanceId = consultation.ordonnance?.id;
 
      if (!ordonnanceId) {
        console.log('Creating new ordonnance for consultation ID:', consultation.id);
 
        // Enhanced validation
        if (!consultation.id) {
          console.error('Cannot create ordonnance: Missing consultation ID');
          setError(t('myConsultation.error.createOrdonnanceMissingId'));
          return;
        }
 
        // Enhanced validation for docteur and patient IDs
        if (!consultation.docteur?.id || !consultation.patient?.id) {
          console.error('Cannot create ordonnance: Missing doctor or patient information');
          setError(t('myConsultation.error.createOrdonnanceMissingInfo'));
          return;
        }
 
        // Validate user type
        if (!userType || (userType !== 'docteur' && userType !== 'patient')) {
          console.error('Invalid user type for ordonnance creation');
          setError(t('myConsultation.error.createOrdonnanceInvalidType'));
          return;
        }
 
        const ordonnancePayload = {
          consultationId: consultation.id,
          docteurId: consultation.docteur.id,
          patientId: consultation.patient.id,
          contenu: '',
          dateCreation: new Date().toISOString(),
          status: 'active'
        };
 
        console.log('Ordonnance payload:', ordonnancePayload);
 
        try {
          // First check if an ordonnance already exists
          const ordonnance = await fetchOrdonnance(consultation.id);
          if (ordonnance && ordonnance.id) {
            console.log('Ordonnance already exists:', ordonnance);
            ordonnanceId = ordonnance.id;
          } else {
            // Create new ordonnance only if one doesn't exist
            const ordonnanceResponse = await axios.post(`https://tabib.zeabur.app/api/ordonnances`, ordonnancePayload);
            console.log('Ordonnance creation response:', ordonnanceResponse.data);
 
            if (!ordonnanceResponse.data || !ordonnanceResponse.data.id) {
              throw new Error('Invalid response from ordonnance creation');
            }
 
            const updatedOrdonnance = ordonnanceResponse.data;
 
            // Update the selected consultation with the new ordonnance
            const updatedConsultation = {
              ...consultation,
              ordonnance: updatedOrdonnance
            };
 
            setSelectedConsultation(updatedConsultation);
 
            // Update the consultations list with the updated consultation
            setConsultations(prev => prev.map(c => c.id === consultation.id ? updatedConsultation : c));
 
            ordonnanceId = updatedOrdonnance.id;
            console.log('Created ordonnance with ID:', ordonnanceId);
          }
        } catch (error) {
          console.error('Error in ordonnance creation process:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
          setError(t('myConsultation.error.createOrdonnanceFailed', { error: errorMessage }));
          return;
        }
      }
 
      const dto = {
        docteurId: consultation.docteur?.id,
        patientId: consultation.patient?.id,
        ordonnanceId,
        senderType: userType === 'docteur' ? 'doctor' : 'patient',
        receiverType: userType === 'docteur' ? 'patient' : 'doctor',
        messageText: message,
        mediaUrl: null,
        mediaType: null
      };
 
      console.log('Message DTO:', dto);
 
      const res = await axios.post('https://tabib.zeabur.app/api/messages', dto);
      setMessages((prev) => [...prev, res.data]);
      setMessage('');
    } catch (err) {
      console.error('Message sending or consultation creation failed:', err);
      console.error('Error details:', err.response?.data);
      setError(t('myConsultation.error.sendMessageFailed', { error: err.response?.data?.message || err.message }));
    }
  };
 
  const getCounterpartyDetails = (consultation) => {
    if (userType === 'patient') {
      return {
        name: `Dr. ${consultation.docteur?.prenom} ${consultation.docteur?.nom}`,
        specialty: safeText(consultation.docteur?.speciality, 'General'),
        icon: <Stethoscope size={20} />
      };
    } else {
      return {
        name: `${consultation.patient?.prenom} ${consultation.patient?.nom}`,
        details: `Age: ${consultation.patient?.age || 'N/A'} | Gender: ${consultation.patient?.gender || 'N/A'}`,
        icon: <User size={20} />
      };
    }
  };
 
  const isMessageFromCurrentUser = (msg) => {
    if (userType === 'docteur') {
      return msg.senderType === 'doctor';
    } else {
      return msg.senderType === 'patient';
    }
  };
 
  const filteredConsultations = Array.isArray(consultations) 
    ? consultations.filter((consultation) => {
        if (activeTab === 'PENDING') return consultation.etat === 'PENDING' || !consultation.etat;
        if (activeTab === 'ACCEPTED') return consultation.etat === 'ACCEPTED';
        if (activeTab === 'COMPLETED') return consultation.etat === 'COMPLETED';
        if (activeTab === 'DENIED') return consultation.etat === 'DENIED';
        return true;
      })
    : [];
 
  console.log('Current consultations length:', consultations.length);
  console.log('Filtered consultations length:', filteredConsultations.length);
 
  const handleEditOrdonnance = async (ordonnanceId, content) => {
    try {
      setIsEditingOrdonnance(true);
      const response = await axios.put(`https://tabib.zeabur.app/api/ordonnances/${ordonnanceId}`, {
        contenu: content,
        status: 'active'
      });
 
      if (response.data) {
        // Update the consultation with the new ordonnance
        const updatedConsultation = {
          ...selectedConsultation,
          ordonnance: response.data
        };
        setSelectedConsultation(updatedConsultation);
        setConsultations(prev => prev.map(c => c.id === updatedConsultation.id ? updatedConsultation : c));
        setEditingOrdonnanceId(null);
      }
    } catch (err) {
      console.error('Error updating ordonnance:', err);
      setError(t('myConsultation.error.updateOrdonnanceFailed'));
    } finally {
      setIsEditingOrdonnance(false);
    }
  };
 
  // Modify the consultation selection handler
  const handleConsultationSelect = async (consultation) => {
    try {
      // Get the latest ordonnance data
      const ordonnance = await fetchOrdonnance(consultation.id);
      const consultationWithOrdonnance = {
        ...consultation,
        ordonnance: ordonnance
      };
      setSelectedConsultation(consultationWithOrdonnance);
      selectedConsultationRef.current = consultationWithOrdonnance;
    } catch (error) {
      console.log(`Error fetching ordonnance for consultation ${consultation.id}:`, error);
      setSelectedConsultation(consultation);
      selectedConsultationRef.current = consultation;
    }
  };
 
  const handleUpdateConsultationStatus = async (consultationId, newStatus) => {
    try {
      const response = await axios.put(`https://tabib.zeabur.app/api/consultations/${consultationId}/status?status=${newStatus}`);
      if (response.data) {
        // Immediately fetch fresh consultation data to ensure real-time updates
        await fetchConsultations();
      }
    } catch (error) {
      console.error('Error updating consultation status:', error);
      setError(t('myConsultation.error.updateConsultationStatusFailed'));
    }
  };
 
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-layout">
          {/* Consultation List/Calendar Container */}
          <div className="consultations-list-container">
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
                {t('myConsultation.listView')}
              </button>
              <button
                className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon size={18} />
                {t('myConsultation.calendarView')}
              </button>
            </div>
 
            {viewMode === 'list' ? (
              <>
                <div className="tabs">
                  {['PENDING', 'ACCEPTED', 'COMPLETED', 'DENIED'].map((tab) => (
                    <button
                      key={tab}
                      className={`tab ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {t(`myConsultation.status.${tab.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
 
                <h3 className="list-title">
                  {userType === 'patient' ? t('myConsultation.myConsultations') : t('myConsultation.patientConsultations')}
                </h3>
 
                <div className="consultations-list">
                  {error && <p className="error-message">{error}</p>}
                  {loading && <p className="loading">{t('myConsultation.loadingConsultations')}</p>}
                  {!loading && filteredConsultations.length === 0 ? (
                    <p className="no-consultations">{t('myConsultation.noConsultationsFound')}</p>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <div
                        className={`consultation-item ${selectedConsultation?.id === consultation.id ? 'selected' : ''}`}
                        key={consultation.id}
                        onClick={() => handleConsultationSelect(consultation)}
                      >
                        <div className="consultation-details">
                          <h4 className="counterparty-name">
                            {userType === 'patient'
                              ? `Dr. ${consultation.docteur?.prenom} ${consultation.docteur?.nom}`
                              : `${consultation.patient?.prenom} ${consultation.patient?.nom}`}
                          </h4>
                          {userType === 'doctor' && (
                            <p className="patient-age">{t('myConsultation.age')}: {consultation.patient?.age || 'N/A'}</p>
                          )}
                          <div className="consultation-time">
                            <Calendar className="icon" size={16} />
                            <span>{formatDate(consultation.dateConsultation)}</span>
                            <Clock className="icon" size={16} />
                            <span>{formatTime(consultation.dateConsultation)}</span>
                          </div>
                          <p className="consultation-reason">
                            {t('myConsultation.reason')}: {safeText(consultation.reason)}
                          </p>
                        </div>
                        <div className="consultation-actions">
                          {userType === 'docteur' && consultation.etat === 'PENDING' && (
                            <div className="action-buttons">
                              <button
                                className="accept-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateConsultationStatus(consultation.id, 'ACCEPTED');
                                }}
                              >
                                <Check size={16} />
                                {t('myConsultation.accept')}
                              </button>
                              <button
                                className="deny-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateConsultationStatus(consultation.id, 'DENIED');
                                }}
                              >
                                <X size={16} />
                                {t('myConsultation.deny')}
                              </button>
                            </div>
                          )}
                          <div className={`status-badge ${consultation.etat || 'PENDING'}`}>
                            {t(`myConsultation.status.${(consultation.etat || 'PENDING').toLowerCase()}`)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <ConsultationCalendar
                consultations={consultations}
                onEventClick={(consultation) => handleConsultationSelect(consultation)}
              />
            )}
          </div>
 
          {/* Consultation Details */}
          {selectedConsultation && (
            <div className="consultation-detail">
              <div className="consultation-header">
                <div className="header-content">
                  {(() => {
                    const counterparty = getCounterpartyDetails(selectedConsultation);
                    return (
                      <>
                        <div className="header-with-icon">
                          {counterparty.icon}
                          <div className="header-text">
                            <h3 className="detail-name">{counterparty.name}</h3>
                            <p className="detail-info">
                              {userType === 'patient'
                                ? `${t('myConsultation.specialty')}: ${counterparty.specialty}`
                                : counterparty.details}
                            </p>
                          </div>
                        </div>
                        <div className="appointment-info">
                          <p className="appointment-time">
                            <Calendar className="icon" size={16} />
                            {formatDate(selectedConsultation.dateConsultation)}
                            <Clock className="icon" size={16} />
                            {formatTime(selectedConsultation.dateConsultation)}
                          </p>
                          <div className="appointment-status">
                            {t('myConsultation.status.label')}: <span className="status">{t(`myConsultation.status.${(selectedConsultation.etat || 'PENDING').toLowerCase()}`)}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
 
              {/* Only show content for ACCEPTED or COMPLETED consultations */}
              {(selectedConsultation.etat === 'ACCEPTED' || selectedConsultation.etat === 'COMPLETED') && (
                <>
                  {/* Video Call Section */}
                  {selectedConsultation.videoCallLink && selectedConsultation.etat === 'ACCEPTED' && (
                    <div className="video-call-section">
                      <div className="video-call-header">
                        <Video size={20} />
                        <h4>{t('myConsultation.liveVideoCall')}</h4>
                        <small style={{marginLeft: '10px', color: '#666'}}>
                          {t('myConsultation.url')}: {selectedConsultation.videoCallLink}
                        </small>
                      </div>
 
                      <div className="video-call-container">
                        {/* Fallback Join Button */}
                        <div className="video-call-fallback">
                          <a
                            href={selectedConsultation.videoCallLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="join-button"
                            style={{
                              display: 'inline-block',
                              padding: '10px 20px',
                              backgroundColor: '#007bff',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '5px',
                              marginBottom: '10px'
                            }}
                          >
                            {t('myConsultation.joinButton')}
                          </a>
                        </div>
 
                        {/* Iframe embed */}
                        <div className="video-call-iframe-container" style={{
                          position: 'relative',
                          width: '100%',
                          height: '300px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          {!iframeLoaded && (
                            <div className="iframe-loading" style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5'
                            }}>
                              <LoadingSpinner size="large" color="primary" text={t('myConsultation.loadingVideoCall')} />
                            </div>
                          )}
                          <iframe
                            src={selectedConsultation.videoCallLink}
                            title="Video Call"
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            allowFullScreen
                            className="video-call-iframe"
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              opacity: iframeLoaded ? 1 : 0,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                            onLoad={(e) => {
                              console.log('Iframe loaded successfully');
                              setIframeLoaded(true);
                            }}
                            onError={(e) => {
                              console.error('Error loading iframe:', e);
                              setError(t('myConsultation.failedLoadVideoCall'));
                              setIframeLoaded(true); // Show error state
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
 
                  {/* Medical Notes Section */}
                  {userType === 'doctor' && (
                    <div className="medical-notes">
                      <h4>{t('myConsultation.medicalNotes')}</h4>
                      <p>{selectedConsultation.notes || t('myConsultation.noNotesAvailableYet')}</p>
                    </div>
                  )}
 
                  {/* Chat and Ordonnance Section */}
                  <div className="chat-section">
                    <div className="chat-header">
                      <div className="chat-header-left">
                        <MessageSquare size={18} />
                        <span>{t('myConsultation.messages')}</span>
                      </div>
                      {userType === 'docteur' && selectedConsultation.etat === 'ACCEPTED' && (
                        <button 
                          className="edit-ordonnance-btn"
                          onClick={() => setShowOrdonnanceEditor(true)}
                        >
                          <Plus size={18} />
                          {t('myConsultation.editOrdonnance')}
                        </button>
                      )}
                    </div>
 
                    {/* Ordonnance Section */}
                    <div className="fixed-ordonnance-section">
                      <div className="ordonnance-header" onClick={() => setShowOrdonnance(!showOrdonnance)} style={{ cursor: 'pointer' }}>
                        <FileText size={18} />
                        <h4>{t('myConsultation.ordonnance')}</h4>
                        <span style={{ marginLeft: 'auto' }}>{showOrdonnance ? '▼' : '▶'}</span>
                      </div>
 
                      {showOrdonnance && (
                        <>
                          {loadingOrdonnance ? (
                            <div className="loading-ordonnance">
                              <LoadingSpinner size="medium" color="primary" text={t('myConsultation.loadingOrdonnance')} />
                            </div>
                          ) : editingOrdonnanceId === selectedConsultation.id && userType === 'docteur' && selectedConsultation.etat === 'ACCEPTED' ? (
                            <div className="ordonnance-editor">
                              <textarea
                                value={ordonnanceContent}
                                onChange={(e) => setOrdonnanceContent(e.target.value)}
                                className="ordonnance-textarea"
                                rows={4}
                              />
                              <div className="ordonnance-actions">
                                <button 
                                  onClick={() => setEditingOrdonnanceId(null)} 
                                  className="cancel-btn"
                                >
                                  {t('myConsultation.cancel')}
                                </button>
                                <button 
                                  onClick={() => handleEditOrdonnance(selectedConsultation.ordonnance.id, ordonnanceContent)} 
                                  className="save-btn"
                                  disabled={isEditingOrdonnance}
                                >
                                  {isEditingOrdonnance ? t('myConsultation.saving') : t('myConsultation.save')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div id="ordonnance-content" className="ordonnance-content">
                              {selectedConsultation.ordonnance ? (
                                <>
                                  <div className="ordonnance-info"> 
                                    <div className="ordonnance-date">
                                      <strong>{t('myConsultation.date')}:</strong> {formatDate(selectedConsultation.ordonnance.dateCreation)}
                                    </div>
                                    {selectedConsultation.ordonnance.docteur && (
                                      <div className="ordonnance-doctor">
                                        <strong>{t('myConsultation.doctor')}:</strong> Dr. {selectedConsultation.ordonnance.docteur.prenom} {selectedConsultation.ordonnance.docteur.nom}
                                        {selectedConsultation.ordonnance.docteur.specialite && (
                                          <span className="specialty">({selectedConsultation.ordonnance.docteur.specialite})</span>
                                        )}
                                      </div>
                                    )}
                                    {selectedConsultation.ordonnance.patient && (
                                      <div className="ordonnance-patient">
                                        <strong>{t('myConsultation.patient')}:</strong> {selectedConsultation.ordonnance.patient.prenom} {selectedConsultation.ordonnance.patient.nom}
                                      </div>
                                    )}
                                  </div>
 
                                  <button className="export-button" onClick={exportOrdonnanceAsPDF} style={{ margin: '10px 0' }}>
                                     {t('myConsultation.exportOrdonnanceAsPDF')}
                                  </button>
                                  <div className="ordonnance-prescription">
                                    <h5>{t('myConsultation.prescription')}:</h5>
                                    <pre>{selectedConsultation.ordonnance.contenu || t('myConsultation.noPrescriptionContentAvailable')}</pre>
                                  </div>
                                  <div className="ordonnance-footer">
                                    <p>{`Dr. ${selectedConsultation.ordonnance.docteur.prenom} ${selectedConsultation.ordonnance.docteur.nom}`}</p>
                                    <p className="signature-label">{t('myConsultation.signature')}</p>
                                    </div>
                                </>
                              ) : (
                                <p>{t('myConsultation.noOrdonnanceAvailable')}</p>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
 
                    {/* Chat Messages */}
                    <div className="chat-messages">
                      {messages.length === 0 ? (
                        <p className="no-messages">{t('myConsultation.noMessages')}</p>
                      ) : (
                        messages.map((msg, index) => {
                          const isFromMe = isMessageFromCurrentUser(msg);
                          let senderName;
 
                          if (msg.senderType === 'doctor') {
                            senderName = `Dr. ${msg.docteur?.prenom || ''} ${msg.docteur?.nom || ''}`;
                          } else {
                            senderName = `${msg.patient?.prenom || ''} ${msg.patient?.nom || ''}`;
                          }
 
                          return (
                            <div key={index} className={`chat-bubble ${isFromMe ? 'sent' : 'received'}`}>
                              <div className="message-header">
                                <span className="message-sender">{isFromMe ? 'You' : senderName}</span>
                              </div>
                              <p className="message-text">{msg.messageText}</p>
                              <span className="message-time">
                                {msg.timestamp ? formatTime(msg.timestamp) : ''}
                              </span>
                            </div>
 
                          );
                        })
                      )}
                    </div>
 
                    {/* Chat Input - Only show for ACCEPTED consultations */}
                    {selectedConsultation.etat === 'ACCEPTED' && (
                      <div className="chat-input">
                        <input
                          type="text"
                          placeholder={t('myConsultation.typeYourMessage')}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="btn-send" onClick={handleSendMessage}>
                          {t('myConsultation.send')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
 
              {/* Show message for DENIED consultations */}
              {selectedConsultation.etat === 'DENIED' && (
                <div className="consultation-denied-message">
                  <p>{t('myConsultation.consultationDeniedMessage')}</p>
                </div>
              )}
 
              {/* Show message for PENDING consultations */}
              {selectedConsultation.etat === 'PENDING' && (
                <div className="consultation-pending-message">
                  <p>{t('myConsultation.consultationPendingMessage')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showOrdonnanceEditor && selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content ordonnance-editor-modal">
            <div className="modal-header">
              <h3>{t('myConsultation.editOrdonnance')}</h3>
              <button 
                className="close-modal"
                onClick={() => setShowOrdonnanceEditor(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ChatOrdonnanceEditor 
                consultationId={selectedConsultation.id}
                onClose={() => {
                  setShowOrdonnanceEditor(false);
                  // Refresh the ordonnance data after editing
                  fetchOrdonnance(selectedConsultation.id).then(ordonnance => {
                    if (ordonnance) {
                      setSelectedConsultation({
                        ...selectedConsultation,
                        ordonnance: ordonnance
                      });
                    }
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default MyConsultation;