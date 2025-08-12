package com.project.custom_exception;

public class FileStorageException extends RuntimeException {
	public FileStorageException(String message,Throwable cause) {
		super(message,cause);
		
	}

}
