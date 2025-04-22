import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    department: "Biochemistry",
    role: "employee",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, phone, email, password, department, role } = form;
    if (!name || !phone || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      toast.success("✅ Registered successfully");

      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        department: "Biochemistry",
        role: "employee",
      });

    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg border space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">📝 Register</h2>

        {/* Role Selector */}
        <div className="space-y-1">
          <Label className="text-gray-800">Register as</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="role"
                value="employee"
                checked={form.role === "employee"}
                onChange={handleChange}
              />
              Employee
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="name" className="text-gray-800">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} className="text-gray-800" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="text-gray-800">Phone</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="text-gray-800" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-gray-800">Email</Label>
          <Input id="email" name="email" value={form.email} onChange={handleChange} className="text-gray-800" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-gray-800">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="text-gray-800"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="department" className="text-gray-800">Department</Label>
          <Input
            id="department"
            name="department"
            value="Biochemistry"
            disabled
            className="bg-gray-100 text-gray-600"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login Instead
        </Button>
      </div>
    </div>
  );
}
