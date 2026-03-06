package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Response.InventoryLogResponse;
import com.coffee.franchise.api.enums.TransactionType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface InventoryLogService {

    /**
     * Log an inventory change.
     */
    InventoryLogResponse logInventoryChange(UUID warehouseId, UUID ingredientId,
                                            TransactionType transactionType,
                                            BigDecimal quantityChanged,
                                            UUID referenceId);
    List<InventoryLogResponse> getAllInventoryLogs();
    /**
     * Get all logs for a specific warehouse and ingredient.
     */
    List<InventoryLogResponse> getLogsByWarehouseAndIngredient(UUID warehouseId, UUID ingredientId);

    /**
     * Get all logs for a specific warehouse.
     */
    List<InventoryLogResponse> getLogsByWarehouse(UUID warehouseId);

    /**
     * Get all logs by reference ID (e.g., an order ID).
     */
    List<InventoryLogResponse> getLogsByReferenceId(UUID referenceId);
}
