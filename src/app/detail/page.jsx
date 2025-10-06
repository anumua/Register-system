'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DetailPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load real data from API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/positions', { cache: 'no-store' });
        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
        const data = await res.json();
        setUnits(data.units || []);
      } catch (e) {
        setError('ไม่สามารถโหลดข้อมูลตำแหน่งได้');
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  console.log(units);
  // Build combined roster from real positions grouped by subunit
  const buildCombinedRoster = (unit) => {
    if (!unit) return [];
    const rows = [];
    unit.subunits.forEach((sub, subIndex) => {
      const positions = [...(sub.positions || [])];
      positions.sort((a, b) => {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        return ao - bo;
      });

      console.log(positions)
      positions.forEach((p, idx) => {
        console.log(p)
        rows.push({
          departmentId: subIndex + 1,
          departmentName: sub.subunitName,
          slotNumber: p.code,
          name: p.occupiedBy && p.occupiedBy.trim() !== "" ? `นนส. ${p.occupiedBy.trim()}` : "ว่าง",
          status: p.status === 'occupied' ? 'ไม่ว่าง' : 'ว่าง',
          position_name: p.name
        });
      });
    });
    return rows;
  };

  // Function สำหรับเปิด dialog รายละเอียดหน่วย
  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setDialogOpen(true);
  };

  // Function สำหรับปิด dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUnit(null);
  };

  // Function สำหรับคำนวณสถานะหน่วย
  const getUnitStatus = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage === 100) return { status: 'full', color: 'error', label: 'เต็ม' };
    if (percentage >= 80) return { status: 'almost-full', color: 'warning', label: 'ใกล้เต็ม' };
    return { status: 'available', color: 'success', label: 'ว่าง' };
  };


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/main')}
          sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}
          size={isMobile ? 'small' : 'medium'}
        >
          กลับหน้าหลัก
        </Button>

        <Box sx={{
          textAlign: 'center',
          py: isMobile ? 2 : 4,
          px: isMobile ? 2 : 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
        }}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: isMobile ? '1.75rem' : '3rem' }}
          >
            📊 รายละเอียดการลงทะเบียน
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              opacity: 0.9,
              fontSize: isMobile ? '0.875rem' : '1.25rem',
              lineHeight: 1.4
            }}
          >
            ดูสถานะการลงทะเบียนของแต่ละหน่วยและรายชื่อสมาชิก
          </Typography>
        </Box>
      </Box>

      {/* Summary Statistics */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 3 : 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{
            textAlign: 'center',
            p: isMobile ? 1.5 : 2,
            minHeight: isMobile ? 80 : 'auto'
          }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              color="primary"
              fontWeight="bold"
              sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
            >
              {units.length}
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              หน่วยทั้งหมด
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{
            textAlign: 'center',
            p: isMobile ? 1.5 : 2,
            minHeight: isMobile ? 80 : 'auto'
          }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              color="success.main"
              fontWeight="bold"
              sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
            >
              {units.reduce((sum, unit) => {
                const unitCurrent = (unit.subunits || []).reduce((s, su) => s + (su.current || 0), 0);
                return sum + unitCurrent;
              }, 0)}
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              ลงทะเบียนแล้ว
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{
            textAlign: 'center',
            p: isMobile ? 1.5 : 2,
            minHeight: isMobile ? 80 : 'auto'
          }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              color="error.main"
              fontWeight="bold"
              sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
            >
              {units.filter(u => {
                const current = (u.subunits || []).reduce((s, su) => s + (su.current || 0), 0);
                const capacity = (u.subunits || []).reduce((s, su) => s + (su.capacity || 0), 0);
                return capacity > 0 && current >= capacity;
              }).length}
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              หน่วยที่เต็ม
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{
            textAlign: 'center',
            p: isMobile ? 1.5 : 2,
            minHeight: isMobile ? 80 : 'auto'
          }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              color="warning.main"
              fontWeight="bold"
              sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
            >
              {units.reduce((sum, unit) => {
                const capacity = (unit.subunits || []).reduce((s, su) => s + (su.capacity || 0), 0);
                const current = (unit.subunits || []).reduce((s, su) => s + (su.current || 0), 0);
                return sum + Math.max(capacity - current, 0);
              }, 0)}
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              ตำแหน่งว่าง
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Units Grid */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        gutterBottom
        sx={{
          mb: isMobile ? 2 : 3,
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}
      >
        รายการหน่วยทหาร
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: isMobile ? 2 : 3,
          alignItems: 'stretch'
        }}
      >
        {units.map((unit, idx) => {
          const unitCapacity = (unit.subunits || []).reduce((s, su) => s + (su.capacity || 0), 0);
          const unitCurrent = (unit.subunits || []).reduce((s, su) => s + (su.current || 0), 0);
          const unitStatus = getUnitStatus(unitCurrent, unitCapacity || 1);
          const percentage = unitCapacity ? (unitCurrent / unitCapacity) * 100 : 0;

          return (
            <Card
              key={unit.unitName + String(idx)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-4px)',
                  boxShadow: isMobile ? 2 : 4
                }
              }}
              onClick={() => handleUnitClick(unit)}
            >
              <CardContent sx={{
                p: isMobile ? 2 : 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: isMobile ? 280 : 320,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{
                    bgcolor: 'primary.main',
                    mr: isMobile ? 1.5 : 2,
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40
                  }}>
                    <GroupsIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      fontWeight="bold"
                      noWrap
                      sx={{
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        lineHeight: 1.2
                      }}
                    >
                      {unit.unitName}
                    </Typography>
                    <Typography
                      variant={isMobile ? "caption" : "body2"}
                      color="text.secondary"
                      noWrap
                      sx={{
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        lineHeight: 1.2
                      }}
                    >
                      หน่วยย่อย: {(unit.subunits || []).length} หน่วยย่อย
                    </Typography>
                  </Box>
                  <Chip
                    label={unitStatus.label}
                    color={unitStatus.color}
                    size={isMobile ? "small" : "medium"}
                    sx={{ fontSize: isMobile ? '0.7rem' : '0.8125rem' }}
                    icon={
                      unitStatus.status === 'full' ? <WarningIcon sx={{ fontSize: isMobile ? 14 : 16 }} /> :
                        unitStatus.status === 'almost-full' ? <InfoIcon sx={{ fontSize: isMobile ? 14 : 16 }} /> :
                          <CheckCircleIcon sx={{ fontSize: isMobile ? 14 : 16 }} />
                    }
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      variant={isMobile ? "caption" : "body2"}
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      ลงทะเบียนแล้ว: {unitCurrent}/{unitCapacity} คน
                    </Typography>
                    <Typography
                      variant={isMobile ? "caption" : "body2"}
                      fontWeight="bold"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      {percentage.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    color={unitStatus.color}
                    sx={{ height: isMobile ? 6 : 8, borderRadius: 4 }}
                  />
                </Box>

                <Divider sx={{ my: isMobile ? 1.5 : 2 }} />

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                  >
                    หน่วยย่อยในหน่วย:
                  </Typography>
                  <Stack spacing={isMobile ? 0.5 : 1} sx={{ flex: 1, minHeight: isMobile ? 80 : 100 }}>
                    {(unit.subunits || []).slice(0, isMobile ? 3 : 4).map((su, suIdx) => (
                      <Box key={String(suIdx)} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: isMobile ? '0.7rem' : '0.75rem',
                            flex: 1,
                            pr: 1
                          }}
                          noWrap
                        >
                          {su.subunitName}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                        >
                          {su.current}/{su.capacity}
                        </Typography>
                      </Box>
                    ))}
                    {(unit.subunits || []).length > (isMobile ? 3 : 4) && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: isMobile ? '0.65rem' : '0.7rem',
                          fontStyle: 'italic',
                          textAlign: 'center'
                        }}
                      >
                        และอีก {(unit.subunits || []).length - (isMobile ? 3 : 4)} หน่วยย่อย
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    mt: isMobile ? 1.5 : 2,
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    alignSelf: 'flex-end'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnitClick(unit);
                  }}
                >
                  ดูรายละเอียด
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Unit Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth={isMobile ? "sm" : "lg"}
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            minHeight: isMobile ? (isSmallMobile ? '100vh' : '90vh') : '80vh',
            margin: isMobile ? (isSmallMobile ? 0 : 1) : 2
          }
        }}
      >
        {selectedUnit && (
          <>
            <DialogTitle sx={{ pb: 1, px: isMobile ? 2 : 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: 0
                }}>
                  <Avatar sx={{
                    bgcolor: 'primary.main',
                    mr: isMobile ? 1.5 : 2,
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40
                  }}>
                    <GroupsIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      fontWeight="bold"
                      noWrap
                      sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                    >
                      {selectedUnit.name}
                    </Typography>
                    <Typography
                      variant={isMobile ? "caption" : "body2"}
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      รหัส: {selectedUnit.code} | {selectedUnit.current}/{selectedUnit.capacity} คน
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleCloseDialog}
                  size={isMobile ? "small" : "medium"}
                >
                  <CloseIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12}>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    fontWeight="bold"
                    gutterBottom
                    sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                  >
                    รายชื่อสมาชิกและตำแหน่งทั้งหมด
                  </Typography>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      maxHeight: isSmallMobile
                        ? 'calc(100vh - 240px)'
                        : (isMobile ? '60vh' : '65vh'),
                      minHeight: isSmallMobile ? 'calc(100vh - 240px)' : undefined,
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    <Table
                      stickyHeader
                      size={isMobile ? "small" : "medium"}
                      sx={{ tableLayout: 'fixed' }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            width: isSmallMobile ? '30%' : '18%'
                          }}>
                            หน่วยย่อย
                          </TableCell>


                          <TableCell sx={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            width: isSmallMobile ? '27%' : '18%'
                          }}>
                            ตำแหน่ง
                          </TableCell>


                          {!isSmallMobile && (
                            <TableCell sx={{
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              width: '15%'
                            }}>
                              เลขที่ตำแหน่ง
                            </TableCell>
                          )}
                          <TableCell sx={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            width: isSmallMobile ? '44%' : '44%'
                          }}>
                            {isMobile ? 'ชื่อ' : 'ชื่อ-นามสกุล'}
                          </TableCell>

                          {!isSmallMobile && (
                            <TableCell sx={{
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              width: isSmallMobile ? '20%' : '16%'
                            }}>
                              สถานะ
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {buildCombinedRoster(selectedUnit).map((row, index) => (
                          <TableRow key={`${row.departmentId}-${row.slotNumber}-${index}`} hover>
                            <TableCell sx={{
                              fontSize: isMobile ? '0.7rem' : '0.875rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',

                            }}>
                              {row.departmentName}
                            </TableCell>


                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: isMobile ? '0.7rem' : '0.875rem',
                                  lineHeight: 1.2,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  flex: 1,
                                  minWidth: 0
                                }}
                                noWrap
                              >
                                {row.position_name}
                              </Typography>
                            </TableCell>

                            {!isSmallMobile && (
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: isMobile ? '0.7rem' : '0.875rem',
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1,
                                    minWidth: 0
                                  }}
                                  noWrap
                                >
                                  {row.slotNumber}
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell sx={{ maxWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0.5 : 1, minWidth: 0 }}>
                                {!isSmallMobile && row.name !== "ว่าง" && (
                                  <Avatar sx={{
                                    width: isMobile ? 20 : 24,
                                    height: isMobile ? 20 : 24
                                  }}>
                                    <PersonIcon sx={{ fontSize: isMobile ? 12 : 14 }} />
                                  </Avatar>
                                )}
                                {row.name === 'ว่าง' ? (
                                  <Chip
                                    label={row.name}
                                    size="small"
                                    color='success'
                                    variant='filled'
                                    sx={{ fontSize: isMobile ? '0.6rem' : '0.75rem' }}
                                  />

                                ) : <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: isMobile ? '0.7rem' : '0.875rem',
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1,
                                    minWidth: 0
                                  }}
                                  noWrap
                                >
                                  {row.name}
                                </Typography>}

                              </Box>
                            </TableCell>
                            <TableCell>
                              {!isSmallMobile && (
                                <Chip
                                  label={row.status}
                                  size="small"
                                  color={row.status === 'ว่าง' ? 'success' : 'error'}
                                  variant={row.status === 'ว่าง' ? 'filled' : 'outlined'}
                                  sx={{ fontSize: isMobile ? '0.6rem' : '0.75rem' }}
                                />
                              )}

                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{
              p: isMobile ? 2 : 3,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1 : 0
            }}>

              <Button
                onClick={handleCloseDialog}
                fullWidth={isMobile}
                size={isMobile ? "medium" : "large"}
                sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
              >
                ปิด
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
