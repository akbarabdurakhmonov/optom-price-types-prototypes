import sys, asyncio
from playwright.async_api import async_playwright
R = "/home/claude/optom-price-types-prototypes/"
P1 = ["fixed-single","fixed-usd","multi-1-empty","multi-1-filled","multi-2-table","multi-2-matrix","multi-2-bulk","multi-err","multi-3-review","range","range-err","neg","own-dialog","own-step2","live-switch"]
P2 = ["a-list","a-new","a-err","a-edit","a-cat","a-custom","s-pick","s-dup","s-new","s-mine","b-filter"]
SHOTS = sys.argv[1:]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        errs = []
        jobs = [("p-pt3-negotiation.html", [f"?s={i}" for i in range(20)]), ("p-pt4-buyer-prices.html", [f"?s={i}" for i in range(11)]),
                ("p-pt1-prices.html", ["#" + x for x in P1]), ("p-pt2-characteristics.html", ["#" + x for x in P2])]
        for f, qs in jobs:
            for q in qs:
                pg = await b.new_page(viewport={"width": 1400, "height": 950})
                pg.on("pageerror", lambda e, f=f, q=q: errs.append(f"{f}{q}: {e}"))
                await pg.goto(f"file://{R}{f}{q}"); await pg.wait_for_timeout(250)
                t = await pg.inner_text("body")
                if len(t) < 200: errs.append(f"{f}{q}: almost empty")
                key = f"{f[:5]}{q}"
                if key in SHOTS: await pg.screenshot(path=f"/tmp/shot_{key.replace('?','_').replace('#','_').replace('=','')}.png", full_page=False)
                await pg.close()
        print("errors:", errs or "none")
        await b.close()
asyncio.run(main())
