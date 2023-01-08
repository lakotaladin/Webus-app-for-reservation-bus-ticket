import './resources/global.css';
import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import AdminBuses from './pages/Admin/AdminBuses';
import AdminUsers from './pages/Admin/AdminUsers';
import Register from './pages/Register';
import Login from './pages/Login';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import Booknow from './pages/Booknow';
import Bookings from './pages/Bookings';
import Contact from './pages/Contact';
// preuzeto sa sajta antd design 
// import { Button } from 'antd';
// Preuzeto sa sajta antd design i dodato .min. da bi radilo 
// Rute

function App() {
  // kreiranje dinamickog Spinner-a
  const { loading } = useSelector(state => state.alerts)
  return (
    <div>
      {/* Ako je ucitavanje jednako true, onda prikazi Spinner */}
      {loading && <Loader />}

      {/* RUTE  */}
      <BrowserRouter>

        <Routes>
          {/* Početna stranica */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          {/* Rezervisanje karte */}
          <Route path="/book-now/:id" element={
            <ProtectedRoute>
              <Booknow />
            </ProtectedRoute>
          } />
          {/* Sve rezervisane karte */}
          <Route path="/bookings" element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } />
          {/* Kontakt stranica */}
          <Route path="/contact" element={
              <Contact />
          } />
          {/* Admin autobusi */}
          <Route path="/admin/buses" element={
            <ProtectedRoute>
              <AdminBuses />
            </ProtectedRoute>
          } />
          {/* Admin korisnici */}
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          } />
          {/* Registracija */}
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          {/* Logovanje */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
