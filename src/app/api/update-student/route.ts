// src/app/api/update-student/route.ts
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/connectdb';
import User from '../../../../models/User';
import Student from '../../../../models/Student';
import { NextResponse as Response } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { token, studentId, updates } = body;

    if (!token) {
      return Response.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;

    if (!userId) {
      return Response.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ unique_id: userId });

    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
      return Response.json({ success: false, message: "Unauthorized: Admins and superadmins only" }, { status: 403 });
    }

    if (!studentId || !updates || typeof updates !== 'object') {
      return Response.json({ success: false, message: 'Student ID and updates are required' }, { status: 400 });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { unique_id: studentId },
      { $set: updates },
      { new: true }
    );

    if (!updatedStudent) {
      return Response.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Student updated successfully', student: updatedStudent }, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
