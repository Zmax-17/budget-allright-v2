import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

import { AuthResponse, User } from "@supabase/supabase-js";
import supabase from "@/shared/services/supabase";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  signup: (
    email: string,
    password: string,
  ) => Promise<AuthResponse>;
  login: (
    email: string,
    password: string,
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Failed to load session");
        setUser(null);
      } finally {
        setLoading(false); // Finish loading
      }
    };
    getSession();

    // Subscribe to state changes
    const {
      data: { subscription: listener },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<AuthResponse> => {
      const response = await supabase.auth.signUp({
        email,
        password,
      });

      if (!response.error && response.data.user) {
        setUser(response.data.user);
      }

      return response;
    },
    [],
  );

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<AuthResponse> => {
      const response =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (!response.error && response.data.user) {
        setUser(response.data.user);
      }

      return response;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut();

      setUser(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);
      console.error("Logout error:", message);
      toast.error(`Exit error: ${message}`);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signup, login, logout }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
}
