package com.coffee.franchise.api.entity;

import com.coffee.franchise.api.enums.SupplierIngredientStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "supplier_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "minimum_order_quantity")
    private BigDecimal minimumOrderQuantity;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    @Enumerated(EnumType.STRING)
    private SupplierIngredientStatus status;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
