import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { toast, Toaster } from "sonner";
import { authService } from "../services/authService";
import { LoginCredentials } from "../types";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials: LoginCredentials = { login:email, password };

    try {
       const data = await authService.login(credentials);

        localStorage.setItem("token", data.access_token || (data as any).token);

      localStorage.setItem("role", "admin");
      localStorage.setItem("user_name", data.user.name);

      toast.success(`Welcome back, ${data.user.name}!`);

       navigate("/");
    } catch (error: any) {
       const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
      console.error("Login error details:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-surface p-6">
       <Toaster position="top-right" expand={false} richColors />

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-xl bg-carbon-black flex items-center justify-center mb-6 shadow-xl shadow-carbon-black/10 transform hover:scale-105 transition-transform">
            <span
              className="text-white font-bold text-2xl tracking-tighter"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              C
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-carbon-black">
            Welcome back
          </h2>
          <p className="text-text-description mt-1 text-sm">
            Sign in to manage your service provider dashboard.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-border-light">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <Input
                label="Email Address Or Phone"
                 placeholder="name@company.com || 01016158010"
                className="h-11 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-light text-emerald-solid focus:ring-emerald-solid/20 transition-all cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs font-medium text-slate-400 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              {/* <Link
                to="/forgot-password"
                title="Forgot Password"
                className="text-xs font-bold text-carbon-black hover:text-emerald-solid transition-colors"
              >
                Forgot password?
              </Link> */}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-xs rounded-lg btn-emerald"
              isLoading={isLoading}
            >
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-bold text-carbon-black hover:text-emerald-solid transition-colors"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
