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

  img.onclick = () => {
    openPDF(name);
  };

  legendContainer.appendChild(img);

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