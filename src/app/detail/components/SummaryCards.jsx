import { Grid, Card, Typography, Box } from '@mui/material';

export default function SummaryCards({ allSubunits, isMobile }) {
  const totalRegistered = allSubunits.reduce((sum, su) => sum + (su.current || 0), 0);
  const totalVacant = allSubunits.reduce(
    (sum, su) => sum + Math.max((su.capacity || 0) - (su.current || 0), 0),
    0
  );

  const items = [
    { label: 'หน่วย', value: allSubunits.length, color: 'primary.main' },
    { label: 'เลือกตำแหน่งแล้ว', value: totalRegistered, color: 'success.main' },
    { label: 'ตำแหน่งว่าง', value: totalVacant, color: 'warning.main' },
  ];

  return (
    <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 0, sm: 0 } }}>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {items.map((item, i) => (
          <Grid item xs={4} sm={4} md={4} key={i}>
            <Card 
              elevation={2}
              sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2, md: 2.5 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                fontWeight="bold"
                color={item.color}
                sx={{ 
                  mb: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {item.value.toLocaleString()}
              </Typography>
              <Typography 
                variant={isMobile ? 'caption' : 'body2'} 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  lineHeight: 1.3,
                  px: { xs: 0.5, sm: 1 }
                }}
              >
                {item.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}