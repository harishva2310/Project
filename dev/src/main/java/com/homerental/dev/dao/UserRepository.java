package com.homerental.dev.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.User;
public interface UserRepository extends JpaRepository<User, Long> {

}
