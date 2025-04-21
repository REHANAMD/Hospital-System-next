import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export default function AssignTaskPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !desc || !employeeId || !date) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          assignedTo: employeeId,
          dueDate: date,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to assign task");

      toast.success("✅ Task created successfully");

      // Reset form
      setTitle("");
      setDesc("");
      setEmployeeId("");
      setDate(new Date());
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📝 Assign New Task</h1>

      <div className="grid gap-4 max-w-xl bg-white p-6 rounded-xl shadow-md border">

        <div className="space-y-1">
          <Label htmlFor="title" className="text-gray-800">Task Title</Label>
          <Input
            id="title"
            placeholder="e.g., Blood Test Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-gray-800"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="desc" className="text-gray-800">Description</Label>
          <Textarea
            id="desc"
            placeholder="Enter task details here..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="text-gray-800"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="empId" className="text-gray-800">Assign To (Employee ID)</Label>
          <Input
            id="empId"
            placeholder="e.g., 68061405bda3c64bc2e81178"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="text-gray-800"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-gray-800">Due Date</Label>
          <Calendar mode="single" selected={date} onSelect={setDate} />
          <p className="text-sm text-gray-500">
            Selected: {date ? format(date, "PPP") : "None"}
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          {loading ? "Submitting..." : "Submit Task"}
        </Button>
      </div>
    </div>
  );
}
