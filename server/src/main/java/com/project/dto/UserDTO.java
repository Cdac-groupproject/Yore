package com.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
	private Long userId;
    private String fullName;
    private String email;
    private String role;
}
