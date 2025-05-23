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
import { departmentMap, jobRoleMap, educationLevelMap, educationFieldMap } from "../../lib/translations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DemoEducationReportPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/reports/education/").then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  // Метрики
  const count = stats.count;

  // Уровни образования
  const levelLabels = Object.keys(stats.level_counts).map(l => educationLevelMap[l] || l);
  const levelData = Object.values(stats.level_counts);

  // Поля образования
  const fieldLabels = Object.keys(stats.field_counts).map(f => educationFieldMap[f] || f);
  const fieldData = Object.values(stats.field_counts);

  // Самый популярный уровень образования
  const topLevel = levelLabels[levelData.indexOf(Math.max(...levelData))] || '-';
  // Самое популярное поле образования
  const topField = fieldLabels[fieldData.indexOf(Math.max(...fieldData))] || '-';
  // Среднее количество сотрудников на поле образования
  const avgField = fieldData.length ? (fieldData.reduce((a, b) => a + b, 0) / fieldData.length).toFixed(1) : '-';

  // По департаментам
  const depLabels = Object.keys(stats.field_by_dep);
  const depFieldKeys = Array.from(new Set(depLabels.flatMap(dep => Object.keys(stats.field_by_dep[dep]))));
  const depFieldDatasets = depFieldKeys.map((field, idx) => ({
    label: educationFieldMap[field] || field,
    data: depLabels.map(dep => stats.field_by_dep[dep][field] || 0),
    backgroundColor: `hsl(${idx * 60}, 70%, 60%)`
  }));

  // По ролям
  const roleLabels = Object.keys(stats.field_by_role);
  const roleFieldKeys = Array.from(new Set(roleLabels.flatMap(role => Object.keys(stats.field_by_role[role]))));
  const roleFieldDatasets = roleFieldKeys.map((field, idx) => ({
    label: educationFieldMap[field] || field,
    data: roleLabels.map(role => stats.field_by_role[role][field] || 0),
    backgroundColor: `hsl(${idx * 60}, 70%, 60%)`
  }));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Аналитика по образованию сотрудников</Typography>
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
                <Typography variant="subtitle2" color="textSecondary">Топ уровень образования</Typography>
                <Typography variant="h5">{topLevel}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Топ поле образования</Typography>
                <Typography variant="h5">{topField}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Среднее сотрудников на поле</Typography>
                <Typography variant="h5">{avgField}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Распределение по уровню образования</Typography>
            <Pie data={{
              labels: levelLabels,
              datasets: [{ data: levelData, backgroundColor: ["#1976d2", "#43a047", "#ffa000", "#e53935", "#8e24aa"] }]
            }} options={{responsive:true, plugins:{legend:{position:'bottom'}}, aspectRatio:1.2}} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Распределение по полю образования</Typography>
            <Pie data={{
              labels: fieldLabels,
              datasets: [{ data: fieldData, backgroundColor: ["#1976d2", "#43a047", "#ffa000", "#e53935", "#8e24aa", "#00bcd4"] }]
            }} options={{responsive:true, plugins:{legend:{position:'bottom'}}, aspectRatio:1.2}} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Поля образования по департаментам</Typography>
            <Bar
              data={{
                labels: depLabels.map(dep => departmentMap[dep] || dep),
                datasets: depFieldDatasets
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, aspectRatio: 1.6 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Поля образования по ролям</Typography>
            <Bar
              data={{
                labels: roleLabels.map(role => jobRoleMap[role] || role),
                datasets: roleFieldDatasets
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, aspectRatio: 1.6 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemoEducationReportPage;
