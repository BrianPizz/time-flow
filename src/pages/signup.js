import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";

import AuthContainer from "@/components/auth/AuthContainer";
import AuthCard from "@/components/auth/AuthCard";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // Save token + redirect
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Account
          </Button>
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Alreay have an account?{" "}
            <Link href="/login" variant="body2">
              Login
            </Link>
          </Typography>
        </form>
      </AuthCard>
    </AuthContainer>
  );
}
