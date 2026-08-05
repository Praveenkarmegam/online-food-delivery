import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "", price: "", category: "Salad" });
  const [editImage, setEditImage] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const removeFood = async (foodId, foodName) => {
    if (!window.confirm(`Are you sure you want to delete '${foodName}'?`)) return;
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error deleting item")
      }
    } catch (error) {
      toast.error("Error deleting item")
    }
  }

  const openEditModal = (item) => {
    setEditItem(item);
    setEditData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setEditImage(false);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", editItem._id);
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("price", Number(editData.price));
      formData.append("category", editData.category);
      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await axios.post(`${url}/api/food/update`, formData);
      if (response.data.success) {
        toast.success("Food updated successfully!");
        setEditItem(null);
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to update food");
      }
    } catch (error) {
      toast.error("Error updating food");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='list add flex-col'>
      <div className="list-header flex-between">
        <p className="list-title">All Foods List ({filteredList.length})</p>
        <div className="list-filters">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="All">All Categories</option>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>
        </div>
      </div>

      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {filteredList.length === 0 ? (
          <div className="no-items-row">No food items found matching your filters.</div>
        ) : (
          filteredList.map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency}{item.price}</p>
                <div className='action-btns'>
                  <button className='action-btn edit-btn' onClick={() => openEditModal(item)}>✏️ Edit</button>
                  <button className='action-btn delete-btn' onClick={() => removeFood(item._id, item.name)}>🗑️ Delete</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {editItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Food Item</h3>
              <button className="close-modal-btn" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-food-form">
              <div className="form-group">
                <label>Food Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={editData.category} onChange={handleEditChange}>
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price ({currency})</label>
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Replace Image (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-modal-btn" onClick={() => setEditItem(null)}>Cancel</button>
                <button type="submit" className="save-modal-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
