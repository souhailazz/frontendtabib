package com.medical.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "payment_id", unique = true, nullable = false)
    private String paymentId; // Stripe payment intent ID or external payment ID
    
    @Column(name = "consultation_id", nullable = false)
    private Long consultationId;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @Column(name = "amount", nullable = false)
    private Double amount;
    
    @Column(name = "currency", nullable = false)
    private String currency = "MAD";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "customer_email")
    private String customerEmail;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "mobile_money_provider")
    private String mobileMoneyProvider;
    
    @Column(name = "paypal_order_id")
    private String paypalOrderId;
    
    @Column(name = "refunded_amount")
    private Double refundedAmount = 0.0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "refund_status")
    private RefundStatus refundStatus = RefundStatus.NOT_REFUNDED;
    
    @Column(name = "refund_reason")
    private String refundReason;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "confirmation_sent")
    private Boolean confirmationSent = false;
    
    @Column(name = "confirmation_sent_at")
    private LocalDateTime confirmationSentAt;
    
    // Enums
    public enum PaymentMethod {
        CREDIT_CARD("Credit Card"),
        MOBILE_MONEY("Mobile Money"),
        PAYPAL("PayPal"),
        BANK_TRANSFER("Bank Transfer");
        
        private final String displayName;
        
        PaymentMethod(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum PaymentStatus {
        PENDING("Pending"),
        SUCCEEDED("Succeeded"),
        FAILED("Failed"),
        CANCELLED("Cancelled"),
        EXPIRED("Expired");
        
        private final String displayName;
        
        PaymentStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum RefundStatus {
        NOT_REFUNDED("Not Refunded"),
        PARTIALLY_REFUNDED("Partially Refunded"),
        FULLY_REFUNDED("Fully Refunded"),
        REFUND_PENDING("Refund Pending"),
        REFUND_FAILED("Refund Failed");
        
        private final String displayName;
        
        RefundStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Constructors
    public Payment() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Payment(String paymentId, Long consultationId, Long patientId, Long doctorId, 
                   Double amount, PaymentMethod paymentMethod) {
        this();
        this.paymentId = paymentId;
        this.consultationId = consultationId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = PaymentStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public Long getConsultationId() {
        return consultationId;
    }
    
    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }
    
    public Long getPatientId() {
        return patientId;
    }
    
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
    
    public Long getDoctorId() {
        return doctorId;
    }
    
    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getMobileMoneyProvider() {
        return mobileMoneyProvider;
    }
    
    public void setMobileMoneyProvider(String mobileMoneyProvider) {
        this.mobileMoneyProvider = mobileMoneyProvider;
    }
    
    public String getPaypalOrderId() {
        return paypalOrderId;
    }
    
    public void setPaypalOrderId(String paypalOrderId) {
        this.paypalOrderId = paypalOrderId;
    }
    
    public Double getRefundedAmount() {
        return refundedAmount;
    }
    
    public void setRefundedAmount(Double refundedAmount) {
        this.refundedAmount = refundedAmount;
    }
    
    public RefundStatus getRefundStatus() {
        return refundStatus;
    }
    
    public void setRefundStatus(RefundStatus refundStatus) {
        this.refundStatus = refundStatus;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getRefundReason() {
        return refundReason;
    }
    
    public void setRefundReason(String refundReason) {
        this.refundReason = refundReason;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getRefundedAt() {
        return refundedAt;
    }
    
    public void setRefundedAt(LocalDateTime refundedAt) {
        this.refundedAt = refundedAt;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public Boolean getConfirmationSent() {
        return confirmationSent;
    }
    
    public void setConfirmationSent(Boolean confirmationSent) {
        this.confirmationSent = confirmationSent;
        this.confirmationSentAt = LocalDateTime.now();
    }
    
    public LocalDateTime getConfirmationSentAt() {
        return confirmationSentAt;
    }
    
    public void setConfirmationSentAt(LocalDateTime confirmationSentAt) {
        this.confirmationSentAt = confirmationSentAt;
    }
    
    // Helper methods
    public Double getRemainingAmount() {
        return amount - refundedAmount;
    }
    
    public boolean isFullyRefunded() {
        return refundedAmount >= amount;
    }
    
    public boolean isPartiallyRefunded() {
        return refundedAmount > 0 && refundedAmount < amount;
    }
} 