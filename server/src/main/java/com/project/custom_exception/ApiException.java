package com.project.custom_exception;

public class ApiException extends RuntimeException {
	public ApiException(String message) {
		super(message);
	}
}
