import productService from "../services/product.service.js"
import createError from "../utils/create-error.js"


const productController = {}

productController.create = async (req, res) => {

  const productData = req.body
  const creatorId = req.user.id

  if (!productData.title || !productData.price || productData.stockQuantity === undefined) {
    throw createError(400, 'Title, price, and stock quantity are required')
  }

  const newProduct = await productService.create(productData, creatorId)
  res.status(201).json({ success: true, product: newProduct })
}

productController.getAll = async (req, res) => {

  const products = await productService.findAll()
  if (!products) {
    throw createError(404, 'Get category not found or unauthorized')
  }
  res.status(200).json({ success: true, products })
}


productController.getById = async (req, res) => {

  const id = Number(req.params.id);
  const product = await productService.findById(id);

  if (!product) {
    throw createError(404, 'Product not found')
  }
  res.status(200).json({ success: true, product })
}

productController.updateProduct = async (req, res) => {

  const id = Number(req.params.id);
  const dataToUpdate = req.body;

  if (dataToUpdate.stockQuantity !== undefined && dataToUpdate.stockQuantity < 0) {
    return res.status(400).json({ success: false, message: 'Invalid stock quantity' })
  }

  const productToUpdate = await productService.findById(id);
  if (!productToUpdate) {
    throw createError(404, 'Product not found');
  }

  const updatedProduct = await productService.updateProduct(id, dataToUpdate)
  res.status(200).json({ success: true, product: updatedProduct })
}

productController.deleteProduct = async (req, res) => {
  const id = Number(req.params.id);

  const productToDelete = await productService.findById(id);
  if (!productToDelete) {
    throw createError(404, 'Product not found');
  }

  await productService.deleteProduct(id);
  res.status(204).json({ success: true, deleteProduct })
}


export default productController
