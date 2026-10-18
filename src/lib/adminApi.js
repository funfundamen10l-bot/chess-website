import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function authConfig() {
  const token = localStorage.getItem("admin_token");
  return {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
}

export { API };
