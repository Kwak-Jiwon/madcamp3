import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import './ShoppingPage.css';
import userIcon from './assets/person.svg';
import cartIcon from './assets/cart.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { isLoggedIn, userId, logout, setIsLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleUserClick = () => {
    setShowUserModal(true);
    setShowCartModal(false); // 유저 모달을 열 때 카트 모달을 닫음
  };

  const handleCartClick = async () => {
    navigate('/cart');

    // setShowCartModal(true);
    // setShowUserModal(false); // 카트 모달을 열 때 유저 모달을 닫음

    // try {
    //   const response = await axios.get('http://43.200.215.241:2000/cart', {
    //     params: { userid: userId }
    //   });
      
    //   if (response.data.status === 'success') {
    //     setCartItems(response.data.data);
    //   } else {
    //     setError(response.data.message);
    //   }
    // } catch (error) {
    //   setError('Error fetching cart items');
    // }

  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowCartModal(false);
  };

  const handleAddToCart =async (product) => {
 //   setCartItems([...cartItems, product]);
      try{
        const response=await axios.post('http://43.200.215.241:2000/cart/add',{
          userid: userId,
          itemid: product.itemid,
          itemcnt: 1 // 기본 수량을 1로 설정
        });
      
      if (response.data.status === 'success') {
        setCartItems([...cartItems, product.name]);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error adding item to cart');
    }


  };

  const handleCheckboxChange = (product) => {
    setCheckedItems((prev) =>
      prev.includes(product)
        ? prev.filter((item) => item !== product)
        : [...prev, product]
    );
  };
  const itemhistory=()=>{
    navigate('/purchase-history');
  }
  const handleProductClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };
  const handleRemoveFromCart = async () => {
    const itemsToRemove = checkedItems.map((item) => ({ itemid: item.itemid, itemcnt: 1 }));
    try {
      const response = await axios.post('http://43.200.215.241:2000/cart/remove', {
        userid: userId,
        items: itemsToRemove
      });

      if (response.data.status === 'success') {
        setCartItems(cartItems.filter((item) => !checkedItems.includes(item)));
        setCheckedItems([]);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error removing items from cart');
    }
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
              <div className={`product product-${item.itemid % 2 === 0 ? 'even' : 'odd'}`} key={item.itemid} onClick={() => handleProductClick(item.itemid)} onClick={() => handleProductClick(item.itemid)}>
                <h2>{item.name}</h2>
                <p>Price: U {item.price.toLocaleString()}</p>
                <img src={item.item_image_url} alt={item.name} />
                <div className="button-container">
                  <button onClick={(e) => {e.stopPropagation(); handleBuyNow(item.itemid)}}>Buy Now</button>
                  <button onClick={(e) => {e.stopPropagation(); handleAddToCart(item);}}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>User Information</h2>
            <p>{userId}으로 로그인 중</p>
            <div className="modal-buttons">
              <button onClick={itemhistory}>주문내역</button>
              <button className="logout-button" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* {showCartModal && (
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
                      {item.name}-{item.itemcnt} 개 
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
      )} */}
    </div>
  );
};

export default ShoppingPage;
