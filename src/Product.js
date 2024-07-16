// src/Product.js
import React from 'react';

const Product = ({ product }) => {
  return (
    <div className="product">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Popularity: {product.popularity}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default Product;