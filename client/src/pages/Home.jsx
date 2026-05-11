import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Home() {
  const [message, setMessage] = useState("Checking API...");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await api.get("/health");
        setMessage(res.data.message);
      } catch (error) {
        setMessage("API connection failed");
      }
    };

    checkApi();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-4xl font-bold">BookWise</h1>
        <p className="mt-4 text-slate-400">{message}</p>
      </div>
    </main>
  );
}