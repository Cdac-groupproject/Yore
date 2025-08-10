package com.project.service.user;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.dao.UserDao;
import com.project.dao.GenderDao;
import com.project.dao.RoleDao;
import com.project.dto.AuctioneerDto;
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
    
    @Autowired
    private ModelMapper modelMapper;
    
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
    
    
    public List<AuctioneerDto> getAllAuctioneers() {
        List<User> auctioneers = userDao.findByRole_RoleNameIgnoreCase("AUCTIONEER");
		return auctioneers.stream()
                .map(user -> modelMapper.map(user, AuctioneerDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public void deleteUserById(Long id) {
        if (!userDao.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userDao.deleteById(id);
    }
    
    @Override
    public User updateUser(Long id, UserRequestDTO dto) {
        // Find existing user
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Update fields
        user.setFullName(dto.getFullName());
        user.setPhoneNo(dto.getPhoneNo());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());

        // Update Gender, if provided
        if (dto.getGenderId() != null) {
            Gender gender = genderDao.findById(dto.getGenderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Gender not found with id: " + dto.getGenderId()));
            user.setGender(gender);
        }

        // Update Role, if provided
        if (dto.getRoleId() != null) {
            Role role = roleDao.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + dto.getRoleId()));
            user.setRole(role);
        }

        // Update password, if provided and not blank (optional, for security)
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Save updated user
        return userDao.save(user);
    }

    
}
