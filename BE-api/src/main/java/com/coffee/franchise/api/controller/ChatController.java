package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.ChatRequest;
import com.coffee.franchise.api.service.Impl.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private AiService aiService;

    @PostMapping
    public Map<String,String> chat(@RequestBody ChatRequest request){

        String aiResponse = aiService.chat(request.getMessage());

        Map<String,String> result = new HashMap<>();
        result.put("reply", aiResponse);

        return result;
    }
}
