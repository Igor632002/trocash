"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocations } from "@/lib/hooks/useLocations";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [area, setArea] = useState("Faro");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { locationsList } = useLocations();

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Sign up
        const { data: authData, error: signupErr } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signupErr) throw signupErr;

        // Create profile
        if (authData.user) {
          const { error: profileErr } = await supabase.from("profiles").insert([
            {
              id: authData.user.id,
           //   email: email,
              display_name: displayName || email.split("@")[0],
              area,
            },
          ]);
          if (profileErr) throw profileErr;
        }

        setError(" Conta criada! Verifique seu email.");
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
        // Redirect to home page after successful login
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
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
