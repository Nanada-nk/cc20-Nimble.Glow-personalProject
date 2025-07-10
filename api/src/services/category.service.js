import prisma from "../config/prisma.config.js"

const categoryService = {}

categoryService.create = (name, createdById) => {
  return prisma.category.create({
    data: {
      name,
      createdById,
    },
    include: {
      createdBy: {
        select: {
          firstName:true,
          lastName:true,
          email: true,
          role: true
        }
      }
    }
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
          email:true,
          role:true
        },
      },
      products:{
        orderBy:{
          id: "asc"
        },
        take:1,
        include:{
          images:true
        }
      }
    },
  })
}


categoryService.findById = (id) => {
  return prisma.category.findUnique({
    where: {
      id: id,
    },
    include: {
      createdBy: {
        select: {
          firstName:true,
          lastName:true,
          email: true,
          role: true
        }
      }
    }
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
    include: {
      createdBy: {
        select: {
          firstName:true,
          lastName:true,
          email: true,
          role: true
        }
      }
    }
  })
}


categoryService.deleteCategory = (id) => {
  return prisma.category.delete({
    where: { id },
    include:{
      createdBy:{
        select:{
          firstName:true,
          lastName:true,
          email:true,
          role:true
        }
      }
    }
  });
};


export default categoryService