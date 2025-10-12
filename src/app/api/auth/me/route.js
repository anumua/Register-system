import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET);
  
    
    // Get full user data from database
    const user = await prisma.users.findUnique({
      where: { user_id: payload.sub },
      select: {
        user_id: true,
        username: true,
        fullname: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ 
      authenticated: true, 
      user: {
        user_id: user.user_id,
        username:  user.username,
        fullname:   user.fullname,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 401 });
  }
}


