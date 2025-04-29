import { NextResponse as Response } from 'next/server';
import connectDB from '../../../../lib/connectdb';
import Student from '../../../../models/Student';

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find({ role: { $ne: 'superadmin' } });

    return Response.json({ success: true, students }, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
