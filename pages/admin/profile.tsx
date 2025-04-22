"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/router";

export default function AdminProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); // still disabled
  const [otp, setOtp] = useState("");
  const router = useRouter();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
    if (adminData) {
      setName(adminData.name || "");
      setEmail(adminData.email || "");
      setPhone(adminData.phone || "");
    }
  }, []);

  const handleUpdate = async () => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId || !name || !email || !phone) {
      toast.error("Missing fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, name, email, phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("✅ Profile updated successfully");
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleResend = () => {
    toast.info("🔁 OTP resent (not really)");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 relative">
      {/* 🔙 Back button top-left */}
      <div className="absolute top-6 left-6">
        <Button variant="outline" onClick={() => router.push("/admin")}>
          ← Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md border p-8 max-w-xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">🧍‍♂️ Edit Personal Info</h2>

        <div className="space-y-2">
          <Label className="text-gray-700" htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="text-gray-800"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700" htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="text-gray-800"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700" htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="text-gray-800"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700" htmlFor="password">Password</Label>
          <Input
            id="password"
            value={password}
            type="password"
            disabled
            placeholder="********"
            className="text-gray-400 bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700" htmlFor="otp">OTP Verification</Label>
          <Input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="text-gray-800"
          />
          <p
            className="text-sm text-blue-600 hover:underline cursor-pointer mt-1"
            onClick={handleResend}
          >
            Resend OTP
          </p>
        </div>

        <Button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
           Save Changes
        </Button>
      </div>
    </div>
  );
}
