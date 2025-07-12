import categoryService from "../services/category.service.js"
import createError from "../utils/create-error.js";


const categoryController = {}

categoryController.create = async (req, res, next) => {
  const { name } = req.body
  const createdById = req.user.id
  if (!name) {
    throw createError(400, "Category name is required")
  }

  const newCategory = await categoryService.create(name, createdById)
  res.status(201).json({ success: true, category: newCategory })
}

categoryController.getAll = async (req, res, next) => {
  const categories = await categoryService.findAll()
  res.status(200).json({ success: true, categories: categories })
}

categoryController.updateCategory = async (req, res, next) => {
  const id = Number(req.params.id)
  const { name } = req.body

  if (!name) {
    throw createError(400, "Category name is required")
  }

  const categoryToUpdate = await categoryService.findById(id)
  if (!categoryToUpdate) {
    throw createError(404, "Category not found")
  }

  const updatedCategory = await categoryService.updateCategory(id, { name })
  res.status(200).json({ success: true, category: updatedCategory })
}

categoryController.deleteCategory = async (req, res, next) => {
  const id = Number(req.params.id);

  const categoryToDelete = await categoryService.findById(id);
  if (!categoryToDelete) {
    throw createError(404, "Category not found");
  }
  const deleteCategory = await categoryService.deleteCategory(id)
  res.status(200).json({ success: true, message: "Category deleted successfully",deleteCategory : deleteCategory })
}


export default categoryController
