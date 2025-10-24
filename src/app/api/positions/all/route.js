import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงข้อมูลตำแหน่งทั้งหมดพร้อมข้อมูลนักเรียนที่เลือก
    const rows = await prisma.$queryRaw`
      SELECT 
        p.pos_id,
        p.pos_index,
        p.unit_army,
        p.unit_division,
        p.unit_name,
        p.unit_prov,
        p.pos_name,
        p.pos_pronum,
        p.pos_code,
        p.pos_king,
        p.nco_id,
        p.time_select,
        CONCAT(s.first_name, ' ', s.last_name) as student_name,
        s.nco_number,
        s.nco_rank,
        s.nco_index
      FROM positions p
      LEFT JOIN students s ON p.nco_id = s.nco_id
      ORDER BY 
        CASE WHEN p.pos_king = 'ทม.' THEN 1 ELSE 2 END,
        p.unit_army ASC,
        p.unit_division ASC,
        p.unit_name ASC,
        p.pos_pronum ASC
    `;

    // รวมข้อมูลทั้งหมดเป็นกลุ่มเดียว
    const allPositions = [];

    rows.forEach(row => {
      const positionData = {
        pos_id: row.pos_id,
        pos_index: row.pos_index,
        unit_army: row.unit_army,
        unit_division: row.unit_division,
        unit_name: row.unit_name,
        unit_prov: row.unit_prov,
        pos_name: row.pos_name,
        pos_pronum: row.pos_pronum,
        pos_code: row.pos_code,
        pos_king: row.pos_king,
        student_name: row.student_name || '',
        nco_number: row.nco_number || '',
        nco_rank: row.nco_rank || '',
        time_select: row.time_select,
        is_selected: !!row.nco_id,
        nco_index: row.nco_index || ''
      };

      allPositions.push(positionData);
    });

    return new Response(JSON.stringify({ 
      allPositions
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/positions/all error", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
