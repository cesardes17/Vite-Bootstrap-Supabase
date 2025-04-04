import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { authService } from "./services/authService";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            console.error("Passwords don't match");
            return;
        }

        try {
            const { data, error } = await authService.signUp(email, password);

            if (error) throw error;

            console.log("Registered successfully:", data);
            window.location.href = "perfil.html";
            
        } catch (error) {
            console.error("Error registering:", error.message);
        }
    });
});