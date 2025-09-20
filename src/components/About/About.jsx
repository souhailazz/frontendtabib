import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageMeta from '../SEO/PageMeta';
import { FaUserShield, FaLock, FaRocket, FaHandsHelping } from 'react-icons/fa';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <PageMeta 
        title="À propos de Tabib Life"
        description="Découvrez Tabib Life, la plateforme de prise de rendez-vous médicaux en ligne au Maroc. Notre mission, nos valeurs et notre engagement envers la santé digitale."
        keywords="à propos tabib life, mission tabib maroc, valeurs tabib life, santé digitale maroc, plateforme médicale maroc"
        ogTitle="À propos de Tabib Life - Votre santé, notre priorité"
        ogDescription="Découvrez comment Tabib Life révolutionne la prise de rendez-vous médicaux au Maroc avec une plateforme simple, sécurisée et efficace."
        ogImage="https://tabib.life/logo.webp"
        ogUrl="https://tabib.life/about"
      />
      <div className="about-container">
        <h1>{t('about.title')}</h1>
        <p>{t('about.description1')}</p>
        <p>{t('about.description2')}</p>
        
        <div className="about-mission">
          <h2>{t('about.mission.title')}</h2>
          <p>{t('about.mission.description')}</p>
        </div>

        <div className="about-values">
          <h2>{t('about.values.title')}</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3><FaUserShield /> {t('about.values.accessibility.title')}</h3>
              <p>{t('about.values.accessibility.description')}</p>
            </div>
            <div className="value-item">
              <h3><FaLock /> {t('about.values.trust.title')}</h3>
              <p>{t('about.values.trust.description')}</p>
            </div>
            <div className="value-item">
              <h3><FaRocket /> {t('about.values.innovation.title')}</h3>
              <p>{t('about.values.innovation.description')}</p>
            </div>
            <div className="value-item">
              <h3><FaHandsHelping /> {t('about.values.support.title')}</h3>
              <p>{t('about.values.support.description')}</p>
            </div>
          </div>
        </div>

        <Link to="/" className="back-link">{t('about.backLink')}</Link>
      </div>
    </>
  );
};

export default About;