package com.idr.form.repository;
import com.idr.form.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;public interface PostRepository extends JpaRepository<Post, Long> {    
    @Query(value = """
        SELECT *, 
          (6371 * acos(
            cos(radians(:lat)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(:lon)) +
            sin(radians(:lat)) * sin(radians(p.latitude))
          )) AS distance
        FROM post p
        ORDER BY distance ASC
    """, nativeQuery = true)
    List<Post> findAllOrderByDistance(@Param("lat") double lat, @Param("lon") double lon);
}
