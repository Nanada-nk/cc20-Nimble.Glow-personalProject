import productService from "../services/product.service.js"
import createError from "../utils/create-error.js"
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs/promises"

const productController = {}

const uploadImagesToCloudinary = async (files) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(file =>
    cloudinary.uploader.upload(file.path, { folder: 'nimble-glow-products' })
  );
  try {
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } finally {
    const unlinkPromises = files.map(file => fs.unlink(file.path));
    await Promise.all(unlinkPromises);
  }
}

productController.create = async (req, res, next) => {

  const productData = req.body
  const creatorId = req.user.id

  if (!productData.title || !productData.price || productData.stockQuantity === undefined) {
    throw createError(400, 'Title, price, and stock quantity are required')
  }

  const imageUrls = await uploadImagesToCloudinary(req.files);
  productData.images = imageUrls

  const newProduct = await productService.create(productData, creatorId)
  res.status(201).json({ success: true, product: newProduct })
}

productController.getAll = async (req, res, next) => {
  const queryOptions = req.query;
  const result = await productService.findAll(queryOptions);
  const formattedResult = {
    ...result,
    products: result.products
  };
  res.status(200).json({ success: true, ...formattedResult });
}

productController.getById = async (req, res, next) => {

  const id = Number(req.params.id);
  const product = await productService.findById(id);

  if (!product) {
    throw createError(404, 'Product not found')
  }
  res.status(200).json({ success: true, product: product })
}

productController.updateProduct = async (req, res, next) => {

  const id = Number(req.params.id);
  const dataToUpdate = req.body;

  if (dataToUpdate.stockQuantity !== undefined && dataToUpdate.stockQuantity < 0) {
    return res.status(400).json({ success: false, message: 'Invalid stock quantity' })
  }

  const newImageUrls = await uploadImagesToCloudinary(req.files)
  const imagesToDelete = req.body.imagesToDelete ? JSON.parse(req.body.imagesToDelete) : []


  const productToUpdate = await productService.findById(id);
  if (!productToUpdate) {
    throw createError(404, 'Product not found');
  }

  const updatedProduct = await productService.updateProduct(id, dataToUpdate, newImageUrls, imagesToDelete);
  res.status(200).json({ success: true, product: updatedProduct });
}

productController.deleteProduct = async (req, res, next) => {
  const id = Number(req.params.id);

  const productToDelete = await productService.findById(id);
  if (!productToDelete) {
    throw createError(404, 'Product not found');
  }


  const deletedProduct = await productService.deleteProduct(id);


  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    product: deletedProduct
  });
}



export default productController
