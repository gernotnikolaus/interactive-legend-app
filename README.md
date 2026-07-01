# interactive-legend-app

A lightweight, embeddable interactive legend viewer.  
Click a pie slice → opens the corresponding factsheet.  
Driven entirely by URL parameters — no backend needed.

---

## File Structure

```
project/
├── index.html
├── style.css
├── script.js
└── legends/
    └── punjab/
        ├── infrastructure/
        │   ├── Punjab_Infrastructure_Legend_Base.svg
        │   ├── Punjab_Infrastructure_Legend_RetrofittingRoads.svg
        │   ├── ... (one SVG per slice)
        │   └── sheet/
        │       ├── Punjab_Infrastructure_Factsheet_RetrofittingRoads.png
        │       └── ... (one png per slice)
        └── agriculture/
            ├── Punjab_Agriculture_Legend_Base.svg
            ├── Punjab_Agriculture_Legend_DrainageChannels.svg
            ├── ...
            └── sheet/
                └── ...
```

---

## URL Usage

Open a specific theme by passing `?theme=` in the URL:

```
index.html?theme=punjab_infrastructure
index.html?theme=punjab_agriculture
```

Falls back to `punjab_infrastructure` if no theme is given.

---

## Adding a New Theme

In `script.js`, add an entry to the `THEMES` object:

```js
my_new_theme: {
  path: "legends/region/sector/",
  base: "Region_Sector_Legend_Base.svg",
  prefix: "Region_Sector_Legend_",
  pdfPrefix: "Region_Sector_Factsheet_",
  background: "#f0e8d0",
  slides: [
    "SliceName1",
    "SliceName2"
  ]
}
```

Then embed it with:

```
index.html?theme=my_new_theme
```

---

## SVG Requirements

- The **base SVG** is a static background image (non-clickable).
- Each **slice SVG** must be the same dimensions as the base.