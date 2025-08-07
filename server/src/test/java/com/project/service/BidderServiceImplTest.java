package com.project.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.dao.*;
import com.project.dto.bidder.BidderRequestDTO;
import com.project.dto.bidder.BidderRegisterResDTO;
import com.project.entity.*;
import com.project.service.bidder.BidderServiceImpl;

import org.modelmapper.ModelMapper;

public class BidderServiceImplTest {

    @Mock private UserDao userDao;
    @Mock private GenderDao genderDao;
    @Mock private RoleDao roleDao;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private ModelMapper modelMapper;
    @Mock private EmailService emailService;

    @InjectMocks private BidderServiceImpl bidderService;

    private BidderRequestDTO request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        request = new BidderRequestDTO();
        request.setFullName("John Doe");
        request.setEmail("john@example.com");
        request.setPhoneNo("1234567890");
        request.setPassword("password");
        request.setAge(25);
        request.setGenderId(1L);
    }

    @Test
    void testSignUp_Success() {
        when(userDao.existsByEmail("john@example.com")).thenReturn(false);
        when(genderDao.findById(1L)).thenReturn(Optional.of(new Gender()));
        when(roleDao.findByRoleName("BIDDER")).thenReturn(Optional.of(new Role()));

        String result = bidderService.signUp(request);

        assertNotNull(result);
        assertTrue(result.contains("OTP sent successfully"));
        verify(emailService).sendEmail(eq("john@example.com"), anyString(), contains("Your OTP"));
    }

    @Test
    void testSignUp_EmailAlreadyExists() {
        when(userDao.existsByEmail("john@example.com")).thenReturn(true);

        Exception ex = assertThrows(RuntimeException.class, () -> {
            bidderService.signUp(request);
        });

        assertTrue(ex.getMessage().contains("Email already registered"));
    }
}
