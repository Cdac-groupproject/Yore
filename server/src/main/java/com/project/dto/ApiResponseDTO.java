package com.project.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApiResponseDTO {
	private String msg;
	
	public ApiResponseDTO(String msg) {
		this.msg = msg;
	}
}
