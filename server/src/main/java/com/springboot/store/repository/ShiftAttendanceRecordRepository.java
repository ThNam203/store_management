package com.springboot.store.repository;

import com.springboot.store.entity.ShiftAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ShiftAttendanceRecordRepository extends JpaRepository<ShiftAttendanceRecord, Integer> {
    @Query("SELECT s FROM ShiftAttendanceRecord s WHERE s.staffId = :staffId AND YEAR(s.date) = YEAR(CURRENT_DATE) AND MONTH(s.date) = MONTH(CURRENT_DATE) AND s.store IS NOT NULL AND s.dailyShift IS NOT NULL")
    List<ShiftAttendanceRecord> findByStaffIdAndDateInThisMonth(@Param("staffId") int staffId);

    List<ShiftAttendanceRecord> findByStaffId(int staffId);

    @Query("SELECT s FROM ShiftAttendanceRecord s WHERE s.staffId = :staffId AND YEAR(s.date) = YEAR(CURRENT_DATE) AND MONTH(s.date) = MONTH(CURRENT_DATE) AND s.store IS NOT NULL AND s.dailyShift IS NOT NULL AND SIZE(s.bonusSalaryList) >0 AND SIZE(s.punishSalaryList)>0 ")
    List<ShiftAttendanceRecord> findByStaffIdAndDateInThisMonthAndBonusAndPunishNotNull(@Param("staffId") int staffId);

    @Query("SELECT s FROM ShiftAttendanceRecord s WHERE s.staffId = :staffId AND s.date BETWEEN :startDate AND :endDate AND s.store IS NOT NULL AND s.dailyShift IS NOT NULL")
    List<ShiftAttendanceRecord> findByStaffIdAndDateBetween(@Param("staffId") int staffId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
