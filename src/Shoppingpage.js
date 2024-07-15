import React, { useState, useRef,useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import './ShoppingPage.css';
import userIcon from './assets/person.svg';
import cartIcon from './assets/cart.svg';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

import productImage1 from './assets/product1.svg';
import productImage2 from './assets/product2.svg';
import productImage3 from './assets/product3.svg';

const products = [
  { name: 'Product 1', description: 'Description of product 1', image: productImage1 },
  { name: 'Product 2', description: 'Description of product 2', image: productImage2 },
  { name: 'Product 3', description: 'Description of product 3', image: productImage3 },
];

const RotatingStar = () => {
  const { scene } = useGLTF('/star.glb');
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
    }
  });

  return <primitive object={scene} ref={ref} />;
};

const ShoppingPage = () => {
  const navigate=useNavigate();
  const { isLoggedIn, userId,logout,setIsLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [items,setItems]=useState([]);
  const [error,setError]=useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleUserClick = () => {
    setShowUserModal(true);
  };

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowCartModal(false);
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleCheckboxChange = (product) => {
    setCheckedItems((prev) =>
      prev.includes(product)
        ? prev.filter((item) => item !== product)
        : [...prev, product]
    );
  };

  const handleRemoveFromCart = () => {
    setCartItems(cartItems.filter((item) => !checkedItems.includes(item)));
    setCheckedItems([]);
  };
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://43.200.215.241:2000/items');
        if (response.data.status === 'success') {
          setItems(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching items');
      }
    };

    fetchItems();
  }, []);


  const handleBuyNow = (itemId) => {
    navigate(`/items/${itemId}`);
  };
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <RotatingStar />
      </Canvas>

      <div className="overlay">
        <header className="header">
          <h1 className="shop-title">Welcome to Xandar</h1>
          <div className="icons">
            <img src={userIcon} alt="User" onClick={handleUserClick} className="icon" />
            <img src={cartIcon} alt="Cart" onClick={handleCartClick} className="icon" />
          </div>
        </header>
        <div className="products-container">
          <div className="products">
          {items.map(item => (
              <div className={`product product-${item.itemid % 2 === 0 ? 'even' : 'odd'}`} key={item.itemid}>
                <h2>{item.name}</h2>
                <p>Price: U {item.price.toLocaleString()}</p>
                <img src={item.item_image_url} alt={item.name} style={{ width: '100px', height: '100px' }} />
                <button onClick={() => handleBuyNow(item.itemid)}>Buy Now</button>
                <button onClick={() => handleAddToCart(item.name)}>Add to Cart</button>
              </div>
            ))}

            {/* {products.map((product, i) => (
              <div className="product" key={i}>
                <h2>{product.name}</h2>
                <img src={product.image} alt={product.name} className="product-image" />
                <p>{product.description}</p>
                <button onClick={() => handleAddToCart(product.name)}>Add to Cart</button>
              </div>
            ))} */}


          </div>
        </div>
      </div>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>User Information</h2>
            <p>{userId}</p>
            {/* <p>Name: {user.name}</p>
            <p>Cash: ${user.cash}</p>
            <p>Address: {user.address}</p> */}
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Shopping Cart</h2>
            {cartItems.length > 0 ? (
              <div>
                <ul>
                  {cartItems.map((item, index) => (
                    <li key={index}>
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={handleRemoveFromCart}>Remove Selected Items</button>
              </div>
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;
