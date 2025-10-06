'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Shield as ShieldIcon
} from '@mui/icons-material';

export default function UnitSelectionDialog({ 
  open, 
  onClose, 
  militaryUnits, 
  onSelectUnit 
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { borderRadius: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pb: 2 }}>
        <ShieldIcon sx={{ fontSize: 28, color: 'primary.main', mb: 1, display: 'block', mx: 'auto' }} />
        เลือกหน่วยทหาร
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)'
            },
            gap: 2.5,
            justifyItems: 'center'
          }}
        >
          {militaryUnits.map((unit) => (
            <Box key={unit.id} sx={{ width: '100%', maxWidth: 220 }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: 'primary.main',
                    '& .unit-icon': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'scale(1.1)'
                    }
                  },
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 3,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  width: '100%'
                }}
                onClick={() => onSelectUnit(unit)}
              >
                <CardContent 
                  sx={{ 
                    p: 2.5, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    '&:last-child': { pb: 2.5 }
                  }}
                >
                  {/* Icon Section */}
                  <Box
                    className="unit-icon"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'primary.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.5,
                      transition: 'all 0.3s ease',
                      border: '2px solid',
                      borderColor: 'primary.100'
                    }}
                  >
                    <ShieldIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  </Box>
                  
                  {/* Content Section */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="600" 
                      sx={{ 
                        mb: 0.5,
                        fontSize: '0.85rem',
                        lineHeight: 1.2,
                        height: '2.4em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: 'text.primary'
                      }}
                    >
                      {unit.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1.5, 
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}
                    >
                      {unit.code}
                    </Typography>
                  </Box>
                  
                  {/* Status Section */}
                  <Box>
                    <Chip
                      label={`${unit.current}/${unit.capacity} คน`}
                      size="small"
                      color={unit.current >= unit.capacity ? 'error' : 'success'}
                      variant="filled"
                      sx={{ 
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        minWidth: 70,
                        height: 24,
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
