package com.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponseDTO {
	private String msg;

	public ApiResponseDTO(String msg) {
		this.msg = msg;
	}
}
