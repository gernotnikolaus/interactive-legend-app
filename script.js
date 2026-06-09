const baseLegend = document.getElementById("baseLegend");
const legendContainer = document.getElementById("legendContainer");
const legendView = document.getElementById("legendView");
const pdfView = document.getElementById("pdfView");
const pdfFrame = document.getElementById("pdfFrame");
const backButton = document.getElementById("backButton");

const BASE_PATH = "legends/punjab/infrastructure/";
const BASE_FILE = "Punjab_Infrastructure_Legend_Base.svg";
const SLIDES = [
  "CanalRehabilitationGatesAutomation",
  "FloodplainEncroachmentRemoval",
  "GreenhousingFeatures",
  "RetrofittingBridges",
  "RetrofittingRoads",
  "RetrofittingSchoolsHealthFacilities",
  "RiverEnbankmentStabilization"
];

baseLegend.src = BASE_PATH + BASE_FILE;

// --- Build slice images (pointer-events off — canvas handles clicks) ---
const sliceImgs = [];

SLIDES.forEach(name => {
  const img = document.createElement("img");
  img.className = "slice";
  img.crossOrigin = "anonymous";
  img.src = BASE_PATH + "Punjab_Infrastructure_Legend_" + name + ".svg";
  img.style.pointerEvents = "none"; // let canvas handle interaction
  legendContainer.appendChild(img);
  sliceImgs.push({ name, img });
});

// --- Canvas used for pixel-sampling (invisible) ---
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

function getActiveSlice(clientX, clientY) {
  const rect = legendContainer.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  canvas.width = rect.width;
  canvas.height = rect.height;

  // Check slices in reverse order (topmost first)
  for (let i = sliceImgs.length - 1; i >= 0; i--) {
    const { img } = sliceImgs[i];
    if (!img.complete) continue;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    const alpha = pixel[3];

    if (alpha > 10) return sliceImgs[i]; // opaque pixel = hit
  }
  return null;
}

// --- Hover: highlight whichever slice is under cursor ---
legendContainer.addEventListener("mousemove", e => {
  const hit = getActiveSlice(e.clientX, e.clientY);
  sliceImgs.forEach(({ img }) => img.style.filter = "none");
  if (hit) {
    hit.img.style.filter = "drop-shadow(0 0 12px rgba(0, 0, 0, 0.59)) drop-shadow(0 0 24px rgba(0, 0, 0, 0.7))";
    legendContainer.style.cursor = "pointer";
  } else {
    legendContainer.style.cursor = "default";
  }
});

legendContainer.addEventListener("mouseleave", () => {
  sliceImgs.forEach(({ img }) => img.style.filter = "none");
  legendContainer.style.cursor = "default";
});

// --- Click: open the PDF for the hit slice ---
legendContainer.addEventListener("click", e => {
  const hit = getActiveSlice(e.clientX, e.clientY);
  if (hit) openPDF(hit.name);
});

// --- PDF open/close ---
function openPDF(name) {
  const pdfPath = BASE_PATH + "pdf/Punjab_Infrastructure_Factsheet_" + name + ".pdf";
  
  pdfFrame.src = pdfPath;
  pdfView.style.display = "flex";
  pdfView.style.opacity = "0";
  legendView.style.display = "none";

  requestAnimationFrame(() => {
    pdfView.style.transition = "opacity 0.4s ease";
    pdfView.style.opacity = "1";
  });
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