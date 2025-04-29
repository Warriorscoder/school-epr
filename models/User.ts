import mongoose, { Schema, Document } from 'mongoose';


interface Usertype extends Document {
    unique_id: string;
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin' | 'superadmin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<Usertype>(
    {
        unique_id: { type: String},
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'admin', 'superadmin'], required: true },
    },
    {
        timestamps: true,
    }
);

const User = (mongoose.models.User as mongoose.Model<Usertype>) || mongoose.model<Usertype>('User', UserSchema)


export default User;