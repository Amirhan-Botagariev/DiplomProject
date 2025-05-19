import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { departmentMap, genderMap, maritalStatusMap } from "../lib/translations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DemoGenderReportPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/employees/gender_stats/").then(res => {
      setStats(res.data);
      setLoading(false);
      // DEBUG: log raw backend data
      console.log('gender_stats raw:', res.data);
    });
  }, []);

  if (loading || !stats) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  // DEBUG: show raw data for troubleshooting
  // Remove after debug
  if (!loading && stats) {
    console.log('gender_stats for debug:', stats);
  }

  // Метрики
  const count = stats.count;
  const male = stats.gender_counts["Male"] || 0;
  const female = stats.gender_counts["Female"] || 0;
  const malePct = count ? ((male / count) * 100).toFixed(1) : '-';
  const femalePct = count ? ((female / count) * 100).toFixed(1) : '-';
  const married = stats.marital_counts["Married"] || 0;
  const single = stats.marital_counts["Single"] || 0;
  const divorced = stats.marital_counts["Divorced"] || 0;
  const marriedPct = count ? ((married / count) * 100).toFixed(1) : '-';
  const singlePct = count ? ((single / count) * 100).toFixed(1) : '-';
  const divorcedPct = count ? ((divorced / count) * 100).toFixed(1) : '-';

  // Pie Chart: Пол
  const genderLabels = Object.keys(stats.gender_counts);
  const genderData = Object.values(stats.gender_counts);
  // Pie Chart: Семейное положение
  const maritalLabels = Object.keys(stats.marital_counts);
  const maritalData = Object.values(stats.marital_counts);

  // Bar Chart: Пол по департаментам
  const depLabels = Object.keys(stats.gender_by_dep);
  const depGenderKeys = Array.from(new Set(depLabels.flatMap(dep => Object.keys(stats.gender_by_dep[dep]))));
  const depGenderDatasets = depGenderKeys.map((gender, idx) => ({
    label: genderMap[gender] || gender,
    data: depLabels.map(dep => stats.gender_by_dep[dep][gender] || 0),
    backgroundColor: idx === 0 ? '#1976d2' : '#e53935'
  }));

  // Bar Chart: Семейное положение по департаментам
  const depMaritalKeys = Array.from(new Set(depLabels.flatMap(dep => Object.keys(stats.marital_by_dep[dep]))));
  const depMaritalDatasets = depMaritalKeys.map((marital, idx) => ({
    label: maritalStatusMap[marital] || marital,
    data: depLabels.map(dep => stats.marital_by_dep[dep][marital] || 0),
    backgroundColor: ["#1976d2", "#43a047", "#ffa000"][idx % 3]
  }));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Аналитика по полу и семейному положению</Typography>
      <Box mb={3}>
        <Grid container spacing={2}>
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
                <Typography variant="subtitle2" color="textSecondary">Мужчин</Typography>
                <Typography variant="h5">{malePct}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Женщин</Typography>
                <Typography variant="h5">{femalePct}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Женатых / Замужних</Typography>
                <Typography variant="h5">{marriedPct}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Не женатых / Не замужних</Typography>
                <Typography variant="h5">{singlePct}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Разведённых</Typography>
                <Typography variant="h5">{divorcedPct}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Распределение по полу</Typography>
            <Box sx={{ height: 320 }}>
              <Pie
                data={{
                  labels: genderLabels.map(g => genderMap[g] || g),
                  datasets: [{
                    data: genderData,
                    backgroundColor: ["#1976d2", "#e53935"]
                  }]
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Распределение по семейному положению</Typography>
            <Box sx={{ height: 320 }}>
              <Pie
                data={{
                  labels: maritalLabels.map(m => maritalStatusMap[m] || m),
                  datasets: [{
                    data: maritalData,
                    backgroundColor: ["#1976d2", "#43a047", "#ffa000"]
                  }]
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Пол по департаментам</Typography>
            <Box sx={{ height: 320 }}>
              <Bar
                data={{
                  labels: depLabels.map(dep => departmentMap[dep] || dep),
                  datasets: depGenderDatasets
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Семейное положение по департаментам</Typography>
            <Box sx={{ height: 320 }}>
              <Bar
                data={{
                  labels: depLabels.map(dep => departmentMap[dep] || dep),
                  datasets: depMaritalDatasets
                }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemoGenderReportPage;
