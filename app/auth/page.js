"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocations } from "@/lib/hooks/useLocations";
import { writeAuthSessionCookie } from "@/lib/auth/cookie-client";

export default function AuthPage() {
  const router = useRouter();
  const manualAuth = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [area, setArea] = useState("Faro");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { locationsList } = useLocations();

  // The profile can only be inserted with an authenticated session (RLS), which exists
  // only after the email is confirmed. Signup details travel in user_metadata until then.
  async function ensureProfile(user) {
    if (!user) return;
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (existing) return;

    const meta = user.user_metadata || {};
    const userEmail = user.email || "";
    const { error: profileErr } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email: userEmail,
        display_name: meta.display_name || userEmail.split("@")[0],
        area: meta.area || "Faro",
      },
    ]);
    if (profileErr) throw profileErr;
  }

  // Handles the redirect from the confirmation email (session arrives in the URL)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session || manualAuth.current) return;
      setTimeout(async () => {
        try {
          await ensureProfile(session.user);
          writeAuthSessionCookie(session);
          router.push("/");
        } catch (err) {
          setError(err.message);
        }
      }, 0);
    });
    return () => listener?.subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    manualAuth.current = true;

    try {
      if (isSignup) {
        // Sign up
        const { data: authData, error: signupErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { display_name: displayName || email.split("@")[0], area },
          },
        });
        if (signupErr) throw signupErr;

        // Session exists only when email confirmation is disabled
        if (authData.session) {
          await ensureProfile(authData.user);
        }

        setError("✅ Conta criada! Verifique o seu email para confirmar o registo.");
        setEmail("");
        setPassword("");
        setDisplayName("");
      } else {
        // Sign in
        const { error: signinErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signinErr) throw signinErr;
        const { data: sessionData } = await supabase.auth.getSession();
        await ensureProfile(sessionData?.session?.user);
        writeAuthSessionCookie(sessionData?.session || null);
        // Redirect to home page after successful login
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      manualAuth.current = false;
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <div style={{ background: "#292521", color: "#fff", padding: 20, borderRadius: 12, marginBottom: 20, textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>troCASH 🎁</h1>
        <p style={{ margin: "5px 0 0 0" }}>Algarve · Troca coisas, serviços e horas</p>
      </div>

      <form onSubmit={handleAuth} style={{ display: "grid", gap: 12 }}>
        <h2>{isSignup ? "Criar Conta" : "Entrar"}</h2>

        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />

        <input
          type="password"
          name="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />

        {isSignup && (
          <>
            <input
              type="text"
              name="displayName"
              autoComplete="name"
              placeholder="Nome (opcional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
            />

            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
            >
              {locationsList.map((l) => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          </>
        )}

        {error && <div style={{ padding: 10, background: error.includes("✅") ? "#d4edda" : "#f8d7da", borderRadius: 6, color: error.includes("✅") ? "#155724" : "#721c24" }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ padding: 12, background: "#292521", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {loading ? "A processar..." : isSignup ? "Criar Conta" : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          style={{ padding: 12, background: "#f5efe9", color: "#292521", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
        >
          {isSignup ? "Já tem conta? Entrar" : "Criar nova conta"}
        </button>
      </form>
    </div>
  );
}
