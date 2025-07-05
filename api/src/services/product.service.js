import prisma from "../config/prisma.config.js"

const productService = {}

productService.create = (productData, creatorId) => {
  const { title, description, price, stockQuantity, images, categoryId } = productData;

  return prisma.product.create({
    data: {
      title,
      description: description || "",
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      categoryId: Number(categoryId),
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
productService.updateProduct = (id, dataToUpdate, newImageUrls = [], imagesToDelete = []) => {
  const { title, description, price, stockQuantity, categoryId } = dataToUpdate
  const updateData = { title, description, price, stockQuantity, categoryId }
  const imageUpdateLogic = {};
  if (newImageUrls.length > 0) {
    imageUpdateLogic.create = newImageUrls.map(url => ({ url }));
  }
  if (imagesToDelete.length > 0) {
    imageUpdateLogic.deleteMany = {
      id: { in: imagesToDelete.map(id => Number(id)) }
    };
  }

  if (Object.keys(imageUpdateLogic).length > 0) {
    updateData.images = imageUpdateLogic;
  }
  return prisma.product.update({
    where: { id },
    data: updateData,
    include: { images: true }
  })
}

productService.deleteProduct = (id) => {
  return prisma.product.delete({
    where: { id }
  })
}


export default productService