package com.project.dto.bidder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BidderRegisterResDTO {
	private String fullName;
    private String phoneNo;
    private String email;
    private int age;
    private Long genderId;
    private String roleId;
}
