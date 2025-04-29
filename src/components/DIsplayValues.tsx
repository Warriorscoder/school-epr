/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import StarBorder from "./ui/StarBorder"
import CountUp from "./ui/CountUp"
import Threads from "./ui/Threads"
import { useEffect, useState } from "react";
import axios from "axios";
import StudentTable from "./Table";

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
  

function DIsplayValues() {
    const [studentsCount, setStudentsCount] = useState(0);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [averageCgpa, setAverageCgpa] = useState(0);
    const [Students, setStudents] = useState<StudentType[]>([]);
    const [userRole, setUserRole] = useState("student");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
            try {
                const res = await axios.get('/api/all-students');
                const data = res.data;

                if (data.success) {
                    const students = data.students;
                    setStudents(students);
                    
                    setStudentsCount(students.length);

                    const male = students.filter((student: { gender: string; }) => student.gender === 'Male').length;
                    const female = students.filter((student: { gender: string; }) => student.gender === 'Female').length;

                   const totalCgpa = students
                   .filter((student: { CGPA: any; }) => student.CGPA && !isNaN(Number(student.CGPA))) 
                   .reduce((acc: number, student: { CGPA: any; }) => acc + Number(student.CGPA), 0);

               const average = students.length > 0 ? totalCgpa / students.length : 0;

               setAverageCgpa(Number(average.toFixed(2)));

                    setMaleCount(male);
                    setFemaleCount(female);
                    setLoading(false);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching students count', error);
                setLoading(false)
            }
        }

        fetchStudents();

        const temptoken = localStorage.getItem('token');

        async function checkUserRole() {
            try {
              console.log(temptoken)
              const response = await axios.post('/api/check-admin', {token:temptoken});
    
              const data = await response.data;
    
              if (data.success) {
                setUserRole(data.role); 
              }
    
            } catch (error) {
              console.error('Error checking user role', error);
            }
          }
    
          checkUserRole();

    }, []);

    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen text-white text-xl">
            Loading student data...
          </div>
        );
      }

      
    return (
        <>

            <div className="absolute inset-0 z-0 pointer-events-none w-full h-full bg-black">
                <Threads
                    amplitude={3}
                    distance={0}
                    enableMouseInteraction={true}
                />
            </div>
            <div className="flex w-full mx-auto bg-black mt-10">
                <div className="relative z-10 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 mx-auto">
                    <div className="flex justify-center items-center">
                        <StarBorder as="button" className="custom-class" color="cyan" speed="2s">
                            <CountUp
                                from={0}
                                to={studentsCount}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text text-4xl"
                            />
                            <p className="text-xl mt-2">Students</p>
                        </StarBorder>
                    </div>

                    <div className="flex justify-center items-center">
                        <StarBorder as="button" className="custom-class" color="cyan" speed="3s">
                            <CountUp
                                from={0}
                                to={maleCount}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text text-4xl"
                            />
                            <p className="text-xl mt-2">Male students</p>
                        </StarBorder>
                    </div>

                    <div className="flex justify-center items-center">
                        <StarBorder as="button" className="custom-class" color="cyan" speed="3s">
                            <CountUp
                                from={0}
                                to={femaleCount}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text text-4xl"
                            />
                            <p className="text-xl mt-2">Female students</p>
                        </StarBorder>
                    </div>

                    <div className="flex justify-center items-center">
                        <StarBorder as="button" className="custom-class" color="cyan" speed="3s">
                            <CountUp
                                from={0}
                                to={averageCgpa}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text text-4xl"
                            />
                            <p className="text-xl mt-2">Avg. CGPA</p>
                        </StarBorder>
                    </div>

                   
                </div>
            </div>

            <StudentTable students={Students} averageCGPA={averageCgpa} userRole={userRole} />
        </>
    )
}

export default DIsplayValues