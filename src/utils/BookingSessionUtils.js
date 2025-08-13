// utils/bookingSessionUtils.js
// Utility functions for managing booking session storage

export const BookingSessionUtils = {
    // Save booking data to sessionStorage
    saveBookingData: (bookingFormData) => {
      try {
        sessionStorage.setItem('bookingFormData', JSON.stringify(bookingFormData));
        sessionStorage.setItem('pendingBooking', 'true');
        sessionStorage.setItem('returnPath', bookingFormData.currentPath);
        
        console.log('💾 Saved booking data to session:', bookingFormData);
        return true;
      } catch (error) {
        console.error('❌ Error saving booking data:', error);
        return false;
      }
    },
  
    // Get saved booking data
    getSavedBookingData: () => {
      try {
        const savedData = sessionStorage.getItem('bookingFormData');
        const pendingBooking = sessionStorage.getItem('pendingBooking');
        const returnPath = sessionStorage.getItem('returnPath');
        
        if (!savedData || pendingBooking !== 'true') {
          return null;
        }
        
        return {
          bookingData: JSON.parse(savedData),
          returnPath: returnPath
        };
      } catch (error) {
        console.error('❌ Error parsing saved booking data:', error);
        return null;
      }
    },
  
    // Clear booking session data
    clearBookingSession: () => {
      try {
        sessionStorage.removeItem('bookingFormData');
        sessionStorage.removeItem('pendingBooking');
        sessionStorage.removeItem('returnPath');
        console.log('🧹 Cleared booking session data');
        return true;
      } catch (error) {
        console.error('❌ Error clearing booking session:', error);
        return false;
      }
    },
  
    // Check if there's a pending booking
    hasPendingBooking: () => {
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      const savedData = sessionStorage.getItem('bookingFormData');
      return pendingBooking === 'true' && !!savedData;
    },
  
    // Create booking data object
    createBookingDataObject: (doctor, formData, location) => {
      return {
        doctorId: doctor.id,
        doctorData: {
          id: doctor.id,
          nom: doctor.nom,
          prenom: doctor.prenom,
          specialite: doctor.specialite,
          city: doctor.city,
          hopital: doctor.hopital,
          telephone: doctor.telephone,
          rating: doctor.rating,
          nombreConsultations: doctor.nombreConsultations
        },
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        consultationType: formData.consultationType,
        currentPath: location.pathname + location.search,
        searchParams: Object.fromEntries(new URLSearchParams(location.search)),
        timestamp: new Date().toISOString()
      };
    },
  
    // Log booking session state for debugging
    logSessionState: () => {
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      const returnPath = sessionStorage.getItem('returnPath');
      const bookingFormData = sessionStorage.getItem('bookingFormData');
      
      console.log('📊 Booking Session State:', {
        pendingBooking,
        returnPath,
        hasBookingData: !!bookingFormData,
        bookingDataLength: bookingFormData?.length || 0
      });
      
      if (bookingFormData) {
        try {
          const parsed = JSON.parse(bookingFormData);
          console.log('📋 Booking Data Preview:', {
            doctorId: parsed.doctorId,
            doctorName: `${parsed.doctorData?.nom} ${parsed.doctorData?.prenom}`,
            date: parsed.date,
            time: parsed.time,
            consultationType: parsed.consultationType
          });
        } catch (error) {
          console.error('❌ Error parsing booking data for log:', error);
        }
      }
    }
  };