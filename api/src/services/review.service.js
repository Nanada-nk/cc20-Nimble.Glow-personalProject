import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const reviewService = {};

reviewService.createReview = async (productOnOrderId, userId, data) => {

  const productInOrder = await prisma.productOnOrder.findUnique({
    where: { id: Number(productOnOrderId) },
    include: {
      order: { include: { cart: true } },
      review: true,
    },
  });

  if (!productInOrder) {
    throw createError(404, "Product in order not found.");
  }
  if (productInOrder.order.cart.userId !== userId) {
    throw createError(403, "You can only review products from your own orders.");
  }
  if (!['DELIVERED', 'COMPLETED'].includes(productInOrder.order.orderStatus)) {
    throw createError(403, "You can only review products after the order is delivered or completed.");
  }
  if (productInOrder.review) {
    throw createError(400, "You have already reviewed this item.");
  }

  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId: userId,
      productOnOrderId: Number(productOnOrderId),
      images: {
        create: data.images ? data.images.map(url => ({ url })) : undefined
      }
    },
    include: {
      images: true,
      user: { select: { firstName: true, profileImage: true } }
    }
  });
};

reviewService.getReviewsForProduct = (productId) => {
  return prisma.review.findMany({
    where: {
      productOnOrder: {
        productId: Number(productId),
      }
    },
    include: {
      images: true,
      user: {
        select: {
          firstName: true,
          profileImage: true
        }
      }
    },
    orderBy: {
      reviewDate: "desc"
    }
  });
};

reviewService.findAllReviews = () => {
  return prisma.review.findMany({
    orderBy: {
      reviewDate: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
          profileImage: true
        }
      },
      productOnOrder: {
        select: {
          product: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    }
  });
};

reviewService.findById = (reviewId) => {
  return prisma.review.findUnique({
    where: {
      id: Number(reviewId)
    }
  });
};

reviewService.update = (reviewId, dataToUpdate) => {
  const { rating, comment } = dataToUpdate;

  return prisma.review.update({
    where: {
      id: Number(reviewId)
    },
    data: {
      rating,
      comment
    }
  });
}



export default reviewService;