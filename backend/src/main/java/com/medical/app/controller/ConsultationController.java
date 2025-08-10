package com.medical.app.controller;

import com.medical.app.dto.ConsultationDTO;
import com.medical.app.model.Consultation;
import com.medical.app.model.ConsultationEtat;
import com.medical.app.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@RequestBody ConsultationDTO consultationDTO) {
        Consultation savedConsultation = consultationService.createConsultation(consultationDTO);
        return ResponseEntity.ok(savedConsultation);
    }

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationService.getAllConsultations();
    }

    @DeleteMapping("/{id}")
    public void deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Consultation> getConsultationsByDoctorId(@PathVariable Long doctorId) {
        return consultationService.getConsultationsByDoctorId(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Consultation> getConsultationsByPatientId(@PathVariable Long patientId) {
        return consultationService.getConsultationsByPatientId(patientId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Consultation> updateConsultationStatus(
            @PathVariable Long id,
            @RequestParam ConsultationEtat status) {
        Consultation updatedConsultation = consultationService.updateConsultationStatus(id, status);
        if (updatedConsultation != null) {
            return ResponseEntity.ok(updatedConsultation);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/doctor/{doctorId}/pending")
    public ResponseEntity<List<Consultation>> getPendingConsultationsByDoctorId(@PathVariable Long doctorId) {
        List<Consultation> pendingConsultations = consultationService.getPendingConsultationsByDoctorId(doctorId);
        return ResponseEntity.ok(pendingConsultations);
    }

    @GetMapping("/doctor/{doctorId}/available-slots")
    public ResponseEntity<List<String>> getAvailableTimeSlots(
            @PathVariable Long doctorId,
            @RequestParam String date) {

        // Logic for generating slots and filtering booked ones (same as before)
        return consultationService.getAvailableTimeSlots(doctorId, date);
    }
}
