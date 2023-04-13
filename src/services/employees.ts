import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type queryParamsProps = {
  limit?: string;
  skip?: string;
};

const queryParams = ({ limit, skip }: queryParamsProps) => ({
  // text: '',
  // words: [],
  take: limit ? parseInt(limit, 10) : 50,
  skip: skip ? parseInt(skip, 10) : 0
  // sort: { reviews: -1 }
});

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
  return await prisma.employee.findMany(queryParams(req.query));
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
