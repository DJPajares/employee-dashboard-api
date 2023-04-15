import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEmployees = async (data) => {
  return await prisma.employee.createMany({
    data
  });
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
