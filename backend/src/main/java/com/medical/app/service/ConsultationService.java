package com.medical.app.service;

import com.medical.app.dao.ConsultationDAO;
import com.medical.app.dao.DocteurDAO;
import com.medical.app.dao.PatientDAO;
import com.medical.app.dto.ConsultationDTO;
import com.medical.app.model.Consultation;
import com.medical.app.model.ConsultationEtat;
import com.medical.app.model.Docteur;
import com.medical.app.model.Ordonnance;
import com.medical.app.model.Patient;
import com.medical.app.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationDAO consultationDAO;

    @Autowired
    private DocteurDAO docteurDAO;

    @Autowired
    private PatientDAO patientDAO;

    @Autowired
    private OrdonnanceService ordonnanceService;

    @Autowired
    private ConsultationRepository consultationRepository;
    
 
public Consultation createConsultation(ConsultationDTO dto) {
    // Trouver les entités Docteur et Patient
    Docteur docteur = docteurDAO.findById(dto.getDocteurId().intValue());
    Patient patient = patientDAO.findById(dto.getPatientId().intValue());

    // Vérifier que les entités sont valides
    if (docteur == null || patient == null) {
        throw new IllegalArgumentException("Docteur ou patient introuvable.");
    }

    // Vérifier les consultations existantes du docteur
    LocalDateTime dateDemandee = dto.getDateConsultation();
    if (!isDoctorAvailable(dto.getDocteurId(), dateDemandee)) {
        throw new IllegalArgumentException("Ce médecin a déjà une consultation dans les 15 minutes.");
    }

    // Générer un lien de visioconférence Jitsi
    String roomName = "teleconsult-" + java.util.UUID.randomUUID();
    String jitsiLink = "https://meet.jit.si/" + roomName;

    // Créer la consultation
    Consultation consultation = new Consultation();
    consultation.setDocteur(docteur);
    consultation.setPatient(patient);
    consultation.setDateConsultation(dateDemandee);
    consultation.setReason(dto.getReason());
    consultation.setVideoCallLink(jitsiLink);

    // Set the new fields here:
    consultation.setConsultationType(dto.getConsultationType());
    consultation.setPrice(dto.getPrice());
    consultation.setTotalPrice(dto.getTotalPrice());

    Consultation savedConsultation = consultationDAO.save(consultation);

    // Créer l'ordonnance associée
    Ordonnance ordonnance = new Ordonnance();
    ordonnance.setDocteur(docteur);
    ordonnance.setPatient(patient);
    ordonnance.setContenu("Ordonnance initiale générée automatiquement.");
    ordonnance.setDateCreation(LocalDateTime.now());
    ordonnance.setCreatedAt(LocalDateTime.now());
    ordonnance.setConsultation(savedConsultation);

    // Sauvegarder l'ordonnance
    ordonnanceService.createOrdonnance(ordonnance);

    return savedConsultation;
}


    public List<Consultation> getAllConsultations() {
        return consultationDAO.findAll();
    }

    public void deleteConsultation(Long id) {
        consultationDAO.delete(id);
    }

    public List<Consultation> getConsultationsByDoctorId(Long doctorId) {
        return consultationDAO.findByDocteurId(doctorId);
    }

    public List<Consultation> getConsultationsByPatientId(Long patientId) {
        return consultationDAO.findByPatientId(patientId);
    }

    public Consultation updateConsultationStatus(Long consultationId, ConsultationEtat newStatus) {
        Consultation consultation = consultationDAO.findById(consultationId);
        if (consultation != null) {
            consultation.setEtat(newStatus);
            return consultationDAO.save(consultation);
        }
        return null;
    }

    public List<Consultation> getPendingConsultationsByDoctorId(Long doctorId) {
        List<Consultation> allConsultations = consultationDAO.findByDocteurId(doctorId);
        return allConsultations.stream()
                .filter(c -> c.getEtat() == ConsultationEtat.PENDING)
                .collect(Collectors.toList());
    }

    public boolean isDoctorAvailable(Long doctorId, LocalDateTime requestedDateTime) {
        LocalDateTime start = requestedDateTime.minusMinutes(14); // allows 15 min total
        LocalDateTime end = requestedDateTime.plusMinutes(15);
    
        List<Consultation> conflicts = consultationRepository.findConflictingConsultations(doctorId, start, end);
        return conflicts.isEmpty();
    }
    
    public org.springframework.http.ResponseEntity<List<String>> getAvailableTimeSlots(Long doctorId, String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalTime start = LocalTime.of(9, 0); // 09:00
        LocalTime end = LocalTime.of(17, 0); // 17:00
        int slotMinutes = 30;
        List<String> allSlots = new ArrayList<>();
        for (LocalTime time = start; time.isBefore(end); time = time.plusMinutes(slotMinutes)) {
            allSlots.add(time.format(DateTimeFormatter.ofPattern("HH:mm")));
        }
        List<Consultation> consultations = getConsultationsByDoctorId(doctorId);
        List<String> bookedSlots = new ArrayList<>();
        for (Consultation c : consultations) {
            if (c.getDateConsultation() != null && c.getDateConsultation().toLocalDate().equals(localDate)) {
                bookedSlots.add(c.getDateConsultation().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
            }
        }
        allSlots.removeAll(bookedSlots);
        return org.springframework.http.ResponseEntity.ok(allSlots);
    }
}
