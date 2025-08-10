package com.medical.app.repository;

import com.medical.app.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // Find by payment ID (Stripe payment intent ID)
    Optional<Payment> findByPaymentId(String paymentId);
    
    // Find by consultation ID
    List<Payment> findByConsultationId(Long consultationId);
    
    // Find by patient ID
    List<Payment> findByPatientId(Long patientId);
    
    // Find by doctor ID
    List<Payment> findByDoctorId(Long doctorId);
    
    // Find by status
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    // Find by payment method
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
    
    // Find by refund status
    List<Payment> findByRefundStatus(Payment.RefundStatus refundStatus);
    
    // Find payments that need confirmation emails
    List<Payment> findByConfirmationSentFalseAndStatus(Payment.PaymentStatus status);
    
    // Find payments within date range
    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find payments by patient and status
    List<Payment> findByPatientIdAndStatus(Long patientId, Payment.PaymentStatus status);
    
    // Find payments by doctor and status
    List<Payment> findByDoctorIdAndStatus(Long doctorId, Payment.PaymentStatus status);
    
    // Find failed payments
    @Query("SELECT p FROM Payment p WHERE p.status = 'FAILED' AND p.errorMessage IS NOT NULL")
    List<Payment> findFailedPayments();
    
    // Find payments that need refund processing
    @Query("SELECT p FROM Payment p WHERE p.refundStatus = 'REFUND_PENDING'")
    List<Payment> findPendingRefunds();
    
    // Get total amount by status
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    Double getTotalAmountByStatus(@Param("status") Payment.PaymentStatus status);
    
    // Get total amount by doctor
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.doctorId = :doctorId AND p.status = 'SUCCEEDED'")
    Double getTotalAmountByDoctor(@Param("doctorId") Long doctorId);
    
    // Get total refunded amount by doctor
    @Query("SELECT SUM(p.refundedAmount) FROM Payment p WHERE p.doctorId = :doctorId")
    Double getTotalRefundedAmountByDoctor(@Param("doctorId") Long doctorId);
    
    // Find payments with pending confirmations
    @Query("SELECT p FROM Payment p WHERE p.confirmationSent = false AND p.status = 'SUCCEEDED'")
    List<Payment> findPaymentsNeedingConfirmation();
    
    // Find payments by transaction ID
    Optional<Payment> findByTransactionId(String transactionId);
    
    // Find payments by customer email
    List<Payment> findByCustomerEmail(String customerEmail);
    
    // Find payments by mobile money provider
    List<Payment> findByMobileMoneyProvider(String mobileMoneyProvider);
    
    // Find payments by PayPal order ID
    Optional<Payment> findByPaypalOrderId(String paypalOrderId);
    
    // Get payment statistics
    @Query("SELECT COUNT(p), SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCEEDED' AND p.createdAt >= :startDate")
    Object[] getPaymentStatistics(@Param("startDate") LocalDateTime startDate);
    
    // Find duplicate payments (same consultation, same amount, within short time)
    @Query("SELECT p FROM Payment p WHERE p.consultationId = :consultationId AND p.amount = :amount AND p.createdAt >= :startTime")
    List<Payment> findPotentialDuplicates(@Param("consultationId") Long consultationId, 
                                        @Param("amount") Double amount, 
                                        @Param("startTime") LocalDateTime startTime);
} 