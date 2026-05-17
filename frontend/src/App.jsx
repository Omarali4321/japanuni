import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Universities from './pages/Universities'
import UniversityDetail from './pages/UniversityDetail'
import Scholarships from './pages/Scholarships'
import Admission from './pages/Admission'
import Visa from './pages/Visa'
import StudentLife from './pages/StudentLife'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Compare from './pages/Compare'
import Match from './pages/Match'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="universities" element={<Universities />} />
        <Route path="universities/:id" element={<UniversityDetail />} />
        <Route path="compare" element={<Compare />} />
        <Route path="match" element={<Match />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="admission" element={<Admission />} />
        <Route path="visa" element={<Visa />} />
        <Route path="student-life" element={<StudentLife />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}
