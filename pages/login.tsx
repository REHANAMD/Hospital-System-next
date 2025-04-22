import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async () => {
    if (!empId || !password || !role || !captchaToken) {
      toast.error("All fields (including CAPTCHA) are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empId, password, role, token: captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("✅ Login successful");
      if (role === "admin" && data.adminId) {
        localStorage.setItem("adminId", data.adminId);
        console.log("💾 Stored adminId:", data.adminId);
      }
       else if (role === "employee" && data.empId) {
        localStorage.setItem("empId", data.empId);
      }
      
      router.push(role === "admin" ? "/admin" : "/employee");

    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
      setShowRegister(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg border space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">🔐 Login</h2>

        <div className="space-y-1">
          <Label className="text-gray-800">Login as</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="role"
                value="employee"
                checked={role === "employee"}
                onChange={() => setRole("employee")}
              />
              Employee
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              Admin
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="empId" className="text-gray-800">Employee ID</Label>
          <Input id="empId" value={empId} onChange={(e) => setEmpId(e.target.value)} className="text-gray-800" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-gray-800">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-gray-800"
          />
        </div>

        {/* ✅ reCAPTCHA visible checkbox */}
        <ReCAPTCHA
          sitekey="6LeqMyArAAAAAMUV8HaZclc7_INDKMo7mrGkoW1w"
          onChange={(token) => setCaptchaToken(token)}
        />

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {showRegister && (
          <Button
            variant="outline"
            className="w-full border-blue-500 text-blue-600 mt-2 animate-pulse"
            onClick={() => router.push("/register")}
          >
            New here? Register instead
          </Button>
        )}
      </div>
    </div>
  );
}
