package com.project.service.employee;

import java.util.List;
import com.project.dto.EmployeeDTO;

public interface EmployeeService {
    EmployeeDTO addEmployee(EmployeeDTO dto);
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO getEmployeeById(Integer id);
    EmployeeDTO updateEmployee(Integer id, EmployeeDTO dto);
    void deleteEmployee(Integer id);
}