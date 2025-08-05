package com.project.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class EmployeeDTO {
    private Integer employeeId;
    private String name;
    private String email;
    private Integer categoryId;
}