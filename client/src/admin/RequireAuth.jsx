import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "authed" : "anon");
    });
  }, []);

  if (status === "checking") return null;
  if (status === "anon") return <Navigate to="/admin/login" replace />;
  return children;
}
