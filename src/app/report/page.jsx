	'use client';

	import Container from "@mui/material/Container";
	import Typography from "@mui/material/Typography";
	import SortableUnitsTable from "./components/SortableUnitsTable";
	export const dynamic = "force-dynamic";
	import { Grid, Button } from "@mui/material";
	import {
		ArrowBack as ArrowBackIcon
	} from '@mui/icons-material';
	import { useRouter } from 'next/navigation';
	import { useEffect, useState } from 'react';

	export default function Page() {
		const router = useRouter();
		const [unitsNoKing, setUnitsNoKing] = useState([]);
		const [unitsKing, setUnitsKing] = useState([]);
		const [errorMessage, setErrorMessage] = useState("");

		useEffect(() => {
			let isMounted = true;
			let intervalId;

			async function load() {
				try {
					const [resNoKing, resKing] = await Promise.all([
						fetch('/api/report/unit_noking', { cache: 'no-store' }),
						fetch('/api/report/unit_king', { cache: 'no-store' })
					]);

					if (!resNoKing.ok || !resKing.ok) {
						const statusText = `${!resNoKing.ok ? resNoKing.status : ''} ${!resKing.ok ? resKing.status : ''}`.trim();
						throw new Error(`Failed to fetch (${statusText})`);
					}

					const [jsonNoKing, jsonKing] = await Promise.all([
						resNoKing.json(),
						resKing.json()
					]);

					if (!isMounted) return;
					setUnitsNoKing(Array.isArray(jsonNoKing?.units) ? jsonNoKing.units : []);
					setUnitsKing(Array.isArray(jsonKing?.units) ? jsonKing.units : []);
				} catch (err) {
					if (!isMounted) return;
					setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
				}
			}

			// initial load
			load();
			// poll every 10 seconds
			intervalId = setInterval(load, 5000);

			return () => {
				isMounted = false;
				if (intervalId) clearInterval(intervalId);
			};
		}, []);

		if (errorMessage) {
			return (
				<Container sx={{ py: 3 }}>
					<Typography variant="h5" fontWeight={600} gutterBottom>
						รายงานหน่วย
					</Typography>
					<Typography color="error.main">เกิดข้อผิดพลาดในการดึงข้อมูล: {errorMessage}</Typography>
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
					รายงานหน่วย
				</Typography>
				<Grid>
					<SortableUnitsTable rows={unitsNoKing} />
				</Grid>
				<Grid marginTop={10}>
					<Typography sx={{ fontSize: 40, fontWeight: 600, marginBottom: 5, color: 'red' }}>หน่วย ฉก.ทม.รอ.904</Typography>
					<SortableUnitsTable rows={unitsKing} />
				</Grid>
			</Container>
		);
	}

