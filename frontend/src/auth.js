export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};