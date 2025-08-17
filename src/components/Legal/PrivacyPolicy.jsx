import React from 'react';
import { SEO } from '../SEO/SEO';
import { useTranslation } from 'react-i18next';
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookieBite, FaUserCog, FaEnvelope } from 'react-icons/fa';
import './LegalPages.css';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const pageTitle = 'Politique de Confidentialité';
  const pageDescription = 'Découvrez comment Tabib Life protège vos données personnelles et vos droits en matière de confidentialité.';

  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        path="/privacy-policy/"
      />
      
      <div className="legal-document">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">
            <FaShieldAlt className="mr-2 text-blue-600" />
            {pageTitle}
          </h1>
          <p className="text-gray-600 mb-8">Dernière mise à jour : {currentDate}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-blue-600" />
              Introduction
            </h2>
            <p className="mb-4">
              Chez Tabib Life, nous prenons votre vie privée au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre plateforme de prise de rendez-vous médicaux en ligne.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserLock className="mr-2 text-blue-600" />
              Informations que nous collectons
            </h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Informations personnelles (nom, prénom, date de naissance, adresse email, numéro de téléphone)</li>
              <li>Informations médicales nécessaires à la prise de rendez-vous</li>
              <li>Historique des rendez-vous et consultations</li>
              <li>Données de localisation pour trouver des professionnels de santé à proximité</li>
              <li>Données de navigation et d'utilisation de notre plateforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaDatabase className="mr-2 text-blue-600" />
              Comment nous utilisons vos informations
            </h2>
            <p className="mb-4">Nous utilisons vos informations pour :</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Faciliter la prise de rendez-vous avec les professionnels de santé</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
              <li>Vous envoyer des rappels et notifications importants</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaCookieBite className="mr-2 text-blue-600" />
              Cookies et technologies similaires
            </h2>
            <p className="mb-4">
              Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez gérer vos préférences en matière de cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserCog className="mr-2 text-blue-600" />
              Vos droits
            </h2>
            <p className="mb-4">Conformément à la loi sur la protection des données, vous avez le droit de :</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Demander la rectification de vos données</li>
              <li>Demander l'effacement de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" />
              Contact
            </h2>
            <p className="mb-4">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter à :
            </p>
            <p className="font-medium">Email : privacy@tabiblife.com</p>
            <p className="font-medium">Adresse : 123 Avenue des Médecins, Casablanca, Maroc</p>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Cette politique de confidentialité est entrée en vigueur le {currentDate} et peut être mise à jour périodiquement. Nous vous encourageons à la consulter régulièrement.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
