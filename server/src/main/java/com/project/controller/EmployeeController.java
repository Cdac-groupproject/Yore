package com.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.project.dto.ApiResponse;
import com.project.dto.EmployeeDTO;
import com.project.service.employee.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@Validated
public class EmployeeController {

    private final EmployeeService employeeService;

    /*
     * Request handling method (REST API end point)
     * - desc - Add new Employee
     * URL - http://host:port/employees/create
     * Method - POST
     * Payload - JSON representation of employee
     * Resp - SC 201 + EmployeeDTO or SC 400 + ApiResponse for errors
     */
    @PostMapping("/create")
    @Operation(description = "Add New Employee")
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.addEmployee(dto));
    }

    /*
     * Request handling method (REST API end point)
     * URL - http://host:port/employees/
     * Method - GET
     * Payload - none
     * Resp - SC 200 + list of employees or SC 204 if list is empty
     */
    @GetMapping
    @Operation(description = "List All Employees")
    public ResponseEntity<?> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(employees);
    }

    /*
     * REST API end point - desc - get employee details by ID
     * URL - http://host:port/employees/{employeeId}
     * Method - GET
     * Resp - SC 200 + EmployeeDTO or SC 404 + ApiResponse
     */
    @GetMapping("/{employeeId}")
    @Operation(description = "Get Employee by ID")
    public ResponseEntity<?> getEmployeeById(@PathVariable @Min(1) Integer employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeeById(employeeId));
    }

    /*
     * REST API end point - desc - update employee by ID
     * URL - http://host:port/employees/update/{employeeId}
     * Method - PUT
     * Resp - SC 200 + updated EmployeeDTO or SC 404/400 + ApiResponse
     */
    @PutMapping("/update/{employeeId}")
    @Operation(description = "Update Employee by ID")
    public ResponseEntity<?> updateEmployee(@PathVariable @Min(1) Integer employeeId,
                                            @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(employeeId, dto));
    }

    /*
     * REST API end point - desc - delete employee by ID
     * URL - http://host:port/employees/{employeeId}
     * Method - DELETE
     * Resp - SC 200 + ApiResponse or SC 404 if not found
     */
    @DeleteMapping("/{employeeId}")
    @Operation(description = "Delete Employee by ID")
    public ApiResponse deleteEmployee(@PathVariable @Min(1) Integer employeeId) {
        employeeService.deleteEmployee(employeeId);
        return new ApiResponse("Employee with ID " + employeeId + " deleted successfully.");
    }
}
