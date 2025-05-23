import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper, CircularProgress, Card, CardContent } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { departmentMap, jobRoleMap } from "../../lib/translations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DemoAgeReportPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/reports/age/").then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  // 1. Средний возраст по департаментам
  const depLabels = Object.keys(stats.avg_age_by_dep);
  const depAges = Object.values(stats.avg_age_by_dep);

  // 2. Средний возраст по ролям
  const roleLabels = Object.keys(stats.avg_age_by_role);
  const roleAges = Object.values(stats.avg_age_by_role);

  // 3. Возрастные группы
  const groupLabels = Object.keys(stats.age_groups);
  const groupCounts = Object.values(stats.age_groups);

  // Метрики
  const allAges = Object.values(stats.boxplot_by_dep).flat();
  const avgAge = allAges.length ? (allAges.reduce((a, b) => a + b, 0) / allAges.length).toFixed(1) : '-';
  const minAge = allAges.length ? Math.min(...allAges) : '-';
  const maxAge = allAges.length ? Math.max(...allAges) : '-';
  const medianAge = allAges.length ? allAges.sort((a,b)=>a-b)[Math.floor(allAges.length/2)] : '-';
  const count = allAges.length;
  const under30 = allAges.filter(age => age < 30).length;
  const percentUnder30 = count ? ((under30 / count) * 100).toFixed(1) : '-';

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Аналитика по возрасту сотрудников</Typography>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Средний возраст</Typography>
                <Typography variant="h5">{avgAge}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Медиана</Typography>
                <Typography variant="h5">{medianAge}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Минимум</Typography>
                <Typography variant="h5">{minAge}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Максимум</Typography>
                <Typography variant="h5">{maxAge}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Всего сотрудников</Typography>
                <Typography variant="h5">{count}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Моложе 30 лет</Typography>
                <Typography variant="h5">{percentUnder30}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Средний возраст по департаментам</Typography>
            <Bar
              data={{
                labels: depLabels.map(dep => departmentMap[dep] || dep),
                datasets: [{
                  label: "Средний возраст",
                  data: depAges,
                  backgroundColor: "#1976d2"
                }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Средний возраст по ролям</Typography>
            <Bar
              data={{
                labels: roleLabels.map(role => jobRoleMap[role] || role),
                datasets: [{
                  label: "Средний возраст",
                  data: roleAges,
                  backgroundColor: "#43a047"
                }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Возрастная структура (Pie Chart)</Typography>
            <Box sx={{ height: 320 }}>
              <Pie
                data={{
                  labels: groupLabels,
                  datasets: [{
                    data: groupCounts,
                    backgroundColor: ["#1976d2", "#43a047", "#ffa000", "#e53935", "#6d4c41"]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Распределение по возрастным группам</Typography>
            <Box sx={{ height: 320 }}>
              <Bar
                data={{
                  labels: groupLabels,
                  datasets: [{
                    label: "Количество сотрудников",
                    data: groupCounts,
                    backgroundColor: "#ffa000"
                  }]
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemoAgeReportPage;
