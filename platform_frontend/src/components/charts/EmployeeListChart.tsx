import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Employee {
  employee_id: number;
  age: number;
  department?: string;
  job_role?: string;
  salary?: number;
}

export const EmployeeListChart = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch(`${backendUrl}/api/v1/query/execute_predefined`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setEmployees(result);
        } else {
          console.warn("Expected an array but got:", result);
          setEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }

    fetchEmployees();
  }, []);

  const data = {
    labels: employees.map(emp => `ID: ${emp.employee_id}`),
    datasets: [
      {
        label: "Age",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: employees.map(emp => emp.age),
        yAxisID: 'age',
      },
      {
        label: "Salary",
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        data: employees.map(emp => emp.salary || 0),
        yAxisID: 'salary',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Employee Age and Salary Chart"
      }
    },
    scales: {
      age: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Age' }
      },
      salary: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Salary' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div>
      <h2>Employee Data</h2>
      <Bar data={data} options={options} />
    </div>
  );
};