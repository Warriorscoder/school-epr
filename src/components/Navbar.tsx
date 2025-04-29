'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";


function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState("")
  const navigate = useRouter();
  const [userRole, setUserRole] = useState("student");

  useEffect(() => {
    const temptoken = localStorage.getItem('token');
    if (temptoken) {
      setToken(temptoken);

      async function checkUserRole() {
        try {
          console.log(temptoken)
          const response = await axios.post('/api/check-admin', { token: temptoken });

          const data = await response.data;

          if (data.success) {
            setUserRole(data.role);
          }

        } catch (error) {
          console.error('Error checking user role', error);
        }
      }

      checkUserRole();

    }
    else {
      navigate.push('/sign-in');
    }
  }, [navigate]);

  // console.log(userRole)
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken("");
    window.location.reload();
  }
  return (
    <>
      <header className="text-white body-font shadow-white shadow-sm relative z-50 rent bg-black  ">
        <div className="mx-auto flex items-center justify-between px-5 py-2 relative">

          <Link href="/" className="flex items-center text-white  md:ml-5">
            <span>School ERP</span>
          </Link>


          <nav className="hidden md:flex gap-4 text-base items-center ml-auto">

            {(userRole === "admin" || userRole === "superadmin") && (
              <>
                <Link href="/add-student">
                  <h2 className="text-white">Add-student</h2>
                </Link>
                {userRole === "superadmin" && (
                  <Link href="/make-admin">
                    <h2 className="text-white">Make-admin</h2>
                  </Link>
                )}
              </>
            )}


            {
              !token ?
                <Link href={'/sign-in'} className="cursor-pointer">
                  <button className="inline-flex items-center bg-white border-0 py-1 px-3 focus:outline-none text-gray-900 rounded text-base 0 ray-600">
                    Login
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link> :
                <button onClick={handleLogout} className="inline-flex items-center cursor-pointer bg-white border-0 py-1 px-3 focus:outline-none text-gray-900 rounded text-base 0 ray-600">
                  Logout
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
            }

          </nav>

          <div className="md:hidden ml-auto z-50">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none ">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`fixed top-0 right-0 h-fit w-1/3 bg-transparent shadow-lg backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-5 pt-20 flex flex-col gap-4 text-base items-end text-right">
            {(userRole === "admin" || userRole === "superadmin") && (
              <>
                <Link href="/add-student">
                  <h2 className="text-white">Add-student</h2>
                </Link>
                {userRole === "superadmin" && (
                  <Link href="/make-admin">
                    <h2 className="text-white">Make-admin</h2>
                  </Link>
                )}
              </>
            )}

            {
              !token ?
                <Link href={'/sign-in'}>
                  <button className="inline-flex items-center bg-white text-black border-0 py-1 px-3 focus:outline-none rounded text-base 0 ray-600">
                    Login
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link> :
                <button onClick={handleLogout} className="inline-flex items-center bg-white text-black border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base 0 ray-600">
                  Logout
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
            }

          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar