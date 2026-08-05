import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_BACKEND_URL || "https://online-food-delivery-f656.onrender.com";
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [userData, setUserData] = useState(null);
    const currency = "₹";
    const deliveryCharge = 50;

    const fetchUserProfile = async (authToken) => {
        const activeToken = authToken || token || localStorage.getItem("token");
        if (!activeToken) return;
        try {
            const response = await axios.get(url + "/api/user/get-profile", { headers: { token: activeToken } });
            if (response.data && response.data.success) {
                setUserData(response.data.userData);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data && response.data.success) {
                setFoodList(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            setFoodList([]);
        }
    }

    const loadCartData = async (tokenParam) => {
        try {
            const authToken = typeof tokenParam === 'object' && tokenParam !== null ? tokenParam.token : tokenParam;
            if (!authToken) return;
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: authToken } });
            if (response.data && response.data.success && response.data.cartData) {
                setCartItems(response.data.cartData);
            } else {
                setCartItems({});
            }
        } catch (error) {
            console.error("Error loading cart data:", error);
            setCartItems({});
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
                await fetchUserProfile(savedToken);
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        userData,
        setUserData,
        fetchUserProfile
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;