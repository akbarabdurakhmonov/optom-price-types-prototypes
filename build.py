import os, re
R = "/home/claude/optom-price-types-prototypes/"; SRC = R + "src/"
css = "".join(open(SRC + f).read() for f in ["base.css", "sd.css", "pu.css", "ol1.css", "ol2.css", "pt.css"])
harness = open(SRC + "harness.js").read()
FOOT = '<p style="text-align:center;color:#8b9189;font-size:11.5px;margin:18px 0 28px">Optom.uz · clickable prototype for the price types user stories (epic US-SF-2.2) · requirements: Price types and negotiable price PRD · example data only. Where a prototype differs from the acceptance criteria in Confluence, the acceptance criteria win.</p>'
NEW = [("p-pt3-negotiation.html", "P-PT3 Negotiation: chat, offer, cart, order", "p3.js"), ("p-pt4-buyer-prices.html", "P-PT4 Buyer: prices, tiers, cart and filters", "p4.js")]
for fn, title, js in NEW:
    open(R + fn, "w").write(f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{css}</style></head><body>
<div id="app"></div>{FOOT}
<script>{harness}
{open(SRC + js).read()}
</script></body></html>''')
FIT = '<script>(function(){if(window===window.top)return;var a=function(){var w=document.documentElement.clientWidth;document.documentElement.style.zoom=w<1280?(w/1280).toFixed(3):"";};a();window.addEventListener("resize",a);})();</script>'
# P-PT1: decisions applied (PT22: no request form; OQ-PT21: price hint later); links relative
p1 = open(SRC + "p-pt1-prices.html").read()
p1 = re.sub(r"https://claude\.ai/artifact/WK8Md2dcRRzTaZatzYjSUN", "p-pt2-characteristics.html", p1)
p1 = re.sub(r"https://claude\.ai/artifact/[A-Za-z0-9]+", "index.html", p1)
a = p1.index("  h+='<div class=\"note prop\" style=\"flex-direction:column;gap:8px\"><span><span class=\"flag\">⚑ предложение BA</span> Ориентир цены.")
b = p1.index("\n", a); p1 = p1[:a] + p1[b + 1:]
p1 = p1.replace("покупатель указывает нужный вариант в запросе. Не нарисовано в этом прототипе.", "покупатель называет нужный вариант в чате, продавец указывает его в предложении цены.")
lines = p1.split("\n")
for i, ln in enumerate(lines):
    if ln.startswith("  h+='<div class=\"pv\"><span class=\"eyb\">Так увидит покупатель</span>") and "Договорная цена" in ln:
        lines[i] = "  h+='<div class=\"pv\"><span class=\"eyb\">Так увидит покупатель</span><div class=\"pimg\"><i></i></div><h4>Samsung Galaxy A55 5G</h4><div class=\"pprice\">Договорная цена</div>'+(S.neg.moq>1?'<small style=\"color:var(--muted)\">Минимальный заказ: '+fmt(S.neg.moq)+' шт.</small>':'')+'<button type=\"button\" class=\"btn pri\" style=\"justify-content:center\">Написать продавцу</button></div></div>';"
    if "Buyer actions: «Запросить цену»" in ln:
        lines[i] = '   "Buyer action: «Написать продавцу» only (PT21, PT22: no request form in the MVP). The price is agreed in the chat with a price offer (prototype P-PT3).",'
    if "⚑ Proposal: an optional price hint" in ln:
        lines[i] = '   "The minimum order is shown to buyers only when above 1 (⚑ OQ-PT32). A public price hint «от … сум» is later (OQ-PT21), not in this release."]},'
p1 = "\n".join(lines)
p1 = p1.replace("it can be linked to a shared value so buyers still find the variant through the filter (decided 13.11.2026).", "it is shown on the product page but never in catalogue filters (decided 13.11.2026).")
for x in ("Запросить цену", "Ориентир цены", "hintOn&&"):
    assert x not in p1, x
p1 = p1.replace("</body>", FIT + "</body>", 1)
open(R + "p-pt1-prices.html", "w").write(p1)
p2 = open(SRC + "p-pt2-characteristics.html").read()
p2 = re.sub(r"https://claude\.ai/artifact/N2HiFbJ6Ft3hnQUgoPu19d", "p-pt1-prices.html", p2)
p2 = re.sub(r"https://claude\.ai/artifact/[A-Za-z0-9]+", "index.html", p2)
p2 = p2.replace("</body>", FIT + "</body>", 1)
open(R + "p-pt2-characteristics.html", "w").write(p2)
def n(js): return open(SRC + js).read().count("{ label:")
LIST = [("p-pt1-prices.html", "P-PT1 Seller: «Цена и остатки» (types, «Разная цена», ranges, negotiable, own values)", "US-SF-2.2-01, -02, -03, -05", "15 scenarios, open one with #id"),
        ("p-pt2-characteristics.html", "P-PT2 Characteristics and variant values (admin directory, seller own values, buyer filter)", "US-AF-5.5-04, US-SF-2.2-05", "11 scenarios, open one with #id"),
        ("p-pt3-negotiation.html", "P-PT3 Negotiation: chat, offer, cart, order, admin, notifications", "US-BF-4.1-03, US-SF-4.2-01, US-BF-4.2-01, US-BF-4.2-02, US-AF-2.1-04, US-BF-8.1-06", f"{n('p3.js')} scenarios, ?s=N"),
        ("p-pt4-buyer-prices.html", "P-PT4 Buyer: prices, tiers, cart and filters", "US-BF-3.5-01, US-BF-5.1-03, US-BF-2.4-04, US-SF-2.2-04", f"{n('p4.js')} scenarios, ?s=N")]
lis = "".join(f'<li><a href="{f}">{t}</a><br><small>{st} · {c}</small></li>' for f, t, st, c in LIST)
open(R + "index.html", "w").write(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Optom.uz price types prototypes</title>
<style>body{{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:780px;margin:40px auto;padding:0 16px;color:#1b1c1f}}a{{color:#00a028}}li{{margin:12px 0}}small{{color:#667}}</style></head><body>
<h1>Optom.uz · Price types and negotiable price prototypes v1.0</h1><p>Clickable prototypes for the user stories of epic US-SF-2.2 (Price types and negotiable price). Screens in Russian, notes in English. Pick a state in the <b>Scenario</b> list at the top.</p>
<ul>{lis}</ul><p><small>Example data only. The acceptance criteria in Confluence are the source of truth.</small></p></body></html>''')
open(R + "README.md", "w").write("# Optom.uz price types prototypes\n\nClickable HTML prototypes P-PT1 – P-PT4 for the user stories of epic US-SF-2.2 (Price types and negotiable price), published with GitHub Pages and embedded in the Confluence user story pages.\n\nRequirements: Price types and negotiable price PRD. Source of truth: the Confluence story pages. Example data only, no real customer data.\n\nP-PT3 and P-PT4 are built from `src/` with `build.py`; P-PT1 and P-PT2 are single-file prototypes in `src/`, copied with small corrections by `build.py`.\n")
open(R + "robots.txt", "w").write("User-agent: *\nDisallow: /\n")
open(R + ".nojekyll", "w").write("")
print("built")
