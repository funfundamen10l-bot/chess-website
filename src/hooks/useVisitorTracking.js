import { useEffect } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function useVisitorTracking() {
  useEffect(() => {
    const track = async () => {
      try {
        await axios.post(`${API}/track`, {
          page: window.location.pathname,
          referrer: document.referrer || null,
        }, { withCredentials: true });
      } catch {
        // tracking is non-critical
      }
    };
    track();
  }, []);
}
