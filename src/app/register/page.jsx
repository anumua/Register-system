'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Import components
import StudentSearchCard from './components/StudentSearchCard';
import UnitSelectionCard from './components/UnitSelectionCard';
import UnitMembersTable from './components/UnitMembersTable';
import UnitSelectionDialog from './components/UnitSelectionDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  // States
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Real data สำหรับหน่วยทหาร พร้อมหน่วยย่อย
  const [militaryUnits, setMilitaryUnits] = useState([]);



  // Load military units data on component mount
  useEffect(() => {
    loadMilitaryUnits();
  }, []);

  const loadMilitaryUnits = async () => {
    try {
      const response = await fetch('/api/positions');
      const data = await response.json();
      
      if (data.units) {
        const formattedUnits = data.units.map((unit, index) => ({
          id: index + 1,
          name: unit.unitName,
          code: unit.unitName, // You might want to add a proper code field
          capacity: unit.subunits.reduce((total, subunit) => total + subunit.capacity, 0),
          current: unit.subunits.reduce((total, subunit) => total + subunit.current, 0),
          subunits: unit.subunits.map((subunit, subIndex) => ({
            id: `${index + 1}-${subIndex + 1}`,
            name: subunit.subunitName,
            capacity: subunit.capacity,
            current: subunit.current,
            description: `หน่วยย่อย ${subunit.subunitName}`,
            positions: subunit.positions
          }))
        }));
        setMilitaryUnits(formattedUnits);
      }
    } catch (err) {
      console.error('Error loading military units:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลหน่วยทหาร');
    }
  };

  
  // Function สำหรับค้นหานักเรียนจากฐานข้อมูลจริง
  const searchStudent = async (id) => {
    setSearchLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/students?nco_number=${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(`เกิดข้อผิดพลาด: ${data.error}`);
        setStudentData(null);
      } else if (data.students && data.students.length > 0) {
        const student = data.students[0];
        setStudentData({
          id: student.id,
          name: student.name,
          rank: student.rank,
          class: student.class,
          studentId: student.studentId,
          remark: !student.remark || student.remark === "null null ตำแหน่ง null" ? '' : student.remark
        });
      } else {
        setError('ไม่พบข้อมูลนักเรียนนายสิบ');
        setStudentData(null);
      }
    } catch (err) {
      setError(`เกิดข้อผิดพลาดในการค้นหา: ${err.message}`);
      setStudentData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // Function สำหรับเลือกหน่วย
  const selectUnit = async (unit) => {
    setLoading(true);
    setSelectedUnit(unit);
    setUnitDialogOpen(false);
    
    try {
      // Load real unit data with positions
      const response = await fetch('/api/positions');
      const data = await response.json();
      
      if (data.units) {
        const selectedUnitData = data.units.find(u => u.unitName === unit.name);
        if (selectedUnitData) {
          // Format unit data for display
          const formattedUnitData = [];
          
          for (const subunit of selectedUnitData.subunits) {
            for (const position of subunit.positions) {
              if (position.occupiedBy) {
                // Get student data for occupied positions
                const studentResponse = await fetch(`/api/students?nco_id=${position.occupiedBy}`);
                const studentData = await studentResponse.json();
                
                if (studentData.students && studentData.students.length > 0) {
                  const student = studentData.students[0];
                  formattedUnitData.push({
                    id: position.posId,
                    studentId: student.studentId,
                    name: student.name,
                    rank: student.rank,
                    class: student.class,
                    joinDate: position.timeSelected ? new Date(position.timeSelected).toLocaleDateString('th-TH') : '',
                    subunitId: subunit.subunitName,
                    subunitName: subunit.subunitName,
                    positionOrder: position.order,
                    positionCode: position.code,
                    positionName: position.name
                  });
                }
              }
            }
          }
          
          setUnitData(formattedUnitData);
        }
      }
    } catch (err) {
      console.error('Error loading unit data:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลหน่วย');
    } finally {
      setLoading(false);
    }
  };

  // Function สำหรับเพิ่มนักเรียนเข้าตำแหน่ง
  const addStudentToPosition = async (position) => {
    if (!studentData || !selectedUnit) {
      setError('กรุณาค้นหานักเรียนและเลือกหน่วยก่อน');
      return;
    }

    setLoading(true);
    setError('');
    console.log(position, '-2-2-')
    try {
      // Check if student already in unit
      const existingStudent = unitData.find(member => member.studentId === studentData.id);
      if (existingStudent) {
        setError('นักเรียนคนนี้อยู่ในหน่วยแล้ว');
        setLoading(false);
        return;
      }

      // Assign student to position via API
      const response = await fetch(`/api/positions/${position.posId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nco_id: studentData.id,
          action: 'assign'
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add student to local state
        const newMember = {
          id: position.posId,
          studentId: studentData.studentId,
          name: studentData.name,
          rank: studentData.rank,
          class: studentData.class,
          joinDate: new Date().toLocaleDateString('th-TH'),
          subunitId: position.subunitName,
          subunitName: position.subunitName,
          positionOrder: position.code,
          positionCode: position.code,
          positionName: position.name
        };
        
        setUnitData([...unitData, newMember]);
        setSuccess(`เพิ่ม ${studentData.name} เข้า${position.subunitName} ตำแหน่ง ${position.name} เรียบร้อยแล้ว`);
        
        // Clear student data
        setStudentData(null);
        setStudentId('');
        
        // Reload units to update capacity
        loadMilitaryUnits();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'เกิดข้อผิดพลาดในการเพิ่มนักเรียน');
      }
      
    } catch (err) {
      console.error('Error assigning student to position:', err);
      setError('เกิดข้อผิดพลาดในการเพิ่มนักเรียน');
    } finally {
      setLoading(false);
    }
  };

  // Function สำหรับลบนักเรียนออกจากหน่วย
  const removeStudentFromUnit = async () => {
    if (!studentToDelete) return;

    setLoading(true);
    setError('');
    
    try {
      // Remove student from position via API
      const response = await fetch(`/api/positions/${studentToDelete.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unassign'
        })
      });

      if (response.ok) {
        // Remove student from local state
        const updatedUnitData = unitData.filter(member => member.id !== studentToDelete.id);
        setUnitData(updatedUnitData);
        setSuccess(`ลบ ${studentToDelete.name} ออกจากหน่วย ${selectedUnit.name} เรียบร้อยแล้ว`);
        
        // Close dialog and clear state
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
        
        // Reload units to update capacity
        loadMilitaryUnits();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'เกิดข้อผิดพลาดในการลบนักเรียน');
      }
      
    } catch (err) {
      console.error('Error removing student from position:', err);
      setError('เกิดข้อผิดพลาดในการลบนักเรียน');
    } finally {
      setLoading(false);
    }
  };

  // Function สำหรับเปิด dialog ยืนยันการลบ
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  // Function สำหรับ reset การค้นหา
  const handleResetSearch = () => {
    setStudentId('');
    setStudentData(null);
    setError('');
    setSuccess('');
  };


  return (
    <Container maxWidth='lg' sx={{ py: 6, px: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/main')}
          sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}
          size={isMobile ? 'small' : 'medium'}
        >
          กลับหน้าหลัก
        </Button>
        
      {/* Header */}
      <Box sx={{ 
        mb: 6, 
        textAlign: 'center',
        py: 4,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        borderRadius: 3,
        color: 'white',
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
      }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
          🎖️ ระบบลงทะเบียนเลือกตำแหน่งในหน่วยทหาร
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
          ค้นหานักเรียนนายสิบและเลือกหน่วยย่อยเพื่อดูตำแหน่ง
        </Typography>
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: '#4caf50' 
            }} />
            <Typography variant="body2">ระบบออนไลน์</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: '#ff9800' 
            }} />
            <Typography variant="body2">ปลอดภัย</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: '#e91e63' 
            }} />
            <Typography variant="body2">รวดเร็ว</Typography>
          </Box>
        </Box>
      </Box>

       {/* Alert Messages */}
       {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

        {/* Search and Unit Selection Section */}
        <Box marginTop={1.5} sx={{ display: 'flex', gap: 4, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: '0 0 65%', minWidth: 0 }}>
            <StudentSearchCard
              studentId={studentId}
              setStudentId={setStudentId}
              studentData={studentData}
              searchLoading={searchLoading}
              onSearch={searchStudent}
              onReset={handleResetSearch}
            />
          </Box>
          <Box sx={{ flex: '0 0 32.5%', minWidth: 0 }}>
            <UnitSelectionCard
              selectedUnit={selectedUnit}
              unitData={unitData}
              onOpenDialog={() => setUnitDialogOpen(true)}
            />
          </Box>
        </Box>

  

      

      {/* Unit Data Table */}
      
      <UnitMembersTable
        selectedUnit={selectedUnit}
        unitData={unitData}
        loading={loading}
        onDeleteClick={handleDeleteClick}
        onPositionClick={addStudentToPosition}
        studentData={studentData}
      />

      {/* Unit Selection Dialog */}
      <UnitSelectionDialog
        open={unitDialogOpen}
        onClose={() => setUnitDialogOpen(false)}
        militaryUnits={militaryUnits}
        onSelectUnit={selectUnit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        studentToDelete={studentToDelete}
        loading={loading}
        onConfirmDelete={removeStudentFromUnit}
      />

     
    </Container>
  );
}
