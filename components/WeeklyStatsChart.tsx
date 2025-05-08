"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // laddar in allt som krävs

type DataPoint = {
  week: string;
  minutes: number;
};

export default function WeeklyStatsChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/stats/weekly-duration", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // anpassa om du lagrar token annorlunda
        },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map((d) => new Date(d.week).toLocaleDateString("sv-SE")),
    datasets: [
      {
        label: "Träningsminuter per vecka",
        data: data.map((d) => d.minutes),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Veckovis träningstid</h2>
      <Line data={chartData} />
    </div>
  );
}
