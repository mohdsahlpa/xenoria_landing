export function initFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  // Visual footer is disabled to allow the sphere to act as the final anchor
  footer.innerHTML = ``;
  footer.style.display = 'none';
}
