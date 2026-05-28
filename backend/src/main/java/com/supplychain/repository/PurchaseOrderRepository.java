package com.supplychain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supplychain.entity.PurchaseOrder;
import com.supplychain.entity.PurchaseOrder.POStatus;

import jakarta.transaction.Transactional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByStatus(POStatus status);
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    List<PurchaseOrder> findByPartId(Long partId);
    long countByStatus(POStatus status);
    
    @Transactional
    void deleteByPartId(Long partId); 
   
}