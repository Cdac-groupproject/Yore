package com.project.validation;

import com.project.dto.AddAuctionDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AuctionTimeValidator implements ConstraintValidator<ValidAuctionTimes, AddAuctionDTO> {

    @Override
    public boolean isValid(AddAuctionDTO dto, ConstraintValidatorContext context) {
        if (dto.getStartTime() == null || dto.getEndTime() == null) {
            return true; // Handled by @NotNull
        }
        return dto.getEndTime().isAfter(dto.getStartTime());
    }
}
