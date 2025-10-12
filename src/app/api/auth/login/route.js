import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../../../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const TOKEN_TTL_SECONDS = 60 * 60 * 12; // 12h

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.users.findFirst({
      where: { username: username }
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้" }, { status: 401 });
    }

    const passwordOk = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!passwordOk) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const payload = {
      sub: user.user_id,
      name: user.fullname || null,
      role: user.role || null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });

    const res = NextResponse.json({ 
      ok: true, 
      user: {
        id: user.user_id,
        name: payload.fullname,
        role: payload.role,
        username: user.username
      }
    });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_TTL_SECONDS,
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


