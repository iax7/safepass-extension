import { Controller } from "@hotwired/stimulus";
import { checkIcon, clipboardIcon } from "../helpers/icons";

export default class extends Controller {
  async copy({ params: { content } }) {
    try {
      await navigator.clipboard.writeText(content);
      this.element.innerHTML = checkIcon;
      setTimeout(() => {
        this.element.innerHTML = clipboardIcon;
      }, 1000); // 1 second
    } catch (e) {
      console.error("Failed to copy text");
    }
  }
}
