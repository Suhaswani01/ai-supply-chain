package com.supplychain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
	  
	@Email(message="Enter valid email")
	@NotBlank(message ="Enter required email")
     private String email;
	
	@NotBlank(message="Enter the password")
	private String password;

}
