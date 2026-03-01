package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.service.Impl.InventoryServiceImpl;
import com.coffee.franchise.api.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryServiceImpl inventoryService;
    private final InventoryService service;
    @GetMapping("/getList")
    public ResponseEntity<List<InventoryResponse>> getInventoryList()
    {
        return ResponseEntity.ok(inventoryService.getItemList());
    }

    @GetMapping("/getDetails/{id}")
    public ResponseEntity<InventoryResponse> getInventoryDetails(@PathVariable UUID id)
    {
        return ResponseEntity.ok(inventoryService.getItemDetails(id));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<InventoryResponse> getInventoryDetails(@PathVariable UUID id, @Valid @ModelAttribute InventoryRequest request)
    throws IOException {
        return ResponseEntity.ok(inventoryService.updateItem(id,request));
    }

    @PostMapping("/search/{name}")
    public ResponseEntity<List<InventoryResponse>> getInventoryDetails(@PathVariable String name)
    {
        return ResponseEntity.ok(inventoryService.searchItem(name));
    }

    @PostMapping("/create")
    public ResponseEntity<InventoryResponse> createNewInventory(@Valid @ModelAttribute InventoryRequest request)
        throws IOException{
        return ResponseEntity.ok(inventoryService.addInventory(request));
    }

}
