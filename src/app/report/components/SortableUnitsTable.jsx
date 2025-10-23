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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getProgressColor(percent) {
    const p = clamp(Number(percent) || 0, 0, 100);
    const hue = 120 - p * 1.2;
    return `hsl(${hue}, 80%, 45%)`;
}

function getStatusInfo(percent) {
    if (percent >= 90) return { label: 'เต็ม', color: '#2e7d32', icon: TrendingUp };
    if (percent >= 70) return { label: 'ดี', color: '#388e3c', icon: TrendingUp };
    if (percent >= 50) return { label: 'ปานกลาง', color: '#f57c00', icon: Minus };
    if (percent >= 30) return { label: 'ต่ำ', color: '#e64a19', icon: TrendingDown };
    return { label: 'ต่ำมาก', color: '#c62828', icon: TrendingDown };
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

        const aStr = String(aVal);
        const bStr = String(bVal);
        return order === "asc" ? aStr.localeCompare(bStr, 'th') : bStr.localeCompare(aStr, 'th');
    };
}

export default function SortableUnitsTable({ rows, title = "สรุปข้อมูลตำแหน่งแยกตามหน่วย" }) {
    const [orderBy, setOrderBy] = useState("percentNum");
    const [order, setOrder] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredRows = useMemo(() => {
        if (!searchTerm.trim()) return enriched;
        
        const search = searchTerm.toLowerCase().trim();
        return enriched.filter(u => {
            return (
                u.unit_army?.toLowerCase().includes(search) ||
                u.unit_division?.toLowerCase().includes(search) ||
                u.unit_name?.toLowerCase().includes(search) ||
                u.unit_prov?.toLowerCase().includes(search)
            );
        });
    }, [enriched, searchTerm]);

    const sortedRows = useMemo(() => {
        const cmp = getComparator(order, orderBy);
        return [...filteredRows].sort(cmp);
    }, [filteredRows, order, orderBy]);

    const stats = useMemo(() => {
        const totalPositions = enriched.reduce((sum, u) => sum + u.total, 0);
        const totalRegistered = enriched.reduce((sum, u) => sum + u.registered_count, 0);
        const totalVacant = totalPositions - totalRegistered;
        const avgPercent = totalPositions > 0 ? (totalRegistered / totalPositions) * 100 : 0;
        
        return {
            units: enriched.length,
            totalPositions,
            totalRegistered,
            totalVacant,
            avgPercent: avgPercent.toFixed(1)
        };
    }, [enriched]);

    const handleRequestSort = (key) => () => {
        if (orderBy === key) {
            setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setOrderBy(key);
            setOrder("asc");
        }
    };

    const headCells = [
        { id: "unit_army", label: "กองทัพ", numeric: false, width: "120px" },
        { id: "unit_division", label: "กองพล", numeric: false, width: "140px" },
        { id: "unit_name", label: "หน่วย", numeric: false, minWidth: "180px" },
        { id: "unit_prov", label: "จังหวัด", numeric: false, width: "120px" },
        { id: "total", label: "ตำแหน่งทั้งหมด", numeric: true, width: "130px" },
        { id: "registered_count", label: "เลือกแล้ว", numeric: true, width: "110px" },
        { id: "vacant", label: "ว่าง", numeric: true, width: "90px" },
        { id: "percentNum", label: "สถานะการเลือก", numeric: true, minWidth: "220px" }
    ];

    return (
        <Box sx={{ mb: 5 }}>
            {/* Header Section */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    mb: 2, 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                }}
            >
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600, 
                                color: '#1a237e'
                            }}
                        >
                            {title}
                        </Typography>
                        
                        <Chip 
                            label={`${stats.units} หน่วย`}
                            sx={{ 
                                fontWeight: 600,
                                backgroundColor: '#e3f2fd',
                                color: '#1565c0',
                                fontSize: '0.875rem',
                                height: 32
                            }}
                        />
                    </Box>
                    
                    <Divider />
                    
                    {/* Statistics Cards */}
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 2 
                    }}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                backgroundColor: 'white',
                                border: '1px solid #e3f2fd',
                                borderRadius: 1.5
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                ตำแหน่งทั้งหมด
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: '#1565c0' }}>
                                {stats.totalPositions.toLocaleString()}
                            </Typography>
                        </Paper>
                        
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                backgroundColor: 'white',
                                border: '1px solid #e8f5e9',
                                borderRadius: 1.5
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                เลือกแล้ว
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                {stats.totalRegistered.toLocaleString()}
                            </Typography>
                        </Paper>
                        
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                backgroundColor: 'white',
                                border: '1px solid #fff3e0',
                                borderRadius: 1.5
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                ว่าง
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: '#e65100' }}>
                                {stats.totalVacant.toLocaleString()}
                            </Typography>
                        </Paper>
                        
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                backgroundColor: 'white',
                                border: '1px solid #f3e5f5',
                                borderRadius: 1.5
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                เฉลี่ยการเลือก
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: '#6a1b9a' }}>
                                {stats.avgPercent}%
                            </Typography>
                        </Paper>
                    </Box>
                    
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="ค้นหาหน่วย, กองทัพ, กองพล, จังหวัด..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white'
                            }
                        }}
                    />
                    
                    {searchTerm && (
                        <Typography variant="body2" color="text.secondary">
                            พบ {sortedRows.length} หน่วยจากการค้นหา "{searchTerm}"
                        </Typography>
                    )}
                </Stack>
            </Paper>

            {/* Table Section */}
            <TableContainer 
                component={Paper} 
                variant="outlined"
                sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
            >
                <Table size="small" sx={{ minWidth: 1100 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell 
                                align="center" 
                                sx={{ 
                                    width: 70,
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    color: '#424242',
                                    borderBottom: '2px solid #e0e0e0',
                                    py: 1.5
                                }}
                            >
                                ลำดับ
                            </TableCell>
                            {headCells.map((hc) => (
                                <TableCell 
                                    key={hc.id} 
                                    align={hc.numeric ? "right" : "left"} 
                                    sortDirection={orderBy === hc.id ? order : false}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        color: '#424242',
                                        borderBottom: '2px solid #e0e0e0',
                                        whiteSpace: 'nowrap',
                                        width: hc.width,
                                        minWidth: hc.minWidth,
                                        py: 1.5
                                    }}
                                >
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
                                <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูลในตาราง'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedRows.map((u, idx) => {
                                const status = getStatusInfo(u.percentNum);
                                const StatusIcon = status.icon;
                                
                                return (
                                    <TableRow 
                                        key={`${u.unit_army}-${u.unit_division}-${u.unit_name}-${idx}`} 
                                        hover
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            },
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <TableCell align="center" sx={{ fontWeight: 500, color: '#666' }}>
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {u.unit_army}
                                        </TableCell>
                                        <TableCell>{u.unit_division}</TableCell>
                                        <TableCell>{u.unit_name}</TableCell>
                                        <TableCell>{u.unit_prov}</TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {u.total.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip 
                                                label={u.registered_count.toLocaleString()}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: '#e8f5e9',
                                                    color: '#2e7d32',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip 
                                                label={u.vacant.toLocaleString()}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: '#fff3e0',
                                                    color: '#e65100',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end' }}>
                                                <Box sx={{ flexGrow: 1, maxWidth: 120 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={u.percentNum}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 1,
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: getProgressColor(u.percentNum),
                                                                borderRadius: 1
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 700,
                                                        minWidth: 50,
                                                        textAlign: 'right',
                                                        color: status.color
                                                    }}
                                                >
                                                    {u.percentLabel}%
                                                </Typography>
                                                <Chip
                                                    icon={<StatusIcon size={14} />}
                                                    label={status.label}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${status.color}15`,
                                                        color: status.color,
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        height: 24,
                                                        '& .MuiChip-icon': {
                                                            color: status.color
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}