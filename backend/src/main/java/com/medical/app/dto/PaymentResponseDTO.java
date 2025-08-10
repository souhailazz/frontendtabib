package com.medical.app.dto;

import java.time.LocalDateTime;

public class PaymentResponseDTO {
    
    private String paymentId;
    private String status; // "succeeded", "pending", "failed", "cancelled"
    private String paymentMethod;
    private Double amount;
    private String currency;
    private String transactionId;
    private LocalDateTime createdAt;
    private String customerEmail;
    private String customerName;
    private String consultationId;
    private String errorMessage;
    private String confirmationUrl;
    private String clientSecret;
    
    // Constructor
    public PaymentResponseDTO() {}
    
    public PaymentResponseDTO(String paymentId, String status, String paymentMethod, Double amount) {
        this.paymentId = paymentId;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.createdAt = LocalDateTime.now();
    }
    
    public PaymentResponseDTO(String paymentId, String status, String paymentMethod, Double amount, String clientSecret) {
        this.paymentId = paymentId;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.createdAt = LocalDateTime.now();
        this.clientSecret = clientSecret;
    }
    
    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
    
    public String getConsultationId() {
        return consultationId;
    }
    
    public void setConsultationId(String consultationId) {
        this.consultationId = consultationId;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public String getConfirmationUrl() {
        return confirmationUrl;
    }
    
    public void setConfirmationUrl(String confirmationUrl) {
        this.confirmationUrl = confirmationUrl;
    }

    public String getClientSecret() {
        return clientSecret;
    }
    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }
} 