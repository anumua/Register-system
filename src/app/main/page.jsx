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

  
  // const statItems = [
  //   { icons: <SchoolIcon fontSize="large" />, title: 'นักเรียนทั้งหมด', value: statCard?.total_student ? statCard?.total_student : 0, unit: 'คน', color: '#2563eb' },
  //   { icons: <SchoolIcon fontSize="large" />, title: 'ทม.', value: statCard?.king ? statCard?.king : 0, unit: 'คน', color: '#2563eb' },
  //   { icons: <PersonAddIcon fontSize="large" />, title: 'เลือกแล้ว', value: statCard?.registered ? statCard?.registered : 0, unit: 'คน', color: '#059669' },
  //   { icons: <PendingIcon fontSize="large" />, title: 'รอลงเลือก', value: statCard?.total_student ? (statCard?.total_student - statCard?.registered) - statCard.king : 0, unit: 'คน', color: '#dc2626' },
   
    
  // ];

  const menuItems = [
    { icons: <AppRegistrationIcon fontSize="large" />, title: 'เลือกหน่วยบรรจุ', subtitile: 'เลือกหน่วยให้กับนักเรียน', pagename: '/register', color: '#059669' },
    { icons: <GroupsIcon fontSize="large" />, title: 'รายละเอียดการเลือกหน่วย', subtitile: 'ดูสถานะหน่วยและรายชื่อสมาชิก', pagename: '/detail', color: '#2563eb' },
    { icons: <AssessmentIcon fontSize="large" />, title: 'สรุปข้อมูลหน่วย', subtitile: 'รายงานและสถิติการลงทะเบียน', pagename: '/report', color: '#7c3aed' },
  ];

 
  // useEffect(() => {
  //   let cancelled = false;
  //   fetch('/api/main', { cache: 'no-store' })
  //     .then(res => res.json())
  //     .then(data => { if (!cancelled) setStatCard(data[0] || []); })
  //     .catch(() => {});
  //   return () => { cancelled = true; };
  // }, []);

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
        {/* <Box
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
        </Box> */}

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

         
       
        </Box>
      </Container>
    </>
  );
}
