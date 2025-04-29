import connectDB from '../../../../lib/connectdb';
import User from '../../../../models/User';
import { NextResponse as Response } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, userIdToPromote } = body;

    if (!token || !userIdToPromote) {
      return Response.json({ success: false, message: 'Please provide token and userIdToPromote' }, { status: 400 });
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
      return Response.json({ success: false, message: 'Unauthorized: Only super admins can promote users' }, { status: 403 });
    }

    console.log(userIdToPromote);

    const userToPromote = await User.findOne({ unique_id: userIdToPromote });

    if (!userToPromote) {
      return Response.json({ success: false, message: 'User to promote not found' }, { status: 404 });
    }

    userToPromote.role = 'admin';
    await userToPromote.save();

    return Response.json({ success: true, message: 'User promoted to admin successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
