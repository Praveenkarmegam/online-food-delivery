import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/StoreContext'

const FoodDisplay = ({ category }) => {

  const { food_list, searchQuery, sortOption, setSortOption } = useContext(StoreContext);

  let filteredList = (food_list || []).filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortOption === "lowToHigh") {
    filteredList = [...filteredList].sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filteredList = [...filteredList].sort((a, b) => b.price - a.price);
  }

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>Top dishes near you</h2>
        <div className="food-sort-control">
          <label>Sort by Price: </label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="no-foods-found">
          <p>No dishes found matching your criteria.</p>
        </div>
      ) : (
        <div className='food-display-list'>
          {filteredList.map((item) => (
            <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
