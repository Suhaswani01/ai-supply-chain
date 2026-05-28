package com.supplychain.service;

import com.supplychain.entity.Part;
import com.supplychain.entity.PurchaseOrder;
import com.supplychain.entity.PurchaseOrder.POStatus;
import com.supplychain.entity.Supplier;
import com.supplychain.repository.PartRepository;
import com.supplychain.repository.PurchaseOrderRepository;
import com.supplychain.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PartRepository partRepository;
    private final SupplierRepository supplierRepository;

    public List<PurchaseOrder> getAllPOs() {
        return purchaseOrderRepository.findAll();
    }

    public List<PurchaseOrder> getPendingPOs() {
        return purchaseOrderRepository.findByStatus(POStatus.PENDING);
    }

    public PurchaseOrder getPOById(Long id) {
        return purchaseOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PO not found: " + id));
    }

    public PurchaseOrder createPO(PurchaseOrder po) {
        
        Part part = partRepository.findById(po.getPart().getId())
            .orElseThrow(() -> new RuntimeException("Part not found"));

        
        Supplier supplier = supplierRepository.findById(po.getSupplier().getId())
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

        po.setPart(part);
        po.setSupplier(supplier);
        po.setStatus(POStatus.PENDING);
        return purchaseOrderRepository.save(po);
    }

    public PurchaseOrder approvePO(Long id) {
        PurchaseOrder po = getPOById(id);
        po.setStatus(POStatus.APPROVED);
        return purchaseOrderRepository.save(po);
    }

    public PurchaseOrder rejectPO(Long id) {
        PurchaseOrder po = getPOById(id);
        po.setStatus(POStatus.REJECTED);
        return purchaseOrderRepository.save(po);
    }

    public long getPendingCount() {
        return purchaseOrderRepository.countByStatus(POStatus.PENDING);
    }
    public void deletePO(Long id) {
        purchaseOrderRepository.deleteById(id);
    }
}