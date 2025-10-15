import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Button,
  useTheme,
  alpha,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Groups as GroupsIcon,
  CheckCircle,
  Info,
  Warning,
  ArrowForward,
  Search,
  Clear
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';

const getUnitStatus = (current, capacity) => {
  const percentage = (current / capacity) * 100;
  if (percentage === 100) return { status: 'full', color: 'error', label: 'เต็ม' };
  if (percentage >= 80) return { status: 'almost-full', color: 'warning', label: 'ใกล้เต็ม' };
  return { status: 'available', color: 'success', label: 'ว่าง' };
};

export default function SubunitGrid({ allSubunits, onClick, isMobile }) {
  const theme = useTheme();

  // แยก state สำหรับ input กับ searchTerm จริง (debounce)
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // ⏳ debounce: อัปเดต searchTerm หลังหยุดพิมพ์ 300ms
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // 🧠 useMemo: กรองข้อมูลเฉพาะเมื่อ searchTerm เปลี่ยนจริง ๆ
  const filteredSubunits = useMemo(() => {
    const search = searchTerm.toLowerCase();
    if (!search) return allSubunits;
    return allSubunits.filter(
      (su) =>
        su.subunitName?.toLowerCase().includes(search) ||
        su.unitName?.toLowerCase().includes(search)
    );
  }, [searchTerm, allSubunits]);

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="ค้นหาหน่วย..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => {
                    setSearchInput('');
                    setSearchTerm('');
                  }}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <Clear sx={{ fontSize: 20 }} />
                </Button>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: theme.palette.background.paper,
                boxShadow: 2
              },
              '&.Mui-focused': {
                bgcolor: theme.palette.background.paper,
                boxShadow: 3
              }
            }
          }}
        />

        {searchTerm && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            พบ {filteredSubunits.length} จาก {allSubunits.length} หน่วย
          </Typography>
        )}
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(auto-fill, minmax(320px, 1fr))',
            lg: 'repeat(auto-fill, minmax(360px, 1fr))' 
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          pb: 2,
        }}
      >
        {filteredSubunits.map((su, idx) => {
          const unitStatus = getUnitStatus(su.current || 0, su.capacity || 1);
          const percentage = su.capacity ? (su.current / su.capacity) * 100 : 0;

          return (
            <Card
              key={`${su.unitName}-${su.subunitName}-${idx}`}
              onClick={() => onClick(su, true)}
              elevation={isMobile ? 2 : 1}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: { xs: 2, sm: 3 },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '&:hover': { 
                  transform: isMobile ? 'scale(0.98)' : 'translateY(-8px)',
                  boxShadow: isMobile ? 4 : 8,
                  borderColor: theme.palette.primary.main,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                // Gradient overlay สำหรับ mobile
                ...(isMobile && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:active::before': {
                    opacity: 1,
                  },
                }),
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5, gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    <GroupsIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      fontWeight="bold" 
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 0.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {su.subunitName}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main',
                          display: 'inline-block',
                        }} 
                      />
                      {su.unitName}
                    </Typography>
                  </Box>

                  <Chip
                    label={unitStatus.label}
                    color={unitStatus.color}
                    size="small"
                    icon={
                      unitStatus.status === 'full' ? <Warning sx={{ fontSize: 16 }} /> :
                      unitStatus.status === 'almost-full' ? <Info sx={{ fontSize: 16 }} /> :
                      <CheckCircle sx={{ fontSize: 16 }} />
                    }
                    sx={{
                      fontWeight: 600,
                      height: { xs: 24, sm: 28 },
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      '& .MuiChip-icon': {
                        ml: 0.5,
                      },
                    }}
                  />
                </Box>

                {/* Progress Section */}
                <Box 
                  sx={{ 
                    mb: 2.5,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette[unitStatus.color].main, 0.05),
                    border: `1px solid ${alpha(theme.palette[unitStatus.color].main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.8rem', sm: '0.875rem' }}>
                      ลงทะเบียนแล้ว
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={`${unitStatus.color}.main`}>
                      {su.current}/{su.capacity}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    value={percentage} 
                    variant="determinate" 
                    color={unitStatus.color}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette[unitStatus.color].main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                        transition: 'transform 0.4s ease',
                      },
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block', 
                      textAlign: 'right', 
                      mt: 0.5,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    {percentage.toFixed(1)}%
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Positions List */}
              

                {/* Action Button */}
                <Button 
                  variant="contained"
                  fullWidth 
                  endIcon={<ArrowForward />}
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    mt: 1,
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    boxShadow: 'none',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  ดูรายละเอียด
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* No Results Message */}
      {filteredSubunits.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
          }}
        >
          <Search sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            ไม่พบหน่วยที่ค้นหา
          </Typography>
          <Typography variant="body2" color="text.disabled">
            ลองใช้คำค้นหาอื่นหรือล้างการค้นหา
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSearchTerm('')}
            sx={{ mt: 2 }}
          >
            ล้างการค้นหา
          </Button>
        </Box>
      )}
    </Box>
  );
}