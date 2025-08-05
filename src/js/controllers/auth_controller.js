import { Controller } from "@hotwired/stimulus";
import { Turbo } from "@hotwired/turbo-rails";
import {
  setSessionStorage,
  clearSessionStorage,
} from "../services/storage_service";

export default class extends Controller {
  static targets = ["flash", "email", "password"];

  connect() {
    document.addEventListener("auth:signOut", this.signOut);
  }

  async signIn() {
    const email = this.emailTarget.value;
    const password = this.passwordTarget.value;

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.errors) {
        this.flashTarget.innerHTML = `<div class="p-3 bg-danger text-white rounded my-3">
          ${data.errors.join(", ")}</div>`;
      }
      if (data.token) {
        setSessionStorage({ token: data.token });
        Turbo.visit("/frames/entries.html", { frame: "app" });
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }

  signOut = async () => {
    await clearSessionStorage("token");
    Turbo.visit("/frames/signin.html", { frame: "app" });
  };
}
