'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  Collapse
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

export default function UnitMembersTable({ 
  selectedUnit, 
  unitData, 
  loading, 
  onDeleteClick,
  onPositionClick,
  studentData
}) {
  if (!selectedUnit) return null;

  // สร้าง map ของสมาชิกที่มีอยู่ตาม subunit และ position
  const membersBySubunit = {};
  unitData.forEach(member => {
    if (member.subunitId) {
      if (!membersBySubunit[member.subunitId]) {
        membersBySubunit[member.subunitId] = {};
      }
      membersBySubunit[member.subunitId][member.positionCode] = member;
     
    }
  });

  const [expandedSubunits, setExpandedSubunits] = React.useState({});

  const toggleSubunit = (subunitId) => {
    setExpandedSubunits(prev => ({
      ...prev,
      [subunitId]: !prev[subunitId]
    }));
  };

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          หน่วยย่อยในหน่วย {selectedUnit.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          คลิกหน่วยย่อยเพื่อดูตำแหน่งและลำดับที่ว่าง
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '40px' }}></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>หน่วยย่อย</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>จำนวนตำแหน่ง</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>สถานะ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>รายละเอียด</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedUnit.subunits?.map((subunit) => {
                  const subunitMembers = membersBySubunit[subunit.name] || {};
                  const occupiedSlots = Object.keys(subunitMembers).length;
                  const isExpanded = expandedSubunits[subunit.name];
                  const memberNames = Object.values(membersBySubunit)
                    .flatMap(subunit => Object.values(subunit))
                    .map(student => student.name);

                  const isAssigned = !memberNames.includes(studentData?.name);
                                

               
                 
                  return (
                    <React.Fragment key={subunit.id}>
                      {/* Subunit Header Row */}
                      <TableRow 
                        sx={{ 
                          backgroundColor: 'primary.50',
                          '&:hover': { backgroundColor: 'primary.100' }
                        }}
                      >
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => toggleSubunit(subunit.name)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold" color="primary.dark">
                              {subunit.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              หน่วยย่อย
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${occupiedSlots}/${subunit.capacity} ตำแหน่ง`}
                            size="small"
                            color={occupiedSlots >= subunit.capacity ? 'error' : 'success'}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {occupiedSlots === 0 ? 'ว่างทั้งหมด' : 
                             occupiedSlots === subunit.capacity ? 'เต็มแล้ว' : 
                             `ว่าง ${subunit.capacity - occupiedSlots} ตำแหน่ง`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            คลิกเพื่อ{isExpanded ? 'ซ่อน' : 'แสดง'}ตำแหน่ง
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => toggleSubunit(subunit.name)}
                            sx={{ minWidth: 80 }}
                          >
                            {isExpanded ? 'ซ่อน' : 'แสดง'}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Subunit Positions */}
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0, border: 'none' }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                                ตำแหน่งในหน่วยย่อย {subunit.name}
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' ,width:'200px'}}>ตำแหน่ง</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' ,width:'170px'}}>เลขที่ตำแหน่ง</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', width:'170px'}}>รหัสนักเรียน</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' ,width:'400px'}}>ผู้ดำรงตำแหน่ง</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>จัดการ</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {subunit.positions?.map((position) => {
                                    const assignedMember = subunitMembers[position.code];
                                    const isEmpty = !assignedMember;
                                    const canAssign = isEmpty && studentData && isAssigned; // isAssigned is check student in list data
                                 
                                   
                                   
                                    return (
                                      <TableRow 
                                        key={`${subunit.id}-${position.order}`}
                                        hover={canAssign}
                                        sx={{
                                          cursor: canAssign ? 'pointer' : 'default',
                                          backgroundColor: isEmpty ? 'success.25' : 'inherit',
                                          '&:hover': canAssign ? {
                                            backgroundColor: 'success.50'
                                          } : {}
                                        }}
                                        onClick={() => canAssign && onPositionClick({
                                          posId: position.posId,
                                          subunitName: subunit.name,
                                          order: position.order,
                                          code: position.code,
                                          name: position.name
                                        })}
                                      >
                                        <TableCell>
                                          <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                              {position.name || 'ตำแหน่ง'}
                                            </Typography>
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                            {position.code}
                                            </Typography>
                                            {isEmpty && canAssign && (
                                              <Chip 
                                                label="ว่าง" 
                                                size="small" 
                                                color="warning" 
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                              />
                                            )}
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2" color="text.secondary">
                                            {assignedMember ? assignedMember.studentId : '-'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          {assignedMember ? (
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                              <Avatar sx={{ width: 28, height: 28 }}>
                                                <PersonIcon sx={{ fontSize: 16 }} />
                                              </Avatar>
                                              <Typography variant="body2">
                                                นนส. {assignedMember.name}
                                              </Typography>
                                            </Box>
                                          ) : (
                                            <Typography variant="body2" color="text.secondary">
                                              {canAssign ? 'คลิกเพื่อเพิ่ม' : '-'}
                                            </Typography>
                                          )}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                          {assignedMember ? (
                                            <Button
                                              variant="outlined"
                                              color="error"
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteClick(assignedMember);
                                              }}
                                              startIcon={<DeleteIcon />}
                                              sx={{
                                                minWidth: 70,
                                                fontSize: '0.75rem',
                                                '&:hover': {
                                                  backgroundColor: 'error.50'
                                                }
                                              }}
                                            >
                                              ลบ
                                            </Button>
                                          ) : canAssign ? (
                                            <Button
                                              variant="contained"
                                              color="success"
                                              size="small"
                                              startIcon={<AddIcon />}
                                              sx={{ 
                                                minWidth: 70,
                                                fontSize: '0.75rem'
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onPositionClick({
                                                  posId: position.posId,
                                                  subunitName: subunit.name,
                                                  order: position.order,
                                                  code: position.code,
                                                  name: position.name
                                                });
                                              }}
                                            >
                                              เพิ่ม
                                            </Button>
                                          ) : (
                                            <Typography variant="body2" color="text.disabled">
                                              -
                                            </Typography>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
