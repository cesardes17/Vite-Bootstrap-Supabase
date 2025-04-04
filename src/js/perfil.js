import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { authService } from "./services/authService";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) {
      window.location.href = "index.html";
      return;
    }

    // Display user information
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-id").textContent = user.id;
    document.getElementById("last-signin").textContent = new Date(
      user.last_sign_in_at
    ).toLocaleString();

    // Handle logout
    document
      .getElementById("logout-btn")
      .addEventListener("click", async () => {
        try {
          const { error } = await authService.signOut();
          if (error) throw error;
          window.location.href = "index.html";
        } catch (error) {
          console.error("Error logging out:", error.message);
        }
      });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    window.location.href = "index.html";
  }
});
