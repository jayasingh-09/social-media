import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
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
        justifyContent: "center",
        py: 4,
        backgroundColor: "#f5f8fa",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 2,
          borderRadius: 0,
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#fff",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Hi {user?.firstName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to your dashboard!
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            py: 1,
            fontWeight: "bold",
            borderRadius: "30px",
            textTransform: "none",
            background: "#1DA1F2",
            "&:hover": {
              background: "#1A91DA",
            },
          }}
          onClick={() => navigate(`/post/${email}`)}
        >
          Create Post
        </Button>

        {posts.map((post, idx) => {
          const key = `${post.latitude},${post.longitude}`;
          const location =
            locationsMap[key] || `(${post.latitude}, ${post.longitude})`;

          return (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                mt: 3,
                border: "1px solid #e1e8ed",
                borderRadius: 0,
                backgroundColor: "#fff",
              }}
            >
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt="Post"
                  height="280"
                  sx={{
                    objectFit: "cover",
                  }}
                />
              )}
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "#14171A" }}
                >
                  {post.user?.firstName || "Unknown User"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  📍 {location}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.95rem", color: "#0f1419" }}
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
