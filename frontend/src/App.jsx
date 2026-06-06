import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import Home from './Pages/Home';
import PostDetail from './Pages/PostDetail';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import Posts from './Pages/Posts';
import CreatePostAdmin from './Pages/AdminCreatePost';
import AdminEditPost from './Pages/AdminEditPost';
import { ProtectedRoutes } from './Components/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Route>

        {/* Admin-protected routes */}
        <Route element={<ProtectedRoutes requiredRole="admin" />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/posts" element={<Posts />} />
          <Route path="/admin/posts/create" element={<CreatePostAdmin />} />
          <Route path="/admin/posts/edit/:id" element={<AdminEditPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
