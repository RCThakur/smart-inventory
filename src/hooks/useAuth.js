// src/hooks/useAuth.js
export const useAuth = () => {
  // Simulate current logged-in user
  const user = {
    name: "John Doe",
    role: "Manager", // Change to "Admin", "Manager", or "Viewer"
  };

  return { user };
};
