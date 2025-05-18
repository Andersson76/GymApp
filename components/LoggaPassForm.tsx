"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoggaPassForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    duration: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Något gick fel vid skapande av pass");
        return;
      }

      setSuccess(true);
      setForm({
        title: "",
        date: "",
        description: "",
        duration: 0,
      });

      router.refresh(); // uppdatera sidan om lista visas här
    } catch (err) {
      console.error("Tekniskt fel – kunde inte spara passet:", err);
      setError("Tekniskt fel – kunde inte spara passet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Logga träningspass</h2>

      <input
        type="text"
        name="title"
        placeholder="Titel"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Beskrivning (valfritt)"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="duration"
        placeholder="Tid (minuter)"
        value={form.duration}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
        min={1}
      />

      <button
        type="submit"
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
      >
        Spara pass
      </button>

      {success && <p className="text-green-600">✅ Pass sparat!</p>}
      {error && <p className="text-red-600">❌ {error}</p>}
    </form>
  );
}
