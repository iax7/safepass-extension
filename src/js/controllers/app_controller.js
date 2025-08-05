import { Controller } from "@hotwired/stimulus";
import { Turbo } from "@hotwired/turbo-rails";
import { getSessionStorage } from "../services/storage_service";

export default class extends Controller {
  async connect() {
    const token = await getSessionStorage("token");

    if (token) {
      Turbo.visit("/frames/entries.html", { frame: "app" });
    }
  }
}
