import express from 'express';
import { Employee } from '@prisma/client';
import {
  createEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} from '../services/employees';
import { csvParser } from '../middlewares/csvParser';

const router = express.Router();

router.post('/', csvParser, async (req, res) => {
  const employee: Employee = await createEmployee(req.body);
  res.send(employee);
});

router.get('/:id', async (req, res) => {
  const employee: Employee = await getEmployee(req.params.id);
  res.send(employee);
});

router.get('/', async (req, res) => {
  const employees: Employee[] = await getEmployees(req, res);
  res.send(employees);
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
