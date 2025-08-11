package com.project.service;

import com.project.entity.Gender;
import com.project.dao.GenderDao;
import com.project.service.GenderService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GenderServiceImpl implements GenderService {

    private final GenderDao genderRepository;

    public GenderServiceImpl(GenderDao genderRepository) {
        this.genderRepository = genderRepository;
    }

    @Override
    public List<Gender> getAllGenders() {
        return genderRepository.findAll();
    }
}
