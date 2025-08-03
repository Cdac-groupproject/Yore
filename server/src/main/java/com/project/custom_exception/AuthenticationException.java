package com.project.custom_exception;

public class AuthenticationException extends RuntimeException {
	public AuthenticationException(String msg) {
		super(msg);
	}
}
