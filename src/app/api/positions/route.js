import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {

    const rows = await prisma.$queryRaw`
    select a.*, concat(b.first_name,' ', b.last_name) as student_name, b.nco_number
    from positions a
    left join students b on a.nco_id = b.nco_id
    WHERE pos_king != 'ทม.'
    order by unit_division asc ,  unit_name asc ,  pos_pronum asc
    `;
  
    // Group into units and subunits, compute vacancy by absence of nco_id
    const unitMap = new Map();

    for (const row of rows) {
      
      const unitKey = row.unit_name;
      if (!unitMap.has(unitKey)) {
        unitMap.set(unitKey, {
          unitName: row.unit_name,
          subunits: new Map(),
        });
      }
      const unit = unitMap.get(unitKey);

      const subKey = row.unit_name || "-";
      if (!unit.subunits.has(subKey)) {
        unit.subunits.set(subKey, {
          subunitName: row.unit_name || "ไม่ระบุ",
          positions: [],
        });
      }
      const sub = unit.subunits.get(subKey);

      sub.positions.push({
        posId: row.pos_id,
        pos_index: row.pos_index || null,
        name: row.pos_name || null,
        order: row.pos_pronum ? Number(row.pos_pronum) : null,
        remark: row.pos_mark || null,
        king: row.pos_king || null,
        occupiedBy: row.student_name || null,
        occupieNumber: row.nco_number || null,
        timeSelected: row.time_select || null,
        status: row.nco_id ? "occupied" : "vacant",
      });
    }

    const units = Array.from(unitMap.values()).map((u) => {
      const subunits = Array.from(u.subunits.values()).map((s) => {
        const sortedPositions = s.positions.sort((a, b) => {
          if (a.order == null && b.order == null) return 0;
          if (a.order == null) return 1;
          if (b.order == null) return -1;
          return a.order - b.order;
        });
        const capacity = sortedPositions.length;
        const current = sortedPositions.filter((p) => p.status === "occupied").length;
        const vacancies = sortedPositions
          .filter((p) => p.status === "vacant")
          .map((p) => ({ order: p.order, code: p.code, posId: p.posId }));
        return {
          subunitName: s.subunitName,
          capacity,
          current,
          vacancies,
          positions: sortedPositions,
        };
      });

      return {
        unitName: u.unitName,
        subunits,
      };
    });

    return new Response(JSON.stringify({ units }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/positions error", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


