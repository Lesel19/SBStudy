import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatsChart({ sessions, totalTime }) {
  const data = {
    labels: ["Nombres de sessions terminées", "Temps total (min)"],
    datasets: [
      {
        label: "Unité",
        data: [sessions, Math.floor(totalTime / 60)],
        backgroundColor: ["#ff5252", "#4caf50"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Vos statistiques graphiquement" },
    },
  };

  return <Bar data={data} options={options} />;
}

export default StatsChart;