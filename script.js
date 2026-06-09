const baseLegend = document.getElementById("baseLegend");
const legendContainer = document.getElementById("legendContainer");

const legendView = document.getElementById("legendView");
const pdfView = document.getElementById("pdfView");
const pdfFrame = document.getElementById("pdfFrame");
const backButton = document.getElementById("backButton");


// -----------------------------
// CONFIG
// -----------------------------

const BASE_PATH =
  "legends/punjab/infrastructure/";

const BASE_FILE =
  "Punjab_Infrastructure_Legend_Base.svg";

const SLIDES = [
  "CanalRehabilitationGatesAutomation",
  "FloodplainEncroachmentRemoval",
  "GreenhousingFeatures",
  "RetrofittingBridges",
  "RetrofittingRoads",
  "RetrofittingSchoolsHealthFacilities",
  "RiverEnbankmentStabilization"
];


// -----------------------------
// LOAD BASE
// -----------------------------

baseLegend.src = BASE_PATH + BASE_FILE;


// -----------------------------
// CREATE SLICES
// -----------------------------

SLIDES.forEach(name => {

  const img = document.createElement("img");

  img.className = "slice";

  img.src =
    BASE_PATH +
    "Punjab_Infrastructure_Legend_" +
    name +
    ".svg";

  // offscreen canvas for pixel testing
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img.onload = () => {

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

  };

});


// -----------------------------
// OPEN PDF
// -----------------------------

function openPDF(name) {

  const pdfPath =
    BASE_PATH +
    "pdf/" +
    "Punjab_Infrastructure_Factsheet_" +
    name +
    ".pdf";

  legendView.style.display = "none";
  pdfView.style.display = "flex";

  pdfFrame.src = pdfPath;
}


// -----------------------------
// CLOSE PDF
// -----------------------------

function closePDF() {
  pdfView.style.display = "none";
  legendView.style.display = "flex";
  pdfFrame.src = "";
}


// -----------------------------
// BACK BUTTON
// -----------------------------

backButton.addEventListener("click", closePDF);