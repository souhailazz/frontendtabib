import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGavel, FaUserMd, FaExclamationTriangle, FaBook, FaInfoCircle } from 'react-icons/fa';
import PageMeta from '../SEO/PageMeta';
import './LegalPages.css';

const TermsOfService = () => {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  const pageTitle = 'Conditions Générales d\'Utilisation';
  const pageDescription = 'Consultez les conditions générales d\'utilisation de la plateforme Tabib Life pour la prise de rendez-vous médicaux en ligne au Maroc.';

  return (
    <>
      <PageMeta 
        title={pageTitle}
        description={pageDescription}
        keywords="conditions générales d'utilisation, CGU, conditions d'utilisation, mentions légales, conditions de service"
        ogTitle={`${pageTitle} | Tabib Life`}
        ogDescription={pageDescription}
        ogImage="https://tabib.life/logo.webp"
        ogUrl="https://tabib.life/terms-of-service"
      />
      
      <div className="legal-document">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">
            <FaGavel className="mr-2 text-blue-600" />
            {pageTitle}
          </h1>
          <p className="text-gray-600 mb-8">En vigueur au {currentDate}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaGavel className="mr-2 text-blue-600" />
              Article 1 - Objet
            </h2>
            <p className="mb-4">
              Les présentes conditions générales d'utilisation (ci-après les "CGU") ont pour objet l'encadrement juridique de l'utilisation du site Tabib Life et de ses services.
            </p>
            <p>
              Le site Tabib Life a pour objet de fournir une plateforme de prise de rendez-vous en ligne avec des professionnels de santé.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserMd className="mr-2 text-blue-600" />
              Article 2 - Inscription et accès aux services
            </h2>
            <p className="mb-4">L'utilisation du service nécessite une inscription préalable. L'utilisateur doit fournir des informations exactes et à jour.</p>
            <p>L'accès aux services nécessite un compte utilisateur sécurisé par identifiant et mot de passe.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 3 - Description des services</h2>
            <p className="mb-4">Tabib Life met à disposition des utilisateurs :</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Un service de prise de rendez-vous en ligne avec des professionnels de santé</li>
              <li>Un accès à des informations sur les professionnels de santé</li>
              <li>Un système de gestion des consultations et des dossiers médicaux</li>
              <li>Des fonctionnalités de rappel et de suivi des rendez-vous</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaExclamationTriangle className="mr-2 text-blue-600" />
              Article 4 - Responsabilités
            </h2>
            <p className="mb-4">
              Tabib Life s'engage à fournir un service de qualité mais ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations fournies par les professionnels de santé.
            </p>
            <p>
              L'utilisateur reconnaît que Tabib Life n'est pas un prestataire de soins de santé et que la plateforme ne fournit pas de conseils médicaux.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 5 - Protection des données</h2>
            <p className="mb-4">
              Les données à caractère personnel sont traitées conformément à notre Politique de Confidentialité. En utilisant nos services, vous acceptez ce traitement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 6 - Propriété intellectuelle</h2>
            <p className="mb-4">
              L'ensemble des éléments constituant le site Tabib Life (textes, images, logos, logiciels, etc.) sont la propriété exclusive de Tabib Life ou de ses partenaires.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 7 - Modification des CGU</h2>
            <p className="mb-4">
              Tabib Life se réserve le droit de modifier à tout moment les présentes conditions générales d'utilisation. Les utilisateurs seront informés des modifications par email ou lors de leur prochaine connexion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaBook className="mr-2 text-blue-600" />
              Article 8 - Droit applicable et juridiction compétente
            </h2>
            <p className="mb-4">
              Les présentes CGU sont régies par le droit marocain. En cas de litige, les tribunaux marocains seront seuls compétents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-600" />
              Contact
            </h2>
            <p className="mb-2">Pour toute question concernant les présentes conditions générales d'utilisation, vous pouvez nous contacter à :</p>
            <p className="font-medium">Email : contact@tabiblife.com</p>
            <p className="font-medium">Adresse : 123 Avenue des Médecins, Casablanca, Maroc</p>
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

export default TermsOfService;
