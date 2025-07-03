import productService from "../services/product.service.js"


const productController = {}

productController.create = async (req, res) => {

  const productData = req.body
  const creatorId = req.user.id

  if (!productData.title || !productData.price || !productData.stockQuantity) {
    return res.status(400).json({ success: false, message: 'Title, price, and stock quantity are required' });
  }

  const newProduct = await productService.create(productData, creatorId);
  res.status(201).json({ success: true, product: newProduct })

  // const { title, description, price, stockQuantity, images, categoryId } = req.body

  // if (!req.body) {
  //   return res.status(400).json({ success: false, message: 'All fields of product are required' })
  // }

  // const data = {
  //   title, description, price, stockQuantity,
  //   images: { create: images }
  //   , categoryId
  // }

  // const newProduct = await productService.create({ data })
  // res.status(201).json({ success: true, newProduct })
}

productController.getAll = async (req, res) => {

  const products = await productService.findAll();
  res.status(200).json({ success: true, products })

  // const userId = req.user.id
  // const getCategory = await productService.findAll(userId)
  // if (!getCategory) {
  //   return res.status(404).json({ success: false, message: 'Get category not found or unauthorized' })
  // }
  // res.status(200).json({ success: true, getCategory })
}

// เพิ่มใน productController
productController.getById = async (req, res) => {

  const id = Number(req.params.id);
  const product = await productService.findById(id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({ success: true, product });

  // const id = Number(req.params.id);
  // const product = await productService.findById(id);

  // if (!product) {
  //   return res.status(404).json({ success: false, message: 'Product not found' });
  // }
  // res.status(200).json({ success: true, product })
}

productController.updateProduct = async (req, res) => {

  const id = Number(req.params.id);
  const dataToUpdate = req.body;

  if (dataToUpdate.stockQuantity !== undefined && dataToUpdate.stockQuantity < 0) {
    return res.status(400).json({ success: false, message: 'Invalid stock quantity' });
  }

  const updatedProduct = await productService.updateProduct(id, dataToUpdate);
  res.status(200).json({ success: true, product: updatedProduct });

  // const { id } = req.params
  // const { title, description, price, stockQuantity, categoryId } = req.body


  // if (stockQuantity !== undefined && stockQuantity < 0) {
  //   return res.status(400).json({ success: false, message: 'Invalid stock quantity' });
  // }

  // const data = { title, description, price, stockQuantity, categoryId }

  // const productToUpdate = await productService.updateProduct(id, { data })
  // res.status(200).json({ success: true, productToUpdate })
}

productController.deleteProduct = async (req, res) => {
  const id = Number(req.params.id)
  const deleteProduct = await productService.deleteProduct(id)
  res.status(200).json({ success: true, deleteProduct })
}


export default productController
