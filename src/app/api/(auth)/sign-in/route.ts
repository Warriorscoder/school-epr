import User from "../../../../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../../../../../lib/connectdb";

export async function POST(request: Request) {

    const { email, password } = await request.json();

    if (!email || !password) {
        return Response.json({
            success: false,
            message: "Please fill all the fields"
        },
            { status: 400 })
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return Response.json({
            success: false,
            message: "Please enter a valid email"
        },
            { status: 400 })
    }

    if (password.length < 6) {
        return Response.json({
            success: false,
            message: "Password should be at least 6 characters long"
        },
            { status: 400 })
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
        
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return Response.json({
                success: false,
                message: "Invalid credentials"
            },
                { status: 400 })
        }
        const token = jwt.sign({ id: existingUser.unique_id }, process.env.JWT_SECRET!)

        return Response.json({
            success: true,
            token: token,
            message: "User logged in successfully"
        })
    }

    else {
        return Response.json({
            success: false,
            message: "User not found"
        },
            { status: 400 })
    }


}
