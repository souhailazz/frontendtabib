package com.medical.app.controller;

import com.medical.app.model.Patient;
import com.medical.app.model.Docteur;
import com.medical.app.model.Consultation;
import com.medical.app.model.Ordonnance;
import com.medical.app.model.Payment;
import com.medical.app.dto.ConsultationDTO;
import com.medical.app.service.PatientService;
import com.medical.app.service.DocteurService;
import com.medical.app.service.ConsultationService;
import com.medical.app.service.OrdonnanceService;
import com.medical.app.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private DocteurService docteurService;

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private OrdonnanceService ordonnanceService;

    @Autowired
    private PaymentService paymentService;

    // Dashboard Statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        try {
            List<Patient> patients = patientService.getAllPatients();
            List<Docteur> doctors = docteurService.getAllDocteurs();
            List<Consultation> consultations = consultationService.getAllConsultations();
            List<Ordonnance> ordonnances = ordonnanceService.getAllOrdonnances();
            List<Payment> payments = paymentService.getAllPayments();

            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalPatients", patients.size());
            statistics.put("totalDoctors", doctors.size());
            statistics.put("totalConsultations", consultations.size());
            statistics.put("totalPrescriptions", ordonnances.size());
            statistics.put("totalPayments", payments.size());
            
            // Calculate consultation status distribution
            long completedConsultations = consultations.stream()
                .filter(c -> "COMPLETED".equals(c.getEtat().name()))
                .count();
            long pendingConsultations = consultations.stream()
                .filter(c -> "PENDING".equals(c.getEtat().name()))
                .count();
            long acceptedConsultations = consultations.stream()
                .filter(c -> "ACCEPTED".equals(c.getEtat().name()))
                .count();
            long cancelledConsultations = consultations.stream()
                .filter(c -> "CANCELLED".equals(c.getEtat().name()))
                .count();

            statistics.put("completedConsultations", completedConsultations);
            statistics.put("pendingConsultations", pendingConsultations);
            statistics.put("acceptedConsultations", acceptedConsultations);
            statistics.put("cancelledConsultations", cancelledConsultations);

            // Calculate revenue from payments
            double totalRevenue = payments.stream()
                .filter(p -> Payment.PaymentStatus.SUCCEEDED.equals(p.getStatus()))
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
            statistics.put("totalRevenue", totalRevenue);

            // Calculate revenue from consultations (fallback)
            double consultationRevenue = consultations.stream()
                .filter(c -> "COMPLETED".equals(c.getEtat().name()))
                .mapToDouble(c -> c.getPrice() != null ? c.getPrice().doubleValue() : 0.0)
                .sum();
            statistics.put("consultationRevenue", consultationRevenue);

            // Payment statistics
            long successfulPayments = payments.stream()
                .filter(p -> Payment.PaymentStatus.SUCCEEDED.equals(p.getStatus()))
                .count();
            long failedPayments = payments.stream()
                .filter(p -> Payment.PaymentStatus.FAILED.equals(p.getStatus()))
                .count();
            long pendingPayments = payments.stream()
                .filter(p -> Payment.PaymentStatus.PENDING.equals(p.getStatus()))
                .count();

            statistics.put("successfulPayments", successfulPayments);
            statistics.put("failedPayments", failedPayments);
            statistics.put("pendingPayments", pendingPayments);

            // Payment method distribution
            Map<String, Long> paymentMethodStats = payments.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    p -> p.getPaymentMethod().getDisplayName(),
                    java.util.stream.Collectors.counting()
                ));
            statistics.put("paymentMethodStats", paymentMethodStats);

            // Recent activity
            List<Consultation> recentConsultations = consultations.stream()
                .sorted((c1, c2) -> c2.getDateConsultation().compareTo(c1.getDateConsultation()))
                .limit(5)
                .toList();
            statistics.put("recentConsultations", recentConsultations);

            // Recent payments
            List<Payment> recentPayments = payments.stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(5)
                .toList();
            statistics.put("recentPayments", recentPayments);

            // Top doctors by consultation count
            Map<Docteur, Long> doctorConsultationCounts = consultations.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    Consultation::getDocteur,
                    java.util.stream.Collectors.counting()
                ));
            
            List<Map<String, Object>> topDoctors = doctorConsultationCounts.entrySet().stream()
                .sorted(Map.Entry.<Docteur, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> doctorStats = new HashMap<>();
                    doctorStats.put("doctor", entry.getKey());
                    doctorStats.put("consultationCount", entry.getValue());
                    
                    // Calculate doctor revenue from payments
                    double doctorRevenue = payments.stream()
                        .filter(p -> p.getDoctorId().equals(entry.getKey().getId()))
                        .filter(p -> Payment.PaymentStatus.SUCCEEDED.equals(p.getStatus()))
                        .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                        .sum();
                    doctorStats.put("revenue", doctorRevenue);
                    
                    return doctorStats;
                })
                .toList();
            statistics.put("topDoctors", topDoctors);

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch statistics: " + e.getMessage()));
        }
    }

    // Patient Management
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        try {
            List<Patient> patients = patientService.getAllPatients();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        try {
            Patient savedPatient = patientService.savePatient(patient);
            return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Integer id, @RequestBody Patient patient) {
        try {
            Patient updatedPatient = patientService.updatePatient(id, patient);
            if (updatedPatient != null) {
                return ResponseEntity.ok(updatedPatient);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Integer id) {
        try {
            Patient patient = patientService.getPatientById(id);
            if (patient != null) {
                patientService.deletePatient(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Doctor Management
    @GetMapping("/doctors")
    public ResponseEntity<List<Docteur>> getAllDoctors() {
        try {
            List<Docteur> doctors = docteurService.getAllDocteurs();
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/doctors")
    public ResponseEntity<Docteur> createDoctor(@RequestBody Docteur docteur) {
        try {
            Docteur savedDoctor = docteurService.saveDocteur(docteur);
            return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<Docteur> updateDoctor(@PathVariable Integer id, @RequestBody Docteur docteur) {
        try {
            Docteur updatedDoctor = docteurService.updateDocteur(id, docteur);
            if (updatedDoctor != null) {
                return ResponseEntity.ok(updatedDoctor);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Integer id) {
        try {
            Docteur doctor = docteurService.getDocteurById(id);
            if (doctor != null) {
                docteurService.deleteDocteur(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Consultation Management
    @GetMapping("/consultations")
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        try {
            List<Consultation> consultations = consultationService.getAllConsultations();
            return ResponseEntity.ok(consultations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/consultations")
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) {
        try {
            // For admin creation, we'll use the existing createConsultation method
            // but we need to create a DTO first
            ConsultationDTO dto = new ConsultationDTO();
            dto.setDocteurId(Long.valueOf(consultation.getDocteur().getId()));
            dto.setPatientId(Long.valueOf(consultation.getPatient().getId()));
            dto.setDateConsultation(consultation.getDateConsultation());
            dto.setReason(consultation.getReason());
            dto.setConsultationType(consultation.getConsultationType());
            dto.setPrice(consultation.getPrice());
            dto.setTotalPrice(consultation.getTotalPrice());
            
            Consultation savedConsultation = consultationService.createConsultation(dto);
            return new ResponseEntity<>(savedConsultation, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/consultations/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id, @RequestBody Consultation consultation) {
        try {
            consultation.setId(id);
            // For now, we'll just update the status
            Consultation updatedConsultation = consultationService.updateConsultationStatus(id, consultation.getEtat());
            if (updatedConsultation != null) {
                return ResponseEntity.ok(updatedConsultation);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/consultations/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        try {
            consultationService.deleteConsultation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Prescription Management
    @GetMapping("/prescriptions")
    public ResponseEntity<List<Ordonnance>> getAllPrescriptions() {
        try {
            List<Ordonnance> prescriptions = ordonnanceService.getAllOrdonnances();
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<Ordonnance> createPrescription(@RequestBody Ordonnance ordonnance) {
        try {
            Ordonnance savedPrescription = ordonnanceService.createOrdonnance(ordonnance);
            return new ResponseEntity<>(savedPrescription, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/prescriptions/{id}")
    public ResponseEntity<Ordonnance> updatePrescription(@PathVariable Long id, @RequestBody Ordonnance ordonnance) {
        try {
            Ordonnance updatedPrescription = ordonnanceService.updateOrdonnance(id, ordonnance);
            if (updatedPrescription != null) {
                return ResponseEntity.ok(updatedPrescription);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/prescriptions/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        try {
            boolean deleted = ordonnanceService.deleteOrdonnance(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Payment Management
    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String paymentId) {
        try {
            Optional<Payment> payment = paymentService.getPaymentById(paymentId);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/payments")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        try {
            Payment savedPayment = paymentService.createPaymentFromAdmin(payment);
            return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/payments/{paymentId}")
    public ResponseEntity<Payment> updatePayment(@PathVariable String paymentId, @RequestBody Payment payment) {
        try {
            Payment updatedPayment = paymentService.updatePaymentFromAdmin(paymentId, payment);
            if (updatedPayment != null) {
                return ResponseEntity.ok(updatedPayment);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/payments/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable String paymentId) {
        try {
            boolean deleted = paymentService.deletePaymentFromAdmin(paymentId);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/payments/consultation/{consultationId}")
    public ResponseEntity<List<Payment>> getPaymentsByConsultation(@PathVariable Long consultationId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByConsultationId(consultationId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/payments/patient/{patientId}")
    public ResponseEntity<List<Payment>> getPaymentsByPatient(@PathVariable Long patientId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByPatientId(patientId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/payments/doctor/{doctorId}")
    public ResponseEntity<List<Payment>> getPaymentsByDoctor(@PathVariable Long doctorId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByDoctorId(doctorId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/payments/{paymentId}/refund")
    public ResponseEntity<Map<String, Object>> processRefund(
            @PathVariable String paymentId,
            @RequestParam(required = false) Double amount,
            @RequestParam(required = false) String reason) {
        try {
            var response = paymentService.processRefund(paymentId, amount, reason);
            if ("failed".equals(response.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", response.getErrorMessage()));
            }
            return ResponseEntity.ok(Map.of("message", "Refund processed successfully", "data", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to process refund: " + e.getMessage()));
        }
    }

    // Analytics and Reports
    @GetMapping("/analytics/doctors")
    public ResponseEntity<List<Map<String, Object>>> getDoctorAnalytics() {
        try {
            List<Docteur> doctors = docteurService.getAllDocteurs();
            List<Consultation> consultations = consultationService.getAllConsultations();
            List<Payment> payments = paymentService.getAllPayments();
            
            List<Map<String, Object>> doctorAnalytics = doctors.stream()
                .map(doctor -> {
                    Map<String, Object> analytics = new HashMap<>();
                    analytics.put("doctor", doctor);
                    
                    long totalConsultations = consultations.stream()
                        .filter(c -> doctor.getId() == c.getDocteur().getId())
                        .count();
                    analytics.put("totalConsultations", totalConsultations);
                    
                    long completedConsultations = consultations.stream()
                        .filter(c -> doctor.getId() == c.getDocteur().getId())
                        .filter(c -> "COMPLETED".equals(c.getEtat().name()))
                        .count();
                    analytics.put("completedConsultations", completedConsultations);
                    
                    // Revenue from payments
                    double totalRevenue = payments.stream()
                        .filter(p -> p.getDoctorId().equals(doctor.getId()))
                        .filter(p -> Payment.PaymentStatus.SUCCEEDED.equals(p.getStatus()))
                        .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                        .sum();
                    analytics.put("totalRevenue", totalRevenue);
                    
                    // Revenue from consultations (fallback)
                    double consultationRevenue = consultations.stream()
                        .filter(c -> doctor.getId() == c.getDocteur().getId())
                        .filter(c -> "COMPLETED".equals(c.getEtat().name()))
                        .mapToDouble(c -> c.getPrice() != null ? c.getPrice().doubleValue() : 0.0)
                        .sum();
                    analytics.put("consultationRevenue", consultationRevenue);
                    
                    double completionRate = totalConsultations > 0 ? 
                        (double) completedConsultations / totalConsultations * 100 : 0;
                    analytics.put("completionRate", completionRate);
                    
                    return analytics;
                })
                .sorted((a, b) -> Long.compare(
                    (Long) b.get("totalConsultations"), 
                    (Long) a.get("totalConsultations")
                ))
                .toList();
            
            return ResponseEntity.ok(doctorAnalytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/analytics/payments")
    public ResponseEntity<Map<String, Object>> getPaymentAnalytics() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            
            Map<String, Object> analytics = new HashMap<>();
            
            // Payment status distribution
            Map<String, Long> statusDistribution = payments.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    p -> p.getStatus().getDisplayName(),
                    java.util.stream.Collectors.counting()
                ));
            analytics.put("statusDistribution", statusDistribution);
            
            // Payment method distribution
            Map<String, Long> methodDistribution = payments.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    p -> p.getPaymentMethod().getDisplayName(),
                    java.util.stream.Collectors.counting()
                ));
            analytics.put("methodDistribution", methodDistribution);
            
            // Total revenue by status
            Map<String, Double> revenueByStatus = payments.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    p -> p.getStatus().getDisplayName(),
                    java.util.stream.Collectors.summingDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                ));
            analytics.put("revenueByStatus", revenueByStatus);
            
            // Total refunded amount
            double totalRefunded = payments.stream()
                .mapToDouble(p -> p.getRefundedAmount() != null ? p.getRefundedAmount() : 0.0)
                .sum();
            analytics.put("totalRefunded", totalRefunded);
            
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
