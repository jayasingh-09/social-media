import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography } from "@mui/material";

function Post() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setLocation({ latitude: lat, longitude: lon });

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();

        // Optional: cleaner version (city, state, country)
        const city =
          data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";
        const country = data.address.country || "";
        const readable = `${city}, ${state}, ${country}`
          .trim()
          .replace(/^,|,$/g, "");

        setLocationName(readable || data.display_name || "Unknown location");
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
        setLocationName("Location unavailable");
      }
    });
  }, []);

  const handleSubmit = async () => {
    const postData = {
      user: { email },
      content,
      imageUrl,
      latitude: location.latitude,
      longitude: location.longitude,
      locationName, // ✅ human-readable
    };

    try {
      await axios.post("http://localhost:8080/posts", postData);
      alert("Post submitted!");
      navigate(`/home/${email}`);
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5">Create Post</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Detected Location: {locationName || "Loading..."}
      </Typography>

      <TextField
        fullWidth
        label="Content"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        label="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>
        Post
      </Button>
    </Container>
  );
}

export default Post;
