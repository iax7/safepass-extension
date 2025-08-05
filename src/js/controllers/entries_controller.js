import { Controller } from "@hotwired/stimulus";
import { getSessionStorage } from "../services/storage_service";
import { fetchEntries } from "../services/fetch_entries_service";
import { sidebar, main } from "../templates/entries_templates";

export default class extends Controller {
  static targets = ["sidebar", "main"];

  async connect() {
    const token = await getSessionStorage("token");
    if (!token) {
      document.dispatchEvent(new CustomEvent("auth:signOut"));
      return;
    }

    //fetch
    const entries = await fetchEntries();
    try {
      this.sidebarTarget.innerHTML = sidebar(entries);
      this.mainTarget.innerHTML = main(entries[0]);
    } catch (error) {
      console.error("Error rendering entries:", error);
      return;
    }
  }

  updateMain({ params }) {
    this.mainTarget.innerHTML = main(params.entry);
  }
}
