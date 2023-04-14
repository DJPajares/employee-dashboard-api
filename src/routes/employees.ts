import express from 'express';
import { Employee } from '@prisma/client';
import {
  createEmployees,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} from '../services/employees';
import { csvParser } from '../middlewares/csvParser';

const router = express.Router();

// router.post('/', async (req, res) => {
//   const employees: Employee[] = req.body;

//   const result = await createEmployees(employees);
//   res.send(result);
// });

router.post('/', csvParser, async (req, res) => {
  const employees: Employee[] = req.body.csvData;

  const result = await createEmployees(employees);
  res.send(result);
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
