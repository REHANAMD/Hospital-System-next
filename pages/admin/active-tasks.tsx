import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ViewReports() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/active-tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleToggleComplete = async (taskId: string, checked: boolean) => {
    try {
      await fetch(`/api/tasks/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, status: checked ? "completed" : "pending" }),
      });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: checked ? "completed" : "pending" } : t
        )
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Button variant="outline" onClick={() => router.push("/admin")}>
        ← Back to Dashboard
      </Button>

      <h1 className="text-2xl font-bold text-gray-800">📂 Active Tasks</h1>

      <Card className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Sr. No.</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Task ID</th>
              <th className="p-3 border">Assigned To</th>
              <th className="p-3 border">Due Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Mark as Complete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td className="p-3 border text-center text-gray-500" colSpan={8}>
                  No active tasks.
                </td>
              </tr>
            ) : (
              tasks.map((task: any, idx: number) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{idx + 1}</td>
                  <td className="p-3 border font-medium">{task.title}</td>
                  <td className="p-3 border text-gray-600">{task.description || "—"}</td>
                  <td className="p-3 border">{task._id}</td>
                  <td className="p-3 border">{task.assignedTo}</td>
                  <td className="p-3 border">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border capitalize">{task.status}</td>
                  <td className="p-3 border text-center">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={(e) =>
                        handleToggleComplete(task._id, e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
