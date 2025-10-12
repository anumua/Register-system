'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '../src/app/contexts/AuthContext';

export default function HeaderBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { authState, logout } = useAuth();
  const router = useRouter();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const userName =
    authState.user?.name ||
    (authState.user?.first_name || authState.user?.last_name
      ? `${authState.user?.first_name || ''} ${authState.user?.last_name || ''}`.trim()
      : undefined) ||
    authState.user?.fullName ||
    authState.user?.username ||
    'ผู้ใช้';

  // Format user info for desktop display
  const userFullName = authState.user?.fullname || '';

  // Create desktop display info with proper spacing
  const desktopUserInfo = [userFullName]
    .filter(Boolean) // Remove empty strings
    .join(' ')
    .trim();
  
  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #154D71 100%, #1976d2 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72 }}>
        {/* Left side: Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <StorefrontIcon sx={{ fontSize: { xs: 28, md: 36 }, color: '#fff' }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              letterSpacing: 1,
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}
          >
            ระบบลงทะเบียนหน่วย
          </Typography>
        </Box>

        {/* Right side: Auth-aware UI */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {authState.loading ? null : authState.authenticated ? (
            <>
              {/* Desktop: Show rank, first name, last name */}
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 500,
                  display: { xs: 'none', md: 'block' } // Hide on mobile, show on desktop
                }}
              >
                {desktopUserInfo || userName}
              </Typography>
              
              {/* Mobile: Show only avatar */}
              <Tooltip title={`${desktopUserInfo || userName} - Account settings`}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userName} src="/avatar.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Avatar alt={userName} src="/avatar.jpg" sx={{ width: 28, height: 28, mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {desktopUserInfo || userName}
                    </Typography>
                    {authState.user?.role && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {authState.user.role}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  ออกจากระบบ
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => router.push('/login')}>
              เข้าสู่ระบบ
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}