import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-xl shadow-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Resource Portal</h1>
        <p className="text-gray-600">Choose an action to get started:</p>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
