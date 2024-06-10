package com.homerental.dev.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.Users;
public interface UserRepository extends JpaRepository<Users, Long> {

}
