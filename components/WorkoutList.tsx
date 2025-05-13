"use client";
import ConfirmModal from "@/components/ConfirmModal";
import EditWorkoutModal from "@/components/EditWorkoutModal";
import { useEffect, useState } from "react";
import IconButton from "@/components/IconButton";

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
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

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

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
  };

  const handleSaveEdit = async (updated: {
    title: string;
    date: string;
    duration: number;
    description?: string;
  }) => {
    if (!editingWorkout) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/api/workouts/${editingWorkout.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const updatedWorkout = await res.json();
      setWorkouts((prev) =>
        prev.map((w) => (w.id === editingWorkout.id ? updatedWorkout : w))
      );
      setEditingWorkout(null);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  return (
    <ul className="space-y-4">
      {workouts.map((w) => (
        <li
          key={w.id}
          className="relative bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">{w.title}</h3>
            <span className="text-xs text-gray-500">{w.date}</span>
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-600 gap-4">
            <span>⏱️ {w.duration} min</span>
            {w.description && <span className="italic">{w.description}</span>}
          </div>

          <div className="mt-4 flex gap-3">
            <IconButton
              icon="✏️"
              onClick={() => handleEdit(w)}
              title="Redigera"
            />
            <IconButton
              icon="🗑️"
              onClick={() => handleDelete(w.id)}
              title="Ta bort"
            />
          </div>

          {w.id === selectedId && (
            <ConfirmModal
              isOpen={showModal}
              onCancel={() => {
                setShowModal(false);
                setSelectedId(null);
              }}
              onConfirm={async () => {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(`/api/workouts/${w.id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (res.ok) {
                  setWorkouts((prev) => prev.filter((wp) => wp.id !== w.id));
                }

                setShowModal(false);
                setSelectedId(null);
              }}
              title="Radera träningspass?"
              message="Vill du verkligen ta bort detta pass? Det går inte att ångra."
            />
          )}

          {editingWorkout && (
            <EditWorkoutModal
              isOpen={!!editingWorkout}
              onClose={() => setEditingWorkout(null)}
              onSave={handleSaveEdit}
              initialData={{
                title: editingWorkout.title,
                date: editingWorkout.date,
                duration: editingWorkout.duration,
                description: editingWorkout.description || "",
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
