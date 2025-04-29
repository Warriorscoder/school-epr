'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/Navbar"

const formSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    dateOfBirth: z.string(),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(2),
    phoneNumber: z.string().min(10),
    registrationNumber: z.string().min(4),
    CGPA: z.coerce.number().min(0).max(10),
    batch: z.coerce.number()
})

function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            dateOfBirth: "",
            gender: "Male",
            address: "",
            phoneNumber: "",
            registrationNumber: "",
            CGPA: 0,
            batch: new Date().getFullYear()
        }
    })

    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = localStorage.getItem("token")
        if (!token) {
            return toast.error("Token missing")
        }

        setLoading(true)

        try {
            const res = await axios.post("/api/add-student", {
                token,
                ...data
            })

            if (res.data.success) {
                toast.success("Student added successfully!")
                form.reset()
            } else {
                toast.error("Failed to add student.")
            }
        } catch (error) {
            toast.error("Server error")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
                <Navbar />
                <div className="max-w-2xl mx-auto mt-10 bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-md border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6">Add New Student</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="date" className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white/10 text-white">
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Address</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Registration Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="CGPA" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">CGPA</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" step="0.1" className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="batch" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Batch</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" className="bg-white/10 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button type="submit" disabled={loading} className="w-full bg-white/10 text-white hover:bg-white/20">
                                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                {loading ? "Adding..." : "Add Student"}
                            </Button>
                        </form>
                    </Form>
                </div>
        </>
    )
}

export default Page