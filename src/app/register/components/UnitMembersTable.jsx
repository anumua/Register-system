'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Avatar,
  Box,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Divider,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Person as PersonIcon, Badge as BadgeIcon, SearchRounded as SearchIcon, Warning as WarningIcon } from '@mui/icons-material';

export default function UnitMembersTable({
  subunits = [],
  selectedUnit,
  onSelectSubunit,
  unitData = [],
  loading,
  onDeleteClick,
  onPositionClick,
  studentData,
  militaryUnits = []
}) {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    position: null
  });

  const handlePositionClick = (position) => {
    setConfirmDialog({
      open: true,
      position: position
    });
  };

  const handleConfirmAssign = () => {
    if (confirmDialog.position && onPositionClick) {
      onPositionClick(confirmDialog.position);
    }
    setConfirmDialog({
      open: false,
      position: null
    });
  };

  const handleCancelAssign = () => {
    setConfirmDialog({
      open: false,
      position: null
    });
  };
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          กำลังโหลดข้อมูล...
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <BadgeIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: -0.5
              }}
            >
              เลือกตำแหน่งในหน่วย
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5, fontWeight: 400 }}>
            เลือกหน่วยเพื่อดูและจัดการตำแหน่งในหน่วยงาน
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, opacity: 0.6 }} />

        {/* Locked Unit Notice */}
        {studentData?.fix_unit && (
          <Box sx={{
            mb: 3,
            p: 2,
            backgroundColor: alpha('#ff9800', 0.1),
            border: '1px solid',
            borderColor: alpha('#ff9800', 0.3),
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
              🔒 หน่วยถูกกำหนดไว้แล้ว: {studentData.fix_unit}
            </Typography>
          </Box>
        )}

        {/* Search Section */}
        <Autocomplete
          options={subunits}
          getOptionLabel={(option) => `${option.name}`}
          value={selectedUnit}
          onChange={(e, val) => onSelectSubunit && onSelectSubunit(val)}
          disabled={!!studentData?.fix_unit}
          renderInput={(params) => (
            <TextField
              {...params}
              label={studentData?.fix_unit ? "หน่วย (กำหนดแล้ว)" : "ค้นหาหน่วย"}
              placeholder={studentData?.fix_unit ? "หน่วยถูกกำหนดแล้ว" : "กรุณาเลือกหน่วย..."}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon sx={{ color: studentData?.fix_unit ? 'text.disabled' : 'text.secondary', ml: 1, mr: -0.5 }} />
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
            />
          )}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: alpha('#1976d2', 0.02)
              },
              '&.Mui-focused': {
                backgroundColor: 'background.paper'
              }
            }
          }}
          ListboxProps={{
            sx: {
              '& .MuiAutocomplete-option': {
                fontSize: '0.95rem',
                py: 1.5,
                borderRadius: 1,
                mx: 1,
                '&:hover': {
                  backgroundColor: alpha('#1976d2', 0.08)
                },
                '&.Mui-focused': {
                  backgroundColor: alpha('#1976d2', 0.12)
                }
              }
            }
          }}
        />

        {!selectedUnit ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              backgroundColor: alpha('#1976d2', 0.02),
              border: '2px dashed',
              borderColor: alpha('#1976d2', 0.2),
              borderRadius: 3,
              transition: 'all 0.3s ease'
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: alpha('#1976d2', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3
              }}
            >
              <BadgeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              กรุณาเลือกหน่วย
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              เลือกหน่วยจากช่องค้นหาด้านบน เพื่อแสดงรายการตำแหน่งและข้อมูลสมาชิกในหน่วยงาน
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Unit Info Header */}
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                backgroundColor: alpha('#1976d2', 0.04),
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#1976d2', 0.1),
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 30, color: 'text.primary', flex: 1 }}>
                {selectedUnit.name}
              </Typography>


              <Chip
                label={`ทั้งหมด ${unitData.length}`}
                size="medium"

                sx={{
                  bgcolor: '#1055C9',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 500,
                  px: 1,
                  borderRadius: 2
                }}
              />
              <Chip
                label={`เลือกแล้ว ${unitData.filter(p => p.studentNumber).length} `}

                color="error"
                sx={{
                  bgcolor: '#05339C',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 500,
                  px: 1,
                  borderRadius: 2
                }}
              />
              <Chip
                label={`${(unitData.length - unitData.filter(p => p.studentNumber).length) > 0 ? `ว่าง ${unitData.length - unitData.filter(p => p.studentNumber).length}` : 'เต็ม'}`}
                size="medium"
                color={
                  (unitData.length - unitData.filter(p => p.studentNumber).length) > 0
                    ? 'success'
                    : 'error'
                }
                sx={{
                  fontSize: 20,
                  fontWeight: 500,
                  px: 1,
                  borderRadius: 2,
                }}
              />



            </Box>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: 'white', py: 2.5, fontSize: '0.95rem' }}>
                      ลำดับ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white', py: 2.5, fontSize: '0.95rem' }}>
                      ชื่อตำแหน่ง
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white', py: 2.5, fontSize: '0.95rem' }}>
                      รหัสนักเรียน
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white', py: 2.5, fontSize: '0.95rem' }}>
                      ชื่อ-นามสกุล
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white', py: 2.5, fontSize: '0.95rem', textAlign: 'center' }}>
                      การดำเนินการ
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {[...unitData]
                    .sort((a, b) => {
                      const ai = a.pos_index ?? Number.POSITIVE_INFINITY;
                      const bi = b.pos_index ?? Number.POSITIVE_INFINITY;
                      return ai - bi;
                    })
                    .map((pos, index) => {
                      const isEmpty = !pos.studentId;
                      const canAssign = isEmpty && !!studentData;
                      const studentHasAssignedPosition = !!studentData && !!studentData.assigned;
                      
                      // ตรวจสอบว่าชื่อนักเรียนอยู่ในตำแหน่งใดตำแหน่งหนึ่งแล้วหรือไม่ (ตรวจสอบทุกหน่วย)
                      const studentNameExists = !!studentData && militaryUnits.some(unit =>
                        unit.subunits.some(subunit =>
                          subunit.positions.some(pos =>
                            pos.occupiedBy && pos.occupiedBy.trim() === studentData.name.trim()
                          )
                        )
                      );
                      
                      const paddedId = String(pos.studentId).padStart(3, '0');
                      //console.log('Rendering position:', pos, 'Can assign:', canAssign);
                      console.log(studentData, 'studentData')
                      console.log('test', studentData?.assigned)

                      return (
                        <TableRow
                          key={pos.id}
                          hover={canAssign}
                          sx={{
                            cursor: canAssign ? 'pointer' : 'default',
                            backgroundColor: index % 2 === 0 ? 'background.paper' : alpha('#000', 0.02),
                            transition: 'all 0.2s ease',
                            '&:hover': canAssign ? {
                              backgroundColor: alpha('#4caf50', 0.08),
                              transform: 'scale(1.002)'
                            } : {},
                          }}
                        >
                          <TableCell sx={{ py: 3, fontFamily: 'monospace', fontWeight: 600, color: 'primary.main', fontSize: '1rem' }}>
                            {pos.pos_index || '—'}
                          </TableCell>

                          <TableCell sx={{ py: 3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '1.3rem', color: 'text.primary' }}>
                              {pos.positionName}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '1.1rem', color: "#3e78ff" }}>{pos.positionCode}</Typography>
                          </TableCell>

                          <TableCell sx={{ py: 3 }}>
                            {pos.studentNumber ? (
                              <Chip
                                label={pos.studentNumber}
                                size="small"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  backgroundColor: alpha('#1976d2', 0.1),
                                  color: 'primary.main',
                                  borderRadius: 1.5
                                }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500 }}>
                                ไม่มีข้อมูล
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell sx={{ py: 3 }}>
                            {(pos.studentId || pos.name) ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={
                                    process.env.NEXT_PUBLIC_PICTURE_NCO
                                      ? `/${process.env.NEXT_PUBLIC_PICTURE_NCO}/${paddedId}.jpg`
                                      : undefined
                                  }
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    border: '3px solid',
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    bgcolor: alpha('#1976d2', 0.1),
                                    color: 'primary.main',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.15)',
                                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                                    },
                                    '& img': {
                                      objectFit: 'cover',
                                      objectPosition: 'top'
                                    }
                                  }}
                                >
                                  <PersonIcon sx={{ fontSize: 32 }} />
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  นนส. {pos.name || 'ไม่ระบุ'}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500 }}>
                                ไม่มีข้อมูล
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell sx={{ py: 3, textAlign: 'center' }}>
                            {pos.studentNumber ? (
                              <Chip
                                label="ไม่ว่าง"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: alpha('#f44336', 0.1),
                                  color: 'error.main',
                                  borderRadius: 1.5,
                                  border: '1px solid',
                                  borderColor: alpha('#f44336', 0.3)
                                }}
                              />
                            ) : !studentData ? (
                              <Chip
                                label="ว่าง"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: alpha('#4caf50', 0.1),
                                  color: 'success.main',
                                  borderRadius: 1.5,
                                  border: '1px solid',
                                  borderColor: alpha('#4caf50', 0.3)
                                }}
                              />
                            ) : studentHasAssignedPosition || (pos?.pos_king != null && (studentData?.nco_king == null || studentData?.nco_king.trim() === '')) ? (
                              <Chip
                                label="ว่าง"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: alpha('#4caf50', 0.1),
                                  color: 'success.main',
                                  borderRadius: 1.5,
                                  border: '1px solid',
                                  borderColor: alpha('#4caf50', 0.3)
                                }}
                              />
                            ) : studentData?.assigned || studentNameExists ? (
                              <Chip
                                label="ว่าง"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: alpha('#4caf50', 0.1),
                                  color: 'success.main',
                                  borderRadius: 1.5,
                                  border: '1px solid',
                                  borderColor: alpha('#4caf50', 0.3)
                                }}
                              />
                            ) : (
                              <Button
                                variant="contained"
                                color="success"
                                size="medium"
                                startIcon={<AddIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePositionClick(pos);
                                }}
                                sx={{
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  px: 3,
                                  py: 1,
                                  borderRadius: 2,
                                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                เพิ่มเข้าตำแหน่ง
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {unitData.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: alpha('#9e9e9e', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2
                  }}
                >
                  <BadgeIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  ไม่พบข้อมูลตำแหน่งในหน่วยนี้
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelAssign}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: alpha('#ff9800', 0.05),
          borderBottom: '1px solid',
          borderColor: alpha('#ff9800', 0.2)
        }}>
          <WarningIcon sx={{ color: 'warning.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            ยืนยันการเพิ่มเข้าตำแหน่ง
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <DialogContentText
            sx={{
              marginTop: 2,
              fontSize: '2rem',
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 2,
            }}
          >
            <strong>นนส. {studentData?.name || 'นักเรียน'}</strong>
          </DialogContentText>

          {confirmDialog.position && (
            <Box
              sx={{
                p: 2.5,
                backgroundColor: alpha('#1976d2', 0.05),
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#1976d2', 0.15),
                width:500,
                mb: 2,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: '2.0rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                {confirmDialog.position.positionName} {confirmDialog.position.unit_name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '1.5rem',
                }}
              >
                ({confirmDialog.position.positionCode})
              </Typography>
            </Box>
          )}
        </DialogContent>


        <DialogActions sx={{
          p: 3,
          pt: 2,
          gap: 2,
          backgroundColor: alpha('#f5f5f5', 0.5)
        }}>
          <Button
            onClick={handleCancelAssign}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              borderColor: 'text.secondary',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.primary',
                color: 'text.primary',
                backgroundColor: alpha('#000', 0.04)
              }
            }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleConfirmAssign}
            variant="contained"
            color="success"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            ยืนยันการเพิ่ม
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}