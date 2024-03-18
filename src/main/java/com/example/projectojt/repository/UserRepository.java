package com.example.projectojt.repository;

import com.example.projectojt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    User findByEmail(String email);
    User findByUserID(int userID);
    @Query(value = "select * from user where email = :user_email", nativeQuery = true)
    Optional<User> findByEmail2(@Param("user_email") String user_email);

    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User SET userName = :user_name, phone = :user_phoneNumber, "
            + "birthday = :birthday, password = :password WHERE userID = :user_id")
    void updateUserByUserId(@Param("user_id") int user_id,
                            @Param("user_name") String user_name,
                            @Param("user_phoneNumber") String user_phoneNumber,
                            @Param("birthday") Timestamp birthday,
                            @Param("password") String password);
}
