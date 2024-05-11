import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import MainPage from './pages/MainPage/MainPage';

import AdministrationPage from './pages/AdministrationPage/AdministrationPage';

import AccountPage from './pages/AccountPage/AccountPage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import CartPage from "./pages/CartPage/CartPage";
import ProductsPage from './pages/ProductsPage/ProductsPage';


function App() {
  return (
    <Router>
      <div className='app_wrapper'>
        <Header />
        <Routes>
          <Route path='/' element={<MainPage />} />

          <Route path='/administration' element={<AdministrationPage />} />

          <Route path='/account' element={<AccountPage />} />
          <Route path='/catalog' element={<CatalogPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/products' element={<ProductsPage />} />
          {/* <Route path='/contact' element={<ContactsPage />} />
          
          <Route path='/materials' element={<MaterialsPage />} />
           */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
