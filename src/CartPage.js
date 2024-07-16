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
          params: { userid: userId },
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

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemid === itemId ? { ...item, itemcnt: newQuantity } : item
      )
    );
  };

  const handleQuantityBlur = async (itemId, newQuantity) => {
    try {
      const response = await axios.post('http://43.200.215.241:2000/cart/update-quantity', {
        userid: userId,
        itemid: itemId,
        itemcnt: newQuantity,
      });

      if (response.data.status === 'success') {
        if (newQuantity === 0) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.itemid !== itemId)
          );
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.itemid === itemId ? { ...item, itemcnt: newQuantity } : item
            )
          );
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error updating item quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axios.post('http://43.200.215.241:2000/cart/remove-item', {
        userid: userId,
        itemid: itemId,
      });

      if (response.data.status === 'success') {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.itemid !== itemId)
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error removing item from cart');
    }
  };

  const handlePurchase = async () => {
    if (checkedItems.length === 0) {
      alert('구매할 아이템을 선택해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://43.200.215.241:2000/cart/purchase-selected', {
        userid: userId,
        items: checkedItems.map((itemId) => {
          const item = cartItems.find((cartItem) => cartItem.itemid === itemId);
          return { itemid: item.itemid, itemcnt: item.itemcnt };
        }),
      });

      if (response.data.status === 'success') {
        setPurchaseSuccess(true);
        setCartItems(cartItems.filter((item) => !checkedItems.includes(item.itemid)));
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems.includes(item.itemid)) {
        return total + item.price * item.itemcnt;
      }
      return total;
    }, 0);
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {error && <p className="error">{error}</p>}
      {cartItems.length > 0 ? (
        <div className="cart-container">
          <div className="cart-header">
            <span>상품</span>
            <span>가격</span>
            <span>수량</span>
          </div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <label>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.itemid)}
                    onChange={() => handleCheckboxChange(item.itemid)}
                  />
                  <img src={item.item_image_url} alt={item.name} className="cart-item-image" />
                  <span>{item.name}</span>
                  <span>{item.price.toLocaleString()}원</span>
                  <input
                    type="number"
                    min="0"
                    value={item.itemcnt}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleQuantityChange(item.itemid, parseInt(e.target.value))}
                    onBlur={(e) => handleQuantityBlur(item.itemid, parseInt(e.target.value))}
                  />
                  <span>개</span>
                  <button onClick={() => handleRemoveItem(item.itemid)}>삭제</button>
                </label>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>총 합계</span>
            <span>{calculateTotal().toLocaleString()}원</span>
          </div>
          <button onClick={handlePurchase}>선택한 아이템 구매하기</button>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}

      {purchaseSuccess && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>구매가 완료되었습니다!</h2>
            <button onClick={handleViewPurchaseHistory}>구매내역으로 이동</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
