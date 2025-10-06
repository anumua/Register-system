'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Container, Grid } from '@mui/system';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";


export default function MenuItemCard({ key, icons, title, subtitile, pagename, color = '#2563eb' }) {
  const router = useRouter();

  const handleEnter = async () => {
    router.push(pagename);
  };

  return (
    <>
      <Card sx={{
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
        border: '1px solid rgba(37, 99, 235, 0.1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
          transform: 'translateY(-4px)',
          borderColor: 'rgba(37, 99, 235, 0.2)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '50px 1fr', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                p: 1,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
                boxShadow: `0 2px 8px ${color}20`
              }}
            >
              {icons}
            </Box>
            <Box>
              <Typography variant='body1' sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>{title}</Typography>
              <Typography fontSize={12} color='#64748b' variant='body2' sx={{ fontWeight: 500 }}>{subtitile}</Typography>
            </Box>
          </Box>
          <Button
            variant='contained'
            sx={{
              borderRadius: 2,
              height: '40px',
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: `0 4px 12px ${color}30`,
              '&:hover': {
                background: `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`,
                boxShadow: `0 6px 16px ${color}40`,
                transform: 'translateY(-1px)',
              }
            }}
            fullWidth
            onClick={handleEnter}
          >
            เข้าใช้งาน
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
