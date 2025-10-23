import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { unit_name, subunit_name } = await params;
    console.log("unit_name:", unit_name, "subunit_name:", subunit_name);

    // 🔹 Query ตัวอย่าง (join + filter)
    const rows = await prisma.$queryRaw`
      SELECT 
        a.unit_division,
        a.unit_name,
        a.pos_index,
        a.pos_name,
        a.pos_code,
        COALESCE(CONCAT(b.first_name, ' ', b.last_name), '-') AS student_name,
        b.nco_number
      FROM positions a
      LEFT JOIN students b ON a.nco_id = b.nco_id
      WHERE a.unit_division = ${unit_name}
      AND a.unit_name = ${subunit_name}
      ORDER BY a.pos_index ASC;
    `;

    return new Response(JSON.stringify({ positions: rows }), { status: 200 });
  } catch (error) {
    console.error("❌ API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
