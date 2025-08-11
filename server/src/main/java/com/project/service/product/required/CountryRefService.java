package com.project.service.product.required;

import java.util.List;

import com.project.dto.product.CountryRefDto;
import com.project.entity.CountryRef;

public interface CountryRefService {
	CountryRef addCountryRef(CountryRefDto countryRefDto);
	List<CountryRefDto> getAllCountries();
}
