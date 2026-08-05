import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

import { toast } from 'react-toastify';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
      if (response.data && response.data.success) {
        setData(response.data.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setData([]);
    }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await axios.post(url + "/api/order/cancel", { orderId }, { headers: { token } });
      if (response.data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Error cancelling order");
    }
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  const getStatusColor = (status) => {
    switch (status) {
      case "Food Processing": return "#ff9800";
      case "Out for delivery": return "#2196f3";
      case "Delivered": return "#4caf50";
      case "Cancelled": return "#f44336";
      default: return "tomato";
    }
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p className="no-orders">You have not placed any orders yet.</p>
        ) : (
          data.map((order, index) => {
            const formattedDate = order.date ? new Date(order.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : '';

            return (
              <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <div className="my-orders-info">
                  <p className="my-orders-items">{order.items.map((item, idx) => {
                    if (idx === order.items.length - 1) {
                      return item.name + " x " + item.quantity
                    } else {
                      return item.name + " x " + item.quantity + ", "
                    }
                  })}</p>
                  {formattedDate && <span className="order-date">{formattedDate}</span>}
                </div>
                <p className="order-price">{currency}{order.amount}.00</p>
                <p className="order-count">Items: {order.items.length}</p>
                <p className="order-status-badge">
                  <span style={{ color: getStatusColor(order.status) }}>&#x25cf;</span> <b>{order.status}</b>
                </p>
                <div className="my-orders-actions">
                  <button className="track-btn" onClick={fetchOrders}>Track Order</button>
                  {order.status === "Food Processing" && (
                    <button className="cancel-btn" onClick={() => cancelOrder(order._id)}>Cancel</button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrders
