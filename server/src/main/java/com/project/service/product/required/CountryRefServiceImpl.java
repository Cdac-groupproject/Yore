package com.project.service.product.required;

import java.io.IOException;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.dao.product.CountryRefDao;
import com.project.dto.product.CountryRefDto;
import com.project.dto.product.ProductPostDto;
import com.project.entity.CountryRef;
import com.project.entity.Product;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class CountryRefServiceImpl implements CountryRefService  {

	private final CountryRefDao countryRefDao;
	private final ModelMapper modelMapper;
	
	
	public CountryRefServiceImpl(CountryRefDao countryRefDao, ModelMapper modelmapper) {
		this.countryRefDao = countryRefDao;
		this.modelMapper = modelmapper;
	}



	@Override
	public CountryRef addCountryRef(CountryRefDto countryRefDto) {
		if (countryRefDto == null) {
	        throw new IllegalArgumentException("CountryRefDto cannot be null");
	    }
	    
	    CountryRef countryRef = new CountryRef();
	    //countryRef.setCountryId(countryRefDto.getCountryId()); // optional if your DB auto-generates ID
	    countryRef.setCountryName(countryRefDto.getCountryName());
	    
	    return countryRefDao.save(countryRef);
	}



	@Override
	public List<CountryRefDto> getAllCountries() {
		// TODO Auto-generated method stub
		List<CountryRef> allCountrys = countryRefDao.findAll();
		return allCountrys.stream().map(country -> {
			CountryRefDto countryRef = modelMapper.map(country, CountryRefDto.class);
			return countryRef;
		}).toList();
	}
}
