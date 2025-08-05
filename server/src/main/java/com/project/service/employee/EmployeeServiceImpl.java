package com.project.service.employee;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.EmployeeCategoryDao;
import com.project.dao.EmployeeDao;
import com.project.dto.EmployeeDTO;
import com.project.entity.Employee;
import com.project.entity.EmployeeCategory;

import jakarta.transaction.Transactional;

@Service
@Transactional

public class EmployeeServiceImpl implements EmployeeService {

	 @Autowired
	 private EmployeeDao employeeDao;

	 @Autowired
	 private EmployeeCategoryDao categoryDao;

	 @Autowired
	 private ModelMapper modelMapper;

	@Override
	public EmployeeDTO addEmployee(EmployeeDTO dto) {
		
		Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());

        EmployeeCategory category = categoryDao.findById(dto.getCategoryId())
                .orElseThrow(() -> new ApiException("Invalid Category ID"));
        employee.setCategory(category);

        Employee saved = employeeDao.save(employee);
        return convertToDTO(saved);
        
	}

	@Override
	public List<EmployeeDTO> getAllEmployees() {
		
		return employeeDao.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
	}

	@Override
	public EmployeeDTO getEmployeeById(Integer id) {
		
		 Employee employee = employeeDao.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
	        return convertToDTO(employee);
	}

	@Override
	public EmployeeDTO updateEmployee(Integer id, EmployeeDTO dto) {
		
		Employee employee = employeeDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());

        EmployeeCategory category = categoryDao.findById(dto.getCategoryId())
                .orElseThrow(() -> new ApiException("Invalid Category ID"));
        employee.setCategory(category);

        Employee updated = employeeDao.save(employee);
        return convertToDTO(updated);
        
	}

	@Override
	public void deleteEmployee(Integer id) {
		
		if (!employeeDao.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with ID: " + id);
        }
        employeeDao.deleteById(id);
		
	}
	
	private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setCategoryId(employee.getCategory().getDesignationId());
        //dto.setCategoryName(employee.getCategory().getEmployeeDesignation());
        return dto;
    }

}
