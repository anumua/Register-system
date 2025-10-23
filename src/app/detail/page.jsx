'use client';
import React, { useState } from 'react';
import { Container, Box, LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme, useMediaQuery } from '@mui/material';
import SummaryCards from './components/SummaryCards';
import SubunitGrid from './components/SubunitGrid';
import UnitDialog from './components/UnitDialog';
import HeaderSection from './components/HeaderSection';
import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
  const data = await res.json();

  // แปลง BigInt → Number
  const units = (data.units || []).map(u => ({
    ...u,
    total: Number(u.total),
    registered_count: Number(u.registered_count),
  }));

  return units;
};

export default function DetailPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ใช้ SWR ดึงข้อมูลทุก 3 วิ
  const { data: units, error, isLoading } = useSWR('/api/detail', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: false,
  });


  const allSubunits = (units || []).map(u => ({
    unitArmy: u.unit_army,
    unitName: u.unit_division,
    subunitName: u.unit_name,
    unitProv: u.unit_prov,
    code: u.pos_index,
    current: u.registered_count,
    capacity: u.total,
    positions: u.positions || [],
    posking: u.pos_king,
    pos_code: u.pos_code,
  }));

  const handleUnitClick = (item, isSubunit = false) => {
    const payload = isSubunit
      ? {
          unit_name: `${item.unitName}`,
          subunit_name: `${item.subunitName}`,
          code: item.code || '',
          current: item.current || 0,
          capacity: item.capacity || 0,
          subunits: [item],
        }
      : item;
    setSelectedUnit(payload);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <p>ไม่สามารถโหลดข้อมูลตำแหน่งได้</p>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 1 : 1 }}>
      <HeaderSection router={router} isMobile={isMobile} />
      <SummaryCards allSubunits={allSubunits} isMobile={isMobile} />
      <SubunitGrid allSubunits={allSubunits} onClick={handleUnitClick} isMobile={isMobile} />
      <UnitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedUnit={selectedUnit}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
      />
    </Container>
  );
}
