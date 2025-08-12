package com.project.exception_handler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.FileStorageException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dto.ApiResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

	//	Exception handling method
	@ExceptionHandler(ApiException.class)
	public ResponseEntity<?> handelApiException(ApiException e){
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponseDTO(e.getMessage()));
	}
	@ExceptionHandler(FileStorageException.class)
	public ResponseEntity<?> handelFileStorageException(FileStorageException e){
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponseDTO(e.getMessage()));
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(ApiException e){
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponseDTO(e.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
		List<FieldError> fieldErrors = e.getFieldErrors();

		Map<String, String> errorMap = new HashMap<>();

		fieldErrors.forEach(fieldError ->
			errorMap.put(fieldError.getField(),
						fieldError.getDefaultMessage()));

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
	}

//	Generic catch block
	// equivalent to catch-all
		@ExceptionHandler(Exception.class)
		public ResponseEntity<?> handleException(Exception e) {
			System.out.println("in catch all exc " + e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponseDTO(e.getMessage()));
		}



}

