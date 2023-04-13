import express from 'express';
import employeesRouter from './employees';

const router = express.Router();

router.use('/api/employees', employeesRouter);

export default router;
