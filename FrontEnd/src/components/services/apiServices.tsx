import axioApi from "../../axioApi/apiServer";

// Helper to get session ID from sessionStorage
const getSessionId = () => {
  return sessionStorage.getItem("session_id") || "";
};

// Get categories
export const getCategories = async () => {
  const { data } = await axioApi.get("/products/categories");
  return data;
};

// Get homepage products
export const getHomepageProducts = async () => {
  const { data } = await axioApi.get("/products/homepage");
  return data;
};

export const getProducts = async () => {
  const { data } = await axioApi.get("/products/getAllProducts");
  return data;
};

// Add to cart
export const addToCart = async (product_id: number, quantity: number) => {
  const session_id = getSessionId();
  const { data } = await axioApi.post("/cart/addToCart", {
    session_id,
    product_id,
    quantity,
  });
  return data;
};

// Request OTP
export const requestOtp = async (mobile: string) => {
  const { data } = await axioApi.post("/auth/otp/request", {
    mobile,
  });
  return data;
};

// verify OTP
export const verifyOtp = async (mobile: string, otp: string) => {
  const { data } = await axioApi.post("/auth/otp/verify", {
    mobile,
    otp,
  });
  return data;
};

export const placeOrder = async ({
  name,
  mobile_number,
  address_line1,
  address_line2,
  city,
  pincode,
  landmark,
}: {
  name: string;
  mobile_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  pincode: string;
  landmark: string;
}) => {
  const session_id = getSessionId();
  const { data } = await axioApi.post("/orders/placeOrder", {
    session_id,
    name,
    mobile_number,
    address_line1,
    address_line2,
    city,
    pincode,
    landmark,
  });
  return data;
};

export const login = async (username: string, password: string) => {
  const { data } = await axioApi.post("/auth/login", {
    username,
    password,
  });
  return data;
};

// Get Profile API
export const getProfile = async () => {
  const token = sessionStorage.getItem("token");
  const { data } = await axioApi.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getOrderDtls = async () => {
  const token = sessionStorage.getItem("token");
  const { data } = await axioApi.get("/orders/getOrderDtls", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
