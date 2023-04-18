import express from 'express';
import { Employee } from '@prisma/client';
import {
  createOrUpdateEmployees,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  deleteEmployees
} from '../services/employees';
import { csvParser } from '../middlewares/csvParser';

const router = express.Router();

// Lock endpoint to prevent multiple processes from running at the same time
let lockEndpoint = false;

router.post('/', csvParser, async (req, res, next) => {
  try {
    const employees: Employee[] = req.body.csvData;

    if (lockEndpoint) {
      throw new Error('Cannot process request at this time');
    }

    lockEndpoint = true;

    await createOrUpdateEmployees(employees);

    lockEndpoint = false;

    res.status(200).send({
      success: true
    });
  } catch (error) {
    lockEndpoint = false;
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const employees: Employee[] = await getEmployees(req);

    res.status(200).send({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const employee: Employee = await updateEmployee(req.params.id, req.body);

    res.status(200).send({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const employee: Employee = await deleteEmployee(req.params.id);

    res.status(200).send({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const employees = await deleteEmployees(req.body);

    res.status(200).send({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
});

export default router;
