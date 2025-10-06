'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Group as GroupIcon
} from '@mui/icons-material';

export default function UnitSelectionCard({ 
  selectedUnit, 
  unitData, 
  onOpenDialog 
}) {
  return (
    <Card sx={{ 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',
      borderRadius: 3,
      border: '1px solid rgba(76, 175, 80, 0.1)',
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
          borderColor: 'success.100'
        }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'success.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldIcon color="success" sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="success.dark">
            เลือกหน่วยทหาร
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={onOpenDialog}
            startIcon={<GroupIcon />}
            fullWidth
            sx={{ 
              height: 48,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {selectedUnit ? `${selectedUnit.name}` : 'เลือกหน่วยทหาร'}
          </Button>
        </Box>

        {selectedUnit && (
          <Paper sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            border: '1px solid', 
            borderColor: 'success.200',
            borderRadius: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(76, 175, 80, 0.1)'
          }}>
            <Typography variant="h6" fontWeight="bold" color="success.dark" gutterBottom>
              {selectedUnit.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ 
                width: 4, 
                height: 4, 
                borderRadius: '50%', 
                bgcolor: 'info.main' 
              }} />
              <Typography variant="body1" color="text.primary" fontWeight={400}>
                จำนวนคน: {unitData.length}/{selectedUnit.capacity} นาย
              </Typography>
            </Box>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              borderRadius: 1,
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)'
            }}>
              <Typography variant="body2" fontWeight="bold">
                ตำแหน่งว่าง: {selectedUnit.capacity - unitData.length} นาย
              </Typography>
            </Box>
          </Paper>
        )}

        {!selectedUnit && (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%)',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'grey.300',
            minHeight: 200,
            p: 4
          }}>
            <Box sx={{
              p: 2,
              borderRadius: '50%',
              bgcolor: 'grey.100',
              mb: 2
            }}>
              <GroupIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Box>
            <Typography variant="h6" color="text.secondary" textAlign="center" fontWeight={500}>
              กรุณาเลือกหน่วยทหาร
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              เพื่อดูข้อมูลรายละเอียดและจำนวนสมาชิก
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
