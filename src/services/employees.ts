import { Employee, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEmployees = async (employees: Employee[]) => {
  return await prisma.employee.createMany({
    data: employees
  });
};

export const createOrUpdateEmployees = async (employees: Employee[]) => {
  try {
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
  const { minSalary, maxSalary, limit = 30, offset, sort } = req.query;

  // TODO: validate only if query parameters are present (middleware - validator)

  // TODO: validate query parameters (middleware - validator)
  if (!minSalary || !maxSalary || !limit || !offset || !sort) {
    throw new Error('Missing required query parameters');
  }

  // TODO: validate parameter types (middleware - validator)

  if (minSalary && maxSalary && parseFloat(minSalary) > parseFloat(maxSalary)) {
    throw new Error('Min salary cannot be greater than max salary');
  }

  if (minSalary && parseFloat(minSalary) < 0) {
    throw new Error('Min salary cannot be less than 0');
  }

  if (maxSalary && parseFloat(maxSalary) < 0) {
    throw new Error('Max salary cannot be less than 0');
  }

  try {
    let orderBy = {};

    if (sort) {
      const sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
      const sortField = sort.replace(/^[+\-\s]*/g, '');
      if (['id', 'name', 'login', 'salary'].includes(sortField)) {
        orderBy = {
          [sortField]: sortOrder
        };
      } else {
        throw new Error('Invalid sort field');
      }
    }

    return await prisma.employee.findMany({
      where: {
        salary: {
          gte: minSalary ? parseFloat(minSalary) : undefined,
          lte: maxSalary ? parseFloat(maxSalary) : undefined
        }
      },
      orderBy,
      skip: offset ? parseInt(offset) : undefined,
      take: limit ? parseInt(limit) : 50
    });
  } catch (error) {
    throw new Error('Could not get employees');
  }
};

export const updateEmployee = async (id, data) => {
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
