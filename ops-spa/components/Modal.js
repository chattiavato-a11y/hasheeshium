import { openModal } from "../../comm-us/ui.js";

export function openServiceModal(service, lang) {
  const { modal } = service;
  return openModal({
    title: modal.title,
    description: modal.summary,
    content: (body) => {
      const list = document.createElement("ul");
      list.style.display = "grid";
      list.style.gap = "12px";
      list.style.padding = "0";
      list.style.listStyle = "none";
      modal.body.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        list.appendChild(li);
      });
      body.appendChild(list);
      if (modal.links?.length) {
        const linkWrap = document.createElement("div");
        linkWrap.style.display = "grid";
        linkWrap.style.gap = "8px";
        modal.links.forEach((link) => {
          const anchor = document.createElement("a");
          anchor.href = link.url;
          anchor.textContent = link.label;
          anchor.className = "link-btn";
          anchor.setAttribute("role", "button");
          linkWrap.appendChild(anchor);
        });
        body.appendChild(linkWrap);
      }
    }
  });
}
