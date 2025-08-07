package com.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditProfileDTO {
	private String fullName;
	private String email;
    private String phoneNo;
    private int age;
}
