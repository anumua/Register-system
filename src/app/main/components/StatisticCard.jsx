'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function StatisticCard({ icons, title, value, unit, color = '#2563eb' }) {
  return (
    <Card 
      sx={{ 
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
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box 
            sx={{ 
              color: color,
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.5rem',
              p: 1,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
              boxShadow: `0 2px 8px ${color}20`
            }}
          >
            {icons}
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.875rem',
            fontWeight: 600,
            mb: 0.5,
            lineHeight: 1.2,
            color: '#64748b'
          }}
        >
          {title}
        </Typography>
        
        <Box display="flex" alignItems="baseline" gap={0.5}>
          <Typography 
            variant="h5" 
            component="div"
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#1e293b',
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>
          {unit && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#64748b'
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}