package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.InventoryQuantityRequestDTO;
import com.coffee.franchise.api.dto.Request.ReservationSyncRequestDTO;
import com.coffee.franchise.api.dto.Response.InventoryResponseDTO;

import java.util.UUID;

public interface InventoryService {

    InventoryResponseDTO track(UUID warehouseId, UUID ingredientId);

    InventoryResponseDTO increase(InventoryQuantityRequestDTO request);

    InventoryResponseDTO decrease(InventoryQuantityRequestDTO request);

    InventoryResponseDTO adjust(InventoryQuantityRequestDTO request);

    InventoryResponseDTO syncReservation(ReservationSyncRequestDTO request);
}