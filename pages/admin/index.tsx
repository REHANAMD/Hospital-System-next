"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus, FileText, Users } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [adminName, setAdminName] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // 🎯 Decode token to get admin name
        const base64Url = token.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const decoded: any = JSON.parse(atob(base64));
setAdminName(decoded.name || "Admin");


        // 🔐 Fetch tasks for this admin
        const res = await fetch("/api/fetchTasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token invalid or expired");

        const data = await res.json();
        setTasks(data.tasks);
        console.log("🎯 Personalized Tasks:", data.tasks);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
        handleLogout();
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* 🔓 Logout & 🧍 Edit Info top-right */}
      <div className="absolute top-6 right-6 flex gap-3">
        <Button
          onClick={() => router.push("/admin/profile")}
          variant="secondary"
        >
          🧍 Edit Info
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          🔓 Logout
        </Button>
      </div>

      {/* 💬 Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Welcome, {adminName}
      </h1>
      <p className="text-center text-gray-500 mb-8">
         You have assigned {tasks.length} tasks.
      </p>

      {/* 📦 Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FileText className="h-10 w-10 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Assigned Tasks</h2>
                <p className="text-sm text-gray-500">View and manage tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <FilePlus className="h-10 w-10 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold">Uploaded Reports</h2>
                <p className="text-sm text-gray-500">View all submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-10 w-10 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold">Manage Staff</h2>
                <p className="text-sm text-gray-500">Add, remove, assign roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔘 Bottom Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => router.push("/admin/assign-task")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
           Assign New Task
        </Button>

        <Button
          onClick={() => router.push("/admin/active-tasks")}
          variant="outline"
        >
           View Active Tasks
        </Button>
      </div>
    </div>
  );
}
