package com.coffee.franchise.api.entity;

import com.coffee.franchise.api.enums.WarehouseStatus;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String location;

    @Column(name = "manager_id")
    private UUID managerId; // Soft link to AuthStaff

    @Enumerated(EnumType.STRING)
    private WarehouseStatus status;
}
