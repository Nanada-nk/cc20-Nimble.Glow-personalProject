import categoryService from "../services/category.service"

const categoryController = {}

categoryController.create = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' })
  }


  const newCategory = await categoryService.create({ name })
  res.status(201).json({ success: true, newCategory })
}

categoryController.getAll = async (req, res) => {
  const userId = req.user.id
  const getCategory = await categoryService.findAll(userId)
  if (!getCategory) {
    return res.status(404).json({ success: false, message: 'Get category not found or unauthorized' })
  }
  res.status(200).json({ success: true, getCategory })
}

categoryController.updateCategory = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  const categoryToUpdate = await categoryService.findById(id)
  if (!categoryToUpdate) {
    return res.status(404).json({ success: false, message: 'Category not found' })
  }

  const updateCategory = await categoryService.updateCategory({ id, name })
  res.status(200).json({ success: true, updateCategory })
}

categoryController.deleteCategory = async (req, res) => {
  const id = Number(req.params.id)
  const deleteCategory = await categoryService.deleteCategory(id)
  res.status(200).json({ success: true, deleteCategory })
}


export default categoryController
