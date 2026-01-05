import { useEffect, useState } from "react";
import api from "@/api/api";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/api/admin/analytics").then(res => setData(res.data));
  }, []);

  if (!data) return null;

  return (
    <>
      {/* KEEP YOUR EXISTING CHARTS */}
    </>
  );
}
