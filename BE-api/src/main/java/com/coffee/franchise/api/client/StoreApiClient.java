package com.coffee.franchise.api.client;

import com.coffee.franchise.api.dto.external.StoreImportRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Nếu store.api.url không được cấu hình trong application.yml, nó sẽ lấy link ngrok mặc định
@FeignClient(
    name = "storeApiClient", 
    url = "${store.api.url:https://franchise-service-kc84.onrender.com}"
)
public interface StoreApiClient {

    @PostMapping("/g4/franchise/api/v1/inventory-imports/confirm")
    void confirmInventoryImport(@RequestBody StoreImportRequest request);
}
