import React, { useRef ,useEffect,useState} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import axios from 'axios';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import './ShoppingPage.css';

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
  //const { isLoggedIn } = useAuth();
  const { isLoggedIn, userId,setIsLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={1} />
        <RotatingStar />
      </Canvas>

      <div className="overlay">
        <h1 className="shop-title">Welcome to the Shop</h1>
        <div className="products-container">
           {error && <p className="error">{error}</p>}
          <div className="products">
            {items.map(item => (
              <div className={`product product-${item.itemid % 2 === 0 ? 'even' : 'odd'}`} key={item.itemid}>
                <h2>{item.name}</h2>
                <p>Price: ${item.price}</p>
                <img src={item.item_image_url} alt={item.name} style={{ width: '100px', height: '100px' }} />
                <button>Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isLoggedIn && <LoginPage />}
    </div>
  );
};

export default ShoppingPage;
