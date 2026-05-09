package com.supplychain.service;

import com.supplychain.entity.Supplier;
import com.supplychain.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

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

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    public long getTotalSuppliers() {
        return supplierRepository.count();
    }
}