import { Controller } from "@hotwired/stimulus";
import { eyeOpenIcon, eyeClosedIcon } from "../helpers/icons";

export default class extends Controller {
  static targets = ["passwordInput"];

  toggle(event) {
    if (this.passwordInputTarget.type === "password") {
      this.passwordInputTarget.type = "text";
      event.currentTarget.innerHTML = eyeClosedIcon;
    } else {
      this.passwordInputTarget.type = "password";
      event.currentTarget.innerHTML = eyeOpenIcon;
    }
  }
}
