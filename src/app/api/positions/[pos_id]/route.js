import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { pos_id } = await params;
    const { nco_id, action } = await request.json();

    console.log(pos_id, nco_id, action,'2002202');
    if (action === 'assign') {
      // Assign student to position
      const updatedPosition = await prisma.positions.update({
        where: { pos_id: pos_id },
        data: {
          nco_id: nco_id,
          time_select: new Date()
        }
    
      });

      return new Response(JSON.stringify({ 
        success: true, 
        position: updatedPosition 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (action === 'unassign') {
      // Remove student from position
      const updatedPosition = await prisma.positions.update({
        where: { pos_id: pos_id },
        data: {
          nco_id: null,
          time_select: null
        }
      });

      return new Response(JSON.stringify({ 
        success: true, 
        position: updatedPosition 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("PUT /api/positions/[pos_id] error", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
