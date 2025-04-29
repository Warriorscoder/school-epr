import connectDB from '../../../../lib/connectdb';
import User from '../../../../models/User';
import { NextResponse as Response } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, userIdToDemote } = body;

    if (!token || !userIdToDemote) {
      return Response.json({ success: false, message: 'Please provide token and userIdToDemote' }, { status: 400 });
    }

    await connectDB();

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || typeof decoded === 'string') {
      return Response.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // console.log(decoded);
    const superAdmin = await User.findOne({ unique_id: decoded.id });

    if (!superAdmin) {
      return Response.json({ success: false, message: 'Super admin not found' }, { status: 404 });
    }

    if (superAdmin.role !== 'superadmin') {
      return Response.json({ success: false, message: 'Unauthorized: Only super admins can demote users' }, { status: 403 });
    }

    const userToDemote = await User.findOne({ unique_id: userIdToDemote });

    if (!userToDemote) {
      return Response.json({ success: false, message: 'User to demote not found' }, { status: 404 });
    }

    userToDemote.role = 'student';
    await userToDemote.save();

    return Response.json({ success: true, message: 'User demoted to student successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
