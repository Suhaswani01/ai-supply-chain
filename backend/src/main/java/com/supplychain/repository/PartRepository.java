package com.supplychain.repository;

import com.supplychain.entity.Part;
import com.supplychain.entity.Part.StockStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartRepository extends JpaRepository<Part, Long> {
    List<Part> findByStockStatus(StockStatus status);
    List<Part> findBySupplierId(Long supplierId);
    boolean existsByPartCode(String partCode);
}