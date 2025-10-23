'use client';

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import PositionsTable from "./components/PositionsTable";
import { Grid, Button, Box, Alert } from "@mui/material";
import {
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const dynamic = "force-dynamic";

export default function Page() {
    const router = useRouter();
    const [teamPositions, setTeamPositions] = useState([]);
    const [nonTeamPositions, setNonTeamPositions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;
        let intervalId;

        async function load() {
            try {
                const response = await fetch('/api/positions/all', { cache: 'no-store' });

                if (!response.ok) {
                    throw new Error(`Failed to fetch (${response.status})`);
                }

                const data = await response.json();

                if (!isMounted) return;
                
                setTeamPositions(Array.isArray(data?.teamPositions) ? data.teamPositions : []);
                setNonTeamPositions(Array.isArray(data?.nonTeamPositions) ? data.nonTeamPositions : []);
                setErrorMessage("");
            } catch (err) {
                if (!isMounted) return;
                setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
            }
        }

        // initial load
        load();
        // poll every 10 seconds
        intervalId = setInterval(load, 3000);

        return () => {
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    if (errorMessage) {
        return (
            <Container sx={{ py: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    ตารางตำแหน่งข้อมูลการลงทะเบียน
                </Typography>
                <Alert severity="error">
                    เกิดข้อผิดพลาดในการดึงข้อมูล: {errorMessage}
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/main')}
                sx={{ mb: 2 }}
                size='medium'
            >
                กลับหน้าหลัก
            </Button>
            
            <Typography variant="h5" fontWeight={600} gutterBottom>
                ตารางตำแหน่งข้อมูลการลงทะเบียนทั้งหมด
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <PositionsTable 
                        positions={nonTeamPositions} 
                        title="หน่วยทั่วไป" 
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <PositionsTable 
                        positions={teamPositions} 
                        title="หน่วยรักษาพระองค์ (ทม.)" 
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>หมายเหตุ:</strong> ตารางแสดงข้อมูลตำแหน่งทั้งหมดในระบบ 
                    โดยแยกเป็นหน่วยทั่วไปและหน่วยรักษาพระองค์ (ทม.) 
                    หากตำแหน่งใดมีการเลือกแล้วจะแสดงชื่อนักเรียนนายสิบที่เลือก 
                    หากยังไม่มีการเลือกจะแสดง "ว่าง"
                </Typography>
            </Box>
        </Container>
    );
}
