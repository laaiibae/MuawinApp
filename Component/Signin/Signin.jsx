import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Styled components
const BackgroundWrapper = styled(Box)({
  position: "relative",
  height: "100%", // Allow it to take full screen height
  width: "100%",
  overflow: "auto", // Enable scrolling for the whole wrapper, especially on mobile
});

const BackgroundImage = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`, // Replace with your image path
  backgroundSize: "cover", // Cover ensures the image covers the whole background
  backgroundPosition: "center",
  zIndex: 1,
  backgroundAttachment: "fixed", // Keep the background fixed on scroll for better experience
});

const ContentContainer = styled(Box)({
  position: "relative",
  zIndex: 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px", // Add padding for smaller screens
  minHeight: "100vh", // Ensure the container takes at least the full viewport height
  height: "auto", // Allow it to grow if needed
  overflowY: "auto", // Enable vertical scrolling if content exceeds screen height
});

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: "20px",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "600px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  backgroundColor: "#ffffff",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row", // Side-by-side layout for larger screens
    maxWidth: "1000px",
  },
}));
const LeftContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "20px 10px",
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  [theme.breakpoints.down("sm")]: {
    padding: "10px 0",
  },
}));

const ResponsiveImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: "10px",
  marginBottom: "15px",
  objectFit: "cover",
  [theme.breakpoints.down("sm")]: {
    marginBottom: "10px",
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  borderRadius: "30px",
  width: "100%",
  padding: "10px 0",
  backgroundColor: "#f15a22",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#d14e1d",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px 0",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "20px",
  width: "100%",
  "& label.Mui-focused": {
    color: "#000000",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000000",
    },
    "&:hover fieldset": {
      borderColor: "#000000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000000",
    },
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: "15px",
  },
}));

const Rectangle = styled(Box)({
  width: "80px",
  height: "8px",
  backgroundColor: "#f15a22",
  borderRadius: "5px",
  margin: "10px 0 20px 0",
});

function SignInPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        localStorage.setItem("token", data.token); // Assuming token is returned
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user details

        onLogin(data);
        navigate("/", { replace: true });
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && email && password) {
      handleLogin(e);
    }
  };

  return (
    <BackgroundWrapper>
      <BackgroundImage />
      <ContentContainer>
        <CustomPaper elevation={3}>
          <RightContainer>
            <img
              src={`${process.env.PUBLIC_URL}/images/muawin_signin.jpg`}
              alt="Cheezious"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
          </RightContainer>
          <LeftContainer>
            <img
              src={`${process.env.PUBLIC_URL}/images/muawin_logo_orange.png`}
              alt="Logo"
              style={{ width: "400px", marginBottom: "5px" }}
            />
            <Typography variant="h6" component="h1" gutterBottom>
              Sign-in
            </Typography>
            <Rectangle />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              label="Email"
              variant="outlined"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              InputLabelProps={{
                shrink: true, // Keeps the label always visible and fixed
              }}
              sx={{
                width: "100%", // Full width for the TextField
                marginBottom: "20px", // Space between fields
                "& .MuiInputLabel-root": {
                  color: "#f15a22", // Default label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#f15a22", // Label color on focus
                },
                "& .MuiOutlinedInput-root": {
                  height: "50px", // Slightly increased height
                  "& fieldset": {
                    borderColor: "#f15a22", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#f15a22", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f15a22", // Border color on focus
                  },
                },
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true, // Keeps the label always visible and fixed
              }}
              sx={{
                width: "100%", // Full width for the TextField
                marginBottom: "20px", // Space between fields
                "& .MuiInputLabel-root": {
                  color: "#f15a22", // Default label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#f15a22", // Label color on focus
                },
                "& .MuiOutlinedInput-root": {
                  height: "50px", // Slightly increased height
                  "& fieldset": {
                    borderColor: "#f15a22", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#f15a22", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f15a22", // Border color on focus
                  },
                },
              }}
            />
            <CustomButton
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                  Logging in...
                </>
              ) : (
                "LOGIN"
              )}
            </CustomButton>
          </LeftContainer>
        </CustomPaper>
      </ContentContainer>
    </BackgroundWrapper>
  );
}

export default SignInPage;
