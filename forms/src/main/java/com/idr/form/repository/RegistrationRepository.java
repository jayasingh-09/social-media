package com.idr.form.repository;
import java.util.Optional;
import com.idr.form.model.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRepository extends JpaRepository<Field, Long> {
    // Optional: for login
    Optional<Field> findByEmailAndPassword(String email, String password);
    Optional<Field> findByEmail(String email);

}
