/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectDB from '../../../../lib/connectdb';
import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const token = await request.json();
    console.log(token)
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
    }

    const decoded: any = verify(token.token, JWT_SECRET);
    const uniqueId = decoded?.id;

    if (!uniqueId) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ unique_id: uniqueId });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const userRole = user.role;

    return NextResponse.json({
      success: true,
      message: `User is a ${userRole}`,
      role: userRole
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
