import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

function Post() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState("Fetching location...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ latitude: lat, longitude: lon });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";
            const state = data.address.state || "";
            const country = data.address.country || "";
            const readable = `${city}, ${state}, ${country}`
              .trim()
              .replace(/^,|,$/g, "");

            setLocationName(
              readable || data.display_name || "Unknown location"
            );
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setLocationName("Location unavailable");
          }
        },
        () => {
          setLocationName("Location access denied.");
        }
      );
    } else {
      setLocationName("Geolocation not supported.");
    }
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    const postData = {
      user: { email },
      content,
      latitude: location.latitude,
      longitude: location.longitude,
      locationName,
    };

    try {
      await axios.post("http://localhost:8080/posts", postData);
      alert("Post submitted!");
      navigate(`/home/${email}`);
    } catch (err) {
      console.error("Error posting:", err);
      alert("Failed to submit post.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",        px: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          px: 5,
          py: 4,
          borderRadius: 3,
          width: { xs: "90%", sm: "600px" },
          backgroundColor: "#F4F6F7",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#2C3E50",
            textAlign: "center",
            mb: 2,
          }}
        >
          Create a Post
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#7F8C8D", textAlign: "center", mb: 3 }}
        >
          📍 {locationName}
        </Typography>

        <TextField
          fullWidth
          label="What's on your mind?"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            mb: 3,
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "#2C3E50",
            color: "white",
            fontWeight: "bold",
            borderRadius: "6px",
            py: 1.5,
            transition: "0.3s",
            "&:hover": {
              background: "#1A252F",
            },
          }}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </Paper>
    </Container>
  );
}

export default Post;
