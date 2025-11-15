"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSupabaseUser(session.user);
        await loadUserProfile(session.user.id, session.user);
      }
      setIsLoading(false);
    };

    getSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        await loadUserProfile(session.user.id, session.user);
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 사용자 프로필 로드
  const loadUserProfile = async (userId: string, currentSupabaseUser?: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116은 "no rows returned" 오류
        console.error("프로필 로드 오류:", error);
      }

      const userToUse = currentSupabaseUser || supabaseUser;

      if (data) {
        setUser({
          id: data.id,
          email: data.email || userToUse?.email || "",
          name: data.name || userToUse?.user_metadata?.name || userToUse?.email?.split("@")[0] || "",
          avatar_url: data.avatar_url,
        });
      } else {
        // 프로필이 없으면 기본 정보 사용
        if (userToUse) {
          setUser({
            id: userToUse.id,
            email: userToUse.email || "",
            name: userToUse.user_metadata?.name || userToUse.user_metadata?.full_name || userToUse.email?.split("@")[0] || "",
            avatar_url: userToUse.user_metadata?.avatar_url,
          });
        }
      }
    } catch (error) {
      console.error("프로필 로드 중 오류:", error);
    }
  };

  // 회원가입
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // 사용자 프로필 생성
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name,
          });

        if (profileError) {
          console.error("프로필 생성 오류:", profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // 로그인
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      router.refresh();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      // 현재 origin을 사용하되, 환경 변수가 있으면 우선 사용
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const redirectTo = `${baseUrl}/auth/callback`;
      
      console.log("Google 로그인 리다이렉트 URL:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
        },
      });

      if (error) {
        console.error("Google 로그인 오류:", error);
        alert(`로그인 오류: ${error.message}`);
      }
    } catch (error) {
      console.error("Google 로그인 중 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("로그아웃 오류:", error);
      } else {
        setUser(null);
        setSupabaseUser(null);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

