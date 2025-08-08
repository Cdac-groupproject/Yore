package com.project.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.dao.UserDao;
import com.project.dao.GenderDao;
import com.project.dao.RoleDao;
import com.project.dto.Credentials;
import com.project.dto.user.UserRequestDTO;
import com.project.entity.Gender;
import com.project.entity.Role;
import com.project.entity.User;
import com.project.custom_exception.ResourceNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private GenderDao genderDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User getUserByEmail(String email) {
        return userDao.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Override
    public User getUserByCredentials(Credentials cr) {
        User dbUser = userDao.findByEmail(cr.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with the email"));

        if (passwordEncoder.matches(cr.getPassword(), dbUser.getPassword())) {
            return dbUser;
        }
        return null;
    }

    @Override
    public User createUser(UserRequestDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPhoneNo(dto.getPhoneNo());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());

        Gender gender = genderDao.findById(dto.getGenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Gender not found with id: " + dto.getGenderId()));
        user.setGender(gender);

        Role role = roleDao.findById(dto.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));
        user.setRole(role);

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return userDao.save(user);
    }

    /*
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User dbUser = userDao.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("No user exists with email: " + email));
		return dbUser;
	}

*/
}
