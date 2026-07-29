export const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
export const formatDuration = seconds => seconds >= 60 ? `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(1)}s` : `${seconds.toFixed(2)}s`;
export const titleCase = value => value.charAt(0).toUpperCase() + value.slice(1);
export const downloadFile = (filename, content, type) => { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([content], { type })); link.download = filename; link.click(); URL.revokeObjectURL(link.href); };
export function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200); }
