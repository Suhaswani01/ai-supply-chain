package com.supplychain.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supplychain.entity.User;

public interface UserRepository extends JpaRepository<User,Long>{

	
	Optional<User> findByEmail(String email);
}