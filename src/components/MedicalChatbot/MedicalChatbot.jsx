import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import chatbotApi from '../../services/chatbotApi';
import './MedicalChatbot.css';

// SVG Icons - High Quality Medical Icons
const Icons = {
  Medical: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Fire: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
    </svg>
  ),
  Location: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  ),
  Hospital: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/>
      <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/>
      <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  Pills: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <path d="m8.5 8.5 7 7"/>
    </svg>
  ),
  Minimize: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="m14 10 7-7"/><path d="m3 21 7-7"/>
    </svg>
  ),
};

// Chatbot translations
const chatbotTranslations = {
  en: {
    title: 'Medical Assistant',
    subtitle: 'AI-Powered Burn Care & Health Advisor',
    online: 'Online',
    welcomeTitle: 'Welcome to Medical Assistant',
    welcomeSubtitle: "I'm here to help with your health questions and burn injury assessment.",
    featureChat: 'Ask medical questions',
    featureBurn: 'Learn about burn care',
    featureCamera: 'Upload burn image for AI analysis',
    featureHospital: 'Find nearby hospitals (for severe burns)',
    btnBurnSymptoms: 'Burn Symptoms',
    btnSeekHelp: 'When to Seek Help',
    placeholder: 'Type your health question...',
    placeholderImage: 'Add a message or send image...',
    analyzingImage: 'Analyzing uploaded burn image...',
    findHospitals: 'Find Nearby Hospitals',
    findPharmacies: 'Find Pharmacies',
    nearbyFacilities: 'Nearby Medical Facilities:',
    nearbyPharmacies: 'Nearby Pharmacies:',
    kmAway: 'km away',
    getDirections: 'Get Directions',
    foundHospitals: 'Found {count} medical facilities near you:',
    foundPharmacies: 'Found {count} pharmacies near you:',
    noHospitals: "I couldn't find hospitals in your area. Please search manually or call emergency services if urgent.",
    noPharmacies: "I couldn't find pharmacies in your area.",
    enableLocation: 'Please enable location access to find nearby hospitals. For emergencies, call emergency services immediately.',
    errorMessage: "I'm sorry, I couldn't process your request. Please make sure the backend server is running and try again.",
    uploadBurn: 'Upload burn image',
    findNearby: 'Find nearby hospitals',
    findPharmaciesNearby: 'Find pharmacies nearby',
  },
  fr: {
    title: 'Assistant Médical',
    subtitle: 'Soins des Brûlures & Conseiller Santé IA',
    online: 'En ligne',
    welcomeTitle: 'Bienvenue sur Assistant Médical',
    welcomeSubtitle: "Je suis là pour vous aider avec vos questions de santé et l'évaluation des brûlures.",
    featureChat: 'Poser des questions médicales',
    featureBurn: 'En savoir plus sur les brûlures',
    featureCamera: "Télécharger une image de brûlure pour l'analyse IA",
    featureHospital: 'Trouver des hôpitaux à proximité (brûlures graves)',
    btnBurnSymptoms: 'Symptômes de Brûlure',
    btnSeekHelp: 'Quand Consulter',
    placeholder: 'Tapez votre question de santé...',
    placeholderImage: "Ajouter un message ou envoyer l'image...",
    analyzingImage: "Analyse de l'image de brûlure en cours...",
    findHospitals: 'Trouver des Hôpitaux',
    findPharmacies: 'Trouver Pharmacies',
    nearbyFacilities: 'Établissements Médicaux à Proximité:',
    nearbyPharmacies: 'Pharmacies à Proximité:',
    kmAway: 'km',
    getDirections: 'Itinéraire',
    foundHospitals: '{count} établissements médicaux trouvés près de vous:',
    foundPharmacies: '{count} pharmacies trouvées près de vous:',
    noHospitals: "Je n'ai pas trouvé d'hôpitaux dans votre région. Veuillez chercher manuellement ou appeler les urgences.",
    noPharmacies: "Je n'ai pas trouvé de pharmacies dans votre région.",
    enableLocation: "Veuillez activer l'accès à la localisation. Pour les urgences, appelez immédiatement les services d'urgence.",
    errorMessage: "Désolé, je n'ai pas pu traiter votre demande. Veuillez vérifier que le serveur backend fonctionne.",
    uploadBurn: 'Télécharger une image',
    findNearby: 'Hôpitaux proches',
    findPharmaciesNearby: 'Pharmacies proches',
  },
  ar: {
    title: 'المساعد الطبي',
    subtitle: 'رعاية الحروق والمستشار الصحي بالذكاء الاصطناعي',
    online: 'متصل',
    welcomeTitle: 'مرحباً بك في المساعد الطبي',
    welcomeSubtitle: 'أنا هنا لمساعدتك في أسئلتك الصحية وتقييم إصابات الحروق.',
    featureChat: 'اطرح أسئلة طبية',
    featureBurn: 'تعرف على رعاية الحروق',
    featureCamera: 'حمّل صورة الحرق للتحليل',
    featureHospital: 'ابحث عن المستشفيات القريبة',
    btnBurnSymptoms: 'أعراض الحروق',
    btnSeekHelp: 'متى تطلب المساعدة',
    placeholder: 'اكتب سؤالك الصحي...',
    placeholderImage: 'أضف رسالة أو أرسل الصورة...',
    analyzingImage: 'جاري تحليل صورة الحرق...',
    findHospitals: 'ابحث عن المستشفيات',
    findPharmacies: 'ابحث عن الصيدليات',
    nearbyFacilities: 'المرافق الطبية القريبة:',
    nearbyPharmacies: 'الصيدليات القريبة:',
    kmAway: 'كم',
    getDirections: 'احصل على الاتجاهات',
    foundHospitals: 'تم العثور على {count} مرافق طبية بالقرب منك:',
    foundPharmacies: 'تم العثور على {count} صيدليات بالقرب منك:',
    noHospitals: 'لم أتمكن من العثور على مستشفيات في منطقتك. يرجى البحث يدويًا أو الاتصال بخدمات الطوارئ.',
    noPharmacies: 'لم أتمكن من العثور على صيدليات في منطقتك.',
    enableLocation: 'يرجى تفعيل الوصول إلى الموقع. للحالات الطارئة، اتصل بخدمات الطوارئ فوراً.',
    errorMessage: 'عذراً، لم أتمكن من معالجة طلبك. يرجى التأكد من تشغيل الخادم والمحاولة مرة أخرى.',
    uploadBurn: 'تحميل صورة',
    findNearby: 'مستشفيات قريبة',
    findPharmaciesNearby: 'صيدليات قريبة',
  },
};

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', rtl: true },
];

// Typewriter effect hook
const useTypewriter = (text, speed = 15, enabled = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text || '');
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
};

// Simple markdown-like renderer
const renderMarkdown = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null;

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(<ul key={elements.length}>{currentList}</ul>);
      } else {
        elements.push(<ol key={elements.length}>{currentList}</ol>);
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={idx}>{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={idx}>{line.substring(4)}</h3>);
    } else if (line.trim() === '---') {
      flushList();
      elements.push(<hr key={idx} />);
    } else if (line.match(/^[-•]\s/)) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      currentList.push(<li key={idx}>{formatInline(line.substring(2))}</li>);
    } else if (line.trim()) {
      flushList();
      elements.push(<p key={idx}>{formatInline(line)}</p>);
    }
  });

  flushList();
  return elements;
};

const formatInline = (text) => {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/⚠️/g, '<span style="color: #f59e0b">⚠️</span>');
  text = text.replace(/🚨/g, '<span style="color: #ef4444">🚨</span>');
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

// Analyzing Animation Component
const AnalyzingAnimation = ({ t }) => (
  <div className="mc-analyzing-animation">
    <div className="mc-analyzing-icon">
      <Icons.Sparkles />
    </div>
    <div className="mc-analyzing-content">
      <div className="mc-analyzing-title">AI Analysis in Progress</div>
      <div className="mc-analyzing-subtitle">{t.analyzingImage}</div>
      <div className="mc-analyzing-progress">
        <div className="mc-analyzing-progress-bar"></div>
      </div>
    </div>
  </div>
);

// Message Component with Typewriter
const Message = ({ message, onFindHospitals, t, isNew }) => {
  const isUser = message.role === 'user';
  const shouldAnimate = isNew && !isUser && message.content;
  const { displayedText, isTyping } = useTypewriter(message.content, 8, shouldAnimate);
  
  const textToShow = shouldAnimate ? displayedText : message.content;
  
  return (
    <div className={`mc-message ${message.role}`}>
      <div className="mc-message-avatar">
        {isUser ? <Icons.User /> : <Icons.Stethoscope />}
      </div>
      <div className="mc-message-content">
        {message.image && (
          <img src={message.image} alt="Uploaded" className="mc-message-image" />
        )}
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            {/* Heatmap image for burn analysis - show immediately */}
            {message.heatmapImage && (
              <div className="mc-heatmap-container">
                <img 
                  src={message.heatmapImage} 
                  alt="Burn Analysis Heatmap" 
                  className="mc-heatmap-image"
                />
                <p className="mc-heatmap-legend">
                  <span style={{ color: '#ef4444' }}>🔴</span> High damage
                  <span style={{ color: '#22c55e', marginLeft: '8px' }}>🟢</span> Lower damage
                </p>
              </div>
            )}
            {renderMarkdown(textToShow)}
            {isTyping && <span className="mc-typing-cursor">|</span>}
            {!isTyping && message.burnAnalysis && message.burnAnalysis.seek_medical_attention && (
              <button 
                className="mc-quick-action-btn danger"
                onClick={onFindHospitals}
                style={{ marginTop: '12px' }}
              >
                <Icons.Location /> {t.findHospitals}
              </button>
            )}
          </>
        )}
        {!isTyping && message.hospitals && message.hospitals.length > 0 && (
          <div className="mc-hospital-list">
            <h4><Icons.Hospital /> {t.nearbyFacilities}</h4>
            {message.hospitals.slice(0, 5).map((hospital, idx) => (
              <div key={`hospital-${idx}`} className="mc-hospital-card">
                <h4>{hospital.name}</h4>
                <p className="mc-distance"><Icons.Location /> {hospital.distance_km} {t.kmAway}</p>
                {hospital.address && <p>{hospital.address}</p>}
                {hospital.phone && <p><Icons.Phone /> {hospital.phone}</p>}
                <a href={hospital.maps_url} target="_blank" rel="noopener noreferrer">
                  {t.getDirections} <Icons.ArrowRight />
                </a>
              </div>
            ))}
          </div>
        )}
        {!isTyping && message.pharmacies && message.pharmacies.length > 0 && (
          <div className="mc-hospital-list mc-pharmacy-list">
            <h4><Icons.Pills /> {t.nearbyPharmacies}</h4>
            {message.pharmacies.slice(0, 5).map((pharmacy, idx) => (
              <div key={`pharmacy-${idx}`} className="mc-hospital-card mc-pharmacy-card">
                <h4>{pharmacy.name}</h4>
                <p className="mc-distance"><Icons.Location /> {pharmacy.distance_km} {t.kmAway}</p>
                <p className="mc-pharmacy-type" style={{ fontSize: '11px', color: pharmacy.type === 'parapharmacy' ? '#f59e0b' : 'var(--mc-primary-color)', fontWeight: 500 }}>
                  {pharmacy.type === 'parapharmacy' ? '🏪 Parapharmacie' : '💊 Pharmacie'}
                </p>
                {pharmacy.address && <p>{pharmacy.address}</p>}
                {pharmacy.phone && <p><Icons.Phone /> {pharmacy.phone}</p>}
                {pharmacy.opening_hours && <p style={{ fontSize: '11px', color: 'var(--mc-text-muted)' }}>🕐 {pharmacy.opening_hours}</p>}
                <a href={pharmacy.maps_url} target="_blank" rel="noopener noreferrer">
                  {t.getDirections} <Icons.ArrowRight />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Typing Indicator
const TypingIndicator = () => (
  <div className="mc-message assistant">
    <div className="mc-message-avatar"><Icons.Stethoscope /></div>
    <div className="mc-typing-indicator">
      <div className="mc-typing-dot"></div>
      <div className="mc-typing-dot"></div>
      <div className="mc-typing-dot"></div>
    </div>
  </div>
);

// Language Selector Component
const LanguageSelector = ({ currentLang, onChangeLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = languages.find(l => l.code === currentLang);

  return (
    <div className="mc-language-selector">
      <button 
        className="mc-language-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icons.Globe />
        <span>{currentLanguage?.flag}</span>
        <Icons.ChevronDown />
      </button>
      {isOpen && (
        <div className="mc-language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`mc-language-option ${lang.code === currentLang ? 'active' : ''}`}
              onClick={() => {
                onChangeLang(lang.code);
                setIsOpen(false);
              }}
            >
              <span className="mc-lang-flag">{lang.flag}</span>
              <span className="mc-lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Welcome Screen
const WelcomeScreen = ({ onQuickAction, t }) => (
  <div className="mc-welcome-screen">
    <div className="mc-welcome-icon">
      <Icons.Stethoscope />
    </div>
    <h2>{t.welcomeTitle}</h2>
    <p>{t.welcomeSubtitle}</p>
    
    <div className="mc-feature-list">
      <div className="mc-feature-item" onClick={() => onQuickAction("What should I do for a minor cut?")}>
        <div className="mc-feature-icon">
          <Icons.Chat />
        </div>
        <div>{t.featureChat}</div>
      </div>
      <div className="mc-feature-item" onClick={() => onQuickAction("How do I treat a mild burn at home?")}>
        <div className="mc-feature-icon orange">
          <Icons.Fire />
        </div>
        <div>{t.featureBurn}</div>
      </div>
      <div className="mc-feature-item">
        <div className="mc-feature-icon blue">
          <Icons.Camera />
        </div>
        <div>{t.featureCamera}</div>
      </div>
      <div className="mc-feature-item">
        <div className="mc-feature-icon red">
          <Icons.Hospital />
        </div>
        <div>{t.featureHospital}</div>
      </div>
      <div className="mc-feature-item">
        <div className="mc-feature-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <Icons.Pills />
        </div>
        <div>Find pharmacies nearby</div>
      </div>
    </div>
    
    <div className="mc-quick-actions" style={{ marginTop: '20px', justifyContent: 'center' }}>
      <button className="mc-quick-action-btn" onClick={() => onQuickAction("What are the symptoms of a 2nd degree burn?")}>
        {t.btnBurnSymptoms}
      </button>
      <button className="mc-quick-action-btn" onClick={() => onQuickAction("When should I go to the hospital for a burn?")}>
        {t.btnSeekHelp}
      </button>
    </div>
  </div>
);

// Main Chatbot Component
function MedicalChatbot({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [language, setLanguage] = useState(i18n.language?.substring(0, 2) || 'en');
  const [newestMessageId, setNewestMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get translations for the chatbot
  const t = chatbotTranslations[language] || chatbotTranslations.en;
  const isRTL = languages.find(l => l.code === language)?.rtl || false;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isAnalyzing]);

  // Generate conversation ID on mount
  useEffect(() => {
    setConversationId(`conv_${Date.now()}`);
  }, []);

  // Sync language with i18n
  useEffect(() => {
    const lang = i18n.language?.substring(0, 2);
    if (lang && chatbotTranslations[lang]) {
      setLanguage(lang);
    }
  }, [i18n.language]);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue || t.analyzingImage,
      image: imagePreview,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Show analyzing animation for image uploads
    if (selectedImage) {
      setIsAnalyzing(true);
    }

    try {
      let response;
      
      if (selectedImage) {
        // Classify burn image
        response = await chatbotApi.classifyBurn(selectedImage, conversationId, null, language);
        
        // Add small delay to show the analyzing animation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAnalyzing(false);
        
        const newMessageId = Date.now();
        const assistantMessage = {
          id: newMessageId,
          role: 'assistant',
          content: response.response,
          burnAnalysis: response.burn_analysis,
          heatmapImage: response.heatmap_image,
          timestamp: new Date().toISOString(),
        };
        
        setNewestMessageId(newMessageId);
        setMessages(prev => [...prev, assistantMessage]);
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        // Regular chat
        response = await chatbotApi.sendMessage(inputValue, conversationId, null, language);
        
        const newMessageId = Date.now();
        const assistantMessage = {
          id: newMessageId,
          role: 'assistant',
          content: response.response,
          timestamp: new Date().toISOString(),
        };
        
        setNewestMessageId(newMessageId);
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsAnalyzing(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: t.errorMessage,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, selectedImage, imagePreview, isLoading, conversationId, t, language]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle finding hospitals
  const handleFindHospitals = async () => {
    setIsLoading(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await chatbotApi.findHospitals(latitude, longitude);

      const newMessageId = Date.now();
      if (response.success && response.hospitals.length > 0) {
        setMessages(prev => [...prev, {
          id: newMessageId,
          role: 'assistant',
          content: t.foundHospitals.replace('{count}', response.count),
          hospitals: response.hospitals,
          timestamp: new Date().toISOString(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: newMessageId,
          role: 'assistant',
          content: t.noHospitals,
          timestamp: new Date().toISOString(),
        }]);
      }
      setNewestMessageId(newMessageId);
    } catch (error) {
      console.error('Error finding hospitals:', error);
      const newMessageId = Date.now();
      setMessages(prev => [...prev, {
        id: newMessageId,
        role: 'assistant',
        content: t.enableLocation,
        timestamp: new Date().toISOString(),
      }]);
      setNewestMessageId(newMessageId);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle finding pharmacies
  const handleFindPharmacies = async () => {
    setIsLoading(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await chatbotApi.findPharmacies(latitude, longitude);

      const newMessageId = Date.now();
      if (response.success && response.pharmacies.length > 0) {
        setMessages(prev => [...prev, {
          id: newMessageId,
          role: 'assistant',
          content: t.foundPharmacies.replace('{count}', response.count),
          pharmacies: response.pharmacies,
          timestamp: new Date().toISOString(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: newMessageId,
          role: 'assistant',
          content: t.noPharmacies,
          timestamp: new Date().toISOString(),
        }]);
      }
      setNewestMessageId(newMessageId);
    } catch (error) {
      console.error('Error finding pharmacies:', error);
      const newMessageId = Date.now();
      setMessages(prev => [...prev, {
        id: newMessageId,
        role: 'assistant',
        content: t.enableLocation,
        timestamp: new Date().toISOString(),
      }]);
      setNewestMessageId(newMessageId);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick action
  const handleQuickAction = (message) => {
    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`mc-chatbot-overlay ${isOpen ? 'open' : ''}`}>
      <div className={`mc-chatbot-container ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="mc-chatbot-header">
          <div className="mc-header-icon">
            <Icons.Stethoscope />
          </div>
          <div className="mc-header-info">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          <LanguageSelector currentLang={language} onChangeLang={setLanguage} />
          <div className="mc-header-status">
            <div className="mc-status-dot"></div>
            {t.online}
          </div>
          <button className="mc-close-btn" onClick={onClose} aria-label="Close chatbot">
            <Icons.Close />
          </button>
        </div>

        {/* Messages */}
        <div className="mc-messages-container">
          {messages.length === 0 ? (
            <WelcomeScreen onQuickAction={handleQuickAction} t={t} />
          ) : (
            messages.map((msg) => (
              <Message 
                key={msg.id} 
                message={msg} 
                onFindHospitals={handleFindHospitals}
                t={t}
                isNew={msg.id === newestMessageId}
              />
            ))
          )}
          {isAnalyzing && <AnalyzingAnimation t={t} />}
          {isLoading && !isAnalyzing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mc-input-container">
          {imagePreview && (
            <div className="mc-image-preview-container">
              <img src={imagePreview} alt="Preview" className="mc-image-preview" />
              <button 
                className="mc-remove-image-btn"
                onClick={() => { setSelectedImage(null); setImagePreview(null); }}
              >
                <Icons.Close />
              </button>
            </div>
          )}
          
          <div className="mc-input-wrapper">
            <button 
              className="mc-icon-btn camera"
              onClick={() => fileInputRef.current?.click()}
              title={t.uploadBurn}
            >
              <Icons.Camera />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
            />
            
            <div className="mc-input-main">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedImage ? t.placeholderImage : t.placeholder}
                disabled={isLoading}
              />
            </div>
            
            <button 
              className="mc-icon-btn location"
              onClick={handleFindHospitals}
              title={t.findHospitals}
            >
              <Icons.Hospital />
            </button>
            
            <button 
              className="mc-icon-btn pharmacy"
              onClick={handleFindPharmacies}
              title={t.findPharmacies}
              style={{ color: '#10b981' }}
            >
              <Icons.Pills />
            </button>
            
            <button 
              className="mc-icon-btn send"
              onClick={handleSendMessage}
              disabled={isLoading || (!inputValue.trim() && !selectedImage)}
            >
              <Icons.Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalChatbot;
