import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ncoId = searchParams.get('nco_id');
    const ncoNumber = searchParams.get('nco_number');
    const ncoIndex = searchParams.get('nco_index');

    console.log(ncoId, ncoNumber);
    let students;

    // ถ้ามี ncoId
    if (ncoId) {
      students = await prisma.$queryRaw`
    SELECT s.*, p.unit_division, p.unit_name, p.pos_name
    FROM students s
    LEFT JOIN positions p ON s.nco_id = p.nco_id
    WHERE s.nco_id = ${ncoId}::uuid
    ORDER BY s.nco_class ASC, s.nco_number ASC
  `;
    } else if (ncoIndex) {
      students = await prisma.$queryRaw`
    SELECT s.*, p.unit_division, p.unit_name, p.pos_name
    FROM students s
    LEFT JOIN positions p ON s.nco_id = p.nco_id
    WHERE s.nco_index = ${ncoIndex}::int
    ORDER BY s.nco_class ASC, s.nco_number ASC
  `;
    } else {
      students = await prisma.$queryRaw`
    SELECT s.*, p.unit_division, p.unit_name, p.pos_name
    FROM students s
    LEFT JOIN positions p ON s.nco_id = p.nco_id
    WHERE s.nco_number = ${ncoNumber}::int
    ORDER BY s.nco_class ASC, s.nco_number ASC
  `;
    }


    const formattedStudents = students.map(student => ({
      id: student.nco_id,
      studentId: student.nco_number,
      name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
      rank: student.nco_rank || '',
      class: student.nco_class || '',
      ncoId10: student.nco_id10 || '',
      ncoId13: student.nco_id13 || '',
      nco_index: student.nco_index || '',
      nco_king: student.nco_king || '',
      remark: `${student.unit_division} ${student.unit_name} ตำแหน่ง ${student.pos_name}` || '',
      king: student.nco_king || ''
    }));

    return new Response(JSON.stringify({ students: formattedStudents }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/students error", err);
    return new Response(JSON.stringify({
      error: `Database error: ${err.message}`
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
