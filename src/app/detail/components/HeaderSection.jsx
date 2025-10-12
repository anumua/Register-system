import { Box, Button, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function HeaderSection({ router, isMobile }) {
  return (
    <Box sx={{ mb: isMobile ? 2 : 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/main')}
        sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}
      >
        กลับหน้าหลัก
      </Button>

      <Box
        sx={{
          textAlign: 'center',
          py: isMobile ? 2 : 4,
          px: isMobile ? 2 : 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 8px 32px rgba(25,118,210,0.3)',
        }}
      >
        <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight="bold">
          ข้อมูลการลงทะเบียน
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ opacity: 0.9 }}>
          ดูสถานะการลงทะเบียนของแต่ละหน่วย
        </Typography>
      </Box>
    </Box>
  );
}
