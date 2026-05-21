package com.supplychain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supplychain.entity.Part;
import com.supplychain.entity.Supplier;
import com.supplychain.repository.PurchaseOrderRepository;
import com.supplychain.repository.SupplierRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    public Supplier addSupplier(Supplier supplier) {
        if (supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Email already exists: " + supplier.getEmail());
        }
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier updated) {
        Supplier existing = getSupplierById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setRating(updated.getRating());
        existing.setStatus(updated.getStatus());
        return supplierRepository.save(existing);
    }


    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Supplier not found"));
        
        // Step 1 - Parts ke purchase orders pehle delete karo
        for(Part part : supplier.getParts()) {
            purchaseOrderRepository.deleteByPartId(part.getId());
        }
        
        
        supplierRepository.deleteById(id);
    }

    public long getTotalSuppliers() {
        return supplierRepository.count();
    }
}