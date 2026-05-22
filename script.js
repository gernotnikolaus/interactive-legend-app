/* --------------------------
   URL PARAMETER
--------------------------- */

const params = new URLSearchParams(window.location.search);

const legendName = params.get("legend");


/* --------------------------
   DEFAULT LEGEND
--------------------------- */

const selectedLegend = legends[legendName] || legends["infrastructure"];


/* --------------------------
   HTML ELEMENTS
--------------------------- */

const legendContainer =
  document.getElementById("legendContainer");

const legendView =
  document.getElementById("legendView");

const pdfView =
  document.getElementById("pdfView");

const pdfFrame =
  document.getElementById("pdfFrame");

const backButton =
  document.getElementById("backButton");


/* --------------------------
   CREATE BASE LEGEND
--------------------------- */

const baseLegend = document.createElement("img");

baseLegend.src = selectedLegend.base;

baseLegend.className = "base-legend";

legendContainer.appendChild(baseLegend);


/* --------------------------
   CREATE SLICES
--------------------------- */

selectedLegend.slices.forEach(slice => {

  const sliceElement =
    document.createElement("img");

  sliceElement.src = slice.svg;

  sliceElement.className = "slice";

  sliceElement.title = slice.name;


  /* CLICK EVENT */

  sliceElement.addEventListener("click", () => {

    openPDF(slice.pdf);

  });


  legendContainer.appendChild(sliceElement);

});


/* --------------------------
   OPEN PDF
--------------------------- */

function openPDF(pdfPath) {

  legendView.style.display = "none";

  pdfView.style.display = "flex";

  pdfFrame.src = pdfPath;
}


/* --------------------------
   CLOSE PDF
--------------------------- */

function closePDF() {

  pdfView.style.display = "none";

  legendView.style.display = "flex";

  pdfFrame.src = "";
}


/* --------------------------
   BACK BUTTON
--------------------------- */

backButton.addEventListener("click", closePDF);