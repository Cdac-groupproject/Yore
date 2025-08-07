package com.project.service.user;

import com.project.dto.Credentials;
import com.project.entity.User;

public interface UserService {
	User getUserByEmail(String email);

	User getUserByCredentials(Credentials cr);
}
