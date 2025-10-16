import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.$queryRaw`
      SELECT 
        COUNT(1)::int AS total_position, 
        SUM(CASE WHEN nco_id IS NOT NULL THEN 1 ELSE 0 END)::int AS registered,
        (SELECT COUNT(1)::int FROM students) AS total_student,
		(select count(1) from students where nco_king = 'ทม.')::int as king, 
    (select count(1) from positions where pos_king !='ทม.' and nco_id is null)::int as emtry
      FROM positions;
    `;
    
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
  }
}
