import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './PurchaseHistory.css';

const PurchaseHistory = () => {
  const { userId } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get('http://43.200.215.241:2000/purchase-history', {
          params: { userid: userId }
        });

        if (response.data.status === 'success') {
          setHistoryItems(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching purchase history');
      }
    };

    fetchPurchaseHistory();
  }, [userId]);

  return (
    <div className="history-page">
      <h2>Purchase History</h2>
      {error && <p className="error">{error}</p>}
      {historyItems.length > 0 ? (
        <ul>
          {historyItems.map((item, index) => (
            <li key={index} className="history-item">
              <img src={item.item_image_url} alt={item.name} className="history-item-image" />
              <span>{item.name}</span>
              <span>{item.cnt} 개</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no purchase history</p>
      )}
    </div>
  );
};

export default PurchaseHistory;
