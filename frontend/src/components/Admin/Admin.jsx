import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, UserCheck, Calendar, FileText, Settings, 
  Plus, Edit, Trash2, Search, Filter, Download,
  Eye, EyeOff, ChevronDown, ChevronUp, MoreHorizontal,
  Activity, TrendingUp, Star, Clock, CheckCircle, XCircle
} from 'lucide-react';
import './Admin.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Admin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState({});
  

  
  // Available options for dropdowns
  const [availableCities, setAvailableCities] = useState([]);
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [availableHospitals, setAvailableHospitals] = useState([]);
  
  // Default options for when no data exists - using the same options as Signup component
  const defaultCities = [
    'casablanca', 'rabat', 'fes', 'marrakech', 'tangier', 'agadir', 'meknes', 'oujda', 
    'kenitra', 'tetouan', 'safi', 'el-jadida', 'beni-mellal', 'nador', 'taza'
  ];
  const defaultSpecialties = [
    'Cardiologie', 'Dermatologie', 'Neurologie', 'Orthopedie', 'Pediatrice', 
    'Psychiatre', 'Medecin General'
  ];
  
  // Hospital data organized by city
  const hospitalsByCity = {
    'casablanca': [
      'CHU Ibn Rochd',
      'Hôpital Cheikh Khalifa',
      'Hôpital 20 Août',
      'Hôpital Abdelatif Bni Hamdane',
      'Clinique Anfa'
    ],
    'rabat': [
      'CHU Ibn Sina',
      'Hôpital Moulay Youssef',
      'Hôpital Militaire Mohammed V',
      'Hôpital d\'Enfants',
      'Clinique Agdal'
    ],
    'fes': [
      'CHU Hassan II',
      'Hôpital El Ghassani',
      'Clinique Atlas'
    ],
    'marrakech': [
      'CHU Mohammed VI',
      'Hôpital Ibn Tofail'
    ],
    'tangier': [
      'CHU Mohammed VI',
      'Hôpital Régional'
    ],
    'agadir': [
      'Hôpital Hassan II',
      'CHU Agadir'
    ],
    'meknes': [
      'Hôpital Mohammed V'
    ],
    'oujda': [
      'CHU Mohammed VI',
      'Hôpital Al Farabi'
    ],
    'kenitra': [
      'Hôpital El Idrissi'
    ],
    'tetouan': [
      'Hôpital Saniat Rmel'
    ],
    'safi': [
      'Hôpital Mohammed V'
    ],
    'el-jadida': [
      'Hôpital Mohammed V'
    ],
    'beni-mellal': [
      'Hôpital Régional'
    ],
    'nador': [
      'Hôpital El Hassani'
    ],
    'taza': [
      'Hôpital Ibn Baja'
    ]
  };
  
  // CRUD states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState('patient'); // patient, doctor, consultation
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [paymentIdSearch, setPaymentIdSearch] = useState('');
  const [consultationIdSearch, setConsultationIdSearch] = useState('');
  const [customerNameSearch, setCustomerNameSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('all');
  const [doctorCityFilter, setDoctorCityFilter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Consultation filters
  const [consultationIdSearchFilter, setConsultationIdSearchFilter] = useState('');
  const [patientNameSearchFilter, setPatientNameSearchFilter] = useState('');
  const [doctorNameSearchFilter, setDoctorNameSearchFilter] = useState('');
  const [consultationStatusFilterState, setConsultationStatusFilterState] = useState('all');
  const [dateFromFilterState, setDateFromFilterState] = useState('');
  const [dateToFilterState, setDateToFilterState] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    // Patient fields
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    motDePasse: '',
    
    // Doctor fields
    numeroProfessionnel: '',
    specialite: '',
    hopital: '',
    city: '',
    rating: 0,
    
    // Consultation fields
    dateConsultation: '',
    heureConsultation: '',
    etat: 'PENDING',
    patientId: '',
    docteurId: '',
    prix: 0,
    videoCallLink: ''
  });

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [patientsRes, doctorsRes, consultationsRes, paymentsRes] = await Promise.all([
        fetch('https://tabib-c9pp.onrender.com//api/admin/patients'),
        fetch('https://tabib-c9pp.onrender.com//api/admin/doctors'),
        fetch('https://tabib-c9pp.onrender.com//api/admin/consultations'),
        fetch('https://tabib-c9pp.onrender.com//api/admin/payments')
      ]);

      if (!patientsRes.ok || !doctorsRes.ok || !consultationsRes.ok || !paymentsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [patientsData, doctorsData, consultationsData, paymentsData] = await Promise.all([
        patientsRes.json(),
        doctorsRes.json(),
        consultationsRes.json(),
        paymentsRes.json()
      ]);

      setPatients(patientsData);
      setDoctors(doctorsData);
      setPayments(paymentsData);
      
      // Link payments with consultations
      const consultationsWithPayments = consultationsData.map(consultation => {
        const consultationPayments = paymentsData.filter(payment => payment.consultationId === consultation.id);
        return {
          ...consultation,
          payments: consultationPayments,
          paymentStatus: consultationPayments.length > 0 ? consultationPayments[0].status : 'NO_PAYMENT',
          totalPaid: consultationPayments.filter(p => p.status === 'SUCCEEDED').reduce((sum, p) => sum + (p.amount || 0), 0),
          paymentMethod: consultationPayments.length > 0 ? consultationPayments[0].paymentMethod : null
        };
      });
      setConsultations(consultationsWithPayments);
      
      // Extract unique cities and specialties from doctors data
      const cities = [...new Set(doctorsData.map(doctor => doctor.city).filter(city => city))];
      const specialties = [...new Set(doctorsData.map(doctor => doctor.specialite).filter(specialty => specialty))];
      const hospitals = [...new Set(doctorsData.map(doctor => doctor.hopital).filter(hospital => hospital))];
      
      // Combine existing data with default options to ensure all options are available
      const allCities = [...new Set([...cities, ...defaultCities])];
      const allSpecialties = [...new Set([...specialties, ...defaultSpecialties])];
      const allHospitals = [...new Set([...hospitals, ...Object.values(hospitalsByCity).flat()])];
      setAvailableCities(allCities);
      setAvailableSpecialties(allSpecialties);
      setAvailableHospitals(allHospitals);
      
      // Calculate statistics
      const stats = {
        totalPatients: patientsData.length,
        totalDoctors: doctorsData.length,
        totalConsultations: consultationsData.length,
        completedConsultations: consultationsData.filter(c => c.etat === 'COMPLETED').length,
        pendingConsultations: consultationsData.filter(c => c.etat === 'PENDING').length,
        activePrescriptions: consultationsData.filter(c => c.etat === 'COMPLETED').length * 0.8 // Estimate
      };
      setStatistics(stats);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // CRUD Operations
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editMode === 'patient' ? '/api/admin/patients' : 
                      editMode === 'doctor' ? '/api/admin/doctors' : 
                      editMode === 'payment' ? '/api/admin/payments' :
                      '/api/admin/consultations';
      
      // Transform data for consultation creation
      let dataToSend = formData;
      if (editMode === 'consultation') {
        // Combine date and time into a single datetime string
        const dateTime = formData.dateConsultation && formData.heureConsultation 
          ? `${formData.dateConsultation}T${formData.heureConsultation}:00`
          : null;
        
        dataToSend = {
          ...formData,
          dateConsultation: dateTime,
          // Map price field correctly
          price: formData.prix || formData.price,
          // Remove form-specific fields that shouldn't be sent to backend
          prix: undefined,
          heureConsultation: undefined
        };
      }
      
      const response = await fetch(`https://tabib-c9pp.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) throw new Error('Failed to create item');
      
      setShowCreateModal(false);
      setFormData({});
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editMode === 'patient' ? `/api/admin/patients/${selectedItem.id}` :
                      editMode === 'doctor' ? `/api/admin/doctors/${selectedItem.id}` :
                      editMode === 'consultation' ? `/api/admin/consultations/${selectedItem.id}` :
                      `/api/admin/payments/${selectedItem.paymentId}`;
      
      const response = await fetch(`https://tabib-c9pp.onrender.com/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update item');
      
      setShowEditModal(false);
      setSelectedItem(null);
      setFormData({});
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const endpoint = editMode === 'patient' ? `/api/admin/patients/${selectedItem.id}` :
                      editMode === 'doctor' ? `/api/admin/doctors/${selectedItem.id}` :
                      editMode === 'consultation' ? `/api/admin/consultations/${selectedItem.id}` :
                      `/api/admin/payments/${selectedItem.paymentId}`;
      
      const response = await fetch(`https://tabib-c9pp.onrender.com/${endpoint}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete item');
      
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Utility functions
  const openCreateModal = (type) => {
    setEditMode(type);
    setFormData({});
    setShowCreateModal(true);
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditMode(type);
    setFormData(item);
    setShowEditModal(true);
  };

  const openDeleteModal = (item, type) => {
    setSelectedItem(item);
    setEditMode(type);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'PENDING': return <Clock size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  // Helper functions to map values to display names
  const getSpecialtyDisplayName = (specialty) => {
    const specialtyMap = {
      'Cardiologie': 'Cardiology',
      'Dermatologie': 'Dermatology',
      'Neurologie': 'Neurology',
      'Orthopedie': 'Orthopedics',
      'Pediatrice': 'Pediatrics',
      'Psychiatre': 'Psychiatry',
      'Medecin General': 'General Medicine'
    };
    return specialtyMap[specialty] || specialty;
  };

  const getCityDisplayName = (city) => {
    const cityMap = {
      'casablanca': 'Casablanca',
      'rabat': 'Rabat',
      'fes': 'Fes',
      'marrakech': 'Marrakech',
      'tangier': 'Tangier',
      'agadir': 'Agadir',
      'meknes': 'Meknes',
      'oujda': 'Oujda',
      'kenitra': 'Kenitra',
      'tetouan': 'Tetouan',
      'safi': 'Safi',
      'el-jadida': 'El Jadida',
      'beni-mellal': 'Beni Mellal',
      'nador': 'Nador',
      'taza': 'Taza'
    };
    return cityMap[city] || city;
  };

  // Helper function to get hospitals for a specific city
  const getHospitalsForCity = (city) => {
    return hospitalsByCity[city] || [];
  };

  // Payment status helper functions
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'SUCCEEDED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      case 'CANCELLED': return 'danger';
      case 'NO_PAYMENT': return 'neutral';
      default: return 'info';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'SUCCEEDED': return <CheckCircle size={14} />;
      case 'PENDING': return <Clock size={14} />;
      case 'FAILED': return <XCircle size={14} />;
      case 'CANCELLED': return <XCircle size={14} />;
      case 'NO_PAYMENT': return <Activity size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'SUCCEEDED': return 'Paid';
      case 'PENDING': return 'Pending';
      case 'FAILED': return 'Failed';
      case 'CANCELLED': return 'Cancelled';
      case 'NO_PAYMENT': return 'Not Paid';
      default: return status;
    }
  };

  // Function to view payment details
  const viewPaymentDetails = (payments) => {
    const paymentDetails = payments.map(payment => 
      `Payment ID: ${payment.paymentId}\nAmount: ${payment.amount} ${payment.currency}\nStatus: ${payment.status}\nMethod: ${payment.paymentMethod}\nDate: ${new Date(payment.createdAt).toLocaleString()}`
    ).join('\n\n');
    
    alert(`Payment Details:\n\n${paymentDetails}`);
  };

  // Function to combine consultations with their payment details


  // Function to filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    if (!patientSearchTerm) return true;
    
    const searchLower = patientSearchTerm.toLowerCase();
    const fullName = `${patient.prenom || ''} ${patient.nom || ''}`.toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const phone = (patient.telephone || '').toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           phone.includes(searchLower);
  });

  // Function to filter doctors based on search term and filters
  const filteredDoctors = doctors.filter(doctor => {
    // Search filter
    if (doctorSearchTerm) {
      const searchLower = doctorSearchTerm.toLowerCase();
      const fullName = `${doctor.prenom || ''} ${doctor.nom || ''}`.toLowerCase();
      const email = (doctor.email || '').toLowerCase();
      const numeroProfessionnel = (doctor.numeroProfessionnel || '').toLowerCase();
      
      const matchesSearch = fullName.includes(searchLower) || 
                           email.includes(searchLower) || 
                           numeroProfessionnel.includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Specialty filter
    if (doctorSpecialtyFilter !== 'all' && doctor.specialite !== doctorSpecialtyFilter) {
      return false;
    }
    
    // City filter
    if (doctorCityFilter !== 'all' && doctor.city !== doctorCityFilter) {
      return false;
    }
    
    return true;
  });

  // Function to filter payments based on search terms and status
  const filteredPayments = payments.filter(payment => {
    // If all search fields are empty and no status filter, show all payments
    if (!paymentIdSearch && !consultationIdSearch && !customerNameSearch && paymentStatusFilter === 'all') {
      return true;
    }
    
    // Check payment ID search
    if (paymentIdSearch && !payment.paymentId?.toString().toLowerCase().includes(paymentIdSearch.toLowerCase())) {
      return false;
    }
    
    // Check consultation ID search
    if (consultationIdSearch && !payment.consultationId?.toString().toLowerCase().includes(consultationIdSearch.toLowerCase())) {
      return false;
    }
    
    // Check customer name search
    if (customerNameSearch && !payment.customerName?.toLowerCase().includes(customerNameSearch.toLowerCase())) {
      return false;
    }
    
    // Check status filter
    if (paymentStatusFilter !== 'all' && payment.status !== paymentStatusFilter) {
      return false;
    }
    
    return true;
  });

  // Function to filter consultations based on search terms and filters
  const filteredConsultations = consultations.filter(consultation => {
    // If all search fields are empty and no filters, show all consultations
    if (!consultationIdSearchFilter && !patientNameSearchFilter && !doctorNameSearchFilter && 
        consultationStatusFilterState === 'all' && !dateFromFilterState && !dateToFilterState) {
      return true;
    }
    
    // Check consultation ID search
    if (consultationIdSearchFilter && !consultation.id?.toString().toLowerCase().includes(consultationIdSearchFilter.toLowerCase())) {
      return false;
    }
    
    // Check patient name search
    const patientFullName = `${consultation.patient?.prenom || ''} ${consultation.patient?.nom || ''}`.toLowerCase();
    if (patientNameSearchFilter && !patientFullName.includes(patientNameSearchFilter.toLowerCase())) {
      return false;
    }
    
    // Check doctor name search
    const doctorFullName = `${consultation.docteur?.prenom || ''} ${consultation.docteur?.nom || ''}`.toLowerCase();
    if (doctorNameSearchFilter && !doctorFullName.includes(doctorNameSearchFilter.toLowerCase())) {
      return false;
    }
    
    // Check status filter
    if (consultationStatusFilterState !== 'all' && consultation.etat !== consultationStatusFilterState) {
      return false;
    }
    
    // Check date range filter
    const consultationDate = new Date(consultation.dateConsultation);
    if (dateFromFilterState) {
      const fromDate = new Date(dateFromFilterState);
      fromDate.setHours(0, 0, 0, 0);
      if (consultationDate < fromDate) return false;
    }
    
    if (dateToFilterState) {
      const toDate = new Date(dateToFilterState);
      toDate.setHours(23, 59, 59, 999);
      if (consultationDate > toDate) return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <LoadingSpinner size="large" color="primary" text={t('admin.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-content">
          <h2>{t('admin.error.title')}</h2>
          <p>{error}</p>
          <button onClick={fetchAllData} className="retry-button">
            {t('admin.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>TeleConsult Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={20} />
            Overview
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <Users size={20} />
            Patients
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <UserCheck size={20} />
            Doctors
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <Calendar size={20} />
            Consultations
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <TrendingUp size={20} />
            Payments
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <FileText size={20} />
            Prescriptions
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>
      </aside>

      {/* Mobile Tab Dropdown */}
      <div className="mobile-tab-dropdown">
        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value)}
          className="tab-select"
        >
          <option value="overview">Overview</option>
          <option value="patients">Patients</option>
          <option value="doctors">Doctors</option>
          <option value="consultations">Consultations</option>
          <option value="payments">Payments</option>
          <option value="prescriptions">Prescriptions</option>
          <option value="settings">Settings</option>
        </select>
      </div>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        

        {/* Content Area */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              {/* Statistics Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <Users size={24} />
                    </div>
                    <span className="stat-change positive">+12.5% from last month</span>
                  </div>
                  <h3>Total Patients</h3>
                  <p className="stat-value">{statistics.totalPatients?.toLocaleString() || '1,247'}</p>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <UserCheck size={24} />
                    </div>
                  </div>
                  <h3>Total Doctors</h3>
                  <p className="stat-value">{statistics.totalDoctors || '89'}</p>
                  <p className="stat-description">Active healthcare providers</p>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <Calendar size={24} />
                    </div>
                  </div>
                  <h3>Consultations</h3>
                  <p className="stat-value">{statistics.totalConsultations?.toLocaleString() || '3,456'}</p>
                  <p className="stat-description">Total completed sessions</p>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <FileText size={24} />
                    </div>
                  </div>
                  <h3>Active Prescriptions</h3>
                  <p className="stat-value">{Math.floor(statistics.activePrescriptions) || '892'}</p>
                  <p className="stat-description">Currently active</p>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <TrendingUp size={24} />
                    </div>
                  </div>
                  <h3>Total Payments</h3>
                  <p className="stat-value">{statistics.totalPayments || payments.length}</p>
                  <p className="stat-description">Payment transactions</p>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <CheckCircle size={24} />
                    </div>
                  </div>
                  <h3>Total Revenue</h3>
                  <p className="stat-value">{statistics.totalRevenue ? `${statistics.totalRevenue.toFixed(2)} MAD` : '0.00 MAD'}</p>
                  <p className="stat-description">From successful payments</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-section">
                <div className="recent-consultations">
                  <h3>Recent Consultations</h3>
                  <div className="consultation-list">
                    {consultations.slice(0, 3).map((consultation, index) => (
                      <div key={index} className="consultation-item">
                        <div className="consultation-avatar">
                          {consultation.patient?.prenom?.[0]}{consultation.patient?.nom?.[0]}
                        </div>
                        <div className="consultation-details">
                          <p className="patient-name">
                            {consultation.patient?.prenom} {consultation.patient?.nom}
                          </p>
                          <p className="doctor-name">
                            with Dr. {consultation.docteur?.prenom} {consultation.docteur?.nom}
                          </p>
                        </div>
                        <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                          {consultation.etat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="top-doctors">
                  <h3>Top Doctors</h3>
                  <div className="doctor-list">
                    {doctors.slice(0, 3).map((doctor, index) => (
                      <div key={index} className="doctor-item">
                        <div className="doctor-avatar">
                          {doctor.prenom?.[0]}{doctor.nom?.[0]}
                        </div>
                        <div className="doctor-details">
                          <p className="doctor-name">Dr. {doctor.prenom} {doctor.nom}</p>
                          <p className="doctor-specialty">{doctor.specialite}</p>
                        </div>
                        <div className="doctor-rating">
                          <Star size={16} className="star-icon" />
                          {doctor.rating || '4.5'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="recent-payments">
                  <h3>Recent Payments</h3>
                  <div className="payment-list">
                    {payments.slice(0, 3).map((payment, index) => (
                      <div key={index} className="payment-item">
                        <div className="payment-avatar">
                          {payment.customerName?.[0] || 'P'}
                        </div>
                        <div className="payment-details">
                          <p className="customer-name">{payment.customerName || 'Unknown Customer'}</p>
                          <p className="payment-method">{payment.paymentMethod}</p>
                        </div>
                        <div className="payment-info">
                          <span className="payment-amount">{payment.amount} {payment.currency}</span>
                          <span className={`status-badge ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="patients-section">
              <div className="section-header">
                <h2>Patients Management</h2>
                <button 
                  className="create-button"
                  onClick={() => openCreateModal('patient')}
                >
                  <Plus size={20} />
                  Add Patient
                </button>
              </div>
              
              {/* Patient Search */}
              <div className="search-container">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search patients "
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                  />
                </div>
                {patientSearchTerm && (
                  <div className="search-results-info">
                    Showing {filteredPatients.length} of {patients.length} patients
                  </div>
                )}
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Date of Birth</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.prenom} {patient.nom}</td>
                        <td>{patient.email}</td>
                        <td>{patient.telephone}</td>
                        <td>{patient.dateNaissance}</td>
                        <td className="actions">
                          <button onClick={() => openEditModal(patient, 'patient')}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteModal(patient, 'patient')}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPatients.length === 0 && patientSearchTerm && (
                  <div className="no-results">
                    <p>No patients found matching "{patientSearchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="doctors-section">
              <div className="section-header">
                <h2>Doctors Management</h2>
                <button 
                  className="create-button"
                  onClick={() => openCreateModal('doctor')}
                >
                  <Plus size={20} />
                  Add Doctor
                </button>
              </div>
              
              {/* Doctor Search and Filters */}
              <div className="search-container">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search doctors by name, email, or professional number"
                    value={doctorSearchTerm}
                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-controls">
                  <div className="filter-group">
                    <select 
                      value={doctorSpecialtyFilter} 
                      onChange={(e) => setDoctorSpecialtyFilter(e.target.value)}
                    >
                      <option value="all">All Specialties</option>
                      {defaultSpecialties.map(specialty => (
                        <option key={specialty} value={specialty}>
                          {getSpecialtyDisplayName(specialty)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <select 
                      value={doctorCityFilter} 
                      onChange={(e) => setDoctorCityFilter(e.target.value)}
                    >
                      <option value="all">All Cities</option>
                      {defaultCities.map(city => (
                        <option key={city} value={city}>
                          {getCityDisplayName(city)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(doctorSearchTerm || doctorSpecialtyFilter !== 'all' || doctorCityFilter !== 'all') && (
                  <div className="search-results-info">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                  </div>
                )}
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Professional Number</th>
                      <th>Specialty</th>
                      <th>Hospital</th>
                      <th>City</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>Dr. {doctor.prenom} {doctor.nom}</td>
                        <td>{doctor.numeroProfessionnel || '-'}</td>
                        <td>{doctor.specialite}</td>
                        <td>{doctor.hopital}</td>
                        <td>{doctor.city}</td>
                        <td>
                          <Star size={16} className="star-icon" />
                          {doctor.rating || '4.5'}
                        </td>
                        <td className="actions">
                          <button onClick={() => openEditModal(doctor, 'doctor')}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteModal(doctor, 'doctor')}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDoctors.length === 0 && (doctorSearchTerm || doctorSpecialtyFilter !== 'all' || doctorCityFilter !== 'all') && (
                  <div className="no-results">
                    <p>No doctors found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="consultations-section">
              <div className="section-header">
                <h2>Consultations Management</h2>
                <div className="header-actions">
                  <button 
                    className="create-button"
                    onClick={() => openCreateModal('consultation')}
                  >
                    <Plus size={20} />
                    Add Consultation
                  </button>
                </div>
              </div>
              
              {/* Consultation Search and Filters */}
              <div className="search-container">
                <div className="search-filters-row">
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Consultation ID"
                      value={consultationIdSearchFilter}
                      onChange={(e) => setConsultationIdSearchFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Patient Name"
                      value={patientNameSearchFilter}
                      onChange={(e) => setPatientNameSearchFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={doctorNameSearchFilter}
                      onChange={(e) => setDoctorNameSearchFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="filter-group">
                    <select 
                      value={consultationStatusFilterState}
                      onChange={(e) => setConsultationStatusFilterState(e.target.value)}
                      className="status-filter"
                    >
                      <option value="all">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="date-range-filters" style={{ marginTop: '1rem' }}>
                  <div className="date-filter-group">
                    <label>From:</label>
                    <input
                      type="date"
                      value={dateFromFilterState}
                      onChange={(e) => setDateFromFilterState(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  
                  <div className="date-filter-group" style={{ marginLeft: '1rem' }}>
                    <label>To:</label>
                    <input
                      type="date"
                      value={dateToFilterState}
                      onChange={(e) => setDateToFilterState(e.target.value)}
                      className="date-input"
                      min={dateFromFilterState}
                    />
                  </div>
                  
                  {(dateFromFilterState || dateToFilterState) && (
                    <button 
                      className="clear-date-filter"
                      onClick={() => {
                        setDateFromFilterState('');
                        setDateToFilterState('');
                      }}
                    >
                      Clear dates
                    </button>
                  )}
                </div>
                
                {(consultationIdSearchFilter || patientNameSearchFilter || doctorNameSearchFilter || 
                  consultationStatusFilterState !== 'all' || dateFromFilterState || dateToFilterState) && (
                  <div className="search-results-info">
                    Found {filteredConsultations.length} consultations
                    {consultationStatusFilterState !== 'all' && (
                      <span className="active-filter">• Status: {consultationStatusFilterState}</span>
                    )}
                    {(dateFromFilterState || dateToFilterState) && (
                      <span className="active-filter">
                        • Date: {dateFromFilterState || 'Start'} to {dateToFilterState || 'End'}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map((consultation) => (
                      <tr key={consultation.id}>
                        <td>
                          <span className="id-badge consultation">
                            C-{consultation.id}
                          </span>
                        </td>
                        <td>{consultation.patient?.prenom} {consultation.patient?.nom}</td>
                        <td>Dr. {consultation.docteur?.prenom} {consultation.docteur?.nom}</td>
                        <td>{consultation.dateConsultation ? new Date(consultation.dateConsultation).toLocaleDateString() : 'N/A'}</td>
                        <td>{consultation.dateConsultation ? new Date(consultation.dateConsultation).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(consultation.etat)}`}>
                            {consultation.etat}
                          </span>
                        </td>
                        <td className="consultation-amount">{consultation.prix} MAD</td>
                        <td className="actions">
                          <button onClick={() => openEditModal(consultation, 'consultation')} title="Edit Consultation">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteModal(consultation, 'consultation')} title="Delete Consultation">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="payments-section">
              <div className="section-header">
                <h2>Payments Management</h2>
                <div className="header-actions">
                  <button 
                    className="create-button"
                    onClick={() => openCreateModal('payment')}
                  >
                    <Plus size={20} />
                    Add Payment
                  </button>
                </div>
              </div>
              
              {/* Payment Search */}
              <div className="search-container">
                <div className="search-filters-row">
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Payment ID"
                      value={paymentIdSearch}
                      onChange={(e) => setPaymentIdSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Consultation ID"
                      value={consultationIdSearch}
                      onChange={(e) => setConsultationIdSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={customerNameSearch}
                      onChange={(e) => setCustomerNameSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="filter-group">
                    <select 
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="status-filter"
                    >
                      <option value="all">All Statuses</option>
                      <option value="SUCCEEDED">Succeeded</option>
                      <option value="PENDING">Pending</option>
                      <option value="FAILED">Failed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>
                </div>
                
                {(paymentIdSearch || consultationIdSearch || customerNameSearch || paymentStatusFilter !== 'all') && (
                  <div className="search-results-info">
                    Found {filteredPayments.length} payments
                    {(paymentStatusFilter !== 'all') && <span className="active-filter">• Status: {getPaymentStatusText(paymentStatusFilter)}</span>}
                  </div>
                )}
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Consultation</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment Method</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.paymentId}>
                        <td>
                          <span className="id-badge payment">
                            P-{payment.paymentId}
                          </span>
                        </td>
                        <td>
                          {payment.consultationId ? `C-${payment.consultationId}` : 'N/A'}
                        </td>
                        <td>{payment.customerName || 'N/A'}</td>
                        <td className="payment-amount">{payment.amount} {payment.currency}</td>
                        <td>
                          <span className={`payment-status-badge ${getPaymentStatusColor(payment.status)}`}>
                            {getPaymentStatusIcon(payment.status)}
                            {getPaymentStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="payment-method">
                          {payment.paymentMethod ? (
                            <span className="payment-method-badge">
                              {payment.paymentMethod}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="payment-date">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="actions">
                          <button onClick={() => openEditModal(payment, 'payment')} title="Edit Payment">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => openDeleteModal(payment, 'payment')} title="Delete Payment">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="prescriptions-section">
              <div className="section-header">
                <h2>Prescriptions Management</h2>
                <button className="export-button">
                  <Download size={20} />
                  Export
                </button>
              </div>
              
              <div className="prescriptions-grid">
                <div className="prescription-card">
                  <div className="prescription-header">
                    <h4>Recent Prescriptions</h4>
                  </div>
                  <div className="prescription-list">
                    {consultations
                      .filter(c => c.etat === 'COMPLETED')
                      .slice(0, 5)
                      .map((consultation, index) => (
                        <div key={index} className="prescription-item">
                          <div className="prescription-avatar">
                            {consultation.patient?.prenom?.[0]}{consultation.patient?.nom?.[0]}
                          </div>
                          <div className="prescription-details">
                            <p className="patient-name">
                              {consultation.patient?.prenom} {consultation.patient?.nom}
                            </p>
                            <p className="doctor-name">
                              with Dr. {consultation.docteur?.prenom} {consultation.docteur?.nom}
                            </p>
                          </div>
                          <span className="prescription-date">
                            {new Date(consultation.dateConsultation).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}



          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Admin Settings</h2>
              <div className="settings-grid">
                <div className="setting-card">
                  <h3>System Configuration</h3>
                  <p>Configure system-wide settings and preferences</p>
                </div>
                <div className="setting-card">
                  <h3>User Management</h3>
                  <p>Manage user roles and permissions</p>
                </div>
                <div className="setting-card">
                  <h3>Backup & Restore</h3>
                  <p>System backup and data recovery options</p>
                </div>
                <div className="setting-card">
                  <h3>Analytics</h3>
                  <p>View detailed analytics and reports</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New {editMode}</h3>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              {editMode === 'patient' && (
                <>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.dateNaissance || ''}
                    onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.adresse || ''}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.motDePasse || ''}
                    onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                    required
                  />
                </>
              )}
              
              {editMode === 'doctor' && (
                <>
                  <input
                    type="text"
                    placeholder="Professional Number"
                    value={formData.numeroProfessionnel || ''}
                    onChange={(e) => setFormData({...formData, numeroProfessionnel: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                  <select
                    value={formData.specialite || ''}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    required
                  >
                    <option value="">Select Specialty</option>
                    {availableSpecialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {getSpecialtyDisplayName(specialty)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.city || ''}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      setFormData({
                        ...formData, 
                        city: selectedCity,
                        hopital: '' // Reset hospital when city changes
                      });
                    }}
                    required
                  >
                    <option value="">Select City</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>
                        {getCityDisplayName(city)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.hopital || ''}
                    onChange={(e) => setFormData({...formData, hopital: e.target.value})}
                    required
                    disabled={!formData.city}
                  >
                    <option value="">{formData.city ? 'Select Hospital' : 'Select City First'}</option>
                    {formData.city && getHospitalsForCity(formData.city).map(hospital => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Rating"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.motDePasse || ''}
                    onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                    required
                  />
                </>
              )}
              
              {editMode === 'consultation' && (
                <>
                  <select
                    value={formData.patientId || ''}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.prenom} {patient.nom}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.docteurId || ''}
                    onChange={(e) => setFormData({...formData, docteurId: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.prenom} {doctor.nom} - {doctor.specialite}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    placeholder="Consultation Date"
                    value={formData.dateConsultation || ''}
                    onChange={(e) => setFormData({...formData, dateConsultation: e.target.value})}
                    required
                  />
                  <input
                    type="time"
                    placeholder="Consultation Time"
                    value={formData.heureConsultation || ''}
                    onChange={(e) => setFormData({...formData, heureConsultation: e.target.value})}
                    required
                  />
                  <select
                    value={formData.etat || 'PENDING'}
                    onChange={(e) => setFormData({...formData, etat: e.target.value})}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price (MAD)"
                    value={formData.prix || ''}
                    onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Video Call Link (optional)"
                    value={formData.videoCallLink || ''}
                    onChange={(e) => setFormData({...formData, videoCallLink: e.target.value})}
                  />
                </>
              )}
              
              {editMode === 'payment' && (
                <>
                  <select
                    value={formData.consultationId || ''}
                    onChange={(e) => setFormData({...formData, consultationId: e.target.value})}
                    required
                  >
                    <option value="">Select Consultation</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.patient?.prenom} {consultation.patient?.nom} - {consultation.docteur?.prenom} {consultation.docteur?.nom} - {new Date(consultation.dateConsultation).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                  <select
                    value={formData.currency || 'MAD'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    required
                  >
                    <option value="MAD">MAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <select
                    value={formData.paymentMethod || ''}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                  <select
                    value={formData.status || 'PENDING'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SUCCEEDED">Succeeded</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Customer Email"
                    value={formData.customerEmail || ''}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={formData.customerName || ''}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (optional)"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </>
              )}
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit {editMode}</h3>
              <button onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              {/* Same form fields as create modal */}
              {editMode === 'patient' && (
                <>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.dateNaissance || ''}
                    onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.adresse || ''}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    required
                  />
                </>
              )}
              
              {editMode === 'doctor' && (
                <>
                  <input
                    type="text"
                    placeholder="Professional Number"
                    value={formData.numeroProfessionnel || ''}
                    onChange={(e) => setFormData({...formData, numeroProfessionnel: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                  <select
                    value={formData.specialite || ''}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    required
                  >
                    <option value="">Select Specialty</option>
                    {availableSpecialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {getSpecialtyDisplayName(specialty)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.city || ''}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      setFormData({
                        ...formData, 
                        city: selectedCity,
                        hopital: '' // Reset hospital when city changes
                      });
                    }}
                    required
                  >
                    <option value="">Select City</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>
                        {getCityDisplayName(city)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.hopital || ''}
                    onChange={(e) => setFormData({...formData, hopital: e.target.value})}
                    required
                    disabled={!formData.city}
                  >
                    <option value="">{formData.city ? 'Select Hospital' : 'Select City First'}</option>
                    {formData.city && getHospitalsForCity(formData.city).map(hospital => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Rating"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </>
              )}
              
              {editMode === 'consultation' && (
                <>
                  <select
                    value={formData.patientId || ''}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.prenom} {patient.nom}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.docteurId || ''}
                    onChange={(e) => setFormData({...formData, docteurId: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.prenom} {doctor.nom} - {doctor.specialite}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    placeholder="Consultation Date"
                    value={formData.dateConsultation || ''}
                    onChange={(e) => setFormData({...formData, dateConsultation: e.target.value})}
                    required
                  />
                  <input
                    type="time"
                    placeholder="Consultation Time"
                    value={formData.heureConsultation || ''}
                    onChange={(e) => setFormData({...formData, heureConsultation: e.target.value})}
                    required
                  />
                  <select
                    value={formData.etat || 'PENDING'}
                    onChange={(e) => setFormData({...formData, etat: e.target.value})}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price (MAD)"
                    value={formData.prix || ''}
                    onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Video Call Link (optional)"
                    value={formData.videoCallLink || ''}
                    onChange={(e) => setFormData({...formData, videoCallLink: e.target.value})}
                  />
                </>
              )}
              
              {editMode === 'payment' && (
                <>
                  <select
                    value={formData.consultationId || ''}
                    onChange={(e) => setFormData({...formData, consultationId: e.target.value})}
                    required
                  >
                    <option value="">Select Consultation</option>
                    {consultations.map(consultation => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.patient?.prenom} {consultation.patient?.nom} - {consultation.docteur?.prenom} {consultation.docteur?.nom} - {new Date(consultation.dateConsultation).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                  <select
                    value={formData.currency || 'MAD'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    required
                  >
                    <option value="MAD">MAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <select
                    value={formData.paymentMethod || ''}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                  <select
                    value={formData.status || 'PENDING'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SUCCEEDED">Succeeded</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Customer Email"
                    value={formData.customerEmail || ''}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={formData.customerName || ''}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (optional)"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </>
              )}
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Delete {editMode}</h3>
              <button onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this {editMode}?</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button onClick={handleDelete} className="danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
