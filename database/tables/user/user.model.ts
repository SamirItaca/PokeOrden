import { prisma } from '../../prisma/cliente'

export const getUserById = (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};