'use client';
import {React, useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import StatisticCard from './components/StatisticCard';
import { Box, Container, useTheme, useMediaQuery, Typography, Skeleton, Stack, Avatar, Divider, Chip } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MenuItemCard from './components/MenuCard';
import Grid from '@mui/material/Grid';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';

export default function HomePage() {
    const router = useRouter();
    const [statCard, setStatCard] = useState(false);

  
  const statItems = [
    { icons: <SchoolIcon fontSize="large" />, title: 'นักเรียนทั้งหมด', value: statCard?.total_revenue ? statCard?.total_revenue : 0, unit: 'คน', color: '#2563eb' },
    { icons: <PersonAddIcon fontSize="large" />, title: 'ลงทะเบียนแล้ว', value: statCard?.total_shops ? statCard?.total_shops : 0, unit: 'คน', color: '#059669' },
    { icons: <PendingIcon fontSize="large" />, title: 'รอลงทะเบียน', value: statCard?.paymented_shop ? statCard?.paymented_shop : 0, unit: 'คน', color: '#dc2626' },
    { icons: <EventAvailableIcon fontSize="large" />, title: 'ตำแหน่งว่างคงเหลือ', value: statCard?.diff_shop ? statCard?.diff_shop : 0, unit: 'ตำแหน่ง', color: '#7c3aed' },
  ];

  const menuItems = [
    { icons: <AppRegistrationIcon fontSize="large" />, title: 'ลงทะเบียนเลือกหน่วย', subtitile: 'เลือกหน่วยให้กับนักเรียน', pagename: '/register', color: '#059669' },
    { icons: <GroupsIcon fontSize="large" />, title: 'รายละเอียดการลงทะเบียน', subtitile: 'ดูสถานะหน่วยและรายชื่อสมาชิก', pagename: '/detail', color: '#2563eb' },
    { icons: <AssessmentIcon fontSize="large" />, title: 'สรุปข้อมูลหน่วย', subtitile: 'รายงานและสถิติการลงทะเบียน', pagename: '/reports', color: '#7c3aed' },
  ];

  const [activities, setActivities] = useState([]);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/activities?limit=10', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { if (!cancelled) setActivities(data || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ State สำหรับเช็คว่า mount แล้วหรือยัง
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Container>
        {/* สรุปสถิติ */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          }}
        >
          {!mounted
            ? // 🔹 แสดง skeleton ชั่วคราว
            Array.from(new Array(4)).map((_, index) => (
              <Box key={index} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Box>
            ))
            : // 🔹 แสดงข้อมูลจริง
            statItems.map((item, index) => (
              <StatisticCard
                key={index}
                icons={item.icons}
                title={item.title}
                value={item.value}
                unit={item.unit}
                color={item.color}
              />
            ))}
        </Box>

        {/* เมนูหลัก */}
        <Box>
          <Typography variant="h6" marginTop={2} marginBottom={2} fontWeight={'bold'} fontSize={25}>
            เมนูหลัก
          </Typography>
          <Grid
            sx={{
              marginTop: 2,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)',
            }}
          >
            {!mounted
              ? // 🔹 skeleton menu
              Array.from(new Array(3)).map((_, index) => (
                <Box key={index} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Skeleton variant="circular" width={50} height={50} />
                  <Skeleton width="70%" />
                  <Skeleton width="50%" />
                </Box>
              ))
              : menuItems.map((item, index) => (
                <MenuItemCard
                  key={index}
                  icons={item.icons}
                  title={item.title}
                  subtitile={item.subtitile}
                  pagename={item.pagename}
                  color={item.color}
                />
              ))}
          </Grid>

          {/* กิจกรรมล่าสุด */}
          <Box>
            <Typography
              variant="h6"
              mt={2}
              mb={2}
              fontWeight="bold"
              fontSize={22}
            >
              กิจกรรมล่าสุด
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                
              }}
            >
              {activities.map((item, index) => (
                <Box key={index}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ py: 1 }}
                  >
                    {/* ด้านซ้าย: ชื่อหน่วย/นักเรียน + รหัส */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {item.activity_type === 'register'
                          ? 'ลงทะเบียนเลือกหน่วย'
                          : item.activity_type === 'register_delete'
                          ? 'ยกเลิกการลงทะเบียน'
                          : item.activity_type === 'unit_create'
                          ? 'เพิ่มหน่วย'
                          : item.activity_type === 'unit_update'
                          ? 'แก้ไขหน่วย'
                          : item.activity_type === 'student_create'
                          ? 'เพิ่มนักเรียน'
                          : item.activity_type === 'student_update'
                          ? 'แก้ไขข้อมูลนักเรียน'
                          : 'กิจกรรม'} {item.unit_name || item.student_name || ''} {item.code ? `รหัส ${item.code}` : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                      </Typography>
                    </Box>

                    {/* ด้านขวา: สถานะ */}
                    {item.activity_type === 'register' && (
                      <Chip label="ลงทะเบียนสำเร็จ" sx={{fontWeight:'bold'}} color="success" variant="outlined" size="small" />
                    )}
                    {item.activity_type === 'register_delete' && (
                      <Chip label="ยกเลิกแล้ว" sx={{fontWeight:'bold'}} color="error" variant="outlined" size="small" />
                    )}
                    {(item.activity_type === 'unit_create' || item.activity_type === 'student_create') && (
                      <Chip label="เพิ่มใหม่" sx={{fontWeight:'bold'}} color="info" variant="outlined" size="small" />
                    )}
                    {(item.activity_type === 'unit_update' || item.activity_type === 'student_update') && (
                      <Chip label="แก้ไขแล้ว" sx={{fontWeight:'bold'}} color="warning" variant="outlined" size="small" />
                    )}
                  </Grid>

                  {index < activities.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
