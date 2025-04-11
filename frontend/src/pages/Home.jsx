import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Paper,
} from "@mui/material";
import { getNearbyPosts } from "../services/api";

function Home() {
  const { email } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [locationsMap, setLocationsMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/forms/email/${email}`
        );
        if (res?.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [email]);

  useEffect(() => {
    if (user?.latitude && user?.longitude) {
      getNearbyPosts(user.latitude, user.longitude)
        .then(async (data) => {
          setPosts(data);
          const updatedMap = {};
          for (const post of data) {
            const key = `${post.latitude},${post.longitude}`;
            if (!locationsMap[key]) {
              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${post.latitude}&lon=${post.longitude}`
                );
                const locData = await res.json();
                const city =
                  locData.address.city ||
                  locData.address.town ||
                  locData.address.village ||
                  "";
                const state = locData.address.state || "";
                const country = locData.address.country || "";
                const readable = `${city}, ${state}, ${country}`
                  .trim()
                  .replace(/^,|,$/g, "");
                updatedMap[key] =
                  readable || locData.display_name || "Unknown location";
              } catch (err) {
                updatedMap[key] = "Unknown location";
              }
            }
          }
          setLocationsMap((prev) => ({ ...prev, ...updatedMap }));
        })
        .catch((err) => console.error("Error fetching posts:", err));
    }
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          px: 6,
          py: 5,
          borderRadius: 4,
          width: { xs: "90%", sm: "600px", md: "700px" },
          backgroundColor: "#fff",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Hi {user?.firstName} 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to your dashboard!
          </Typography>
        </Box>

        {/*
          {user && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">
                <strong>User ID:</strong> {user.uid}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Email:</strong> {user.email}
              </Typography>
            </Box>
          )}
          */}

        <Button
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            background: "linear-gradient(to right, #3f51b5, #2196f3)",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "0.3s",
            "&:hover": {
              background: "linear-gradient(to right, #303f9f, #1976d2)",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => navigate(`/post/${email}`)}
        >
          Create a Post
        </Button>

        {posts.map((post, idx) => {
          const key = `${post.latitude},${post.longitude}`;
          const location =
            locationsMap[key] || `(${post.latitude}, ${post.longitude})`;

          return (
            <Card
              key={idx}
              sx={{
                mt: 3,
                borderRadius: 3,
                boxShadow: 5,
                transition: "0.3s",
                "&:hover": { boxShadow: 8, transform: "scale(1.02)" },
              }}
            >
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt="Post"
                  height="300"
                  sx={{
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
              )}
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  📍 {location}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {post.content}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Paper>
    </Box>
  );
}

export default Home;
