/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Particles from "@/components/ui/particles"

interface UserType {
  unique_id: string
  name: string
  email: string
  role: "student" | "admin" | "superadmin"
}

export default function Page() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/all-users")
        setUsers(res.data.users || [])
      } catch (err) {
        toast("Error loading users")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const token = localStorage.getItem("token")
    if (!token) return toast("Missing token")
  
    const isPromoting = currentRole !== "admin"
    const endpoint = isPromoting ? "/api/make-admin" : "/api/remove-admin"
    const payloadKey = isPromoting ? "userIdToPromote" : "userIdToDemote"
  
    try {
      const res = await axios.post(endpoint, {
        token,
        [payloadKey]: userId,
      })
  
      if (res.data.success) {
        toast("Role updated")
        setUsers(prev =>
          prev.map(user =>
            user.unique_id === userId
              ? { ...user, role: isPromoting ? "admin" : "student" }
              : user
          )
        )
      } else {
        toast("Failed to update role")
      }
    } catch {
      toast("Server error")
    }
  }
  

  return (
    <>
  <div className="relative min-h-screen">
  <div className="absolute inset-0 -z-10 pointer-events-none">
    <Particles
      particleColors={['#ffffff', '#ffffff']}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover={false} 
      alphaParticles={false}
      disableRotation={false}
    />
  </div>

  <Navbar />

  <div className="max-w-4xl mx-auto mt-10">
    <h1 className="text-2xl font-bold mb-4 text-white">User Management</h1>
    {loading ? (
      <p className="text-white">Loading...</p>
    ) : (
      <Table>
        <TableCaption>All registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.unique_id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-center">
                {user.role !== "superadmin" && (
                  <Button
                    onClick={() => handleRoleToggle(user.unique_id, user.role)}
                    variant="outline"
                    className="bg-white/10 text-white hover:bg-white/30"
                  >
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
</div>

    </>
  )
}
