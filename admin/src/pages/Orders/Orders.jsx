import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`)
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error loading orders")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      })
      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  const filteredOrders = orders.filter(order => {
    if (statusFilter === "All") return true;
    return order.status === statusFilter;
  });

  return (
    <div className='order add'>
      <div className="order-header-row">
        <h3>Customer Orders ({filteredOrders.length})</h3>
        <div className="status-tabs">
          {["All", "Food Processing", "Out for delivery", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              className={`status-tab-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders-msg">No orders found for '{statusFilter}' status.</div>
        ) : (
          filteredOrders.map((order, index) => {
            const formattedDate = order.date ? new Date(order.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : '';

            return (
              <div key={index} className='order-item'>
                <img src={assets.parcel_icon} alt="" />
                <div>
                  <p className='order-item-food'>
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " x " + item.quantity
                      } else {
                        return item.name + " x " + item.quantity + ", "
                      }
                    })}
                  </p>
                  <p className='order-item-name'>{order.address?.firstName + " " + order.address?.lastName}</p>
                  <div className='order-item-address'>
                    <p>{order.address?.street + ","}</p>
                    <p>{order.address?.city + ", " + order.address?.state + ", " + order.address?.country + ", " + order.address?.zipcode}</p>
                  </div>
                  <p className='order-item-phone'>📞 {order.address?.phone}</p>
                  {formattedDate && <p className='order-item-date'>📅 {formattedDate}</p>}
                </div>
                <p>Items : {order.items.length}</p>
                <p className="order-item-amount">{currency}{order.amount}</p>
                <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="status-select">
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Order
