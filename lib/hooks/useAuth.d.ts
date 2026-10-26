import type { User } from "@supabase/supabase-js";

export function useAuth(): {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};
