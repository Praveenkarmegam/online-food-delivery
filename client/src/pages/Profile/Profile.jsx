import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Profile = () => {
    const { url, token, userData, fetchUserProfile } = useContext(StoreContext)
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('personal')
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: ''
    })

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error("Please login to access your profile")
            navigate('/')
            return
        }
        if (userData) {
            setProfileData({
                name: userData.name || '',
                phone: userData.phone || '',
                street: userData.address?.street || '',
                city: userData.address?.city || '',
                state: userData.address?.state || '',
                zipcode: userData.address?.zipcode || '',
                country: userData.address?.country || ''
            })
        }
    }, [userData, token])

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                name: profileData.name,
                phone: profileData.phone,
                address: {
                    street: profileData.street,
                    city: profileData.city,
                    state: profileData.state,
                    zipcode: profileData.zipcode,
                    country: profileData.country
                }
            }
            const response = await axios.post(url + "/api/user/update-profile", payload, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message || "Profile updated!")
                await fetchUserProfile(token)
            } else {
                toast.error(response.data.message || "Failed to update profile")
            }
        } catch (error) {
            toast.error("Error updating profile")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match!")
            return
        }
        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return
        }
        setLoading(true)
        try {
            const response = await axios.post(url + "/api/user/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message || "Password changed successfully!")
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                toast.error(response.data.message || "Failed to change password")
            }
        } catch (error) {
            toast.error("Error changing password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='profile-page'>
            <div className="profile-header">
                <div className="profile-avatar">
                    <img src={assets.profile_icon} alt="Profile Avatar" />
                </div>
                <div className="profile-title-area">
                    <h2>{userData?.name || 'User Profile'}</h2>
                    <p>{userData?.email}</p>
                </div>
            </div>

            <div className="profile-container">
                <div className="profile-sidebar">
                    <button
                        className={`profile-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        <i className="tab-icon">👤</i> Personal & Address
                    </button>
                    <button
                        className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="tab-icon">🔒</i> Security & Password
                    </button>
                    <button
                        className="profile-tab-btn my-orders-btn"
                        onClick={() => navigate('/myorders')}
                    >
                        <i className="tab-icon">📦</i> My Orders
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === 'personal' && (
                        <form onSubmit={handleProfileSubmit} className="profile-form">
                            <h3>Personal Details</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        placeholder="Your Full Name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileChange}
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <h3>Saved Delivery Address</h3>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={profileData.street}
                                    onChange={handleProfileChange}
                                    placeholder="Street Address"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={profileData.city}
                                        onChange={handleProfileChange}
                                        placeholder="City"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={profileData.state}
                                        onChange={handleProfileChange}
                                        placeholder="State"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Zipcode</label>
                                    <input
                                        type="text"
                                        name="zipcode"
                                        value={profileData.zipcode}
                                        onChange={handleProfileChange}
                                        placeholder="Zip code"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={profileData.country}
                                        onChange={handleProfileChange}
                                        placeholder="Country"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordSubmit} className="profile-form">
                            <h3>Change Password</h3>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password (min 8 chars)"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>

                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
