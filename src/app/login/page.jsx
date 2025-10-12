"use client";
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { useRouter } from "next/navigation";
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const rememberMe = localStorage.getItem("rememberPassword") === "true";
    
    if (rememberMe && savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberPassword(true);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      const data = await res.json();
      
      // Handle remember password functionality
      if (rememberPassword) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberPassword", "true");
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberPassword");
      }
      
      // Update auth state immediately with user data
      login(data.user);
      
      // Navigate to main page
      router.replace("/main");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          width: 64, 
          height: 64,
          boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)"
        }}>
          <StorefrontIcon sx={{ fontSize: 32, color: "white" }} />
        </Avatar>
        <Typography
          variant="h5"
          sx={{
            mb: 1,
            fontWeight: 700,
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          เข้าสู่ระบบ
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#64748b",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          ยินดีต้อนรับกลับเข้าสู่ระบบลงทะเบียนหน่วย
        </Typography>
        <Divider sx={{ width: "100%", mb: 3 }} />

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
          <TextField
            label="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            variant="outlined"
            autoFocus
            sx={{
              background: "#f8fafc",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                  borderWidth: 2,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />

          <TextField
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            sx={{
              background: "#f8fafc",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                  borderWidth: 2,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                sx={{
                  color: "#3b82f6",
                  "&.Mui-checked": {
                    color: "#3b82f6",
                  },
                }}
              />
            }
            label="จำรหัสผ่าน"
            sx={{
              alignSelf: "flex-start",
              "& .MuiFormControlLabel-label": {
                fontSize: "0.9rem",
                color: "#424242",
              },
            }}
          />

          {error && (
            <Alert severity="error" sx={{ fontSize: "0.95rem" }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              py: 1.5,
              mt: 1,
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              textTransform: "none",
              fontSize: "1.05rem",
              fontWeight: 600,
              letterSpacing: 0.5,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(30, 64, 175, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                boxShadow: "0 6px 16px rgba(30, 64, 175, 0.4)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                backgroundColor: "#e2e8f0",
                color: "#94a3b8",
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} sx={{ color: "#fff" }} />
                กำลังเข้าสู่ระบบ...
              </Box>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </Button>
        </Box>
      </Paper>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          mt: "auto",
          pt: 4,
        }}
      >
        <Divider 
          sx={{ 
            mb: 3, 
            width: "100%",
            borderColor: "rgba(0,0,0,0.1)",
            "&::before, &::after": {
              borderColor: "rgba(0,0,0,0.1)",
            }
          }} 
        />
        
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            px: 2,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#374151",
              fontWeight: 500,
              "& .developer": {
                background: "linear-gradient(135deg, #1e3a8a, #374151)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              },
            }}
          >
            © 2025 พัฒนาโดย{" "}
            <span className="developer">จ่าสิบเอก อภิชาติ น้อยแท้ </span>และ{" "}
            <span className="developer">พลทหาร อนุ ม่วงคำ ผลัด 2/67 </span><br/>
            สนับสนุนโดย <span className="developer">กองพันบริการ กองบริการ ศูนย์การทหารราบ</span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}