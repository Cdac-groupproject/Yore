package com.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCategory {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "designation_id")
    private Integer designationId;

    @Column(name = "employee_designation", nullable = false)
    private String employeeDesignation;
    
}
