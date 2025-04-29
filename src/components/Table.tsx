'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface StudentType {
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

interface StudentTableProps {
    students: StudentType[];
    averageCGPA: number;
    userRole: string;
}

export default function StudentTable({ students, averageCGPA, userRole }: StudentTableProps) {
    const [editingStudent, setEditingStudent] = useState<StudentType | null>(null);
    const [editedFields, setEditedFields] = useState<Partial<StudentType>>({});

    const handleDelete = async (unique_id: string) => {
        console.log('Delete clicked for student:', unique_id);

        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found. Please login again.');
            return;
        }

        try {
            const response = await axios.delete('/api/delete-student', {
                data: {
                    token: token,
                    studentId: unique_id
                }
            });

            const data = response.data;

            if (data.success) {
                console.log('Student deleted successfully');

                window.location.reload();
                toast("Success", {
                    description: response.data.message,
                })
            } else {
                console.error('Error deleting student:');
                toast("Error", {
                    description: "Error deleting student",
                })
            }

        } catch (error) {
            console.error('Error deleting student:', error);
            toast("Error", {
                description: "Internal Server Error",
            })
        }
    };


    // const handleUpdate = (unique_id: string) => {
    //     setEditingStudentId(unique_id);
    // };

    const handleEditClick = (student: StudentType) => {
        setEditingStudent(student);
        setEditedFields(student);
    };

    const handleSave = async (studentId: string, updates: Partial<StudentType>) => {
        console.log("Saving updated student:", editedFields);

        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Token not found in localStorage.");
            return;
        }

        try {
            const response = await axios.put('/api/update-student', {
                token,
                studentId,
                updates,
            });

            if (response.data.success) {
                console.log("Student updated successfully:", response.data.message);
                toast("Success", {
                    description: response.data.message,
                })
                window.location.reload();
            } else {
                console.error("Failed to update student:", response.data.message);
            }
        } catch (error) {
            console.error("Error while updating student:", error);
        }

        setEditingStudent(null);
        setEditedFields({});
    };

    const handleCancel = () => {
        setEditingStudent(null);
        setEditedFields({});
    };

    return (
        <div className="relative w-full">
            <Table className="relative w-3/4 mx-auto overflow-scroll text-white mt-10">
                <TableCaption>A list of Students</TableCaption>
                <TableHeader className="text-white">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>CGPA</TableHead>
                        <TableHead className="text-center">Batch</TableHead>
                        {(userRole === "admin" || userRole === "superadmin") && (
                            <TableHead className="text-center">Actions</TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.unique_id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.gender}</TableCell>
                            <TableCell>{student.CGPA.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{student.batch}</TableCell>
                            {(userRole === "admin" || userRole === "superadmin") && (
                                <>
                                    <TableCell className="text-center">
                                        <div className=" flex justify-center gap-2">
                                            <button
                                                className="border-2 cursor-pointer hover:bg-white/30 text-white px-4 py-2 rounded-md"
                                                onClick={() => handleEditClick(student)}
                                            >
                                                Update
                                            </button>

                                            <button
                                                className="border-2 cursor-pointer hover:bg-white/30 text-white px-4 py-2 rounded-md"
                                                onClick={() => handleDelete(student.unique_id)}
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Average CGPA</TableCell>
                        <TableCell className="text-center">{averageCGPA.toFixed(2)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Overlay Mini-Form */}
            {editingStudent && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2  backdrop-blur-sm bg-transparent p-6 rounded-lg shadow-lg w-[500px] z-50">
                    <h2 className="text-xl font-bold mb-4 text-white">Update Student</h2>

                    <div className="flex flex-col gap-3 text-white">
                        <input
                            type="text"
                            placeholder="Name"
                            value={editedFields.name || ""}
                            onChange={(e) => setEditedFields({ ...editedFields, name: e.target.value })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedFields.email || ""}
                            onChange={(e) => setEditedFields({ ...editedFields, email: e.target.value })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={editedFields.dateOfBirth ? new Date(editedFields.dateOfBirth).toISOString().split('T')[0] : ""}
                            onChange={(e) => setEditedFields({ ...editedFields, dateOfBirth: new Date(e.target.value) })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="hover:bg-white/30 bg-white/10">
                                    {editedFields.gender || "Select Gender"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Select Gender</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={editedFields.gender || ""}
                                    onValueChange={(value) =>
                                        setEditedFields({ ...editedFields, gender: value as 'Male' | 'Female' | 'Other' })
                                    }
                                >
                                    <DropdownMenuRadioItem value="Male">Male</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Female">Female</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Other">Other</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <input
                            type="text"
                            placeholder="Address"
                            value={editedFields.address || ""}
                            onChange={(e) => setEditedFields({ ...editedFields, address: e.target.value })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={editedFields.phoneNumber || ""}
                            onChange={(e) => setEditedFields({ ...editedFields, phoneNumber: e.target.value })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <input
                            type="text"
                            placeholder="Registration Number"
                            value={editedFields.registrationNumber || ""}
                            onChange={(e) => setEditedFields({ ...editedFields, registrationNumber: e.target.value })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <input
                            type="number"
                            placeholder="CGPA"
                            value={editedFields.CGPA ?? ""}
                            onChange={(e) => setEditedFields({ ...editedFields, CGPA: parseFloat(e.target.value) })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                        <input
                            type="number"
                            placeholder="Batch"
                            value={editedFields.batch ?? ""}
                            onChange={(e) => setEditedFields({ ...editedFields, batch: parseInt(e.target.value) })}
                            className="p-2 rounded hover:bg-white/30 bg-white/10"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            className="border-2 cursor-pointer hover:bg-white/30 text-white px-4 py-2 rounded-md"
                            onClick={() => handleSave(editingStudent.unique_id, editedFields)}
                        >
                            Save
                        </button>
                        <button
                            className="border-2 cursor-pointer hover:bg-white/30 text-white px-4 py-2 rounded-md"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
