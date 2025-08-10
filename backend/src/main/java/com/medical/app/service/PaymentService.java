package com.medical.app.service;

import com.medical.app.dto.PaymentRequestDTO;
import com.medical.app.dto.PaymentResponseDTO;
import com.medical.app.model.Consultation;
import com.medical.app.model.Payment;
import com.medical.app.repository.ConsultationRepository;
import com.medical.app.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import com.medical.app.util.EmailTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {



    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base.url}")
    private String appBaseUrl;

    // Initialize Stripe
    public void initializeStripe() {
        Stripe.apiKey = stripeSecretKey;
    }

    /**
     * Create a payment intent for credit card payments
     */
    public PaymentResponseDTO createPaymentIntent(PaymentRequestDTO request) {
        try {
            initializeStripe();

            // Validate consultation exists
            Optional<Consultation> consultationOpt = consultationRepository.findById(request.getConsultationId());
            if (consultationOpt.isEmpty()) {
                return createErrorResponse("Consultation not found");
            }

            Consultation consultation = consultationOpt.get();

            // Create Stripe Payment Intent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (request.getAmount() * 100)) // Convert to cents
                    .setCurrency(request.getCurrency().toLowerCase())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Save payment record
            Payment payment = new Payment(
                    paymentIntent.getId(),
                    consultation.getId(),
                    (long) consultation.getPatient().getId(),
                    (long) consultation.getDocteur().getId(),
                    request.getAmount(),
                    Payment.PaymentMethod.CREDIT_CARD
            );
            payment.setCustomerEmail(request.getCustomerEmail());
            payment.setCustomerName(request.getCustomerName());
            payment.setStatus(Payment.PaymentStatus.PENDING);
            paymentRepository.save(payment);

            return new PaymentResponseDTO(
                    paymentIntent.getId(),
                    paymentIntent.getStatus(),
                    "card",
                    request.getAmount(),
                    paymentIntent.getClientSecret()
            );

        } catch (StripeException e) {
            return createErrorResponse("Payment intent creation failed: " + e.getMessage());
        } catch (Exception e) {
            return createErrorResponse("Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Confirm a payment (for credit card payments)
     */
    @Transactional
    public PaymentResponseDTO confirmPayment(String paymentIntentId) {
        try {
            initializeStripe();

            // Find payment record
            Optional<Payment> paymentOpt = paymentRepository.findByPaymentId(paymentIntentId);
            if (paymentOpt.isEmpty()) {
                return createErrorResponse("Payment not found");
            }

            Payment payment = paymentOpt.get();

            // Retrieve payment intent from Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Update payment status
                payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
                payment.setTransactionId(paymentIntent.getLatestCharge());
                paymentRepository.save(payment);

                // Update consultation status
                updateConsultationStatus(payment.getConsultationId(), "CONFIRMED");

                // Send confirmation email
                sendPaymentConfirmationEmail(payment);

                return new PaymentResponseDTO(
                        paymentIntentId,
                        "succeeded",
                        payment.getPaymentMethod().name().toLowerCase(),
                        payment.getAmount()
                );
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setErrorMessage("Payment failed: " + paymentIntent.getStatus());
                paymentRepository.save(payment);

                return createErrorResponse("Payment failed: " + paymentIntent.getStatus());
            }

        } catch (StripeException e) {
            return createErrorResponse("Payment confirmation failed: " + e.getMessage());
        }
    }

    /**
     * Process mobile money payment
     */
    @Transactional
    public PaymentResponseDTO processMobileMoneyPayment(PaymentRequestDTO request) {
        try {
            // Validate consultation exists
            Optional<Consultation> consultationOpt = consultationRepository.findById(request.getConsultationId());
            if (consultationOpt.isEmpty()) {
                return createErrorResponse("Consultation not found");
            }

            Consultation consultation = consultationOpt.get();

            // Generate unique payment ID
            String paymentId = "MM_" + UUID.randomUUID().toString().replace("-", "");

            // Create payment record
            Payment payment = new Payment(
                    paymentId,
                    consultation.getId(),
                    (long) consultation.getPatient().getId(),
                    (long) consultation.getDocteur().getId(),
                    request.getAmount(),
                    Payment.PaymentMethod.MOBILE_MONEY
            );
            payment.setCustomerEmail(request.getCustomerEmail());
            payment.setCustomerName(request.getCustomerName());
            payment.setPhoneNumber(request.getPhoneNumber());
            payment.setMobileMoneyProvider(request.getMobileMoneyProvider());
            payment.setStatus(Payment.PaymentStatus.PENDING);
            paymentRepository.save(payment);

            // Simulate mobile money payment processing
            // In a real implementation, you would integrate with mobile money providers
            boolean paymentSuccess = simulateMobileMoneyPayment(request);

            if (paymentSuccess) {
                payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
                payment.setTransactionId("MM_TXN_" + UUID.randomUUID().toString().substring(0, 8));
                paymentRepository.save(payment);

                // Update consultation status
                updateConsultationStatus(payment.getConsultationId(), "CONFIRMED");

                // Send confirmation email
                sendPaymentConfirmationEmail(payment);

                return new PaymentResponseDTO(
                        paymentId,
                        "succeeded",
                        "mobile_money",
                        request.getAmount()
                );
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setErrorMessage("Mobile money payment failed");
                paymentRepository.save(payment);

                return createErrorResponse("Mobile money payment failed");
            }

        } catch (Exception e) {
            return createErrorResponse("Mobile money payment error: " + e.getMessage());
        }
    }

    /**
     * Process PayPal payment
     */
    @Transactional
    public PaymentResponseDTO processPayPalPayment(PaymentRequestDTO request) {
        try {
            // Validate consultation exists
            Optional<Consultation> consultationOpt = consultationRepository.findById(request.getConsultationId());
            if (consultationOpt.isEmpty()) {
                return createErrorResponse("Consultation not found");
            }

            Consultation consultation = consultationOpt.get();

            // Generate unique payment ID
            String paymentId = "PP_" + UUID.randomUUID().toString().replace("-", "");

            // Create payment record
            Payment payment = new Payment(
                    paymentId,
                    consultation.getId(),
                    (long) consultation.getPatient().getId(),
                    (long) consultation.getDocteur().getId(),
                    request.getAmount(),
                    Payment.PaymentMethod.PAYPAL
            );
            payment.setCustomerEmail(request.getCustomerEmail());
            payment.setCustomerName(request.getCustomerName());
            payment.setPaypalOrderId(request.getPaypalOrderId());
            payment.setStatus(Payment.PaymentStatus.PENDING);
            paymentRepository.save(payment);

            // Simulate PayPal payment processing
            // In a real implementation, you would integrate with PayPal API
            boolean paymentSuccess = simulatePayPalPayment(request);

            if (paymentSuccess) {
                payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
                payment.setTransactionId("PP_TXN_" + UUID.randomUUID().toString().substring(0, 8));
                paymentRepository.save(payment);

                // Update consultation status
                updateConsultationStatus(payment.getConsultationId(), "CONFIRMED");

                // Send confirmation email
                sendPaymentConfirmationEmail(payment);

                return new PaymentResponseDTO(
                        paymentId,
                        "succeeded",
                        "paypal",
                        request.getAmount()
                );
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setErrorMessage("PayPal payment failed");
                paymentRepository.save(payment);

                return createErrorResponse("PayPal payment failed");
            }

        } catch (Exception e) {
            return createErrorResponse("PayPal payment error: " + e.getMessage());
        }
    }

    /**
     * Process refund
     */
    @Transactional
    public PaymentResponseDTO processRefund(String paymentId, Double amount, String reason) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByPaymentId(paymentId);
            if (paymentOpt.isEmpty()) {
                return createErrorResponse("Payment not found");
            }

            Payment payment = paymentOpt.get();

            if (payment.getStatus() != Payment.PaymentStatus.SUCCEEDED) {
                return createErrorResponse("Payment is not in succeeded status");
            }

            if (payment.isFullyRefunded()) {
                return createErrorResponse("Payment is already fully refunded");
            }

            Double refundAmount = amount != null ? amount : payment.getRemainingAmount();
            if (refundAmount > payment.getRemainingAmount()) {
                return createErrorResponse("Refund amount exceeds remaining amount");
            }

            // Process refund based on payment method
            boolean refundSuccess = false;
            if (payment.getPaymentMethod() == Payment.PaymentMethod.CREDIT_CARD) {
                refundSuccess = processStripeRefund(payment, refundAmount);
            } else {
                // For mobile money and PayPal, simulate refund
                refundSuccess = simulateRefund(payment, refundAmount);
            }

            if (refundSuccess) {
                // Update payment record
                payment.setRefundedAmount(payment.getRefundedAmount() + refundAmount);
                payment.setRefundReason(reason);
                payment.setRefundedAt(LocalDateTime.now());

                if (payment.isFullyRefunded()) {
                    payment.setRefundStatus(Payment.RefundStatus.FULLY_REFUNDED);
                    // Update consultation status
                    updateConsultationStatus(payment.getConsultationId(), "CANCELLED");
                } else {
                    payment.setRefundStatus(Payment.RefundStatus.PARTIALLY_REFUNDED);
                }

                paymentRepository.save(payment);

                // Send refund confirmation email
                sendRefundConfirmationEmail(payment, refundAmount);

                return new PaymentResponseDTO(
                        paymentId,
                        "refunded",
                        payment.getPaymentMethod().name().toLowerCase(),
                        refundAmount
                );
            } else {
                payment.setRefundStatus(Payment.RefundStatus.REFUND_FAILED);
                paymentRepository.save(payment);
                return createErrorResponse("Refund processing failed");
            }

        } catch (Exception e) {
            return createErrorResponse("Refund error: " + e.getMessage());
        }
    }

    /**
     * Get payment by ID
     */
    public Optional<Payment> getPaymentById(String paymentId) {
        return paymentRepository.findByPaymentId(paymentId);
    }

    /**
     * Get payments by patient ID
     */
    public List<Payment> getPaymentsByPatientId(Long patientId) {
        return paymentRepository.findByPatientId(patientId);
    }

    /**
     * Get payments by doctor ID
     */
    public List<Payment> getPaymentsByDoctorId(Long doctorId) {
        return paymentRepository.findByDoctorId(doctorId);
    }

    /**
     * Get payment statistics
     */
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Object[] monthlyStats = paymentRepository.getPaymentStatistics(startOfMonth);
        
        if (monthlyStats != null && monthlyStats.length >= 2) {
            stats.put("monthlyCount", monthlyStats[0]);
            stats.put("monthlyAmount", monthlyStats[1]);
        }
        
        return stats;
    }

    /**
     * Get all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Create payment from admin panel
     */
    @Transactional
    public Payment createPaymentFromAdmin(Payment payment) {
        payment.setCreatedAt(java.time.LocalDateTime.now());
        payment.setUpdatedAt(java.time.LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    /**
     * Update payment from admin panel
     */
    @Transactional
    public Payment updatePaymentFromAdmin(String paymentId, Payment paymentDetails) {
        Optional<Payment> paymentOpt = paymentRepository.findByPaymentId(paymentId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            
            // Update fields
            if (paymentDetails.getAmount() != null) {
                payment.setAmount(paymentDetails.getAmount());
            }
            if (paymentDetails.getStatus() != null) {
                payment.setStatus(paymentDetails.getStatus());
            }
            if (paymentDetails.getPaymentMethod() != null) {
                payment.setPaymentMethod(paymentDetails.getPaymentMethod());
            }
            if (paymentDetails.getCustomerEmail() != null) {
                payment.setCustomerEmail(paymentDetails.getCustomerEmail());
            }
            if (paymentDetails.getCustomerName() != null) {
                payment.setCustomerName(paymentDetails.getCustomerName());
            }
            if (paymentDetails.getPhoneNumber() != null) {
                payment.setPhoneNumber(paymentDetails.getPhoneNumber());
            }
            if (paymentDetails.getErrorMessage() != null) {
                payment.setErrorMessage(paymentDetails.getErrorMessage());
            }
            
            payment.setUpdatedAt(java.time.LocalDateTime.now());
            return paymentRepository.save(payment);
        }
        return null;
    }

    /**
     * Delete payment from admin panel
     */
    @Transactional
    public boolean deletePaymentFromAdmin(String paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findByPaymentId(paymentId);
        if (paymentOpt.isPresent()) {
            paymentRepository.delete(paymentOpt.get());
            return true;
        }
        return false;
    }

    /**
     * Get payments by consultation ID
     */
    public List<Payment> getPaymentsByConsultationId(Long consultationId) {
        return paymentRepository.findByConsultationId(consultationId);
    }

    // Helper methods

    private PaymentResponseDTO createErrorResponse(String errorMessage) {
        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setStatus("failed");
        response.setErrorMessage(errorMessage);
        return response;
    }

    private void updateConsultationStatus(Long consultationId, String status) {
        Optional<Consultation> consultationOpt = consultationRepository.findById(consultationId);
        if (consultationOpt.isPresent()) {
            Consultation consultation = consultationOpt.get();
            // Update consultation status based on your ConsultationEtat enum
            // consultation.setEtat(ConsultationEtat.valueOf(status));
            consultationRepository.save(consultation);
        }
    }

    private boolean processStripeRefund(Payment payment, Double amount) {
        try {
            initializeStripe();
            
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(payment.getPaymentId())
                    .setAmount((long) (amount * 100)) // Convert to cents
                    .build();

            Refund refund = Refund.create(params);
            return "succeeded".equals(refund.getStatus());
        } catch (StripeException e) {
            return false;
        }
    }

    private boolean simulateMobileMoneyPayment(PaymentRequestDTO request) {
        // Simulate mobile money payment processing
        // In real implementation, integrate with mobile money providers
        return Math.random() > 0.1; // 90% success rate for simulation
    }

    private boolean simulatePayPalPayment(PaymentRequestDTO request) {
        // Simulate PayPal payment processing
        // In real implementation, integrate with PayPal API
        return Math.random() > 0.05; // 95% success rate for simulation
    }

    private boolean simulateRefund(Payment payment, Double amount) {
        // Simulate refund processing
        return Math.random() > 0.05; // 95% success rate for simulation
    }

        private void sendPaymentConfirmationEmail(Payment payment) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(payment.getCustomerEmail());
            helper.setSubject(" Payment Confirmation - Tabib.life");
            
            String htmlContent = EmailTemplate.getPaymentConfirmationTemplate(payment, appBaseUrl);
            helper.setText(htmlContent, true);
            
            emailSender.send(message);
            
            payment.setConfirmationSent(true);
            paymentRepository.save(payment);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send payment confirmation email: " + e.getMessage());
        }
    }

    private void sendRefundConfirmationEmail(Payment payment, Double refundAmount) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(payment.getCustomerEmail());
            helper.setSubject("💰 Refund Confirmation - Tabib.life");
            
            String htmlContent = EmailTemplate.getRefundConfirmationTemplate(payment, refundAmount);
            helper.setText(htmlContent, true);
            
            emailSender.send(message);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send refund confirmation email: " + e.getMessage());
        }
    }
} 