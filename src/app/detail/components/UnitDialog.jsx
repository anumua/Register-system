import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Typography, Avatar, Box, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip
} from '@mui/material';
import { Groups, Person, Close, Badge } from '@mui/icons-material';
import useSWR from 'swr';

// fetcher SWR
const fetcher = async (url) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
  return res.json();
};

export default function UnitDialog({ open, onClose, selectedUnit, isMobile, isSmallMobile }) {
  if (!selectedUnit) return null;

  // เรียก API เฉพาะเมื่อ dialog เปิดและมี selectedUnit
  const { data: unitData, error, isLoading } = useSWR(
    open && selectedUnit?.unit_name ? `/api/detail/${selectedUnit.unit_name}/${selectedUnit.subunit_name}` : null,
    fetcher,
    { 
      refreshInterval: 3000,          
      revalidateOnFocus: true,        
      revalidateOnReconnect: true     
    }
  );
 

  // positions ป้องกัน undefined
  const positions = Array.isArray(unitData?.positions) ? unitData.positions : [];

  // นับจำนวน current และ vacant
  const currentCount = positions.filter(r => r.nco_number).length;
  const vacantCount = positions.filter(r => r.nco_number === null).length;

  console.log('UnitDialog data:', unitData, 'error:', error, 'isLoading:', isLoading);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isSmallMobile}
      PaperProps={{ sx: { borderRadius: isSmallMobile ? 0 : 2 } }}
    >
      <DialogTitle sx={{ pb: 2, bgcolor: 'grey.50', borderBottom: '2px solid', borderColor: 'primary.main' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}>
              <Groups sx={{ fontSize: isMobile ? 24 : 28 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" color="primary.main">
                {selectedUnit.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  หน่วย: {selectedUnit.subunit_name} ({selectedUnit.unit_name} )
                </Typography>
                <Chip 
                  icon={<Badge />}
                  label={`กำลังพล ${currentCount}/${positions.length} คน`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={`ว่าง ${vacantCount} ตำแหน่ง`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ bgcolor: 'grey.200', '&:hover': { bgcolor: 'grey.300' } }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 1 : 3, bgcolor: 'grey.50' }} dividers>
        {isLoading || !unitData ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              กำลังโหลดข้อมูล...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="error">
              โหลดข้อมูลล้มเหลว: {error.message}
            </Typography>
          </Box>
        ) : positions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              ไม่พบข้อมูลตำแหน่ง
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ maxHeight: isSmallMobile ? 'calc(100vh - 220px)' : 600, borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}
          >
            <Table stickyHeader size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                   {!isMobile && <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', py: 2 }}>เลขที่ตำแหน่ง</TableCell>}
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', py: 2 }}>ตำแหน่ง</TableCell>                
                  <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', py: 2 }}>ชื่อ-นามสกุล</TableCell>   
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((row, index) => (
                  <TableRow 
                    key={row.slotNumber || index} 
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'grey.50' }, 
                      '&:nth-of-type(even)': { bgcolor: 'white' }, 
                      '&:hover': { bgcolor: 'action.hover' } 
                    }}
                  >
                    {!isMobile && <TableCell sx={{ py: 2 }}>{row.pos_index}</TableCell>}
                    <TableCell sx={{ py: isMobile ? 1.5 : 2 }}>{row.pos_name}</TableCell>
                    <TableCell sx={{ py: isMobile ? 1.5 : 2 }}>
                      {row.nco_number === null ? (
                        <Chip 
                        label={'ว่าง'} 
                        color={'success'} 
                        size="small" 
                        sx={{ fontWeight: 'bold', minWidth: 70 }} 
                      />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, bgcolor: 'primary.light' }}>
                            <Person sx={{ fontSize: isMobile ? 16 : 18 }} />
                          </Avatar>
                          <Typography variant="body2">นนส. {row.student_name}</Typography>
                        </Box>
                      )}
                    </TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: isMobile ? 2 : 3, py: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'grey.300' }}>
        <Button onClick={onClose} variant="contained" fullWidth={isMobile} sx={{ minWidth: isMobile ? 'auto' : 100 }}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}
