package com.medical.app.controller;

import com.medical.app.dto.PaymentRequestDTO;
import com.medical.app.dto.PaymentResponseDTO;
import com.medical.app.model.Payment;
import com.medical.app.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a payment intent for credit card payments
     */
    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@Valid @RequestBody PaymentRequestDTO request) {
        PaymentResponseDTO response = paymentService.createPaymentIntent(request);
        
        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Confirm a payment (for credit card payments)
     */
    @PostMapping("/confirm-payment")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(@RequestParam String paymentIntentId) {
        PaymentResponseDTO response = paymentService.confirmPayment(paymentIntentId);
        
        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Process mobile money payment
     */
    @PostMapping("/mobile-money")
    public ResponseEntity<PaymentResponseDTO> processMobileMoneyPayment(@Valid @RequestBody PaymentRequestDTO request) {
        PaymentResponseDTO response = paymentService.processMobileMoneyPayment(request);
        
        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Process PayPal payment
     */
    @PostMapping("/paypal")
    public ResponseEntity<PaymentResponseDTO> processPayPalPayment(@Valid @RequestBody PaymentRequestDTO request) {
        PaymentResponseDTO response = paymentService.processPayPalPayment(request);
        
        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Process refund
     */
    @PostMapping("/refund")
    public ResponseEntity<PaymentResponseDTO> processRefund(
            @RequestParam String paymentId,
            @RequestParam(required = false) Double amount,
            @RequestParam(required = false) String reason) {
        
        PaymentResponseDTO response = paymentService.processRefund(paymentId, amount, reason);
        
        if ("failed".equals(response.getStatus())) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get payment by ID
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String paymentId) {
        Optional<Payment> payment = paymentService.getPaymentById(paymentId);
        
        if (payment.isPresent()) {
            return ResponseEntity.ok(payment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get payments by patient ID
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Payment>> getPaymentsByPatientId(@PathVariable Long patientId) {
        List<Payment> payments = paymentService.getPaymentsByPatientId(patientId);
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payments by doctor ID
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Payment>> getPaymentsByDoctorId(@PathVariable Long doctorId) {
        List<Payment> payments = paymentService.getPaymentsByDoctorId(doctorId);
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payment statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        Map<String, Object> statistics = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get available payment methods
     */
    @GetMapping("/methods")
    public ResponseEntity<Map<String, Object>> getAvailablePaymentMethods() {
        Map<String, Object> methods = Map.of(
            "credit_card", Map.of(
                "name", "Credit Card",
                "enabled", true,
                "currencies", List.of("MAD", "USD", "EUR")
            ),
            "mobile_money", Map.of(
                "name", "Mobile Money",
                "enabled", true,
                "providers", List.of("orange_money", "inwi_money", "barid_mob"),
                "currencies", List.of("MAD")
            ),
            "paypal", Map.of(
                "name", "PayPal",
                "enabled", true,
                "currencies", List.of("MAD", "USD", "EUR")
            )
        );
        
        return ResponseEntity.ok(methods);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "Payment service is running"));
    }
} 