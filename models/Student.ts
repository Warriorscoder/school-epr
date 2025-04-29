import mongoose, { Schema, Document } from 'mongoose';

export interface StudentType extends Document {
    unique_id: string;
    name: string;
    email: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female' | 'Other';
    address: string;
    phoneNumber: string;
    registrationNumber: string;
    CGPA: number;
    batch: number;
    
}

const StudentSchema: Schema = new Schema(
    {
        unique_id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        address: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        registrationNumber: { type: String, required: true, unique: true },
        CGPA: { type: Number, required: true },
        batch: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const Student = (mongoose.models.Student as mongoose.Model<StudentType>) || mongoose.model<StudentType>('Student', StudentSchema)

export default Student;
