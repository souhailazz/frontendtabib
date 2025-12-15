// API Service for Medical Chatbot

const API_BASE_URL = 'https://burnapi.tabib.life';

export const api = {
  // Send chat message
  async sendMessage(message, conversationId = null, userId = null, language = 'en') {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        user_id: userId,
        language: language,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  // Classify burn image
  async classifyBurn(imageFile, conversationId = null, userId = null, language = 'en') {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('language', language);
    
    if (conversationId) {
      formData.append('conversation_id', conversationId);
    }
    if (userId) {
      formData.append('user_id', userId);
    }
    
    const response = await fetch(`${API_BASE_URL}/api/classify-burn`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to classify image');
    }
    
    return response.json();
  },

  // Find nearby hospitals
  async findHospitals(latitude, longitude) {
    const response = await fetch(`${API_BASE_URL}/api/find-hospitals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to find hospitals');
    }
    
    return response.json();
  },

  // Find nearby pharmacies
  async findPharmacies(latitude, longitude) {
    const response = await fetch(`${API_BASE_URL}/api/find-pharmacies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to find pharmacies');
    }
    
    return response.json();
  },

  // Check API health
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },
};

export default api;
