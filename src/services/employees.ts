import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEmployee = async (data) => {
  return await prisma.employee.create({
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
    const sortField = sort.replace(/^[+-]/, '');
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