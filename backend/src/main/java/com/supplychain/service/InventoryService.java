package com.supplychain.service;

import com.supplychain.entity.Part;
import com.supplychain.entity.Part.StockStatus;
import com.supplychain.repository.PartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final PartRepository partRepository;

    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    public Part getPartById(Long id) {
        return partRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Part not found: " + id));
    }

    public Part addPart(Part part) {
        if (partRepository.existsByPartCode(part.getPartCode())) {
            throw new RuntimeException("Part code already exists: " + part.getPartCode());
        }
        updateStockStatus(part);
        return partRepository.save(part);
    }

    public Part updatePart(Long id, Part updatedPart) {
        Part existing = getPartById(id);
        existing.setName(updatedPart.getName());
        existing.setCategory(updatedPart.getCategory());
        existing.setQuantity(updatedPart.getQuantity());
        existing.setUnitPrice(updatedPart.getUnitPrice());
        existing.setSupplier(updatedPart.getSupplier());
        updateStockStatus(existing);
        return partRepository.save(existing);
    }

    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }

    public List<Part> getLowStockParts() {
        return partRepository.findByStockStatus(StockStatus.LOW_STOCK);
    }

    public long getTotalParts() {
        return partRepository.count();
    }

    private void updateStockStatus(Part part) {
        if (part.getQuantity() == 0) {
            part.setStockStatus(StockStatus.OUT_OF_STOCK);
        } else if (part.getQuantity() <= 10) {
            part.setStockStatus(StockStatus.LOW_STOCK);
        } else {
            part.setStockStatus(StockStatus.IN_STOCK);
        }
    }
}