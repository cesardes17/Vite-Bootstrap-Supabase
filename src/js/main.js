import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { authService } from "./services/authService";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) throw error;

      console.log("Logged in successfully:", data);
      window.location.href = "perfil.html";
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Error logging in:", error.message);
      // Handle error (e.g., show error message to user)
    }
  });
});
