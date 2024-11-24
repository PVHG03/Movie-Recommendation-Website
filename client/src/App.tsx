import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { HomePage } from "./pages/Home"
import { MediaDetailPage } from "./pages/MediaDetail"

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/media/:id" element={<MediaDetailPage />} />
      </Routes>
    </Router>
  )
}