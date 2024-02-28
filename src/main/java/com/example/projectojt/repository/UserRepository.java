package com.example.projectojt.repository;

import com.example.projectojt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    User findByEmail(String email);
    @Query(value = "select * from [dbo].[User] where user_email = :user_email", nativeQuery = true)
    Optional<User> findByEmail2(@Param("user_email") String user_email);

    boolean existsByEmail(String email);
}
