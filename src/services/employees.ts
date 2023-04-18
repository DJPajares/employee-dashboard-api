import { Employee, PrismaClient } from '@prisma/client';
import { queryParamsSchema } from '../utilities/queryParamsValidator';

const prisma = new PrismaClient();

export const createEmployees = async (employees: Employee[]) => {
  return await prisma.employee.createMany({
    data: employees
  });
};

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

export const getEmployee = async (id) => {
  return await prisma.employee.findUnique({
    where: {
      id
    }
  });
};

export const getEmployees = async (req, res) => {
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
    throw new Error('Invalid request');
  }
};

export const updateEmployee = async (id, data) => {
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
};

export const deleteEmployee = async (id) => {
  return await prisma.employee.delete({
    where: {
      id
    }
  });
};

export const deleteEmployees = async (data) => {
  return await prisma.employee.deleteMany({
    where: {
      id: {
        in: data
      }
    }
  });
};
