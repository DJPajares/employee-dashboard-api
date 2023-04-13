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

export const getEmployees = async () => {
  return await prisma.employee.findMany();
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
  console.log('id', id);
  return await prisma.employee.delete({
    where: {
      id
    }
  });
};
