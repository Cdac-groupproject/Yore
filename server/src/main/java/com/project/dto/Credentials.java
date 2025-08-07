package com.project.dto;

import lombok.Setter;
import lombok.ToString;
import lombok.Getter;

import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Credentials {
	private String email;
	private String password;
}
