import prisma from "../config/prisma.config.js"

const productService = {}

productService.create = (productData, creatorId) => {
  const { title, description, price, stockQuantity, images, categoryId } = productData;

  return prisma.product.create({
    data: {
      title,
      description: description || "",
      price,
      stockQuantity,
      categoryId,
      createdById: creatorId,
      images: {
        create: images ? images.map(imgUrl => ({ url: imgUrl })) : [],
      },
    },
    include: {
      images: true,
      category: true
    }
  });
}

productService.findAll = () => {
  return prisma.product.findMany({
    include: {
      images: true,
      category: true,
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        }
      }
    }
  });
}
productService.findById = (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      reviews: true,
    }
  })
}
productService.updateProduct = (id, dataToUpdate) => {
  return prisma.product.update({
    where: { id },
    data: dataToUpdate
  })
}
productService.deleteProduct = (id) => {
  return prisma.product.delete({
    where: { id }
  })
}


export default productService