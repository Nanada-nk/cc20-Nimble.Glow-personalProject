import prisma from "../config/prisma.config.js"

const categoryService = {}

categoryService.create = (data) => {
  return prisma.category.create({ data })
}

categoryService.findAll = (userId) => {
  return prisma.category.findMany({
    where: {
      userId
    }
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
      id
    },
    data: {
      name: data.name
    }
  })
}
categoryService.deleteCategory = (id) => {
  return prisma.category.delete({
    where: { id }
  })
}


export default categoryService