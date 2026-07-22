#!/usr/bin/env python3
"""Render a US footprint map (states tinted by role) with utility logos placed
on their service territories. Output: reports/assets/footprint_map.png"""
import asyncio, json, os
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D3 = open(os.path.join(ROOT, "node_modules/d3/dist/d3.min.js")).read()
TOPO = open(os.path.join(ROOT, "node_modules/topojson-client/dist/topojson-client.min.js")).read()
US = open(os.path.join(ROOT, "node_modules/us-atlas/states-10m.json")).read()
LOGO = os.path.join(ROOT, "reports/assets/logos")

W, H = 1360, 720

CURRENT = ["Michigan", "Iowa", "Indiana", "Texas"]
TARGET = ["California", "Ohio", "Pennsylvania", "New Jersey", "West Virginia",
          "Maryland", "Virginia", "Kentucky", "Tennessee", "Arkansas",
          "Louisiana", "Oklahoma", "Georgia", "Alabama", "Mississippi"]

# chip: logos (files, stacked), anchor [lon,lat], offset [dx,dy]px, width px
CHIPS = [
    {"logos": ["pge.png"], "anchor": [-120.3, 38.7], "off": [0, 0], "w": 84},
    {"logos": ["midamerican.png"], "anchor": [-93.4, 42.0], "off": [0, -2], "w": 120},
    {"logos": ["consumers.png", "dte.png"], "anchor": [-84.4, 43.4], "off": [98, -72], "w": 136},
    {"logos": ["centerpoint.png"], "anchor": [-95.4, 29.8], "off": [0, 0], "w": 116},
    {"logos": ["centerpoint.png"], "anchor": [-86.5, 39.6], "off": [-6, -2], "w": 92},
    {"logos": ["aep.png"], "anchor": [-82.2, 37.9], "off": [-6, 28], "w": 106},
    {"logos": ["firstenergy.png"], "anchor": [-77.8, 40.8], "off": [40, -6], "w": 134},
    {"logos": ["southern.png"], "anchor": [-84.4, 32.6], "off": [6, 10], "w": 104},
]

HTML = f"""<!doctype html><html><head><meta charset='utf-8'>
<style>
  body {{ margin:0; font-family: -apple-system, "Segoe UI", system-ui, sans-serif; }}
  #map {{ position:relative; width:{W}px; height:{H}px; background:#fff; }}
  .chip {{ position:absolute; background:#fff; border:1px solid #E3E2DB; border-radius:9px;
          box-shadow:0 2px 7px rgba(0,0,0,.13); padding:8px 9px; box-sizing:border-box;
          display:flex; flex-direction:column; gap:6px; align-items:center; }}
  .chip img {{ width:100%; height:auto; object-fit:contain; display:block; }}
  .legend {{ position:absolute; left:34px; bottom:22px; font-size:16px; color:#52514e; }}
  .legend .row {{ display:flex; align-items:center; gap:9px; margin:5px 0; }}
  .legend .sw {{ width:22px; height:14px; border-radius:3px; border:1px solid rgba(0,0,0,.12); }}
</style></head><body>
<div id="map"><svg id="svg" width="{W}" height="{H}" style="position:absolute;top:0;left:0"></svg></div>
<script>{D3}</script>
<script>{TOPO}</script>
<script>
const US = {US};
const CURRENT = {json.dumps(CURRENT)}, TARGET = {json.dumps(TARGET)};
const CHIPS = {json.dumps(CHIPS)};
const LOGO = "file://{LOGO}";
const W={W}, H={H};
const states = topojson.feature(US, US.objects.states);
const proj = d3.geoAlbersUsa().fitExtent([[26,18],[W-26,H-96]], states);
const path = d3.geoPath(proj);
const svg = d3.select("#svg");
const fill = n => CURRENT.includes(n) ? "#CFE3FA" : (TARGET.includes(n) ? "#FBE6C6" : "#EFEEE9");
svg.append("g").selectAll("path").data(states.features).join("path")
   .attr("d", path).attr("fill", d=>fill(d.properties.name))
   .attr("stroke", "#ffffff").attr("stroke-width", 1.1);
// leaders + dots
const gl = svg.append("g");
const map = document.getElementById("map");
CHIPS.forEach(c => {{
  const a = proj(c.anchor); if(!a) return;
  const cx = a[0] + c.off[0], cy = a[1] + c.off[1];
  if (c.off[0] || c.off[1]) {{
    gl.append("line").attr("x1",a[0]).attr("y1",a[1]).attr("x2",cx).attr("y2",cy)
      .attr("stroke","#8A8983").attr("stroke-width",1.3);
  }}
  gl.append("circle").attr("cx",a[0]).attr("cy",a[1]).attr("r",4.5)
    .attr("fill","#2a2a28").attr("stroke","#fff").attr("stroke-width",1.4);
  const div = document.createElement("div");
  div.className = "chip"; div.style.width = c.w + "px";
  c.logos.forEach(f => {{ const im=document.createElement("img"); im.src = LOGO+"/"+f; div.appendChild(im); }});
  map.appendChild(div);
  // position after layout so we can center by measured height
  requestAnimationFrame(()=>{{
    const h = div.offsetHeight;
    div.style.left = (cx - c.w/2) + "px";
    div.style.top  = (cy - h/2) + "px";
  }});
}});
// legend
const lg = document.createElement("div"); lg.className="legend";
lg.innerHTML = '<div class="row"><span class="sw" style="background:#CFE3FA"></span>Current CVR client base</div>'
             + '<div class="row"><span class="sw" style="background:#FBE6C6"></span>National expansion targets</div>'
             + '<div class="row" style="color:#8A8983;font-size:14px;margin-top:8px">Logos mark each utility\\'s service territory</div>';
map.appendChild(lg);
window.__ready = false;
Promise.all(Array.from(document.images).map(im => im.complete ? 1 : new Promise(r=>{{im.onload=r;im.onerror=r;}})))
  .then(()=> setTimeout(()=>{{ window.__ready = true; }}, 250));
</script></body></html>"""


async def main():
    with open("/tmp/footprint.html", "w") as f:
        f.write(HTML)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        pg = await b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        await pg.goto("file:///tmp/footprint.html")
        await pg.wait_for_function("window.__ready === true", timeout=15000)
        el = await pg.query_selector("#map")
        await el.screenshot(path=os.path.join(ROOT, "reports/assets/footprint_map.png"))
        await b.close()
    print("wrote reports/assets/footprint_map.png")

asyncio.run(main())
