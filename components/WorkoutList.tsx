"use client";

import { useEffect, useState } from "react";

type Workout = {
  id: number;
  title: string;
  date: string;
  description?: string;
  duration: number;
  created_at?: string;
};

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
      setError("Du är inte inloggad.");
      return;
    }
    const fetchWorkouts = async () => {
      try {
        const res = await fetch("/api/workouts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Kunde inte hämta träningspass");
          return;
        }

        const data = await res.json();
        setWorkouts(data.workouts);
      } catch (err) {
        console.log("Error vid hämtning: ", err);
        setError("Tekniskt fel vid hämtning");
      }
    };

    fetchWorkouts();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  if (workouts.length === 0) return <p>Inga pass loggade ännu.</p>;

  return (
    <ul className="space-y-4">
      {workouts.map((w) => (
        <li key={w.id} className="border p-4 rounded shadow-sm">
          <h3 className="font-bold text-lg">{w.title}</h3>
          <p className="text-sm text-gray-600">🗓️ {w.date}</p>
          <p className="text-sm text-gray-600">⏱️ {w.duration} min</p>
          {w.description && <p className="mt-2">{w.description}</p>}

          <div className="mt-4 flex gap-2">
            <button className="text-blue-600 hover:underline">Redigera</button>
            <button className="text-red-600 hover:underline">Ta bort</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
