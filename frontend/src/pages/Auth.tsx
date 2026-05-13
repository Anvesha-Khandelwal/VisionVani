import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Signed in successfully." });
        navigate("/app");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Check your email to confirm your account.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gridMove {
          from { transform: translateY(0); }
          to   { transform: translateY(60px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }

        .vv-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Outfit', sans-serif;
          background: #050508;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .vv-root { grid-template-columns: 1fr; }
          .vv-left { display: none !important; }
          .vv-right { padding: 40px 28px !important; }
        }

        .vv-left {
          position: relative;
          background: linear-gradient(145deg, #0b0b18 0%, #080812 60%, #04040e 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          overflow: hidden;
        }
        .vv-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 56px 56px;
          animation: gridMove 10s linear infinite;
        }
        .vv-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: pulseGlow 7s ease-in-out infinite;
          pointer-events: none;
        }
        .vv-brand { position: relative; z-index: 2; animation: fadeIn 0.9s ease both; }
        .vv-brand-mark {
          display: flex; align-items: center; gap: 12px; margin-bottom: 72px;
        }
        .vv-logo-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .vv-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 21px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
        }
        .vv-tagline {
          font-family: 'Playfair Display', serif;
          font-size: 50px; font-weight: 900; color: #fff;
          line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px;
        }
        .vv-tagline-accent {
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .vv-tagline-sub {
          font-size: 15px; color: #4b5563; font-weight: 300; line-height: 1.7; max-width: 320px;
        }
        .vv-features { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.8s 0.4s ease both; opacity: 0; animation-fill-mode: both; }
        .vv-feature { display: flex; align-items: center; gap: 14px; }
        .vv-feature-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #22d3ee); flex-shrink: 0;
        }
        .vv-feature-text { color: #6b7280; font-size: 14px; }

        .vv-right {
          background: #050508;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 56px 72px; position: relative;
          border-left: 1px solid rgba(255,255,255,0.04);
        }
        .vv-right-inner {
          width: 100%; max-width: 370px;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .vv-right-inner.mounted { opacity: 1; transform: translateY(0); }

        .vv-form-header { margin-bottom: 38px; }
        .vv-form-eyebrow {
          font-size: 10px; font-weight: 600; letter-spacing: 3.5px;
          color: #6366f1; text-transform: uppercase; margin-bottom: 14px;
        }
        .vv-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px; font-weight: 900; color: #f9fafb;
          letter-spacing: -0.5px; line-height: 1.15; margin-bottom: 10px;
          white-space: pre-line;
        }
        .vv-form-subtitle { color: #374151; font-size: 14px; font-weight: 400; }

        .vv-form { display: flex; flex-direction: column; gap: 20px; }
        .vv-field { display: flex; flex-direction: column; gap: 8px; }
        .vv-label {
          font-size: 11px; font-weight: 600; color: #4b5563;
          letter-spacing: 1px; text-transform: uppercase;
        }
        .vv-input-wrap { position: relative; }
        .vv-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; color: #f9fafb;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .vv-input::placeholder { color: #1f2937; }
        .vv-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .vv-input.pw { padding-right: 46px; }
        .vv-eye {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #374151;
          display: flex; align-items: center; padding: 4px; transition: color 0.2s;
        }
        .vv-eye:hover { color: #9ca3af; }

        .vv-btn {
          position: relative; overflow: hidden;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #22d3ee 100%);
          border: none; border-radius: 10px; color: #fff;
          font-size: 14px; font-weight: 600; font-family: 'Outfit', sans-serif;
          cursor: pointer; letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.25s;
          margin-top: 6px;
        }
        .vv-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.55s;
        }
        .vv-btn:hover:not(:disabled)::after { transform: translateX(100%); }
        .vv-btn:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 12px 36px rgba(99,102,241,0.3);
        }
        .vv-btn:active:not(:disabled) { transform: translateY(0); }
        .vv-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .vv-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; margin: 0 auto;
        }

        .vv-sep { display: flex; align-items: center; gap: 14px; margin: 6px 0; }
        .vv-sep-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .vv-sep-txt { font-size: 11px; color: #1f2937; font-weight: 500; letter-spacing: 1px; }

        .vv-toggle { text-align: center; font-size: 13px; color: #374151; margin-top: 20px; }
        .vv-toggle-btn {
          background: none; border: none; color: #6366f1;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: 'Outfit', sans-serif; margin-left: 5px;
          transition: color 0.2s;
        }
        .vv-toggle-btn:hover { color: #818cf8; }

        .vv-footer {
          position: absolute; bottom: 28px;
          font-size: 11px; color: #111827; text-align: center;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="vv-root">
        {/* ── LEFT PANEL ── */}
        <div className="vv-left">
          <div className="vv-grid" />
          <div className="vv-orb" style={{ width: 420, height: 420, top: "-15%", left: "-15%", background: "radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)" }} />
          <div className="vv-orb" style={{ width: 280, height: 280, bottom: "0%", right: "-8%", background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)", animationDelay: "3.5s" }} />

          <div className="vv-brand">
            <div className="vv-brand-mark">
              <div className="vv-logo-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="4.5" fill="white" />
                  <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
                  <circle cx="17" cy="5" r="2.2" fill="white" fillOpacity="0.65" />
                </svg>
              </div>
              <span className="vv-brand-name">VisionVani</span>
            </div>
            <h2 className="vv-tagline">
              See beyond<br />
              <span className="vv-tagline-accent">the ordinary.</span>
            </h2>
            <p className="vv-tagline-sub">
              AI-powered vision intelligence — built for modern developers who move fast.
            </p>
          </div>

          <div className="vv-features">
            {[
              "Real-time visual analysis engine",
              "Supabase auth & database",
              "React + TypeScript + Vite",
              "Scalable modular architecture",
            ].map((f, i) => (
              <div className="vv-feature" key={i}>
                <div className="vv-feature-dot" />
                <span className="vv-feature-text">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="vv-right">
          <div className={`vv-right-inner ${mounted ? "mounted" : ""}`}>
            <div className="vv-form-header">
              <p className="vv-form-eyebrow">{isLogin ? "Welcome back" : "Get started"}</p>
              <h1 className="vv-form-title">
                {isLogin ? "Sign in to\nyour account" : "Create your\naccount"}
              </h1>
              <p className="vv-form-subtitle">
                {isLogin ? "Enter your credentials to continue." : "Start building something great."}
              </p>
            </div>

            <form className="vv-form" onSubmit={handleAuth}>
              <div className="vv-field">
                <label className="vv-label">Email address</label>
                <input
                  className="vv-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="vv-field">
                <label className="vv-label">Password</label>
                <div className="vv-input-wrap">
                  <input
                    className="vv-input pw"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button type="button" className="vv-eye" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="vv-btn" disabled={loading}>
                {loading ? <div className="vv-spinner" /> : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="vv-sep" style={{ marginTop: 24 }}>
              <div className="vv-sep-line" />
              <span className="vv-sep-txt">OR</span>
              <div className="vv-sep-line" />
            </div>

            <div className="vv-toggle">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="vv-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>

          <p className="vv-footer">© 2025 VisionVani · All rights reserved</p>
        </div>
      </div>
    </>
  );
};

export default Auth;