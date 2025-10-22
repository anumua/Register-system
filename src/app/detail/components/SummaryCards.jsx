'use client';

import StatisticCard from '@/app/main/components/StatisticCard';
import { Grid, Card, Typography, Box, Skeleton } from '@mui/material';
import React, {useState, useEffect} from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';



export default function SummaryCards({ allSubunits, isMobile }) {
  const [statCard, setStatCard] = useState(false);
   // ✅ State สำหรับเช็คว่า mount แล้วหรือยัง
   const [mounted, setMounted] = useState(false);
   useEffect(() => {
     setMounted(true);
   }, []);


  useEffect(() => {
    let cancelled = false;

    const fetchStats = () => {
      fetch('/api/main', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => { if (!cancelled) setStatCard(data[0] || []); })
        .catch(() => {});
    };

    fetchStats();
    const intervalId = setInterval(fetchStats, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);


  const statItems = [
    { icons: <SchoolIcon fontSize="large" />, title: 'นักเรียนทั้งหมด', value: statCard?.total_student ? statCard?.total_student : 0, unit: 'คน', color: '#2563eb' },
    { icons: <SchoolIcon fontSize="large" />, title: 'ทม.', value: statCard?.king ? statCard?.king : 0, unit: 'คน', color: '#dc2626' },
    { icons: <PersonAddIcon fontSize="large" />, title: 'เลือกแล้ว', value: statCard?.registered ? statCard?.registered : 0, unit: 'คน', color: '#059669' },
    { icons: <PendingIcon fontSize="large" />, title: 'รอลงเลือก', value: statCard?.total_student ? (statCard?.total_student - statCard?.registered) : 0, unit: 'คน', color: '#FFD32C' },
    { icons: <PendingIcon fontSize="large" />, title: 'ตำแหน่งว่าง', value: statCard?.emtry ? statCard.emtry : 0, unit: 'คน', color: '#FFD32C' }
   
    
  ];

  return (
    <Box  sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
      marginBottom:2
    }}>
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
  );
}