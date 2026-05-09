package com.supplychain.service;

import com.supplychain.entity.PurchaseOrder;
import com.supplychain.entity.PurchaseOrder.POStatus;
import com.supplychain.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

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

    public PurchaseOrder createPO(PurchaseOrder po) {
        po.setStatus(POStatus.PENDING);
        return purchaseOrderRepository.save(po);
    }

    public long getPendingCount() {
        return purchaseOrderRepository.countByStatus(POStatus.PENDING);
    }
}