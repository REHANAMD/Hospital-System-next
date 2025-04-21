import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus, FileText, Users } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const [reportCount, setReportCount] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const base = window.location.origin;

    const fetchCounts = async () => {
      try {
        const [taskRes, reportRes] = await Promise.all([
          fetch(`${base}/api/tasks/fetch`),
          fetch(`${base}/api/reports/fetch`)
        ]);

        const taskData = await taskRes.json();
        const reportData = await reportRes.json();

        setTaskCount(taskData.tasks?.length || 0);
        setReportCount(reportData.reports?.length || 0);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setTaskCount(0);
        setReportCount(0);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">🏥 Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Tasks */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <FileText className="h-10 w-10 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Assigned Tasks</h2>
                <p className="text-sm text-gray-500">
                  {taskCount !== null ? `${taskCount} tasks assigned` : "Loading..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Reports */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <FilePlus className="h-10 w-10 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold">Uploaded Reports</h2>
                <p className="text-sm text-gray-500">
                  {reportCount !== null ? `${reportCount} reports submitted` : "Loading..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manage Staff */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Users className="h-10 w-10 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold">Manage Staff</h2>
                <p className="text-sm text-gray-500">Feature coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={() => router.push("/admin/assign-task")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          Assign New Task
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/view-reports")}
          className="px-6 py-2"
        >
          View Reports
        </Button>
      </div>
    </div>
  );
}
