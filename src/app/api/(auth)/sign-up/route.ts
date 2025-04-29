import User from "../../../../../models/User";
import bcrypt from "bcrypt";
import { nanoid } from 'nanoid';
import jwt from "jsonwebtoken";
import connectDB from "../../../../../lib/connectdb";

export async function POST(request: Request) {

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
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
        return Response.json({
            success: false,
            message: "User already exists"
        },
            { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = nanoid();

    const newUser = new User({
        unique_id: id,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'student'
    })
    await newUser.save()

    const token = jwt.sign({id: id}, process.env.JWT_SECRET !)

    return Response.json({
        success: true,
        token: token,
        message: "User created successfully"
    })


}
