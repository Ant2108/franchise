package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface InventoryServiceInterface {
    List<InventoryResponse> getItemList();
    InventoryResponse getItemDetails(UUID item_ID);
    List<InventoryResponse> searchItem(String name);
    InventoryResponse updateItem(UUID id,InventoryRequest request);
}
