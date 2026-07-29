// ============================================================
// Interactive Legend – script.js
// ============================================================
// Loads a themed SVG legend based on the URL parameter ?theme=
// Each theme has a base SVG + clickable slice SVGs that open
// a factsheet. Slice hit-testing uses canvas pixel sampling
// so transparent areas are correctly ignored.
//
// URL usage, e.g.:
//   index.html?theme=punjab_infrastructure
//   index.html?theme=punjab_agriculture
// ============================================================


// ------------------------------------------------------------
// THEME CONFIG
// Add new themes here. Each entry needs:
//   path       – folder containing SVGs and /sheer/ subfolder
//   base       – filename of the base legend SVG
//   prefix     – filename prefix for slice SVGs
//   sheetPrefix  – filename prefix for png factsheets
//   background – CSS color for the legend background
//   slides     – list of slice/factsheet name suffixes
// ------------------------------------------------------------
const THEMES = {
  punjab_infrastructure: {
    path: "legends/punjab/infrastructure/",
    base: "Punjab_Infrastructure_Legend_Base.svg",
    prefix: "Punjab_Infrastructure_Legend_",
    sheetPrefix: "Punjab_Infrastructure_Factsheet_",
    background: "#f5ffff",
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
    sheetPrefix: "Punjab_Agriculture_Factsheet_",
    background: "#f4faeb",
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
  },
    punjab_socialprotection: {
    path: "legends/punjab/socialprotection/",
    base: "Punjab_SocialProtection_Legend_Base.svg",
    prefix: "Punjab_SocialProtection_Legend_",
    sheetPrefix: "Punjab_SocialProtection_Factsheet_",
    background: "#f7f5ff",
    slides: [
      "BISPEmergencyCashAssistance",
      "DistrictHealthInformationSystem",
      "IntegratedRiskMonitoringEarlyWarningSystem"
    ]
  },
    punjab_urbanresilience: {
    path: "legends/punjab/urbanresilience/",
    base: "Punjab_UrbanResilience_Legend_Base.svg",
    prefix: "Punjab_UrbanResilience_Legend_",
    sheetPrefix: "Punjab_UrbanResilience_Factsheet_",
    background: "#dfedf8",
    slides: [
      "FloodplainEncroachmentRemoval",
      "GreenhousingFeatures",
      "RetrofittingSchoolsHealthFacilities",
      "RetrofittingStormwaterDrainage",
      "RiverEmbankmentStabilization"
    ]
  },
};

// -----------------------------
// READ THEME FROM URL
// Reads ?theme= from the URL, falls back to punjab_infrastructure
// ------------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const themeName = params.get("theme") || "punjab_infrastructure";
const THEME = THEMES[themeName] || THEMES["punjab_infrastructure"];

// Apply background
document.getElementById("legendView").style.background = THEME.background;
document.title = `Legend – ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`;

// DOM REFERENCES
const baseLegend = document.getElementById("baseLegend");
const legendContainer = document.getElementById("legendContainer");
const legendView = document.getElementById("legendView");
const sheetView = document.getElementById("sheetView");
const sheetFrame = document.getElementById("sheetFrame");
const backButton = document.getElementById("backButton");

// LOAD BASE LEGEND
baseLegend.src = THEME.path + THEME.base;

// ----------------------------------------------------
// BUILD SLICE IMAGES
// --------------------------------------------------
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

// ------------------------------------------------------------
// CANVAS HIT-TESTING
// ------------------------------------------------------------
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

// --------------------------------------------------------
// HOVER EFFECT
// -------------------------------------------------------
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
  if (hit) openSheet(hit.name);
});

// ------------------------------------------------------------
// OPEN SHEET
// ------------------------------------------------------------
function openSheet(name) {
  const sheetPath = THEME.path + "sheet/" + THEME.sheetPrefix + name + ".png";
  
  sheetFrame.src = sheetPath;
  sheetView.style.display = "flex";
  sheetView.style.opacity = "0";
  legendView.style.display = "none";

  requestAnimationFrame(() => {
    sheetView.style.transition = "opacity 0.4s ease";
    sheetView.style.opacity = "1";
  });
}

// ---------------------------------------------------
// CLOSE SHEET
// ------------------------------------------------------------
function closeSheet() {
  sheetView.style.transition = "opacity 0.3s ease";
  sheetView.style.opacity = "0";
  setTimeout(() => {
    sheetView.style.display = "none";
    legendView.style.display = "flex";
    sheetFrame.src = "";
  }, 300);
}

backButton.addEventListener("click", closeSheet);