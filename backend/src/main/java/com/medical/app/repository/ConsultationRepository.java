package com.medical.app.repository;

import com.medical.app.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByDocteurId(Long docteurId);
    List<Consultation> findByPatientId(Long patientId);

    @Query("SELECT c FROM Consultation c WHERE c.docteur.id = :doctorId " +
       "AND c.dateConsultation >= :startTime " +
       "AND c.dateConsultation < :endTime")
    List<Consultation> findConflictingConsultations(
        @Param("doctorId") Long doctorId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
}
