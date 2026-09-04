import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Support from './pages/Support.jsx';
import Contact from './pages/Contact.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function Page({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/volunteer" element={<Page><Volunteer /></Page>} />
          <Route path="/support" element={<Page><Support /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/admin" element={<Page><AdminDashboard /></Page>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}