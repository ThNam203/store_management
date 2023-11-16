package com.springboot.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "staff_sunday_bonus")
public class StaffSundayBonus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "value", nullable = false)
    private Double value;

    @Column(name = "bonusUnit", nullable = false)
    private String bonusUnit;
}
