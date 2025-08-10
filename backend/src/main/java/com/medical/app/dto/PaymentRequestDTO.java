package com.medical.app.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PaymentRequestDTO {
    
    @NotNull(message = "Consultation ID is required")
    private Long consultationId;
    
    @NotNull(message = "Payment method is required")
    private String paymentMethod; // "card", "mobile_money", "paypal"
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    private String currency = "MAD";
    
    // For credit card payments
    private String paymentIntentId;
    
    // For mobile money payments
    private String phoneNumber;
    private String mobileMoneyProvider; // "orange_money", "inwi_money", "barid_mob"
    
    // For PayPal payments
    private String paypalOrderId;
    
    // Customer information
    private String customerEmail;
    private String customerName;
    
    // Constructor
    public PaymentRequestDTO() {}
    
    public PaymentRequestDTO(Long consultationId, String paymentMethod, Double amount) {
        this.consultationId = consultationId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
    }
    
    // Getters and Setters
    public Long getConsultationId() {
        return consultationId;
    }
    
    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
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
    
    public String getPaymentIntentId() {
        return paymentIntentId;
    }
    
    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
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
} 