import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, UserCheck, FileText, Star, Video, MapPin, TrendingUp, Activity, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Dashboard.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState('thisMonth');
  const { t } = useTranslation();

  const userId = sessionStorage.getItem('userId');
  const userType = sessionStorage.getItem('userType');

  // API fetching functions
  const fetchData = async () => {
    try {
      
      if (!userType || userType.toLowerCase() !== 'docteur') {
        console.error('Access denied - userType is not "docteur". Current userType:', userType);
        throw new Error(t('dashboard.error.accessDenied'));
      }
  
      if (!userId) {
        throw new Error(t('dashboard.error.userIdNotFound'));
      }
      const [doctorRes, consultationsRes, ordonnancesRes] = await Promise.all([
        fetch(`https://tabiblife.zeabur.app/api/docteurs/${userId}`),
        fetch(`https://tabiblife.zeabur.app/api/consultations/doctor/${userId}`),
        fetch(`https://tabiblife.zeabur.app/api/ordonnances/doctor/${userId}`)
      ]);

      if (!doctorRes.ok) {
        throw new Error(t('dashboard.error.failedToFetchDoctor'));
      }
      if (!consultationsRes.ok) {
        throw new Error(t('dashboard.error.failedToFetchConsultations'));
      }
      if (!ordonnancesRes.ok) {
        throw new Error(t('dashboard.error.failedToFetchPrescriptions'));
      }

      const doctor = await doctorRes.json();
      const consultations = await consultationsRes.json();
      const ordonnances = await ordonnancesRes.json();

      if (!doctor || !doctor.prenom || !doctor.nom) {
        throw new Error(t('dashboard.error.invalidDoctorData'));
      }

      return { doctor, consultations, ordonnances };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  // Process data for dashboard
  const processData = (data) => {
    const { doctor, consultations = [], ordonnances = [] } = data;
    
    // Calculate metrics
    const totalConsultations = consultations.length;
    const prescriptionsIssued = ordonnances.length;
    const videoConsultations = consultations.filter(c => c.videoCallLink).length;
    const completedConsultations = consultations.filter(c => c.etat === 'COMPLETED').length;
    const pendingConsultations = consultations.filter(c => c.etat === 'PENDING').length;
    const acceptedConsultations = consultations.filter(c => c.etat === 'ACCEPTED').length;
    
    // Calculate average rating
    const avgRating = doctor?.rating || 0;

    // Recent prescriptions
    const recentPrescriptions = ordonnances
      .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
      .slice(0, 5)
      .map(ord => ({
        patient: ord.patient ? `${ord.patient.prenom || ''} ${ord.patient.nom || ''}`.trim() : t('dashboard.unknownPatient'),
        date: new Date(ord.dateCreation).toLocaleDateString(),
        details: ord.contenu || t('dashboard.prescriptionDetails')
      }));

    // Weekly consultation pattern
    const weeklyPattern = [
      { day: t('dashboard.weekDays.mon'), consultations: Math.floor(totalConsultations * 0.16), prescriptions: Math.floor(prescriptionsIssued * 0.15) },
      { day: t('dashboard.weekDays.tue'), consultations: Math.floor(totalConsultations * 0.18), prescriptions: Math.floor(prescriptionsIssued * 0.17) },
      { day: t('dashboard.weekDays.wed'), consultations: Math.floor(totalConsultations * 0.20), prescriptions: Math.floor(prescriptionsIssued * 0.19) },
      { day: t('dashboard.weekDays.thu'), consultations: Math.floor(totalConsultations * 0.19), prescriptions: Math.floor(prescriptionsIssued * 0.18) },
      { day: t('dashboard.weekDays.fri'), consultations: Math.floor(totalConsultations * 0.16), prescriptions: Math.floor(prescriptionsIssued * 0.16) },
      { day: t('dashboard.weekDays.sat'), consultations: Math.floor(totalConsultations * 0.08), prescriptions: Math.floor(prescriptionsIssued * 0.10) },
      { day: t('dashboard.weekDays.sun'), consultations: Math.floor(totalConsultations * 0.03), prescriptions: Math.floor(prescriptionsIssued * 0.05) }
    ];

    // Consultation status distribution
    const consultationStatus = [
      { name: t('dashboard.status.completed'), value: completedConsultations },
      { name: t('dashboard.status.pending'), value: pendingConsultations },
      { name: t('dashboard.status.accepted'), value: acceptedConsultations }
    ];

    return {
      metrics: {
        totalConsultations: { value: totalConsultations, change: "+12.3%", period: t('dashboard.metrics.totalConsultations'), icon: Activity },
        prescriptionsIssued: { value: prescriptionsIssued, change: "+8.8%", period: t('dashboard.metrics.totalPrescriptions'), icon: FileText },
        averageRating: { value: avgRating.toFixed(1), change: "+0.1", period: t('dashboard.metrics.yourRating'), icon: Star },
        videoConsultations: { value: videoConsultations, change: "+18.5%", period: t('dashboard.metrics.videoConsultations'), icon: Video },
        completedConsultations: { value: completedConsultations, change: "+5.2%", period: t('dashboard.metrics.completed'), icon: UserCheck },
        pendingConsultations: { value: pendingConsultations, change: "0%", period: t('dashboard.metrics.pending'), icon: Clock }
      },
      doctorInfo: {
        name: `${t('dashboard.doctor.title')} ${doctor.prenom} ${doctor.nom}`,
        specialty: doctor.specialite || t('dashboard.doctor.general'),
        location: doctor.city || t('dashboard.doctor.notAvailable'),
        hospital: doctor.hopital || t('dashboard.doctor.privatePractice'),
        rating: doctor.rating || 0
      },
      recentPrescriptions,
      consultationStatus,
      weeklyConsultationPattern: weeklyPattern
    };
  };

  const exportToExcel = () => {
    if (!dashboardData) return;
  
    const metricsSheet = Object.entries(dashboardData.metrics).map(([key, value]) => ({
      Metric: key,
      Value: value.value,
      Change: value.change,
      Period: value.period
    }));
  
    const prescriptionsSheet = dashboardData.recentPrescriptions.map((p, i) => ({
      Index: i + 1,
      Patient: p.patient,
      Date: p.date,
      Details: p.details
    }));
  
    const statusSheet = dashboardData.consultationStatus.map((entry) => ({
      Status: entry.name,
      Count: entry.value
    }));
  
    const weeklySheet = dashboardData.weeklyConsultationPattern.map((item) => ({
      Day: item.day,
      Consultations: item.consultations,
      Prescriptions: item.prescriptions
    }));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(metricsSheet), "Metrics");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prescriptionsSheet), "Recent Prescriptions");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(statusSheet), "Consultation Status");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(weeklySheet), "Weekly Pattern");
  
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `dashboard_${Date.now()}.xlsx`);
  };

  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData = await fetchData();
        const processedData = processData(rawData);
        setDashboardData(processedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

  if (loading) return (
    <div className="loading-container loading-pulse">
      <LoadingSpinner size="large" color="primary" text={t('dashboard.loading')} />
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2>{t('dashboard.error.title')}</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );

  if (!dashboardData) return null;

  const { metrics, doctorInfo, recentPrescriptions, consultationStatus, weeklyConsultationPattern } = dashboardData;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-title-container">
            <h1 className="header-title">
              <div className="header-icon-wrapper">
                <Activity className="header-icon" />
              </div>
              {t('dashboard.title')}
            </h1>
            <p className="header-subtitle">{t('dashboard.welcome')} {doctorInfo.name}</p>
          </div>
          <div className="filters">
            <select
              className="filter-select"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="thisMonth">{t('dashboard.dateRanges.thisMonth')}</option>
              <option value="last3Months">{t('dashboard.dateRanges.last3Months')}</option>
              <option value="thisYear">{t('dashboard.dateRanges.thisYear')}</option>
            </select>
            <button className="export-button" onClick={exportToExcel}>
              {t('dashboard.exportReport')}
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Doctor Info Card */}
        <div className="doctor-info-card">
          <div className="doctor-info-header">
            <div className="doctor-avatar">
              {doctorInfo.name.split(' ')[1]?.[0]}{doctorInfo.name.split(' ')[2]?.[0]}
            </div>
            <div className="doctor-info-details">
              <h2>{doctorInfo.name}</h2>
              <p className="doctor-specialty">{doctorInfo.specialty}</p>
              <p className="doctor-location">{doctorInfo.location} • {doctorInfo.hospital}</p>
            </div>
            <div className="doctor-rating">
              <Star className="metric-icon star-filled" />
              <span className="rating-value">{doctorInfo.rating}</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {Object.entries(metrics).map(([key, data]) => {
            const IconComponent = data.icon;
            return (
              <div key={key} className="metric-card">
                <div className="metric-card-header">
                  <div className="metric-icon-wrapper">
                    <IconComponent className="metric-icon" />
                  </div>
                  <span className={`metric-change ${data.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {data.change}
                  </span>
                </div>
                <h3 className="metric-title">
                  {t(`dashboard.metricTitles.${key}`)}
                </h3>
                <p className="metric-value">{data.value}</p>
                <p className="metric-period">{data.period}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Prescriptions */}
        <div className="recent-prescriptions-container">
          <h2 className="recent-prescriptions-title">
            <FileText className="metric-icon" />
            {t('dashboard.recentPrescriptions.title')}
          </h2>
          <div className="prescription-list">
            {recentPrescriptions.map((prescription, index) => (
              <div key={index} className="prescription-item">
                <div className="prescription-header">
                  <h3 className="prescription-patient">{prescription.patient}</h3>
                  <span className="prescription-date">{prescription.date}</span>
                </div>
                <p className="prescription-details">{prescription.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="consultation-status-chart chart-container">
            <h2 className="chart-title">{t('dashboard.charts.consultationStatus.title')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consultationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consultationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="weekly-chart-container chart-container">
            <h2 className="weekly-chart-title">
              <Clock className="metric-icon" />
              {t('dashboard.charts.weeklyPattern.title')}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyConsultationPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consultations" fill="#3B82F6" name={t('dashboard.charts.weeklyPattern.consultations')} />
                <Bar dataKey="prescriptions" fill="#10B981" name={t('dashboard.charts.weeklyPattern.prescriptions')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;