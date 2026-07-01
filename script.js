// -----------------------------
// sector config
// -----------------------------
const THEMES = {
  punjab_infrastructure: {
    path: "legends/punjab/infrastructure/",
    base: "Punjab_Infrastructure_Legend_Base.svg",
    prefix: "Punjab_Infrastructure_Legend_",
    pdfPrefix: "Punjab_Infrastructure_Factsheet_",
    background: "#e1eded",
    slides: [
      "CanalRehabilitationGateAutomation",
      "FloodplainEncroachmentRemoval",
      "GreenhousingFeatures",
      "RetrofittingBridges",
      "RetrofittingRoads",
      "RetrofittingSchoolsHealthFacilities",
      "RiverEmbankmentStabilization"
    ]
  },
  punjab_agriculture: {
    path: "legends/punjab/agriculture/",
    base: "Punjab_Agriculture_Legend_Base.svg",
    prefix: "Punjab_Agriculture_Legend_",
    pdfPrefix: "Punjab_Agriculture_Factsheet_",
    background: "#507d7d",
    slides: [
      "DrainageChannels",
      "DroughtTolerantSeedVarieties",
      "FloodplainForestRestoration",
      "FloodProtectionEmbankments",
      "FloodTolerantSeedVarieties",
      "HighEfficiencyIrrigationSystem",
      "IntegratedRiskMonitoringEarlyWarningSystem",
      "RainwaterHarvesting",
      "RangelandRehabilitation",
      "SilageFeedStorage"
    ]
  }
};

// -----------------------------
// READ THEME FROM URL
const params = new URLSearchParams(window.location.search);
const themeName = params.get("theme") || "infrastructure";
const THEME = THEMES[themeName] || THEMES["infrastructure"];

// Apply background
document.getElementById("legendView").style.background = THEME.background;
document.title = `Legend – ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`;

const baseLegend = document.getElementById("baseLegend");
const legendContainer = document.getElementById("legendContainer");
const legendView = document.getElementById("legendView");
const pdfView = document.getElementById("pdfView");
const pdfFrame = document.getElementById("pdfFrame");
const backButton = document.getElementById("backButton");

baseLegend.src = THEME.path + THEME.base;

const sliceImgs = [];

THEME.slides.forEach(name => {
  const img = document.createElement("img");
  img.className = "slice";
  img.crossOrigin = "anonymous";
  img.src = THEME.path + THEME.prefix + name + ".svg";
  img.style.pointerEvents = "none";
  legendContainer.appendChild(img);
  sliceImgs.push({ name, img });
});

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

function getActiveSlice(clientX, clientY) {
  const rect = legendContainer.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  canvas.width = rect.width;
  canvas.height = rect.height;

  for (let i = sliceImgs.length - 1; i >= 0; i--) {
    const { img } = sliceImgs[i];
    if (!img.complete) continue;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    if (pixel[3] > 10) return sliceImgs[i];
  }
  return null;
}

legendContainer.addEventListener("mousemove", e => {
  const hit = getActiveSlice(e.clientX, e.clientY);
  sliceImgs.forEach(({ img }) => img.style.filter = "none");
  if (hit) {
    hit.img.style.filter = "drop-shadow(0 0 12px rgba(0,0,0,0.59)) drop-shadow(0 0 24px rgba(0,0,0,0.7))";
    legendContainer.style.cursor = "pointer";
  } else {
    legendContainer.style.cursor = "default";
  }
});

legendContainer.addEventListener("mouseleave", () => {
  sliceImgs.forEach(({ img }) => img.style.filter = "none");
  legendContainer.style.cursor = "default";
});

legendContainer.addEventListener("click", e => {
  const hit = getActiveSlice(e.clientX, e.clientY);
  if (hit) openPDF(hit.name);
});

function openPDF(name) {
  const pdfPath = THEME.path + "pdf/" + THEME.pdfPrefix + name + ".pdf";
  window.open(pdfPath, "_blank");
}

function closePDF() {
  pdfView.style.transition = "opacity 0.3s ease";
  pdfView.style.opacity = "0";
  setTimeout(() => {
    pdfView.style.display = "none";
    legendView.style.display = "flex";
    pdfFrame.src = "";
  }, 300);
}

backButton.addEventListener("click", closePDF);