package com.project.dto.user;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    private String fullName;
    private String phoneNo;
    private String email;
    private String password;
    private Integer age;
    private Long genderId;
    private Long roleId;
}
