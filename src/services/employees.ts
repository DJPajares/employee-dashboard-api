import { Employee, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEmployees = async (employees: Employee[]) => {
  return await prisma.employee.createMany({
    data: employees
  });
};

export const createOrUpdateEmployees = async (employees: Employee[]) => {
  try {
    const newEmployees = [];
    const existingEmployees = [];

    for (const employee of employees) {
      const { id } = employee;
      const existingEmployee = await prisma.employee.findUnique({
        where: { id }
      });

      if (existingEmployee) {
        existingEmployees.push(employee);
      } else {
        newEmployees.push(employee);
      }
    }

    // Create new employees
    await prisma.employee.createMany({
      data: newEmployees
    });

    // Update existing employees
    for (const employee of existingEmployees) {
      const { id, login, name, salary } = employee;
      const existingLoginEmployee = await prisma.employee.findUnique({
        where: { login }
      });

      if (existingLoginEmployee && existingLoginEmployee.id !== id) {
        throw new Error(`Login '${login}' already exists`);
      }

      await prisma.employee.upsert({
        where: { id },
        update: { login, name, salary },
        create: { id, login, name, salary }
      });
    }
  } catch {
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

  let orderBy = {};

  if (sort) {
    const sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
    const sortField = sort.replace(/^[+\-\s]*/g, '');
    if (['id', 'name', 'login', 'salary'].includes(sortField)) {
      orderBy = {
        [sortField]: sortOrder
      };
    }
  }

  return await prisma.employee.findMany({
    where: {
      salary: {
        gte: minSalary ? parseInt(minSalary, 10) : undefined,
        lte: maxSalary ? parseInt(maxSalary, 10) : undefined
      }
    },
    orderBy,
    skip: offset ? parseInt(offset, 10) : undefined,
    take: limit ? parseInt(limit, 10) : 50
  });
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
