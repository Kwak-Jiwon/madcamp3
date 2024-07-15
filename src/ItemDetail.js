import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ItemDetail.css';

const ItemDetail = () => {
  const { itemId } = useParams(); // URL에서 itemId 파라미터를 가져옵니다
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

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
            <button className="buy-now-button">Buy Now</button>
            <button className="buy-now-button">장바구니</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
