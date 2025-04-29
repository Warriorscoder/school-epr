import jwt from 'jsonwebtoken';
import connectDB from "../../../../lib/connectdb";
import User from "../../../../models/User";
import Student from "../../../../models/Student";

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { token, studentId } = body;

        if (!token || !studentId) {
            return Response.json({ success: false, message: "Token and student ID are required" }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;

        if (!userId) {
            return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findOne({ unique_id: userId });

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.role !== "admin" && user.role !== "superadmin") {
            return Response.json({ success: false, message: "Unauthorized: Admins and superadmins only" }, { status: 403 });
          }

        const deletedStudent = await Student.findOneAndDelete({ unique_id: studentId });

        if (!deletedStudent) {
            return Response.json({ success: false, message: "Student not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Student deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
