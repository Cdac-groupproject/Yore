package com.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long genderId;

    @Column(name = "gender_name", nullable = false)
    private String genderName;
}
