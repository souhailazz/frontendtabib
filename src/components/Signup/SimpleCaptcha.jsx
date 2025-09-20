import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Signup.css';

/**
 * Simple CAPTCHA component for bot protection
 * Generates a math problem for the user to solve
 */
export default function SimpleCaptcha({ onVerify, initialValue = '' }) {
  const { t } = useTranslation();
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+' });
  const [userInput, setUserInput] = useState(initialValue);
  const [isVerified, setIsVerified] = useState(false);

  // Generate a new CAPTCHA challenge
  const generateCaptcha = () => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    // For subtraction, ensure num1 >= num2 to avoid negative results
    if (operator === '-' && num1 < num2) {
      setCaptcha({ num1: num2, num2: num1, operator });
      return;
    }
    
    // For multiplication, use smaller numbers
    if (operator === '*') {
      setCaptcha({ 
        num1: Math.floor(Math.random() * 5) + 1, 
        num2: Math.floor(Math.random() * 5) + 1, 
        operator 
      });
      return;
    }
    
    setCaptcha({ num1, num2, operator });
  };

  // Calculate the correct answer
  const calculateAnswer = () => {
    const { num1, num2, operator } = captcha;
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      default: return 0;
    }
  };

  // Verify the user's input
  const verifyCaptcha = () => {
    const answer = calculateAnswer();
    const isCorrect = parseInt(userInput) === answer;
    setIsVerified(isCorrect);
    onVerify(isCorrect);
    return isCorrect;
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    // Clear verification status when user types
    if (isVerified) {
      setIsVerified(false);
      onVerify(false);
    }
  };

  // Handle key press (submit on Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyCaptcha();
    }
  };

  // Generate initial CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Regenerate CAPTCHA when verified
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        generateCaptcha();
        setUserInput('');
        setIsVerified(false);
      }, 300000); // Regenerate after 5 minutes
      
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  return (
    <div className="captcha-container">
      <div className="captcha-challenge">
        <span className="captcha-question">
          {captcha.num1} {captcha.operator} {captcha.num2} = ?
        </span>
        <button 
          type="button" 
          className="captcha-refresh"
          onClick={generateCaptcha}
          aria-label={t('captcha.refresh')}
        >
          ↻
        </button>
      </div>
      
      <div className="captcha-input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`form-input captcha-input ${isVerified ? 'verified' : ''}`}
          placeholder={t('captcha.placeholder')}
          aria-label={t('captcha.label')}
          required
        />
        <button 
          type="button" 
          className="captcha-verify-btn"
          onClick={verifyCaptcha}
        >
          {t('captcha.verify')}
        </button>
      </div>
      
      {isVerified && (
        <div className="captcha-success" role="alert">
          {t('captcha.success')}
        </div>
      )}
    </div>
  );
}