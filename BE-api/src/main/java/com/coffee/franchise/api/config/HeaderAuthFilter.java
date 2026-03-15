package com.coffee.franchise.api.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HeaderAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = authHeader.substring(7);

            try {
                // 1. JWT gồm 3 phần cách nhau bởi dấu chấm. Phần thứ 2 (payload) chứa data.
                String[] chunks = token.split("\\.");
                if (chunks.length == 3) {
                    // 2. Bóc Base64 (Không cần Secret Key)
                    String payload = new String(Base64.getUrlDecoder().decode(chunks[1]));

                    // 3. Đọc chuỗi JSON
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode claims = mapper.readTree(payload);

                    String email = claims.has("email") ? claims.get("email").asText() : null;
                    if (email == null && claims.has("sub")) email = claims.get("sub").asText();

                    String scope = claims.has("scope") ? claims.get("scope").asText() : "";
                    String uid = claims.has("uid") ? claims.get("uid").asText() : "";

                    // 4. Nhét quyền vào Spring Security
                    if (email != null && !scope.isEmpty()) {
                        List<SimpleGrantedAuthority> authorities = Arrays.stream(scope.split(" "))
                                .filter(s -> !s.trim().isEmpty())
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(email, null, authorities);
                        authToken.setDetails(uid);

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception e) {
                System.out.println("Lỗi đọc Token nội bộ: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}
