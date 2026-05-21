package com.supplychain.repository;

import com.supplychain.entity.PurchaseOrder;
import com.supplychain.entity.PurchaseOrder.POStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByStatus(POStatus status);
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    List<PurchaseOrder> findByPartId(Long partId);
    long countByStatus(POStatus status);
    void deleteByPartId(Long partId); 
}