package com.springboot.store.repository;

import com.springboot.store.entity.StaffSaturdayBonus;
import com.springboot.store.entity.StaffSundayBonus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffSundayBonusRepository extends JpaRepository<StaffSundayBonus, Integer> {
}