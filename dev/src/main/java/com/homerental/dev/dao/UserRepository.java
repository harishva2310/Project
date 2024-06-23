package com.homerental.dev.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.homerental.dev.entity.User;
public interface UserRepository extends JpaRepository<User, Long> {
@Query(value = """
   select * from users where user_email=:email
   """,nativeQuery = true)

    List<Object[]> findUserEmailAddress(@Param("email") String email);
   
}
