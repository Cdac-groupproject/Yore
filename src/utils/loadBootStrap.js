export const loadBootstrap = () => {
  const id = "bootstrap-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    document.head.appendChild(link);
  }
};

export const unloadBootstrap = () => {
  const link = document.getElementById("bootstrap-css");
  if (link) {
    document.head.removeChild(link);
  }
};
