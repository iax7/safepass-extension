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

    //fetch entries
    const entries = await fetchEntries();
    try {
      this.sidebarTarget.innerHTML = sidebar(entries);
      this.mainTarget.innerHTML = main(entries[0]);
    } catch (error) {
      console.error("Error rendering entries:", error);
      return;
    }

    // set current tab url to select the entry
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!activeTab) {
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(activeTab.url);
    } catch (error) {
      console.error("Invalid URL in activeTab: ", error);
      return;
    }

    const activeEntry = entries.find((entry) =>
      entry.url.includes(parsedUrl.hostname)
    );
    if (activeEntry) {
      this.mainTarget.innerHTML = main(activeEntry);
    }
  }

  updateMain({ params }) {
    this.mainTarget.innerHTML = main(params.entry);
  }

  navigateToLogin({ params }) {
    const entry = params.entry;
    chrome.tabs.update({
      url: entry.url,
    });
  }

  async fillInCredentials({ params }) {
    const entry = params.entry;
    // console.log("Filling in credentials for entry:", entry);

    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!activeTab) return;

    let parsedUrl;
    try {
      parsedUrl = new URL(activeTab.url);
    } catch (error) {
      console.error("Invalid URL in activeTab: ", error);
    }

    const activeEntry = entry.url.includes(parsedUrl.host);
    if (activeEntry) {
      chrome.tabs.sendMessage(activeTab.id, {
        username: entry.username,
        password: entry.password,
      });
    }
  }
}
