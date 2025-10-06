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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

export default function StudentSearchCard({ 
  studentId, 
  setStudentId, 
  studentData, 
  searchLoading, 
  onSearch,
  onReset 
}) {
  console.log(studentData)
  return (
    <Card sx={{ 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',
      borderRadius: 3,
      border: '1px solid rgba(25, 118, 210, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.100'
        }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'primary.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SearchIcon color="primary" sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            ค้นหานักเรียนนายสิบ
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="เลขประจำตัวนักเรียนนายสิบ"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="กรอกเลขประจำตัว เช่น 12345"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderWidth: 2,
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => onSearch(studentId)}
            disabled={!studentId || searchLoading}
            sx={{ 
              minWidth: 100, 
              height: 56,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {searchLoading ? <CircularProgress size={24} color="inherit" /> : 'ค้นหา'}
          </Button>
          {(studentData || studentId) && (
            <Button
              variant="outlined"
              color="error"
              onClick={onReset}
              disabled={searchLoading}
              sx={{ 
                minWidth: 80, 
                height: 56,
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-1px)'
                }
              }}
              startIcon={<ClearIcon />}
            >
              Reset
            </Button>
          )}
        </Box>

        {/* Student Data Display */}
        {studentData && (
          <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={studentData.image}
                  sx={{ width: 80, height: 80 }}
                >
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {studentData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {studentData.rank} • {studentData.class}
                </Typography>
                {studentData.remark && (
                <Chip 
                  label={`เลือก: ${studentData.remark}`} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 1 }}
                
                />
              )} 
              </Grid>
            </Grid>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
}
