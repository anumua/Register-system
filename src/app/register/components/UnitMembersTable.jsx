'use client';
import React from 'react';
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
  Divider
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Person as PersonIcon, Badge as BadgeIcon } from '@mui/icons-material';

export default function UnitMembersTable({
  subunits = [],
  selectedUnit,
  onSelectSubunit,
  unitData = [],
  loading,
  onDeleteClick,
  onPositionClick,
  studentData
}) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  return (
    <Card 
      sx={{
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
      }}}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mb: 0.5,
              letterSpacing: 0.3
            }}
          >
            จัดการตำแหน่งในหน่วยงาน
          </Typography>
          <Typography variant="body2" color="text.secondary">
            เลือกหน่วยเพื่อดูและจัดการตำแหน่งในหน่วยงาน
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Search Section */}
        <Autocomplete
          options={subunits}
          getOptionLabel={(option) => `${option.name} (${option.parentUnit})`}
          value={selectedUnit}
          onChange={(e, val) => onSelectSubunit && onSelectSubunit(val)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="ค้นหาหน่วยย่อย" 
              placeholder="กรุณาเลือกหน่วยย่อย..."
              variant="outlined"
            />
          )}
          sx={{ mb: 3 }}
          ListboxProps={{
            sx: {
              '& .MuiAutocomplete-option': {
                fontSize: '0.95rem',
                py: 1.5
              }
            }
          }}
        />

        {!selectedUnit ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              backgroundColor: 'grey.50',
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2
            }}
          >
            <BadgeIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
              กรุณาเลือกหน่วยย่อย
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เลือกหน่วยย่อยจากช่องค้นหาด้านบน เพื่อแสดงรายการตำแหน่งและข้อมูลสมาชิก
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Unit Info Header */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                หน่วยย่อย: {selectedUnit.name}
              </Typography>
              <Chip 
                label={`${unitData.length} ตำแหน่ง`} 
                size="small" 
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`${unitData.filter(p => p.studentNumber).length} คน`} 
                size="small" 
                color="success"
                variant="outlined"
              />
            </Box>

            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ fontWeight: 600, color: 'white', py: 2 }}>ลำดับตำแหน่ง</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', py: 2 }}>ชื่อตำแหน่ง</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', py: 2 }}>รหัสนักเรียน</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', py: 2 }}>ชื่อ-นามสกุล</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', py: 2, textAlign: 'center' }}>
                      การดำเนินการ
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {unitData.map((pos, index) => {
                    const isEmpty = !pos.studentId;
                    const canAssign = isEmpty && !!studentData;
                    const studentHasAssignedPosition = !!studentData && !!studentData.assigned;

                    console.log(pos)

                    return (
                      <TableRow
                        key={pos.id}
                        hover={canAssign}
                        sx={{
                          cursor: canAssign ? 'pointer' : 'default',
                          backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                          '&:hover': canAssign ? { 
                            backgroundColor: 'success.50',
                            transition: 'background-color 0.2s'
                          } : {},
                        }}
                      >
                        <TableCell sx={{ py: 2.5, fontFamily: 'monospace', fontWeight: 500 }}>
                          {pos.pos_index || '—'}
                        </TableCell>
                        
                        <TableCell sx={{ py: 2.5, fontWeight:1000 }}>
                          {pos.positionName}
                        </TableCell>
                        
                        <TableCell sx={{ py: 2.5, fontFamily: 'monospace' }}>
                          {pos.studentNumber ? (
                            <Chip 
                              label={pos.studentNumber} 
                              size="small"
                              sx={{ fontFamily: 'monospace' }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell sx={{ py: 2.5 }}>
                          {(pos.studentId || pos.name) ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar 
                                sx={{ 
                                  width: 36, 
                                  height: 36,
                                  backgroundColor: 'primary.main'
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 20 }} />
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 1000 }}>
                                นนส.{pos.name  || 'ไม่ระบุ'}
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Typography variant="body2" color="text.disabled">
                                <typography variant="body2" color="text.disabled">—</typography>
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell sx={{ py: 2.5, textAlign: 'center' }}>
                          {pos.studentNumber ? (
                            // กรณีมีนักเรียนอยู่ในตำแหน่งแล้ว
                            <Chip 
                              label="ไม่ว่าง" 
                              size="small" 
                              color="error"
                              variant="filled"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : !studentData ? (
                            // กรณียังไม่มีการค้นหานักเรียน
                            <Chip 
                              label="ว่าง" 
                              size="small" 
                              color="success"
                              variant="filled"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : studentHasAssignedPosition ? (
                            // กรณีค้นหานักเรียนแล้ว แต่นักเรียนมีตำแหน่งแล้ว
                            <Chip 
                              label="ว่าง" 
                              size="small" 
                              color="success"
                              variant="filled"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            // กรณีว่างและนักเรียนที่เลือกยังไม่มีตำแหน่ง => แสดงปุ่มเพิ่ม
                            <Button
                              variant="contained"
                              color="success"
                              size="medium"
                              startIcon={<AddIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                onPositionClick(pos);
                              }}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 3,
                                boxShadow: 'none',
                                '&:hover': {
                                  boxShadow: 1
                                }
                              }}
                            >
                              เพิ่ม
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
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  ไม่พบข้อมูลตำแหน่งในหน่วยย่อยนี้
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}