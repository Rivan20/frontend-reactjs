import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function SortBy({ products, setSortedProducts }) {
  
  
  const [sortBy, setSortBy] = useState(''); 
  useEffect(() => {
    let sortedItems;

    switch (sortBy) {
      case 'nameAsc':
        sortedItems = products.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        sortedItems = products.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stockAsc':
        sortedItems = products.slice().sort((a, b) => a.stock - b.stock);
        break;
      case 'stockDesc':
        sortedItems = products.slice().sort((a, b) => b.stock - a.stock);
        break;
      case 'priceAsc':
        sortedItems = products.slice().sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sortedItems = products.slice().sort((a, b) => b.price - a.price);
        break;
      default:
        sortedItems = products;
        break;
    }

    setSortedProducts(sortedItems);
  }, [sortBy, products, setSortedProducts]);

  return (
    <div className="sort-by">
      <select
        className="form-select"
        onChange={(e) => setSortBy(e.target.value)}
        value={sortBy}
      >
        <option value="">Select Sorting Option</option>
        <option value="nameAsc">Name A-Z</option>
        <option value="nameDesc">Name Z-A</option>
        <option value="stockAsc">Stock Low to High</option>
        <option value="stockDesc">Stock High to Low</option>
        <option value="priceAsc">Price Low to High</option>
        <option value="priceDesc">Price High to Low</option>
      </select>
    </div>
  );
  
}
SortBy.propTypes = {
  products: PropTypes.array.isRequired,
  setSortedProducts: PropTypes.func.isRequired,
};