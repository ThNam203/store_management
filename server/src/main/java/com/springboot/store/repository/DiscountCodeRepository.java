package com.springboot.store.repository;

import com.springboot.store.entity.DiscountCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscountCodeRepository extends JpaRepository<DiscountCode, Integer> {
    Optional<DiscountCode> findByValueAndStoreId(String code, int storeId);
}
