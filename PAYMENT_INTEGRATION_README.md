# Payment Integration for Tabib.ma

This document explains the payment integration system implemented for the Tabib.ma medical consultation platform.

## 🚀 Features

- **Multiple Payment Methods**: Credit Card (Stripe), Mobile Money, PayPal
- **Secure Payment Processing**: End-to-end encryption and PCI compliance
- **Email Confirmations**: Automatic payment and refund confirmation emails
- **Refund Management**: Full and partial refund support
- **Payment Tracking**: Comprehensive payment history and analytics
- **Mobile Responsive**: Works seamlessly on all devices

## 📋 Prerequisites

### Backend Requirements
- Java 21+
- Spring Boot 3.2.5+
- Maven
- SQL Server Database
- SMTP email service (Gmail recommended for testing)

### Frontend Requirements
- Node.js 18+
- React 19+
- Stripe account (for credit card payments)

## 🔧 Setup Instructions

### 1. Stripe Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Update the backend configuration:

```properties
# backend/src/main/resources/application.properties
stripe.secret.key=sk_test_your_stripe_secret_key_here
stripe.publishable.key=pk_test_your_stripe_publishable_key_here
```

4. Update the frontend configuration:

```javascript
// frontend/src/components/PaymentModal/PaymentModal.jsx
const stripePromise = loadStripe("pk_test_your_stripe_publishable_key_here");
```

### 2. Email Configuration

Configure SMTP settings for payment confirmations:

```properties
# backend/src/main/resources/application.properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note**: For Gmail, you'll need to generate an "App Password" in your Google Account settings.

### 3. Database Setup

The payment system will automatically create the necessary tables. Ensure your database connection is properly configured.

### 4. Install Dependencies

#### Backend
```bash
cd backend
mvn clean install
```

#### Frontend
```bash
cd frontend
npm install
```

## 🏗️ Architecture

### Backend Components

1. **Payment Model** (`Payment.java`)
   - Stores payment information
   - Tracks payment status and refunds
   - Supports multiple payment methods

2. **Payment Service** (`PaymentService.java`)
   - Handles payment processing logic
   - Integrates with Stripe API
   - Manages email notifications
   - Processes refunds

3. **Payment Controller** (`PaymentController.java`)
   - REST API endpoints for payment operations
   - Handles payment requests and responses

4. **Payment Repository** (`PaymentRepository.java`)
   - Database operations for payments
   - Custom queries for analytics

### Frontend Components

1. **Payment Modal** (`PaymentModal.jsx`)
   - Main payment interface
   - Supports multiple payment methods
   - Real-time validation and error handling

2. **Payment Method Components**
   - Credit Card Form (Stripe integration)
   - Mobile Money Form
   - PayPal Form

## 🔌 API Endpoints

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-payment-intent` | Create Stripe payment intent |
| POST | `/api/payments/confirm-payment` | Confirm credit card payment |
| POST | `/api/payments/mobile-money` | Process mobile money payment |
| POST | `/api/payments/paypal` | Process PayPal payment |
| POST | `/api/payments/refund` | Process refund |
| GET | `/api/payments/{paymentId}` | Get payment details |
| GET | `/api/payments/patient/{patientId}` | Get patient payments |
| GET | `/api/payments/doctor/{doctorId}` | Get doctor payments |
| GET | `/api/payments/statistics` | Get payment statistics |
| GET | `/api/payments/methods` | Get available payment methods |

### Request/Response Examples

#### Create Payment Intent
```json
POST /api/payments/create-payment-intent
{
  "consultationId": 1,
  "paymentMethod": "credit_card",
  "amount": 320.0,
  "currency": "MAD",
  "customerEmail": "patient@example.com",
  "customerName": "John Doe"
}
```

#### Payment Response
```json
{
  "paymentId": "pi_1234567890",
  "status": "succeeded",
  "paymentMethod": "card",
  "amount": 320.0,
  "currency": "MAD",
  "transactionId": "ch_1234567890",
  "createdAt": "2024-01-15T10:30:00",
  "customerEmail": "patient@example.com",
  "customerName": "John Doe"
}
```

## 💳 Payment Methods

### 1. Credit Card (Stripe)
- **Supported Cards**: Visa, Mastercard, American Express
- **Security**: PCI DSS compliant
- **Processing**: Real-time authorization
- **Fees**: Stripe processing fees apply

### 2. Mobile Money
- **Providers**: Orange Money, Inwi Money, Barid Mob
- **Processing**: Simulated (requires provider integration)
- **Fees**: Provider-specific fees
- **Limits**: Provider-specific limits

### 3. PayPal
- **Processing**: Simulated (requires PayPal integration)
- **Security**: PayPal's security measures
- **Fees**: PayPal transaction fees
- **Global**: Available in most countries

## 🔄 Refund Process

### Automatic Refunds
- Failed payments are automatically refunded
- Partial refunds for cancelled consultations
- Full refunds for no-show scenarios

### Manual Refunds
```bash
POST /api/payments/refund
{
  "paymentId": "pi_1234567890",
  "amount": 320.0,
  "reason": "Patient cancelled consultation"
}
```

## 📧 Email Notifications

### Payment Confirmation
- Sent immediately after successful payment
- Includes payment details and transaction ID
- Contains consultation information

### Refund Confirmation
- Sent after refund processing
- Includes refund amount and reason
- Estimated refund timeline

## 🛡️ Security Features

1. **Data Encryption**
   - All sensitive data encrypted at rest
   - TLS encryption for data in transit
   - PCI DSS compliance for card data

2. **Authentication**
   - JWT token validation
   - Role-based access control
   - Session management

3. **Fraud Prevention**
   - Duplicate payment detection
   - Amount validation
   - Rate limiting

## 📊 Analytics & Reporting

### Payment Statistics
- Monthly payment volume
- Payment method distribution
- Success/failure rates
- Revenue analytics

### Doctor Analytics
- Individual doctor earnings
- Payment method preferences
- Consultation completion rates

## 🧪 Testing

### Test Cards (Stripe)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Test Environment
```bash
# Backend
mvn spring-boot:run

# Frontend
npm run dev
```

## 🚨 Error Handling

### Common Errors
1. **Payment Failed**: Insufficient funds, card declined
2. **Network Error**: Connection issues
3. **Validation Error**: Invalid payment data
4. **Server Error**: Backend processing issues

### Error Recovery
- Automatic retry for network errors
- User-friendly error messages
- Fallback payment methods
- Manual intervention for complex issues

## 🔧 Configuration Options

### Payment Limits
```properties
payment.max.amount=10000
payment.min.amount=50
payment.currency.default=MAD
```

### Email Templates
- Customizable email templates
- Multi-language support
- Branded messaging

### Mobile Money Providers
```properties
mobile.money.providers=orange_money,inwi_money,barid_mob
mobile.money.enabled=true
```

## 📱 Mobile Integration

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens

### Mobile Money Integration
- Native mobile money apps
- SMS confirmation
- USSD integration (future)

## 🔮 Future Enhancements

1. **Additional Payment Methods**
   - Bank transfers
   - Cryptocurrency payments
   - Buy now, pay later options

2. **Advanced Features**
   - Recurring payments
   - Payment plans
   - Insurance integration

3. **Analytics**
   - Real-time dashboards
   - Predictive analytics
   - Business intelligence

## 🆘 Support

### Troubleshooting
1. Check Stripe dashboard for payment status
2. Verify email configuration
3. Review server logs for errors
4. Test with Stripe test cards

### Contact
- Technical issues: [Your support email]
- Payment issues: [Your payment support email]
- Documentation: [Your documentation URL]

## 📄 License

This payment integration is part of the Tabib.ma platform and follows the same licensing terms.

---

**Note**: This is a comprehensive payment integration system. For production deployment, ensure all security measures are properly configured and tested. 