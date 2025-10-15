'use client';
import React, { useState, useEffect, act } from 'react';
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
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Components
import StudentSearchCard from './components/StudentSearchCard';
import UnitMembersTable from './components/UnitMembersTable';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [unitData, setUnitData] = useState([]);
  const [militaryUnits, setMilitaryUnits] = useState([]);
  const [subunits, setSubunits] = useState([]);
  const [selectedSubunit, setSelectedSubunit] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();


  console.log()
  // โหลดข้อมูลหน่วยทั้งหมดและแตกหน่วยย่อยออกมา
  useEffect(() => {
    loadMilitaryUnits();
  }, []);

  const loadMilitaryUnits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/positions');
      const data = await response.json();

      if (data.units) {
        setMilitaryUnits(data.units);

        // แตก subunits ทั้งหมดจากทุก unit
        const allSubunits = data.units.flatMap((unit) =>
          unit.subunits.map((subunit) => ({
            id: subunit.subunitId,
            name: subunit.subunitName,
            parentUnit: unit.unitName,
            positions: subunit.positions
          }))
        );
        setSubunits(allSubunits);

        // คืนค่าเพื่อให้ caller สามารถ re-select ได้
        return allSubunits;
      }
    } catch (err) {
      console.error('Error loading military units:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลหน่วย');
    } finally {
      setLoading(false);
    }
    return [];
  };

  // ค้นหานักเรียน
  const searchStudent = async (id) => {
    setSearchLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/students?nco_number=${id}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setStudentData(null);
      } else if (data.students && data.students.length > 0) {
        const student = data.students[0];

        // ตรวจสอบว่าผู้ค้นหามีตำแหน่งแล้วหรือไม่ จาก militaryUnits (pos.occupieNumber ตาม API)
        const assigned = militaryUnits.some((unit) =>
          unit.subunits.some((sub) =>
            sub.positions.some((p) => p.occupieNumber && String(p.occupieNumber) === String(student.studentId))
          )
        );

        setStudentData({
          id: student.id,
          name: student.name,
          rank: student.rank,
          class: student.class,
          studentId: student.studentId,
          assigned: assigned, // <-- เพิ่ม flag ตรงนี้
          remark:
            !student.remark || student.remark === 'null null ตำแหน่ง null'
              ? ''
              : student.remark
        });
      } else {
        setError('ไม่พบข้อมูลนักเรียนนายสิบ');
        setStudentData(null);
      }
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการค้นหานักเรียน');
    } finally {
      setSearchLoading(false);
    }
  };

  // เลือกหน่วยย่อย
  const selectSubunit = (subunit) => {
    setSelectedSubunit(subunit);
    if (!subunit) {
      setUnitData([]);
      return;
    }

    // แสดงตำแหน่งทั้งหมดของหน่วยย่อย (occupied หรือ ว่าง)
    console.log(subunit, 'subunit');
    const members = subunit.positions.map((pos) => ({
      id: pos.posId,
      // เก็บทั้ง studentId (ใช้ตรวจว่าว่างหรือไม่) และ studentNumber (ใช้แสดงในคอลัมน์)
      studentId: pos.occupieNumber || null,
      studentNumber: pos.occupieNumber || null,
      name: pos.occupiedBy?.trim() ? pos.occupiedBy : null,
      rank: null,
      class: null,
      joinDate: pos.timeSelected
        ? new Date(pos.timeSelected).toLocaleDateString('th-TH')
        : '',
      subunitName: subunit.name,
      positionCode: pos.code,
      positionName: pos.name,
      pos_index: pos.pos_index || null,
    }));

    setUnitData(members);
  };

  // เพิ่มนักเรียนเข้าตำแหน่ง
  const addStudentToPosition = async (position) => {
    console.log(position, 'position');
    if (!studentData || !selectedSubunit) {
      setError('กรุณาค้นหานักเรียนและเลือกหน่วยย่อยก่อน');
      return;
    }

    const exists = unitData.find((m) => m.studentId === studentData.studentId);
    if (exists) {
      setError('นักเรียนคนนี้อยู่ในหน่วยนี้แล้ว');
      return;
    }

    try {
      setLoading(true);
      // ใช้ PUT ตาม API ของ server และส่ง nco_id + action
      const response = await fetch(`/api/positions/${position.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nco_id: studentData.id, action: 'assign' })
      });

      if (!response.ok) throw new Error('เพิ่มนักเรียนไม่สำเร็จ');

      await response.json();

      // รีเฟรชข้อมูลจากเซิร์ฟเวอร์และ re-select หน่วยย่อยเดิม
      const refreshedSubunits = await loadMilitaryUnits();
      if (selectedSubunit) {
        const foundSub = refreshedSubunits.find(s => String(s.id) === String(selectedSubunit.id));
        if (foundSub) {
          selectSubunit(foundSub); // จะอัปเดต unitData ให้ตรงกับ server
        }
      }

      // อัปเดต studentData ให้แสดงว่ามีตำแหน่งแล้ว
      setStudentData(prev => prev ? { ...prev, assigned: true } : prev);

      setSuccess(
        `เพิ่มนนส. ${studentData.name} เข้า${selectedSubunit?.name || ''} ตำแหน่ง${position.positionName} สำเร็จ`
      );
      // setStudentId('');
      // setStudentData(null);
      setSelectedSubunit(null);
      // หากต้องการล้างการเลือกนักเรียนหลังเพิ่ม ให้ uncomment บรรทัดถัดไป
      // setStudentData(null);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการเพิ่มนักเรียน');
    } finally {
      setLoading(false);
    }
  };

  // ลบนักเรียนออกจากหน่วย
  const handleDeleteClick = (member) => {
    setStudentToDelete(member);
    setDeleteDialogOpen(true);
  };

  const removeStudentFromUnit = async () => {
    if (!studentToDelete) return;

    try {
      setLoading(true);
      // ใช้ PUT กับ action unassign (route รับ PUT)
      const response = await fetch(`/api/positions/${studentToDelete.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nco_id: null, action: 'unassign' })
      });

      if (!response.ok) throw new Error('ลบไม่สำเร็จ');

      await response.json();

      // รีเฟรชข้อมูลจากเซิร์ฟเวอร์และ re-select หน่วยย่อยเดิม
      const refreshedSubunits = await loadMilitaryUnits();
      if (selectedSubunit) {
        const foundSub = refreshedSubunits.find(s => String(s.id) === String(selectedSubunit.id));
        if (foundSub) selectSubunit(foundSub);
      }

      // ถ้านักเรียนที่เพิ่งลบตรงกับ studentData ที่เลือกอยู่ ให้อัปเดต flag assigned
      setStudentData(prev => {
        if (!prev) return prev;
        // studentToDelete.studentId อาจเก็บรหัสนนส. ของตำแหน่งที่ถูกลบ
        if (String(prev.studentId) === String(studentToDelete.studentId)) {
          return { ...prev, assigned: false };
        }
        return prev;
      });

      setSuccess('ลบสำเร็จ');
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการลบนักเรียน');
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1, px: 2 }}>
      {/* กลับหน้าหลัก */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/main')}
        sx={{ mb: 2 }}
        size={isMobile ? 'small' : 'medium'}
      >
        กลับหน้าหลัก
      </Button>

     

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* ค้นหานักเรียน */}
       
          <StudentSearchCard
            studentId={studentId}
            setStudentId={setStudentId}
            studentData={studentData}
            searchLoading={searchLoading}
            onSearch={searchStudent}
            onReset={() => {
              setStudentData(null);
              setStudentId('');
              setError('');
              setSuccess('');
            }}
          />
  
      </Grid>

       {/* ค้นหาหน่วยย่อยและแสดงตาราง */}
         <Grid item xs={12} md={12} marginTop={2}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) :
            <UnitMembersTable
              subunits={subunits}
              selectedUnit={selectedSubunit}
              onSelectSubunit={selectSubunit}
              unitData={unitData}
              loading={loading}
              onDeleteClick={handleDeleteClick}
              onPositionClick={addStudentToPosition}
              studentData={studentData}
            />
          }
         </Grid>
      {/* Delete Confirmation */}
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
