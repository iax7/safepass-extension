import { getPasswordInput, getUsernameInput } from "./utils/inputs";

const autoFillInCredentials = ({ username, password }) => {
  const usernameField = getUsernameInput();
  const passwordField = getPasswordInput();
  console.log("usernameField:", usernameField);
  console.log("passwordField:", passwordField);
  if (usernameField) usernameField.value = username;
  if (passwordField) passwordField.value = password;
};

chrome.runtime.onMessage.addListener((message) => {
  autoFillInCredentials(message);
});
