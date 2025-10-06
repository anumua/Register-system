'use client';
import React from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

export default function DeleteConfirmDialog({ 
  open, 
  onClose, 
  studentToDelete, 
  loading, 
  onConfirmDelete 
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pb: 1 }}>
        <WarningIcon sx={{ fontSize: 28, color: 'warning.main', mb: 1, display: 'block', mx: 'auto' }} />
        ยืนยันการลบ
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          คุณต้องการลบนักเรียนคนนี้ออกจากหน่วยหรือไม่?
        </Typography>
        {studentToDelete && (
          <Paper sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="body1" fontWeight="bold" color="text.primary">
              {studentToDelete.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              รหัส: {studentToDelete.studentId} • {studentToDelete.rank}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เข้าร่วมเมื่อ: {studentToDelete.joinDate}
            </Typography>
          </Paper>
        )}
       
      </DialogContent>
      
      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
          disabled={loading}
        >
          ยกเลิก
        </Button>
        <Button
          onClick={onConfirmDelete}
          variant="contained"
          color="error"
          sx={{ minWidth: 100 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          {loading ? 'กำลังลบ...' : 'ลบ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
