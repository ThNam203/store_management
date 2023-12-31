package com.springboot.store.repository;

import com.springboot.store.entity.Invoice;
import jakarta.persistence.TemporalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Temporal;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByStoreId(Integer storeId);

    @Query("SELECT i " +
            "FROM Invoice i " +
            "WHERE i.store.id = :storeId AND i.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY i.createdAt ASC")
    List<Invoice> findByStoreIdAndCreatedAtBetween(
            @Param("storeId") Integer storeId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT i.staff.id, SUM(i.total) " +
            "FROM Invoice i " +
            "WHERE i.store.id = :storeId AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY i.staff.id")
    List<Object[]> findSalesReportOfStaff(
            @Param("storeId") Integer storeId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT i.customer.id, SUM(i.subTotal), SUM(i.discountValue), SUM(i.total) " +
            "FROM Invoice i " +
            "WHERE i.store.id = :storeId AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY i.customer.id")
    List<Object[]> findSalesReportOfCustomer(
            @Param("storeId") Integer storeId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT s FROM Invoice s WHERE s.store.id = :storeId AND DATE(s.createdAt) = :date")
    List<Invoice> findByStoreIdAndDate(@Param("storeId") Integer storeId, @Param("date") @Temporal(TemporalType.DATE) Date date);

    @Query("SELECT i FROM Invoice i WHERE i.store.id=:storeId AND i.createdAt BETWEEN :startDate AND :endDate")
    List<Invoice> findByCreatedAtBetween(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate, @Param("endDate") @Temporal(TemporalType.DATE) Date endDate, @Param("storeId") Integer storeId);
}
