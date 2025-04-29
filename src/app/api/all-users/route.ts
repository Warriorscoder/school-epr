import connectDB from '../../../../lib/connectdb';
import User from '../../../../models/User';
import { NextResponse as Response } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find(
      { role: { $ne: 'superadmin' } }, 
      '-password' 
    );

    return Response.json({ success: true, users }, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
