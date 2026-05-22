const baseLegend = document.getElementById("baseLegend");

// CHANGE THIS PATH TO YOUR REAL FILE
baseLegend.src = "legends/punjab/infrastructure/Punjab_Infrastructure_Legend_Base.svg";

baseLegend.onload = () => {
  console.log("Legend loaded successfully");
};

baseLegend.onerror = () => {
  console.error("FAILED TO LOAD IMAGE - CHECK PATH");
};

const slice1 = document.getElementById("slice1");

slice1.src =
  "legends/punjab/infrastructure/Punjab_Infrastructure_Legend_CanalRehabilitationGatesAutomation.svg";

slice1.onclick = () => {
  alert("Slice clicked works!");
};