import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import connectDB from "../../../../lib/connectdb";
import User from "../../../../models/User";
import Student from "../../../../models/Student";

export async function POST(request: Request){
    try {
      const body = await request.json();
      console.log(body)
      const token = body.token
  
      if (!token) {
        return Response.json({ success: false, message: "No token provided" }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
       
      const userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null; 
      
      if (!userId) {
        return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
      }
  
      await connectDB();
      
      console.log(userId)
      const user = await User.findOne({ unique_id: userId });
  
      if (!user) {
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
      }
  
      if (user.role !== "admin" && user.role !== "superadmin") {
        return Response.json({ success: false, message: "Unauthorized: Admins and superadmins only" }, { status: 403 });
      }
  
      const { name, email, dateOfBirth, gender, address, phoneNumber, registrationNumber, CGPA, batch } = body;
  
      if (!name || !email || !dateOfBirth || !gender || !address || !phoneNumber || !registrationNumber || !CGPA || !batch) {
        return Response.json({ success: false, message: "Please fill all fields" }, { status: 400 });
      }
  
      const newStudent = new Student({
        unique_id: nanoid(),
        name,
        email: email.toLowerCase(),
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        phoneNumber,
        registrationNumber,
        CGPA,
        batch,
      });
  
      await newStudent.save();
  
      return Response.json({ success: true, message: "Student added successfully" }, { status: 201 });
  
    } catch (error) {
      console.error(error);
      return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }
