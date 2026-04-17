import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const register         = d  => API.post("/auth/register", d);
export const login            = d  => API.post("/auth/login", d);
export const getMe            = () => API.get("/auth/me");
export const updateProfile    = d  => API.put("/auth/update-profile", d);
export const changePassword   = d  => API.put("/auth/change-password", d);

export const getPosts         = p  => API.get("/posts", { params: p });
export const getMyPosts       = p  => API.get("/posts/my-posts", { params: p });
export const getPostById      = id => API.get(`/posts/id/${id}`);
export const getPost          = sl => API.get(`/posts/${sl}`);
export const createPost       = d  => API.post("/posts", d);
export const updatePost       = (id,d) => API.put(`/posts/${id}`, d);
export const deletePost       = id => API.delete(`/posts/${id}`);
export const toggleLikePost   = id => API.post(`/posts/${id}/like`);
export const toggleSavePost   = id => API.post(`/posts/${id}/save`);
export const getPostStats     = () => API.get("/posts/stats");

export const getComments      = pid => API.get(`/comments/post/${pid}`);
export const addComment       = d   => API.post("/comments", d);
export const updateComment    = (id,d) => API.put(`/comments/${id}`, d);
export const deleteComment    = id  => API.delete(`/comments/${id}`);

export const getCategories    = () => API.get("/categories");
export const createCategory   = d  => API.post("/categories", d);
export const updateCategory   = (id,d) => API.put(`/categories/${id}`, d);
export const deleteCategory   = id => API.delete(`/categories/${id}`);

export const getUserProfile   = u  => API.get(`/users/${u}`);
export const getAllUsers       = () => API.get("/users");
export const updateUserRole   = (id,role) => API.put(`/users/${id}/role`, { role });
export const deleteUser       = id => API.delete(`/users/${id}`);
export const getUserById = id => API.get(`/users/id/${id}`);

export default API;
