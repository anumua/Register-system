"use client";

import { useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getProgressColor(percent) {
    const p = clamp(Number(percent) || 0, 0, 100);
    // Hue 120 (green) -> 0 (red)
    const hue = 120 - p * 1.2;
    return `hsl(${hue}, 80%, 45%)`;
}

function getComparator(order, orderBy) {
    return (a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return order === "asc" ? -1 : 1;
        if (bVal == null) return order === "asc" ? 1 : -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
            return order === "asc" ? aVal - bVal : bVal - aVal;
        }

        // Fallback to string compare
        const aStr = String(aVal);
        const bStr = String(bVal);
        return order === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    };
}

export default function SortableUnitsTable({ rows }) {
    const [orderBy, setOrderBy] = useState("min_order");
    const [order, setOrder] = useState("asc");

    const enriched = useMemo(() => {
        return (rows || []).map((u) => {
            const total = Number(u.total ?? 0);
            const registered = Number(u.registered_count ?? 0);
            const vacant = Math.max(total - registered, 0);
            const percentNum = total > 0 ? (registered / total) * 100 : 0;
            return {
                ...u,
                total,
                registered_count: registered,
                vacant,
                percentNum,
                percentLabel: percentNum.toFixed(1)
            };
        });
    }, [rows]);

    const sortedRows = useMemo(() => {
        const cmp = getComparator(order, orderBy);
        return [...enriched].sort(cmp);
    }, [enriched, order, orderBy]);

    const handleRequestSort = (key) => () => {
        if (orderBy === key) {
            setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setOrderBy(key);
            setOrder("asc");
        }
    };

    const headCells = [
        { id: "unit_army", label: "กองทัพ", numeric: false },
        { id: "unit_division", label: "กองพล", numeric: false },
        { id: "unit_name", label: "หน่วย", numeric: false },
        { id: "unit_prov", label: "จังหวัด", numeric: false },
        { id: "total", label: "ตำแหน่งทั้งหมด", numeric: true },
        { id: "registered_count", label: "เลือกแล้ว", numeric: true },
        { id: "vacant", label: "ว่าง", numeric: true },
        { id: "percentNum", label: "ร้อยละ", numeric: true }
    ];

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="right" sx={{ width: 64 }}>ลำดับ</TableCell>
                        {headCells.map((hc) => (
                            <TableCell key={hc.id} align={hc.numeric ? "right" : "left"} sortDirection={orderBy === hc.id ? order : false}>
                                <TableSortLabel
                                    active={orderBy === hc.id}
                                    direction={orderBy === hc.id ? order : "asc"}
                                    onClick={handleRequestSort(hc.id)}
                                >
                                    {hc.label}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={headCells.length + 1} align="center">ไม่พบข้อมูล</TableCell>
                        </TableRow>
                    ) : (
                        sortedRows.map((u, idx) => (
                            <TableRow key={`${u.unit_army}-${u.unit_division}-${u.unit_name}-${idx}`} hover>
                                <TableCell align="right">{idx + 1}</TableCell>
                                <TableCell>{u.unit_army}</TableCell>
                                <TableCell>{u.unit_division}</TableCell>
                                <TableCell>{u.unit_name}</TableCell>
                                <TableCell>{u.unit_prov}</TableCell>
                                <TableCell align="right">{u.total.toLocaleString()}</TableCell>
                                <TableCell align="right">{u.registered_count.toLocaleString()}</TableCell>
                                <TableCell align="right">{u.vacant.toLocaleString()}</TableCell>
                                <TableCell align="right">
                                    <Box sx={{ minWidth: 160 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={u.percentNum}
                                                    sx={{
                                                        backgroundColor: 'hsl(120, 60%, 92%)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: getProgressColor(u.percentNum)
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ width: 44, textAlign: 'right' }}>
                                                {u.percentLabel}%
                                            </Box>
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


