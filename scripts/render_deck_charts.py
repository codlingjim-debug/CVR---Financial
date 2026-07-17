#!/usr/bin/env python3
"""Render the dashboard's charts to high-res PNGs for the PowerPoint deck.

Loads reports/cvr_dashboard.html in headless Chromium (light theme), wraps each
chart (plus its legend, where one exists) in a white padded container, and
screenshots it at 2x. Writes reports/assets/<name>.png and a manifest with
pixel dimensions that scripts/build_deck.js uses to size images on slides.
"""
import asyncio
import json
import pathlib

from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "reports" / "cvr_dashboard.html"
OUT = ROOT / "reports" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

# name -> (legend element id or None, chart element id)
CHARTS = {
    "rev": ("legend-rev", "chart-rev"),
    "gm": ("legend-gm", "chart-gm"),
    "ladder": (None, "chart-ladder"),
    "ut": ("legend-ut", "chart-ut"),
    "cu": ("legend-cu", "chart-cu"),
    "cov": ("legend-cov", "chart-cov"),
    "note": (None, "chart-note"),
}


async def main():
    page_html = ("<!doctype html><html><head><meta charset='utf-8'></head><body>"
                 + SRC.read_text() + "</body></html>")
    tmp = OUT / "_render.html"
    tmp.write_text(page_html)
    manifest = {}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width": 1020, "height": 1400},
                                      color_scheme="light", device_scale_factor=2)
        await page.goto(tmp.as_uri())
        await page.wait_for_timeout(600)
        for name, (legend, chart) in CHARTS.items():
            await page.evaluate(
                """([legend, chart]) => {
                    const c = document.getElementById(chart);
                    const wrap = document.createElement('div');
                    wrap.id = 'wrap-' + chart;
                    wrap.style.cssText = 'background:#FFFFFF;padding:10px 14px;display:inline-block;width:' +
                        c.getBoundingClientRect().width + 'px';
                    c.parentNode.insertBefore(wrap, legend ? document.getElementById(legend) : c);
                    if (legend) wrap.appendChild(document.getElementById(legend));
                    wrap.appendChild(c);
                }""", [legend, chart])
            elem = page.locator(f"#wrap-{chart}")
            path = OUT / f"{name}.png"
            await elem.screenshot(path=str(path))
            box = await elem.bounding_box()
            manifest[name] = {"w": box["width"], "h": box["height"]}
        await browser.close()
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2))
    tmp.unlink()
    for k, v in manifest.items():
        print(f"{k}: {v['w']:.0f}x{v['h']:.0f}")


asyncio.run(main())
