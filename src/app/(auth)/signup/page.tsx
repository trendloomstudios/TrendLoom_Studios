"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Lock, User, Building, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          organization_name: organization,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSuccessMsg(
        "Account created! Check your email for verification, or enter demo mode below."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-3">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Create CEDO CRM Account
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deploy your dedicated sales & deal management platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="text-center py-4 space-y-4">
              <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/50 text-emerald-200 text-xs">
                {successMsg}
              </div>
              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-500">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="pl-9 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="TrendLoom Studio"
                    className="pl-9 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@trendloom.com"
                    className="pl-9 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="pl-9 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md mt-2"
              >
                {loading ? "Registering organization..." : "Create Free Account"}
              </Button>
            </form>
          )}

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700/80">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
