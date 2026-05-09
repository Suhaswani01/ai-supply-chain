package com.supplychain.entity;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

 @Data
 @Entity
 @Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id ;
	
	@Column(nullable =false,unique = true)
	private String email;
	
	@Column(nullable = false)
	private String password;
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, columnDefinition = "ENUM('ROLE_ADMIN','ROLE_INVENTORY_MANAGER','ROLE_VIEWER')")
	private Role role;
	
	public enum Role{
		ROLE_ADMIN,
        ROLE_INVENTORY_MANAGER,
        ROLE_VIEWER
    }
	}


