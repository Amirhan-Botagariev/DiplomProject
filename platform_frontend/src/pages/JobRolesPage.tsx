import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Button, Grid, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { genderMap, departmentMap, jobRoleMap } from "../lib/translations";

interface Employee {
  employee_id: number;
  employee_number: number;
  age: number;
  gender: string;
  department: string;
  job_role: string;
  // ... другие поля по необходимости
}

const JobRolesPage: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/v1/reference/job_roles").then(res => setJobRoles(res.data ?? []));
  }, []);

  const handleShowEmployees = (role: string) => {
    setSelectedRole(role);
    setOpen(true);
    axios.get("/api/v1/employees/", { params: { job_role: role, limit: 100 } })
      .then(res => setEmployees(res.data.employees ?? []));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
    setEmployees([]);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Должности</Typography>
      <Grid container spacing={2}>
        {jobRoles.map(role => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={role}>
            <Card>
              <CardContent>
                <Typography variant="h6">{jobRoleMap[role] || role}</Typography>
                {/* Здесь можно добавить описание, если появится */}
                <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleShowEmployees(role)}>
                  Посмотреть сотрудников
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          Сотрудники по должности: {selectedRole ? (jobRoleMap[selectedRole] || selectedRole) : ''}
        </DialogTitle>
        <DialogContent>
          {employees.length === 0 ? (
            <Typography>Нет сотрудников с этой должностью.</Typography>
          ) : (
            <Box>
              {employees.map(emp => (
                <Box key={emp.employee_id} mb={1} p={1} borderBottom="1px solid #eee">
                  <Typography>
                    <b>ID:</b> {emp.employee_id} 
                    <b>Возраст:</b> {emp.age} 
                    <b>Пол:</b> {genderMap[emp.gender] || emp.gender} 
                    <b>Департамент:</b> {departmentMap[emp.department] || emp.department}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default JobRolesPage;
