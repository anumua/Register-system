'use client';
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Fade,
  Grow
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function StudentSearchCard({
  studentId,
  setStudentId,
  studentData,
  searchLoading,
  onSearch,
  onReset
}) {
  console.log(studentData);
  console.log(process.env.NEXT_PUBLIC_PICTURE_NCO, '22');
  const paddedId = String(studentData?.studentId).padStart(3, '0');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && studentId && !searchLoading) {
      onSearch(studentId);
    }
  };

  const handlePrevious = () => {
    const currentId = parseInt(studentId) || 0;
    if (currentId > 1) {
      const newId = String(currentId - 1);
      setStudentId(newId);
      onSearch(newId);
    }
  };

  const handleNext = () => {
    const currentId = parseInt(studentId) || 0;
    const newId = String(currentId + 1);
    setStudentId(newId);
    onSearch(newId);
  };

  return (
    <Card 
      elevation={0}
      sx={{
        boxShadow: '0 8px 40px rgba(25, 118, 210, 0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(to bottom, #ffffff, #fafbff)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 48px rgba(25, 118, 210, 0.12)',
          transform: 'translateY(-4px)',
          borderColor: 'primary.light'
        }
      }}
    >
      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          mb: 4,
          pb: 3,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          borderImage: 'linear-gradient(to right, #1976d2, #42a5f5) 1'
        }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
          }}>
            <SearchIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="700" color="primary.dark" sx={{ mb: 0.5 }}>
              ค้นหานักเรียนนายสิบ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              กรอกเลขประจำตัวเพื่อค้นหาข้อมูล
            </Typography>
          </Box>
        </Box>

        {/* Search Box */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={!studentId || parseInt(studentId) <= 1 || searchLoading}
            sx={{
              minWidth: 56,
              height: 56,
              borderRadius: 3,
              borderWidth: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                bgcolor: 'primary.50'
              },
              '&:disabled': {
                borderWidth: 2
              }
            }}
          >
            <ArrowBackIcon />
          </Button>

          <TextField
            fullWidth
            label="เลขประจำตัวนักเรียนนายสิบ"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="กรอกเลขประจำตัว เช่น 12345 (กด Enter เพื่อค้นหา)"
            variant="outlined"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <SchoolIcon sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white',
                transition: 'all 0.3s ease',
                '& fieldset': {
                  borderWidth: 2,
                  borderColor: 'divider'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused': {
                  '& fieldset': {
                    borderWidth: 2.5,
                    borderColor: 'primary.main',
                  },
                  boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500
              }
            }}
          />

          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={!studentId || searchLoading}
            sx={{
              minWidth: 56,
              height: 56,
              borderRadius: 3,
              borderWidth: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                bgcolor: 'primary.50'
              },
              '&:disabled': {
                borderWidth: 2
              }
            }}
          >
            <ArrowForwardIcon />
          </Button>
          
          <Button
            variant="contained"
            onClick={() => onSearch(studentId)}
            disabled={!studentId || searchLoading}
            sx={{
              minWidth: 120,
              height: 56,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            {searchLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <SearchIcon sx={{ mr: 1 }} />
                ค้นหา
              </>
            )}
          </Button>
          
          {(studentData || studentId) && (
            <Fade in={true}>
              <Button
                variant="outlined"
                color="error"
                onClick={onReset}
                disabled={searchLoading}
                sx={{
                  minWidth: 100,
                  height: 56,
                  borderRadius: 3,
                  borderWidth: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                  }
                }}
                startIcon={<ClearIcon />}
              >
                รีเซ็ต
              </Button>
            </Fade>
          )}
        </Box>

        {/* Student Data Display */}
        {studentData && (
          <Grow in={true} timeout={600}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
                border: '2px solid',
                borderColor: 'primary.light',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(to right, #1976d2, #42a5f5)'
                }
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={
                        process.env.NEXT_PUBLIC_PICTURE_NCO
                          ? `/${process.env.NEXT_PUBLIC_PICTURE_NCO}/${paddedId}.jpg`
                          : undefined
                      }
                      sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        bgcolor: '#e0e0e0',
                        color: '#616161',
                        fontSize: 60,
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'scale(1.08)',
                        },
                        '& img': {
                          objectFit: 'cover',
                          objectPosition: 'top',
                        }
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Box sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                      border: '3px solid white'
                    }}>
                      <SchoolIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      fontWeight="700" 
                      color="primary.dark"
                      sx={{ mb: 0.5 }}
                    >
                      นนส. {studentData.name}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      fontWeight="500"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Box 
                        component="span"
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main' 
                        }} 
                      />
                      รหัสประจำตัว {studentId}
                       <Box 
                        component="span"
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main' 
                        }} 
                      />
                      {studentData.class} 
                    </Typography>
                  </Box>
                  
                  {studentData.remark && (
                    <Chip
                      label={`เลือก: ${studentData.remark}`}
                      color="primary"
                      variant="filled"
                      size="medium"
                      sx={{ 
                        fontWeight: 600,
                        height: 36,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        '& .MuiChip-label': {
                          px: 2
                        }
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grow>
        )}
      </CardContent>
    </Card>
  );
}