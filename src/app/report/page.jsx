import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SortableUnitsTable from "./components/SortableUnitsTable";
export const dynamic = "force-dynamic";
import { Grid } from "@mui/material";

async function fetchUnits_noking() {
    try {
        // Build absolute URL for server-side fetch
        const { headers } = await import("next/headers");
        const hdrs = headers();
        const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
        const proto = (hdrs.get("x-forwarded-proto") || "http").split(",")[0];
        const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/report/unit_noking`, { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }
        const json = await res.json();
        return Array.isArray(json?.units) ? json.units : [];
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Unknown error" };
    }
}


async function fetchUnits_king() {
    try {
        // Build absolute URL for server-side fetch
        const { headers } = await import("next/headers");
        const hdrs = headers();
        const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
        const proto = (hdrs.get("x-forwarded-proto") || "http").split(",")[0];
        const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/report/unit_king`, { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }
        const json = await res.json();
        return Array.isArray(json?.units) ? json.units : [];
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Unknown error" };
    }
}


export default async function Page() {
    const data = await fetchUnits_noking();
    const king = await fetchUnits_king();

    if (data && typeof data === "object" && "error" in data) {
        return (
            <Container sx={{ py: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    รายงานหน่วย
                </Typography>
                <Typography color="error.main">เกิดข้อผิดพลาดในการดึงข้อมูล: {data.error}</Typography>
            </Container>
        );
    }

    const units_noking = Array.isArray(data) ? data : [];
    const units_king = Array.isArray(king) ? king : [];

    return (
        <Container sx={{ py: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                รายงานหน่วย
            </Typography>
            <Grid>
                <SortableUnitsTable rows={units_noking} />
            </Grid>
            <Grid marginTop={10}>
                <Typography sx={{fontSize:40 , fontWeight:600 , marginBottom:5 , color:'red'}}>หน่วยรักษาพระองค์</Typography>
                <SortableUnitsTable rows={units_king} />
            </Grid>
        </Container>
    );
}


