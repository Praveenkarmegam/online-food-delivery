import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { url, currency } from '../../assets/assets'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${url}/api/order/stats`)
      if (response.data && response.data.success) {
        setStats(response.data.stats)
      } else {
        toast.error("Failed to load dashboard metrics")
      }
    } catch (error) {
      toast.error("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard Metrics...</div>
  }

  return (
    <div className='dashboard'>
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <button className="refresh-btn" onClick={fetchStats}>🔄 Refresh Stats</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <p className="metric-label">Total Revenue</p>
            <h3 className="metric-value">{currency}{stats?.totalRevenue || 0}</h3>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <p className="metric-label">Total Orders</p>
            <h3 className="metric-value">{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="metric-card items">
          <div className="metric-icon">🍔</div>
          <div className="metric-info">
            <p className="metric-label">Food Items</p>
            <h3 className="metric-value">{stats?.totalFoods || 0}</h3>
          </div>
        </div>

        <div className="metric-card users">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <p className="metric-label">Registered Users</p>
            <h3 className="metric-value">{stats?.totalUsers || 0}</h3>
          </div>
        </div>
      </div>

      <div className="status-overview-section">
        <h3>Order Status Breakdown</h3>
        <div className="status-grid">
          <div className="status-card pending">
            <span className="status-dot orange">●</span>
            <div>
              <p>Processing</p>
              <h4>{stats?.pendingCount || 0}</h4>
            </div>
          </div>
          <div className="status-card shipping">
            <span className="status-dot blue">●</span>
            <div>
              <p>Out for Delivery</p>
              <h4>{stats?.outForDeliveryCount || 0}</h4>
            </div>
          </div>
          <div className="status-card delivered">
            <span className="status-dot green">●</span>
            <div>
              <p>Delivered</p>
              <h4>{stats?.deliveredCount || 0}</h4>
            </div>
          </div>
          <div className="status-card cancelled">
            <span className="status-dot red">●</span>
            <div>
              <p>Cancelled</p>
              <h4>{stats?.cancelledCount || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-orders-section">
        <div className="section-title-row">
          <h3>Recent Orders</h3>
          <button className="view-all-btn" onClick={() => navigate('/orders')}>View All Orders →</button>
        </div>

        <div className="recent-orders-table">
          <div className="table-header">
            <span>Customer</span>
            <span>Items</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order, index) => (
              <div key={index} className="table-row">
                <span className="customer-name">{order.address?.firstName} {order.address?.lastName}</span>
                <span className="items-count">{order.items?.length || 0} items</span>
                <span className="order-amount">{currency}{order.amount}</span>
                <span className={`status-badge ${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>
            ))
          ) : (
            <div className="no-recent-orders">No recent orders placed yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
