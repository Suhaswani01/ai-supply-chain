package com.supplychain.controller;

import com.supplychain.entity.PurchaseOrder;
import com.supplychain.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    public ResponseEntity<List<PurchaseOrder>> getAllPOs() {
        return ResponseEntity.ok(purchaseOrderService.getAllPOs());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    public ResponseEntity<List<PurchaseOrder>> getPendingPOs() {
        return ResponseEntity.ok(purchaseOrderService.getPendingPOs());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    public ResponseEntity<PurchaseOrder> getPOById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.getPOById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    public ResponseEntity<PurchaseOrder> createPO(@RequestBody PurchaseOrder po) {
        return ResponseEntity.ok(purchaseOrderService.createPO(po));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PurchaseOrder> approvePO(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.approvePO(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PurchaseOrder> rejectPO(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.rejectPO(id));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePO(@PathVariable Long id) {
        purchaseOrderService.deletePO(id);
        return ResponseEntity.noContent().build();
    }
}