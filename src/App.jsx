import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AiWidget from './components/AiWidget'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import Login from './pages/login'
import Cadastro from './pages/Cadastro'
import Produtos from './pages/Produtos'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
      <Footer />
      <AiWidget />
    </BrowserRouter>
  )
}

export default App
