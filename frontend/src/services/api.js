import axios from "axios";

export const getNearbyPosts = async (lat, lon) => {
  const res = await axios.get(
    `http://localhost:8080/posts/nearby?lat=${lat}&lon=${lon}`
  );
  return res.data;
};
