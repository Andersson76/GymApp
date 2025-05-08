import WeeklyStatsChart from "@/components/WeeklyStatsChart";

export default function DashboardPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Välkommen till din Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Här kan du logga och se dina träningspass.
      </p>
      <WeeklyStatsChart />
    </main>
  );
}
