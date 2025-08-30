import React from 'react';
import { FaExclamationTriangle, FaStethoscope, FaUserMd, FaInfoCircle } from 'react-icons/fa';
import PageMeta from '../SEO/PageMeta';
import './LegalPages.css';

const MedicalDisclaimer = () => {
  const currentDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const pageTitle = 'Avertissement Médical';
  const pageDescription = 'Informations importantes concernant l\'utilisation de la plateforme Tabib Life à des fins de prise de rendez-vous médicaux.';

  return (
    <>
      <PageMeta 
        title={pageTitle}
        description={pageDescription}
        keywords="avertissement médical, mise en garde médicale, non-responsabilité médicale, informations médicales, plateforme de santé"
        ogTitle={`${pageTitle} | Tabib Life`}
        ogDescription={pageDescription}
        ogImage="https://tabib.life/logo.png"
        ogUrl="https://tabib.life/medical-disclaimer"
      />
      
      <div className="legal-document">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <FaExclamationTriangle className="mr-2 text-yellow-500" />
            {pageTitle}
          </h1>
          <p className="text-gray-600 mb-8">Dernière mise à jour : {currentDate}</p>
          
          <section className="mb-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important :</strong> Tabib Life est une plateforme de mise en relation et de prise de rendez-vous. Ce service ne fournit pas de conseils médicaux, diagnostics ou traitements.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaStethoscope className="mr-2 text-blue-600" />
              Non-remplacement des soins médicaux
            </h2>
            <p className="mb-4">
              Les informations fournies sur Tabib Life sont destinées à des fins d'information générale uniquement et ne doivent pas être considérées comme des conseils médicaux, un diagnostic ou un traitement. Elles ne remplacent pas une consultation avec un professionnel de santé qualifié.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserMd className="mr-2 text-blue-600" />
              Responsabilité des professionnels de santé
            </h2>
            <p className="mb-4">
              Les professionnels de santé référencés sur Tabib Life sont des professionnels indépendants. Tabib Life n'exerce aucun contrôle sur la qualité des soins fournis et décline toute responsabilité quant aux actes médicaux effectués par ces professionnels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Urgences médicales</h2>
            <p className="mb-4 p-4 bg-red-50 border-l-4 border-red-400">
              <strong>En cas d'urgence médicale,</strong> veuillez immédiatement appeler les services d'urgence locaux ou vous rendre au service d'urgence le plus proche.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Exactitude des informations</h2>
            <p className="mb-4">
              Bien que nous nous efforcions de maintenir les informations à jour, Tabib Life ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations fournies par les professionnels de santé.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-600" />
              Contact
            </h2>
            <p className="mb-2">Pour toute question concernant cet avertissement, veuillez nous contacter à :</p>
            <p className="font-medium">Email : contact@tabiblife.com</p>
            <p className="font-medium">Téléphone : +212 5XX-XXXXXX</p>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Dernière mise à jour : {currentDate}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalDisclaimer;
