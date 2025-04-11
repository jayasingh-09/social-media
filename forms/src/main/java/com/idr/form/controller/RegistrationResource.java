package com.idr.form.controller;

import com.idr.form.model.Field;
import com.idr.form.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // You can restrict origins if needed
@RequestMapping("/forms")
public class RegistrationResource {

    @Autowired
    private RegistrationRepository registrationRepository;

    // GET: Fetch all form entries
    @GetMapping
    public List<Field> getAllForms() {
        return registrationRepository.findAll();
    }

    // POST: Add a new form entry
    @PostMapping
    public Field createForm(@RequestBody Field field) {
        return registrationRepository.save(field);
    }
    @GetMapping("/email/{email}")
        public Field getUserByEmail(@PathVariable String email) {
            return registrationRepository.findByEmail(email).orElse(null);
        }
        @GetMapping("/{id}")
        public Field getUserById(@PathVariable Long id) {
            return registrationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
}   
        @PostMapping("/forms")
        public Field saveUser(@RequestBody Field user) {
        return registrationRepository.save(user);
        }
        
        
        

}
        

