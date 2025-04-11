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
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hi {user?.firstName || "loading..."} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your dashboard!
        </Typography>

        {user && (
          <Box sx={{ mt: 2 }}>
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

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate(`/post/${email}`)}
        >
          Create a Post
        </Button>

        {posts.map((post, idx) => {
          const key = `${post.latitude},${post.longitude}`;
          const location =
            locationsMap[key] || `(${post.latitude}, ${post.longitude})`;

          return (
            <Card key={idx} sx={{ mt: 3 }}>
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt="Post"
                  height="300"
                />
              )}
              <CardContent>
                <Typography variant="body1">{post.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  📍 {location}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
}

export default Home;
