package com.springboot.store.repository;

import com.springboot.store.entity.StaffPosition;
import com.springboot.store.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffPositionRepository extends JpaRepository<StaffPosition, Integer> {
    List<StaffPosition> findByStoreId(Integer storeId);

    void deleteByName(String name);

    Optional<StaffPosition> findByNameAndStoreId(String name, int storeId);

    boolean existsByNameAndStore(String name, Store store);
}
