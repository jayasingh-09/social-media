package com.idr.form.controller;

import com.idr.form.model.Field;
import com.idr.form.model.Post;
import com.idr.form.repository.PostRepository;
import com.idr.form.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        Field user = registrationRepository.findByEmail(post.getUser().getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        return postRepository.save(post);
    }

    @GetMapping("/nearby")
    public List<Post> getNearbyPosts(@RequestParam double lat, @RequestParam double lon) {
        return postRepository.findAllOrderByDistance(lat, lon);
    }
}
