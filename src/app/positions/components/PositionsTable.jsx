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
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Search, CheckCircle, Circle } from "lucide-react";

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

export default function PositionsTable({ positions, title }) {
    const [orderBy, setOrderBy] = useState("pos_index");
    const [order, setOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPositions = useMemo(() => {
        if (!searchTerm.trim()) return positions;

        const search = searchTerm.toLowerCase().trim();
        return positions.filter(pos => {
            return (
                pos.unit_army?.toLowerCase().includes(search) ||
                pos.unit_division?.toLowerCase().includes(search) ||
                pos.unit_name?.toLowerCase().includes(search) ||
                pos.unit_prov?.toLowerCase().includes(search) ||
                pos.pos_name?.toLowerCase().includes(search) ||
                pos.pos_code?.toLowerCase().includes(search) ||
                pos.student_name?.toLowerCase().includes(search) ||
                pos.nco_rank?.toLowerCase().includes(search)
            );
        });
    }, [positions, searchTerm]);

    const sortedPositions = useMemo(() => {
        const cmp = getComparator(order, orderBy);
        return [...filteredPositions].sort(cmp);
    }, [filteredPositions, order, orderBy]);

    const stats = useMemo(() => {
        const total = positions.length;
        const selected = positions.filter(p => p.is_selected).length;
        const available = total - selected;
        return { total, selected, available };
    }, [positions]);

    const handleRequestSort = (key) => () => {
        if (orderBy === key) {
            setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setOrderBy(key);
            setOrder("asc");
        }
    };

    const headCells = [
        { id: "pos_index", label: "ลำดับ", numeric: true, sortable: true, width: "70px" },
        { id: "unit_army", label: "กองทัพ", numeric: false, sortable: true, width: "70px" },
        { id: "unit_division", label: "กองพล", numeric: false, sortable: true, width: "70px" },
        { id: "unit_name", label: "หน่วย", numeric: false, sortable: true, width: "110px" },
        { id: "unit_prov", label: "จังหวัด", numeric: false, sortable: true, width: "100px" },
        { id: "pos_name", label: "ชื่อตำแหน่ง", numeric: false, sortable: true, minWidth: "100px" },
        { id: "pos_code", label: "เลขที่ตำแหน่ง", numeric: false, sortable: true, width: "60px" },
        { id: "student_name", label: "ผู้เลือก", numeric: false, sortable: true, minWidth: "270px" }
    ];

    const isHighlight = title.includes('ทม');

    return (
        <Box sx={{ mb: 5 }}>
            {/* Header Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 2,
                    backgroundColor: isHighlight ? '#fff5f5' : '#f8f9fa',
                    border: '1px solid',
                    borderColor: isHighlight ? '#ffcdd2' : '#e0e0e0',
                    borderRadius: 2
                }}
            >
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: isHighlight ? '#d32f2f' : '#1a237e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            {isHighlight && <Box component="span" sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#d32f2f',
                                animation: 'pulse 2s infinite'
                            }} />}
                            {title}
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Chip
                                label={`ทั้งหมด ${stats.total} ตำแหน่ง`}
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: '#e3f2fd',
                                    color: '#1565c0'
                                }}
                            />
                            <Chip
                                icon={<CheckCircle size={16} />}
                                label={`เลือกแล้ว ${stats.selected}`}
                                color="success"
                                sx={{ fontWeight: 600 }}
                            />
                            <Chip
                                icon={<Circle size={16} />}
                                label={`ว่าง ${stats.available}`}
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: '#fff3e0',
                                    color: '#e65100'
                                }}
                            />
                        </Stack>
                    </Box>

                    <Divider />

                    <TextField
                        fullWidth
                        size="small"
                        placeholder="ค้นหาตำแหน่ง, หน่วย, จังหวัด, ชื่อนักเรียน..."
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
                            พบ {sortedPositions.length} รายการจากการค้นหา "{searchTerm}"
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
                <Table
                    size="small"
                    sx={{
                        width: '100%',
                        tableLayout: 'auto'
                    }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            {headCells.map((hc) => (
                                <TableCell
                                    key={hc.id}
                                    align={hc.numeric ? "center" : "left"}
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
                                    {hc.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === hc.id}
                                            direction={orderBy === hc.id ? order : "asc"}
                                            onClick={handleRequestSort(hc.id)}
                                        >
                                            {hc.label}
                                        </TableSortLabel>
                                    ) : (
                                        hc.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedPositions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headCells.length} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูลในตาราง'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedPositions.map((pos, idx) => (
                                <TableRow
                                    key={pos.pos_id}
                                    hover
                                    sx={{
                                        backgroundColor: pos.is_selected ? '#e8f5e9' : 'inherit',
                                        '&:hover': {
                                            backgroundColor: pos.is_selected ? '#c8e6c9' : '#f5f5f5'
                                        },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell align="center" sx={{ fontWeight: 500, color: '#666' }}>
                                        {pos.pos_index}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {pos.unit_army || '-'}
                                    </TableCell>
                                    <TableCell>{pos.unit_division || '-'}</TableCell>
                                    <TableCell>{pos.unit_name || '-'}</TableCell>
                                    <TableCell>{pos.unit_prov || '-'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {pos.pos_name || '-'}
                                            </Typography>

                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.813rem',
                                                color: '#666'
                                            }}
                                        >
                                            {pos.pos_code || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {pos.is_selected ? (
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: '#05339C',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {pos.nco_rank} {pos.student_name}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Chip
                                                label="ว่าง"
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: '#ff9800',
                                                    color: '#e65100',
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </Box>
    );
}