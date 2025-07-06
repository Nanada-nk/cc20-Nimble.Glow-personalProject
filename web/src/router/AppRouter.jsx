import { BrowserRouter, Route, Routes } from 'react-router'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<LoginPage />} />
          <Route path='todo' element={<TodoListPage />} />
          <Route path='register' element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default AppRouter