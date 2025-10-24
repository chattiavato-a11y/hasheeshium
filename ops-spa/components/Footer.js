export function createFooter(copy) {
  const footer = document.createElement("footer");
  footer.className = "footer";
  const text = document.createElement("p");
  text.textContent = copy.disclaimer;
  footer.appendChild(text);
  return footer;
}
