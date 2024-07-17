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
import Modal from 'react-modal';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  const handleUserClick = () => {
    setShowUserModal(true);
    setShowCartModal(false); // 유저 모달을 열 때 카트 모달을 닫음
  };

  const handleCartClick = async () => {
    navigate('/cart');
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowCartModal(false);
  };

  const showModal = (message, callback) => {
    setModalMessage(message);
    setModalCallback(() => callback);
  };

  const handleAddToCart = async (product) => {
    showModal('장바구니에 추가하시겠습니까?', async () => {
      try {
        const response = await axios.post('http://43.200.215.241:2000/cart/add', {
          userid: userId,
          itemid: product.itemid,
          itemcnt: 1 // 기본 수량을 1로 설정
        });

        if (response.data.status === 'success') {
          showModal('장바구니에 추가되었습니다!', () => {});
          setCartItems([...cartItems, product.name]);
        } else {
          showModal(response.data.message, () => {});
        }
      } catch (error) {
        showModal('아이템 추가 중 오류 발생', () => {});
      }
    });
  };

  const handleProductClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  const handleBuyNow = async (itemId) => {
    showModal('구매하시겠습니까?', async () => {
      try {
        const response = await axios.post('http://43.200.215.241:2000/cart/purchase-selected', {
          userid: userId,
          items: [{ itemid: itemId, itemcnt: 1 }]
        });

        if (response.data.status === 'success') {
          setPurchaseSuccess(true);
        } else {
          showModal(response.data.message, () => {});
        }
      } catch (error) {
        showModal('잔액이 부족합니다', () => {});
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    const results = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://43.200.215.241:2000/items');
        if (response.data.status === 'success') {
          setItems(response.data.data);
          setSearchResults(response.data.data); // 초기에는 모든 아이템 표시
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('아이템 불러오기 중 오류 발생');
      }
    };
    const fetchUserBalance = async () => {
      try {
        const response = await axios.get('http://43.200.215.241:2000/user-balance', {
          params: { userid: userId },
        });
        if (response.data.status === 'success') {
          setUserBalance(response.data.balance);
        }
      } catch (error) {
        console.error('Error fetching user balance:', error);
      }
    };
    fetchItems();
    fetchUserBalance();
  }, [userId]);

  if (!isLoggedIn) {
    return <LoginPage />;
  }
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <h1 className="shop-title" onClick={() => navigate('/')}>Welcome to Xandar</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="아이템 이름을 검색하세요"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button onClick={handleSearchSubmit} className="search-button">검색하기</button>
          </div>
          <div className="icons">
            <img src={userIcon} alt="User" onClick={handleUserClick} className="icon" />
            <img src={cartIcon} alt="Cart" onClick={handleCartClick} className="icon" />
          </div>
        </header>

        <div className="products-container">
          <div className="products">
            {searchResults.map(item => (
              <div
                className={`product product-${item.itemid % 2 === 0 ? 'even' : 'odd'}`}
                key={item.itemid}
                onClick={() => handleProductClick(item.itemid)}
              >
                <h2>{item.name}</h2>
                <p>Price: U {item.price.toLocaleString()}</p>
                <img src={item.item_image_url} alt={item.name} />
                <div className="button-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(item.itemid);
                    }}
                  >
                    구매하기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    장바구니에 담기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>User Information</h2>
            <p>{userId}으로 로그인 중</p>
            <span><b>나의 유닛</b> {userBalance.toLocaleString()} U</span>
            <div className="modal-buttons">
              <button onClick={() => navigate('/purchase-history')}>주문내역</button>
              <button className="logout-button" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {modalMessage && (
        <Modal isOpen={true} onRequestClose={() => setModalMessage('')} className="modal" overlayClassName="overlay">
          <h2>{modalMessage}</h2>
          <div className="modal-buttons">
            <button className="confirm-button" onClick={() => {
              setModalMessage('');
              if (modalCallback) modalCallback();
            }}>
              확인
            </button>
            <button className="cancel-button" onClick={() => setModalMessage('')}>
              닫기
            </button>
          </div>
        </Modal>
      )}

      {purchaseSuccess && (
        <Modal isOpen={true} onRequestClose={() => setPurchaseSuccess(false)} className="modal" overlayClassName="overlay">
          <h2>구매가 완료되었습니다!</h2>
          <div className="modal-buttons">
            <button className="confirm-button" onClick={() => navigate('/purchase-history')}>
              구매내역으로 이동
            </button>
            <button className="cancel-button" onClick={() => setPurchaseSuccess(false)}>
              닫기
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ShoppingPage;