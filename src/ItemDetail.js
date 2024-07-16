import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemDetail.css';
import { useAuth } from './AuthContext';
import Modal from 'react-modal';

const ItemDetail = () => {
  const { itemId } = useParams(); // URL에서 itemId 파라미터를 가져옵니다
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);


  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://43.200.215.241:2000/items/${itemId}`);
        if (response.data.status === 'success') {
          setItem(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching item details');
      }
    };

    fetchItem();
  }, [itemId]);
  const openModal = (message, action) => {
    setModalMessage(message);
    setModalAction(() => action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleBuyNow = async () => {
    // const confirmPurchase = window.confirm('구매하시겠습니까?');
    // if (!confirmPurchase) return;

    // try {
    //   const response = await axios.post('http://43.200.215.241:2000/cart/purchase-selected', {
    //     userid: userId,
    //     items: [{ itemid: itemId, itemcnt: 1 }]
    //   });

    //   if (response.data.status === 'success') {
    //     alert('Purchase successful!');
    //     navigate('/purchase-history');
    //   } else {
    //     alert(response.data.message);
    //   }
    // } catch (error) {
    //   alert('Error purchasing item');
    // }

    openModal('구매하시겠습니까?', async () => {
      try {
        const response = await axios.post('http://43.200.215.241:2000/cart/purchase-selected', {
          userid: userId,
          items: [{ itemid: itemId, itemcnt: 1 }]
        });

        if (response.data.status === 'success') {
          openModal('구매가 완료되었습니다!', () => navigate('/purchase-history'));
        } else {
          openModal(response.data.message, null);
        }
      } catch (error) {
        openModal('Error purchasing item', null);
      }
    });

    
  };

  const handleAddToCart = async () => {
    // const confirmAddToCart = window.confirm('장바구니에 추가하시겠습니까?');
    // if (!confirmAddToCart) return;

    // try {
    //   const response = await axios.post('http://43.200.215.241:2000/cart/add', {
    //     userid: userId,
    //     itemid: itemId,
    //     itemcnt: 1 // 기본 수량을 1로 설정
    //   });

    //   if (response.data.status === 'success') {
    //     alert('장바구니에 추가되었습니다!');
    //   } else {
    //     alert(response.data.message);
    //   }
    // } catch (error) {
    //   alert('Error adding item to cart');
    // }

    openModal('장바구니에 추가하시겠습니까?', async () => {
      try {
        const response = await axios.post('http://43.200.215.241:2000/cart/add', {
          userid: userId,
          itemid: itemId,
          itemcnt: 1 // 기본 수량을 1로 설정
        });

        if (response.data.status === 'success') {
          openModal('장바구니에 추가되었습니다!', null);
        } else {
          openModal(response.data.message, null);
        }
      } catch (error) {
        openModal('Error adding item to cart', null);
      }
    });

  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div className="item-detail-container">
      <div className="item-detail">
        <img src={item.item_image_url} alt={item.name} className="item-image" />
        <div className="item-info">
          <h1>{item.name}</h1>
          <p>Price: ${item.price.toLocaleString()}</p>
          <p>{item.description1}</p>
          <div className="button-container">
            <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
            <button className="buy-now-button" onClick={handleAddToCart}>장바구니</button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <h2>{modalMessage}</h2>
        <button onClick={modalAction} className="confirm-button">확인</button>
        <button onClick={closeModal} className="cancel-button">취소</button>
      </Modal>
    </div>
  );
};

export default ItemDetail;
