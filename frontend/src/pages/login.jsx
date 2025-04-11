import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get("http://localhost:8080/forms");
      const users = res.data;

      const matchedUser = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (matchedUser) {
        navigate(`/home/${formData.email}`);
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error connecting to the server.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #3f51b5, #2196f3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          px: 6,
          py: 5,
          borderRadius: 4,
          width: { xs: "90%", sm: "400px" },
          backgroundColor: "#fff",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "#3f51b5" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            color="primary"
            fontWeight="bold"
          >
            Login
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              background: "linear-gradient(to right, #3f51b5, #2196f3)",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(to right, #303f9f, #1976d2)",
              },
            }}
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end" mt={2}>
            <Link href="#" variant="body2" color="primary">
              Forgot password?
            </Link>
          </Grid>
          <Grid container justifyContent="center" mt={2}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/"
                variant="body2"
                color="primary"
                sx={{ ml: 0.5 }}
              >
                Sign Up
              </Link>
            </Typography>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
