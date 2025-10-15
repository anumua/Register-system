import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    console.log('Refreshing materialized view');
    try {
        await prisma.$queryRaw`REFRESH MATERIALIZED VIEW positions_summary;`;
        return new Response(JSON.stringify({ message: 'Materialized view refreshed successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}