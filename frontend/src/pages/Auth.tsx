import { useState } from "react";
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
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
          description: "Check your email to confirm, then sign in.",
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
    <div style={styles.root}>
      {/* Ambient background blobs */}
      <div style={{ ...styles.blob, top: "-10%", left: "-10%", background: "radial-gradient(circle, #6C63FF55, transparent 70%)" }} />
      <div style={{ ...styles.blob, bottom: "-10%", right: "-10%", background: "radial-gradient(circle, #00C9A755, transparent 70%)" }} />
      <div style={{ ...styles.blob, top: "40%", right: "20%", width: 200, height: 200, background: "radial-gradient(circle, #FF6B9D33, transparent 70%)" }} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="12" fill="url(#lg)" />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="44" y2="44">
                <stop stopColor="#6C63FF" />
                <stop offset="1" stopColor="#00C9A7" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="9" fill="white" fillOpacity="0.15" />
            <circle cx="22" cy="22" r="5" fill="white" />
            <circle cx="30" cy="14" r="3" fill="white" fillOpacity="0.7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={styles.title}>VisionVani</h1>
        <p style={styles.subtitle}>
          {isLogin ? "Sign in to continue" : "Create your account"}
        </p>

        {/* Form */}
        <form onSubmit={handleAuth} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, paddingRight: 44 }}
                onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "44px" })}
                onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: "44px" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword
                  ? <EyeOff size={16} color="#888" />
                  : <Eye size={16} color="#888" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, opacity: 0.7, cursor: "not-allowed" } : styles.btn}
          >
            {loading ? (
              <span style={styles.spinner} />
            ) : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle */}
        <div style={styles.toggle}>
          <span style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={styles.toggleBtn}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blobFloat {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.08) translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0A0A12",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  blob: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    filter: "blur(80px)",
    animation: "blobFloat 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 24,
    padding: "48px 40px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
    animation: "fadeUp 0.5s ease both",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#fff",
    textAlign: "center",
    margin: "0 0 8px",
    background: "linear-gradient(135deg, #6C63FF, #00C9A7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 36,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  },
  inputFocus: {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(108,99,255,0.08)",
    border: "1px solid rgba(108,99,255,0.6)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "0 0 0 3px rgba(108,99,255,0.12)",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  btn: {
    marginTop: 8,
    padding: "14px",
    background: "linear-gradient(135deg, #6C63FF, #00C9A7)",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    transition: "opacity 0.2s, transform 0.1s",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  toggle: {
    marginTop: 24,
    textAlign: "center",
  },
  toggleText: {
    color: "#666",
    fontSize: 14,
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
  },
};

export default Auth;