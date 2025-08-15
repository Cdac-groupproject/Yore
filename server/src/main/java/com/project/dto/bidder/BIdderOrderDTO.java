package com.project.dto.bidder;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class BIdderOrderDTO {
	  private String productName;
	    private String productDescription;
	    private Date orderDate;
	    private BigDecimal finalPrice;
}
