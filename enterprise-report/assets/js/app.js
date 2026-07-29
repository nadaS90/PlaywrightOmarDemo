import { reportData } from "./report-data.js";
import { renderCharts } from "./charts.js";
import { TestTable } from "./test-table.js";
import { downloadFile, escapeHtml, formatDuration, showToast, titleCase } from "./utils.js";

const tests = reportData.tests;
const counts = ["passed", "failed", "skipped"].reduce((map, status) => ({ ...map, [status]: tests.filter(test => test.status === status).length }), {});
const total = tests.length;
const passRate = total ? (counts.passed / total) * 100 : 0;

function renderMeta() {
  document.querySelector("#runId").textContent = reportData.meta.runId;
  document.querySelector("#completedAt").textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(reportData.meta.completedAt));
  document.querySelector("#buildLabel").textContent = `Build ${reportData.environment.buildNumber}`;
}

function renderMetrics() {
  const metrics = [
    ["Total tests", total, "fa-layer-group", "#7c5cff", "All discovered tests"],
    ["Passed", counts.passed, "fa-circle-check", "#35d399", `${passRate.toFixed(1)}% successful`],
    ["Failed", counts.failed, "fa-circle-xmark", "#ff6384", counts.failed ? "Requires attention" : "No failures"],
    ["Skipped", counts.skipped, "fa-forward", "#f8c44f", "Excluded from execution"],
    ["Pass rate", `${passRate.toFixed(1)}%`, "fa-chart-line", "#27d7d0", "Quality confidence"],
    ["Total duration", formatDuration(reportData.meta.totalDuration), "fa-clock", "#4ea1ff", "Wall-clock runtime"],
  ];
  document.querySelector("#metrics").innerHTML = metrics.map(([label, value, icon, , hint]) => `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon"><i class="fa-solid ${icon}"></i></span></div><strong class="metric-value">${value}</strong><span class="metric-hint">${hint}</span></article>`).join("");
}

function createFailurePreview(test) {
  const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 700; const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 1200, 700); gradient.addColorStop(0, "#121b31"); gradient.addColorStop(1, "#080d19"); context.fillStyle = gradient; context.fillRect(0, 0, 1200, 700);
  context.fillStyle = "#1e2942"; context.roundRect(95, 70, 1010, 560, 18); context.fill(); context.fillStyle = "#2d3956"; context.fillRect(95, 70, 1010, 62);
  [0,1,2].forEach(i => { context.beginPath(); context.fillStyle = ["#ff6384", "#f8c44f", "#35d399"][i]; context.arc(135 + i * 36, 101, 10, 0, Math.PI * 2); context.fill(); });
  context.fillStyle = "#7c5cff"; context.roundRect(150, 185, 230, 390, 12); context.fill(); context.fillStyle = "#293650"; context.roundRect(420, 185, 620, 100, 12); context.fill(); context.roundRect(420, 315, 620, 100, 12); context.fill(); context.roundRect(420, 445, 420, 100, 12); context.fill();
  context.fillStyle = "#ff6384"; context.font = "700 25px system-ui"; context.fillText("FAILED ASSERTION", 450, 245); context.fillStyle = "#eef4ff"; context.font = "700 31px system-ui"; context.fillText(test.name.slice(0, 45), 450, 375); context.fillStyle = "#8e9bb2"; context.font = "22px system-ui"; context.fillText(test.error.slice(0, 58), 450, 490);
  return canvas.toDataURL("image/png");
}

function renderArtifacts() {
  const failed = tests.filter(test => test.status === "failed");
  const previews = new Map(failed.map(test => [test.id, createFailurePreview(test)]));
  document.querySelector("#screenshotGallery").innerHTML = failed.map(test => `<button class="screenshot-card" type="button" data-screenshot="${test.id}"><div class="screenshot-preview"><i class="fa-solid fa-expand"></i></div><div><h3>${escapeHtml(test.name)}</h3><p><i class="fa-solid fa-camera"></i> Failure screenshot</p></div></button>`).join("");
  const artifacts = failed.flatMap(test => [test.video && { type: "video", test }, test.trace && { type: "trace", test }].filter(Boolean));
  document.querySelector("#artifactList").innerHTML = artifacts.length ? artifacts.map(({ type, test }) => type === "video" ? `<article class="artifact-item artifact-video"><span class="artifact-icon"><i class="fa-solid fa-video"></i></span><div class="artifact-copy"><strong>${escapeHtml(test.name)}</strong><span>Recorded execution video</span></div><a href="${escapeHtml(test.video)}" target="_blank" rel="noopener">Play <i class="fa-solid fa-play"></i></a></article>` : `<article class="artifact-item"><span class="artifact-icon"><i class="fa-solid fa-route"></i></span><div class="artifact-copy"><strong>${escapeHtml(test.name)}</strong><span>Playwright trace archive</span></div><a href="${escapeHtml(test.trace)}" target="_blank" rel="noopener">Open trace <i class="fa-solid fa-arrow-up-right-from-square"></i></a></article>`).join("") : `<div class="artifact-empty">No videos or traces attached to this run.</div>`;
  const lightbox = document.querySelector("#lightbox");
  document.querySelectorAll("[data-screenshot]").forEach(button => button.addEventListener("click", () => { const test = tests.find(item => item.id === Number(button.dataset.screenshot)); document.querySelector("#lightboxImage").src = previews.get(test.id); document.querySelector("#lightboxTitle").textContent = test.name; document.querySelector("#lightboxCaption").textContent = test.error; lightbox.showModal(); }));
  document.querySelector("#closeLightbox").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", event => { if (event.target === lightbox) lightbox.close(); });
}

function renderErrors() {
  const failed = tests.filter(test => test.status === "failed");
  document.querySelector("#errorList").innerHTML = failed.map(test => `<details class="error-item"><summary><i class="fa-solid fa-triangle-exclamation"></i><div><strong>${escapeHtml(test.name)}</strong><span>${escapeHtml(test.error)}</span></div><i class="fa-solid fa-chevron-down error-chevron"></i></summary><div class="stack-wrap"><button class="copy-button" type="button" data-copy="${test.id}" aria-label="Copy stack trace"><i class="fa-regular fa-copy"></i> Copy</button><pre>${escapeHtml(test.stack || test.error)}</pre></div></details>`).join("");
  document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", async () => { const test = tests.find(item => item.id === Number(button.dataset.copy)); await navigator.clipboard.writeText(test.stack || test.error); showToast("Stack trace copied"); }));
}

function renderEnvironment() {
  const icons = { browser: "fa-globe", os: "fa-desktop", nodeVersion: "fa-code", playwrightVersion: "fa-masks-theater", commitSha: "fa-code-commit", branch: "fa-code-branch", buildNumber: "fa-hammer" };
  const labels = { browser: "Browser", os: "Operating system", nodeVersion: "Node version", playwrightVersion: "Playwright version", commitSha: "Commit SHA", branch: "Branch", buildNumber: "Build number" };
  document.querySelector("#environmentGrid").innerHTML = Object.entries(reportData.environment).map(([key, value]) => `<div class="env-item"><dt><i class="fa-solid ${icons[key]}"></i> ${labels[key]}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
}

function summaryTests(type) {
  if (type === "slowest") return [...tests].filter(test => test.duration).sort((a,b) => b.duration-a.duration).slice(0,5);
  if (type === "fastest") return [...tests].filter(test => test.duration).sort((a,b) => a.duration-b.duration).slice(0,5);
  if (type === "flaky") return tests.filter(test => test.retries > 0).sort((a,b) => b.retries-a.retries);
  return tests.filter(test => test.status === "failed");
}
function renderSummary(active = "slowest") {
  const types = ["slowest", "fastest", "flaky", "failed"];
  document.querySelector("#summaryTabs").innerHTML = types.map(type => `<button class="summary-tab ${type === active ? "active" : ""}" type="button" data-summary="${type}">${titleCase(type)}</button>`).join("");
  const selected = summaryTests(active); document.querySelector("#summaryContent").innerHTML = selected.length ? selected.map((test,index) => `<div class="summary-row"><span class="summary-rank">${String(index+1).padStart(2,"0")}</span><div><strong>${escapeHtml(test.name)}</strong><span>${escapeHtml(test.suite)} · ${titleCase(test.status)}</span></div><span>${active === "flaky" ? `${test.retries} retries` : formatDuration(test.duration)}</span></div>`).join("") : `<div class="artifact-empty">No ${active} tests in this run.</div>`;
  document.querySelectorAll("[data-summary]").forEach(button => button.addEventListener("click", () => renderSummary(button.dataset.summary)));
}

function bindActions() {
  document.querySelector("#printReport").addEventListener("click", () => window.print());
  document.querySelector("#downloadJson").addEventListener("click", () => downloadFile(`${reportData.meta.runId}.json`, JSON.stringify(reportData, null, 2), "application/json"));
  document.querySelector("#downloadCsv").addEventListener("click", () => { const headers = ["Test Name","Suite","Browser","Status","Duration","Error Message","Retry Count","Start Time","End Time"]; const rows = tests.map(test => [test.name,test.suite,test.browser,test.status,test.duration,test.error,test.retries,test.startTime,test.endTime]); const csv = [headers,...rows].map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(",")).join("\n"); downloadFile(`${reportData.meta.runId}.csv`, csv, "text/csv;charset=utf-8"); });
  const themeButton = document.querySelector("#themeToggle"); themeButton.addEventListener("click", () => { const isLight = document.documentElement.dataset.theme === "light"; document.documentElement.dataset.theme = isLight ? "dark" : "light"; themeButton.innerHTML = `<i class="fa-solid fa-${isLight ? "sun" : "moon"}"></i>`; renderCharts(reportData); });
}

renderMeta(); renderMetrics(); renderCharts(reportData); new TestTable(tests); renderArtifacts(); renderErrors(); renderEnvironment(); renderSummary(); bindActions();
