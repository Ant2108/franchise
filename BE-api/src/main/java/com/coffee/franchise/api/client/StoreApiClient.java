package com.coffee.franchise.api.client;

import com.coffee.franchise.api.dto.external.StoreImportRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Nếu store.api.url không được cấu hình trong application.yml, nó sẽ lấy link ngrok mặc định
@FeignClient(
    name = "storeApiClient", 
    url = "${store.api.url:https://b7b4-2405-4800-5716-8cc0-90e0-1f1e-a265-e43a.ngrok-free.app}"
)
public interface StoreApiClient {

    @PostMapping("/api/v1/inventory-imports/confirm")
    void confirmInventoryImport(@RequestBody StoreImportRequest request);
}
