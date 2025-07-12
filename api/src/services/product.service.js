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
      category: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }
    }
  });
}


productService.findAll = async (queryOptions = {}) => {
  const { categoryId, search, page = 1, limit = 1000 } = queryOptions; 

  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [products, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { 
        images: true, 
        category: true,
        createdBy: { select: { id: true, firstName: true } }
      }
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(totalProducts / take);

  return { products, currentPage: Number(page), totalPages, totalProducts };
}

productService.findById = (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      images: true,
      category: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      },
      orderItems:{
        where:{
          review:{
            isNot: null
          }
        },
        include:{
          review: {
            include: {
              user: {
                select: {
                  firstName: true,
                  profileImage: true
                },
              },
              images: true
            }
          }
        }
      }
    }
  })
}

productService.updateProduct = (id, dataToUpdate, newImageUrls = [], imagesToDelete = []) => {
  const { title, description, price, stockQuantity, categoryId } = dataToUpdate

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (price) updateData.price = Number(price);
  if (stockQuantity) updateData.stockQuantity = Number(stockQuantity);
  if (categoryId) updateData.categoryId = Number(categoryId);

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
    where: { id: Number(id) },
    data: updateData,
    include: {
      images: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }
    }
  })
}

productService.deleteProduct = (id) => {
  return prisma.product.delete({
    where: { id: Number(id) },
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }
    }
  })
}


export default productService