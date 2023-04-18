import { Employee, PrismaClient } from '@prisma/client';
import { queryParamsSchema } from '../utilities/queryParamsValidator';
import { Request } from 'express';

const prisma = new PrismaClient();

export const createOrUpdateEmployees = async (employees: Employee[]) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const upserts = [];

      for (const employee of employees) {
        const { id, login, name, salary } = employee;
        const promise = prisma.employee.upsert({
          where: { id },
          update: { login, name, salary },
          create: { id, login, name, salary }
        });
        upserts.push(promise);
      }

      await Promise.all(upserts);
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not create or update employees');
  }
};

export const getEmployees = async (req: Request) => {
  try {
    const { minSalary, maxSalary, limit, offset, sort } =
      queryParamsSchema.parse(req.query);

    return await prisma.employee.findMany({
      where: {
        salary: {
          gte: minSalary,
          lte: maxSalary
        }
      },
      orderBy: sort,
      skip: offset,
      take: limit
    });
  } catch (error) {
    throw new Error('Could not get employees');
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const { salary } = data;

    if (salary < 0) {
      throw new Error('Salary cannot be negative');
    }

    return await prisma.employee.update({
      where: {
        id
      },
      data
    });
  } catch (error) {
    throw new Error('Could not update employee');
  }
};

export const deleteEmployee = async (id) => {
  try {
    return await prisma.employee.delete({
      where: {
        id
      }
    });
  } catch (error) {
    throw new Error('Could not delete an employee');
  }
};

export const deleteEmployees = async (data) => {
  try {
    return await prisma.employee.deleteMany({
      where: {
        id: {
          in: data
        }
      }
    });
  } catch (error) {
    throw new Error('Could not delete employees');
  }
};
