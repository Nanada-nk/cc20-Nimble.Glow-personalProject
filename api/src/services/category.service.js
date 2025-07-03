import prisma from "../config/prisma.config.js"

const categoryService = {}

categoryService.create = (name, createdById) => {
  return prisma.category.create({
    data: {
      name,
      createdById,
    },
  })
}


categoryService.findAll = () => {
  return prisma.category.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })
}


categoryService.findById = (id) => {
  return prisma.category.findUnique({
    where: {
      id: id,
    },
  })
}


categoryService.updateCategory = (id, data) => {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name: data.name,
    },
  })
}


categoryService.deleteCategory = (id) => {
  return prisma.category.delete({
    where: { id },
  });
};


export default categoryService