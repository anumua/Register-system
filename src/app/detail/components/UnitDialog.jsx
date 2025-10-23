import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Typography, Avatar, Box, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Divider,
  Skeleton, Alert
} from '@mui/material';
import { 
  Groups, Close, Badge, Person as PersonIcon,
  CheckCircle, EventSeat
} from '@mui/icons-material';
import useSWR from 'swr';

// Fetcher function with better error handling
const fetcher = async (url) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`ไม่สามารถโหลดข้อมูลได้ (${res.status})`);
  }
  return res.json();
};

export default function UnitDialog({ open, onClose, selectedUnit, isMobile, isSmallMobile }) {
  if (!selectedUnit) return null;

  // Fetch unit data with SWR
  const { data: unitData, error, isLoading } = useSWR(
    open && selectedUnit?.unit_name 
      ? `/api/detail/${selectedUnit.unit_name}/${selectedUnit.subunit_name}` 
      : null,
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000
    }
  );

  // Safe array handling
  const positions = Array.isArray(unitData?.positions) ? unitData.positions : [];
  
  // Statistics calculation
  const stats = {
    total: positions.length,
    current: positions.filter(r => r.nco_number).length,
    vacant: positions.filter(r => r.nco_number === null).length,
    percentage: positions.length > 0 
      ? Math.round((positions.filter(r => r.nco_number).length / positions.length) * 100) 
      : 0
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Box sx={{ p: 3 }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isSmallMobile}
      PaperProps={{ 
        sx: { 
          borderRadius: isSmallMobile ? 0 : 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        } 
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          pb: 2, 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                mr: 2, 
                width: isMobile ? 48 : 56, 
                height: isMobile ? 48 : 56,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <Groups sx={{ fontSize: isMobile ? 28 : 32, color: 'white' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="600" 
                sx={{ 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 0.5
                }}
              >
                {selectedUnit.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                {selectedUnit.subunit_name} ({selectedUnit.unit_name})
              </Typography>
              
              {/* Statistics Chips */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Badge sx={{ color: 'white' }} />}
                  label={`${stats.current}/${stats.total} คน (${stats.percentage}%)`}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.3)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<CheckCircle sx={{ color: 'white' }} />}
                  label={`มีกำลังพล ${stats.current}`}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                     '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<EventSeat sx={{ color: '#66bb6a' }} />}
                  label={`ว่าง ${stats.vacant}`}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(102, 187, 106, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    border: '1px solid rgba(102, 187, 106, 0.3)',
                     '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'rotate(90deg)',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent 
        sx={{ 
          p: 0, 
          bgcolor: '#f8f9fa',
          position: 'relative'
        }} 
        dividers
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
              }}
            >
              <Typography variant="body1" fontWeight="600">
                เกิดข้อผิดพลาด
              </Typography>
              <Typography variant="body2">
                {error.message}
              </Typography>
            </Alert>
          </Box>
        ) : positions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <EventSeat sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight="500">
              ไม่พบข้อมูลตำแหน่ง
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              ยังไม่มีข้อมูลตำแหน่งในหน่วยนี้
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ 
              maxHeight: isSmallMobile ? 'calc(100vh - 280px)' : 600,
              bgcolor: 'transparent'
            }}
          >
            <Table stickyHeader size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  {!isMobile && (
                    <TableCell 
                      sx={{ 
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white', 
                        fontWeight: 700,
                        py: 2.5,
                        fontSize: '0.9rem',
                        borderBottom: 'none',
                        textAlign: 'center',
                        width: '120px'
                      }}
                    >
                      เลขที่ตำแหน่ง
                    </TableCell>
                  )}
                  <TableCell 
                    sx={{ 
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      color: 'white', 
                      fontWeight: 700,
                      py: 2.5,
                      fontSize: '0.9rem',
                      borderBottom: 'none',
                      width: isMobile ? '40%' : '30%'
                    }}
                  >
                    ตำแหน่ง
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      color: 'white', 
                      fontWeight: 700,
                      py: 2.5,
                      fontSize: '0.9rem',
                      borderBottom: 'none'
                    }}
                  >
                    ชื่อ-นามสกุล
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((row, index) => {
                  const paddedId = String(row.nco_number).padStart(3, '0');
                  const isVacant = row.nco_number === null;
                  
                  return (
                    <TableRow
                      key={row.slotNumber || index}
                      sx={{
                        bgcolor: index % 2 === 0 ? 'white' : '#f8f9fa',
                        
                        transition: 'all 0.2s ease',
                        borderLeft: isVacant ? '4px solid #ff9800' : '4px solid transparent'
                      }}
                    >
                      {!isMobile && (
                        <TableCell 
                          sx={{ 
                            py: 2.5,
                            textAlign: 'center',
                            fontWeight: 600,
                            color: 'primary.main',
                            fontSize: '0.95rem'
                          }}
                        >
                          {row.pos_code}
                        </TableCell>
                      )}
                      <TableCell 
                        sx={{ 
                          py: isMobile ? 2 : 2.5,
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          color: 'text.primary'
                        }}
                      >
                        {row.pos_name}
                      </TableCell>
                      <TableCell sx={{ py: isMobile ? 2 : 2.5 }}>
                        {isVacant ? (
                          <Chip
                            icon={<EventSeat sx={{ fontSize: 16, color:'#3F7D58' }} />}
                            label="ว่าง"
                            size="small"
                            sx={{ 
                              fontWeight: 600,
                              minWidth: 80,
                              bgcolor: '#ECFAE5',
                              color: '#16610E',
                              border: '1px solid #3F7D58',
                              '&:hover': {
                                bgcolor: '#ffe0b2'
                              },
                              '& .MuiChip-icon': { color: '#3F7D58'}
                            }}
                          />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={
                                process.env.NEXT_PUBLIC_PICTURE_NCO
                                  ? `/${process.env.NEXT_PUBLIC_PICTURE_NCO}/${paddedId}.jpg`
                                  : undefined
                              }
                              sx={{
                                width: isMobile ? 44 : 64,
                                height: isMobile ? 44 : 64,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                border: '3px solid white',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.15)',
                                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                                  borderColor: '#1976d2'
                                },
                                '& img': {
                                  objectFit: 'cover',
                                  objectPosition: 'center top'
                                }
                              }}
                            >
                              <PersonIcon sx={{ fontSize: isMobile ? 24 : 36 }} />
                            </Avatar>
                            <Box>
                              <Typography 
                                variant="body2" 
                                fontWeight="600"
                                sx={{ 
                                  color: 'text.primary',
                                  fontSize: isMobile ? '0.85rem' : '0.95rem'
                                }}
                              >
                                นนส. {row.student_name}
                              </Typography>
                              {!isMobile && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ color: 'text.secondary' }}
                                >
                                  เลขที่ {paddedId}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions 
        sx={{ 
          px: isMobile ? 2 : 3, 
          py: 2.5, 
          bgcolor: 'white',
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1
        }}
      >
        <Button 
          onClick={onClose} 
          variant="contained" 
          fullWidth={isMobile}
          size="large"
          sx={{ 
            minWidth: isMobile ? 'auto' : 120,
            fontWeight: 600,
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
            }
          }}
        >
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}