import express from 'express';
import { Employee } from '@prisma/client';
import {
  createEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} from '../services/employees';

const router = express.Router();

router.get('/', async (req, res) => {
  const employees: Employee[] = await getEmployees();
  res.send(employees);
});

router.get('/:id', async (req, res) => {
  const employee: Employee = await getEmployee(req.params.id);
  res.send(employee);
});

router.post('/', async (req, res) => {
  const employee: Employee = await createEmployee(req.body);
  res.send(employee);
});

router.put('/:id', async (req, res) => {
  const employee: Employee = await updateEmployee(req.params.id, req.body);
  res.send(employee);
});

router.delete('/:id', async (req, res) => {
  const employee: Employee = await deleteEmployee(req.params.id);
  res.send(employee);
});

export default router;
