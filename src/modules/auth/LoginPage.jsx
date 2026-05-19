import { useState } from "react";
import { Shield, Eye, MessageSquare, Cpu, FileCheck } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin@neurava.ai");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-[#071143]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-white via-[#fbfbff] to-[#eef4ff] px-8 py-6 lg:block">
          <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full border border-blue-100 opacity-60" />
          <div className="absolute bottom-10 right-0 h-[520px] w-[520px] opacity-20">
            <div className="h-full w-full rounded-full border border-indigo-200" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl font-black text-white shadow-xl">
                N
              </div>

              <div>
                <h1 className="text-6xl font-black tracking-tight text-[#071143]">
                  Neurava
                </h1>
                <p className="mt-2 text-sm font-bold tracking-widest">
                  AI TRUST <span className="mx-2 text-blue-700">●</span>
                  GOVERNANCE <span className="mx-2 text-blue-700">●</span>
                  AUTONOMOUS
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px w-36 bg-[#071143]" />
              <p className="text-2xl">
                by <span className="font-bold">Data8X</span>
              </p>
              <div className="h-px w-36 bg-[#071143]" />
            </div>

            <div className="mt-8 max-w-xl">
              <h2 className="text-3xl font-black">Trusted AI at scale</h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Neurava AI Firewall protects your AI systems with policy
                enforcement, observability, and governance controls you can
                trust.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              {[
                {
                  icon: <Shield size={28} />,
                  title: "AI Safety & Security",
                  text: "Enforce guardrails and prevent risks across all AI interactions.",
                },
                {
                  icon: <Eye size={28} />,
                  title: "Observability & Insights",
                  text: "Monitor behavior, detect issues, and surface actionable insights.",
                },
                {
                  icon: <FileCheck size={28} />,
                  title: "Governance & Compliance",
                  text: "Maintain audit trails and meet regulatory requirements with confidence.",
                },
                {
                  icon: <Cpu size={28} />,
                  title: "Autonomous Development",
                  text: "Enable safe, scalable and trustworthy AI innovation.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-blue-700">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-1 max-w-md text-sm leading-6 text-slate-700">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-16 text-sm text-slate-600">
              © 2024 Neurava by Data8X. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-gradient-to-br from-white to-slate-50 p-6">
          <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200">
            <h1 className="text-3xl font-black text-[#071143]">
              Login to Neurava
            </h1>

            <p className="mt-4 text-xl text-slate-500">
              Access the AI Firewall Console
            </p>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm font-bold">Email address</label>
              <div className="mt-3 flex items-center gap-4 rounded-xl border border-slate-300 px-5 py-3">
                <MessageSquare size={22} className="text-slate-400" />
                <input
                  className="w-full bg-transparent text-lg outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neurava.ai"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold">Password</label>
              <div className="mt-3 flex items-center gap-4 rounded-xl border border-slate-300 px-5 py-3">
                <Shield size={22} className="text-slate-400" />
                <input
                  className="w-full bg-transparent text-lg outline-none"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500"
                >
                  <Eye size={24} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 accent-violet-600"
                />
                Remember me
              </label>

              <button className="text-sm font-medium text-violet-700">
                Forgot password?
              </button>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-700 to-blue-700 px-4 py-4 text-lg font-bold text-white shadow-lg disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-sm text-slate-500">or continue with</p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-center gap-3 text-lg font-medium text-slate-600">
                <Shield size={24} className="text-blue-700" />
                Single Sign-On (SSO)
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await fetch(
                        "http://localhost:5000/api/auth/google",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            credential: credentialResponse.credential,
                          }),
                        }
                      );

                      const data = await res.json();

                      if (!res.ok) {
                        throw new Error(data.error || "Google login failed");
                      }

                      onLoginSuccess(data);
                    } catch (err) {
                      console.error(err);
                      setError(err.message);
                    }
                  }}
                  onError={() => {
                    setError("Google Sign-In failed");
                  }}
                />
              </div>
            </div>

            <p className="mt-5 text-center text-sm">
              Need help?{" "}
              <span className="font-medium text-violet-700">
                Contact Support
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}