import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://43.200.215.241:2000/cart', {
          params: { userid: userId }
        });

        if (response.data.status === 'success') {
          setCartItems(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching cart items');
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((item) => item !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePurchase = async () => {
    try {
      const response = await axios.post('http://43.200.215.241:2000/cart/purchase-selected', {
        userid: userId,
        items: checkedItems.map(itemId => {
          const item = cartItems.find(cartItem => cartItem.itemid === itemId);
          return { itemid: item.itemid, itemcnt: item.itemcnt };
        })
      });

      if (response.data.status === 'success') {
        setPurchaseSuccess(true);
        setCartItems(cartItems.filter(item => !checkedItems.includes(item.itemid)));
        setCheckedItems([]);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('잔액이 부족합니다.');
    }
  };

  const handleViewPurchaseHistory = () => {
    navigate('/purchase-history');
  };

  const handleCloseModal = () => {
    setPurchaseSuccess(false);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    if (checkedItems.includes(item.itemid)) {
      return total + item.price * item.itemcnt;
    }
    return total;
  }, 0);

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {error && <p className="error">{error}</p>}
      {cartItems.length > 0 ? (
        <div className="cart-container">
          <div className="cart-header">
            <span>상품 이미지</span>
            <span>상품명</span>
            <span>가격</span>
            <span>수량</span>
            <span>선택</span>
          </div>
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.item_image_url} alt={item.name} className="cart-item-image" />
              <span>{item.name}</span>
              <span>{item.price.toLocaleString()} 원</span>
              <span>{item.itemcnt} 개</span>
              <input
                type="checkbox"
                checked={checkedItems.includes(item.itemid)}
                onChange={() => handleCheckboxChange(item.itemid)}
              />
            </div>
          ))}
          <div className="cart-total">
            <span>총합</span>
            <span>{totalPrice.toLocaleString()} 원</span>
          </div>
          <button onClick={handlePurchase}>Purchase Selected Items</button>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}

      {purchaseSuccess && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>구매가 완료되었습니다!</h2>
            <button onClick={handleViewPurchaseHistory}>구매내역으로 이동</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
