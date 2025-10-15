import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const rows = await prisma.$queryRaw`
         SELECT unit_army,
            unit_division,
            unit_name,
            count(*) AS total,
            sum(
                CASE
                    WHEN nco_id IS NOT NULL THEN 1
                    ELSE 0
                END) AS registered_count
        FROM positions
        GROUP BY unit_army, unit_division, unit_name;
    `;

        const data = rows.map(row => ({
            ...row,
            total: Number(row.total),
            registered_count: Number(row.registered_count)
        }));
       

        return new Response(JSON.stringify({ units: data }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }
}