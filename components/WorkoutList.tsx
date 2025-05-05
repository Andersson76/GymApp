"use client";
import ConfirmModal from "@/components/ConfirmModal";
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
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Ingen token = du är inte inloggad.");
      return;
    }

    const res = await fetch(`/api/workouts/${selectedId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setWorkouts((prev) => prev.filter((w) => w.id !== selectedId));
    } else {
      const data = await res.json();
      alert(data.error || "Kunde inte ta bort passet");
    }

    setShowModal(false);
    setSelectedId(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedId(null);
  };

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
            <button
              onClick={() => handleDelete(w.id)}
              className="text-red-600 hover:underline"
            >
              Ta bort
            </button>
          </div>
        </li>
      ))}
      <ConfirmModal
        isOpen={showModal}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        title="Radera träningspass?"
        message="Vill du verkligen ta bort detta pass? Det går inte att ångra."
      />
    </ul>
  );
}
