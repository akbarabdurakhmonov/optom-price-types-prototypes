// P-PT4 Buyer: prices of each type, range tiers, cart recalculation, filters. Example data only.
const fmt = n => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ").replace(/ /g, " ");
const TIERS = [[10, 99, 90800], [100, 499, 88420], [500, null, 84200]];
const RNAME = "Футболка оверсайз, хлопок 220 г/м²", SELL = "Ташкент Текстиль";
const tierOf = q => { for (let i = TIERS.length - 1; i >= 0; i--) if (q >= TIERS[i][0]) return i; return 0; };
const disc = (p, d) => d ? Math.floor(p * (100 - d) / 100 + 0.5) : p;
let S = {};
function base(o) { closeModal(); S = Object.assign({ view: "cards", q: 60, d: 0, fq: 20, fErr: "", lines: [], neg: false, pfrom: "", pto: "", sort: "pop", payDlg: false }, o || {}); render(); if (S.after) S.after(); }
function bHeader() {
  return `<div class="strip"><span>➤ Ташкент, Юнусабад, 4-й квартал, 21</span><span>О компании · Связаться с нами · Доставка и оплата</span></div>
  <div class="bh">${LOGO}<button class="btn pri">☰ Каталог</button><div class="srch"><input placeholder="Что вы ищете?" value="футболка"><button>Найти</button></div><span class="small">Русский · Избранное · Корзина · <b>Профиль</b></span></div>`;
}
function render() {
  const v = S.view;
  $("#app").innerHTML = v === "app" ? appPage() : bHeader() + (v === "cards" ? cards() : v === "range" ? rangePage() : v === "fixed" ? fixedPage() : v === "neg" ? negPage() : v === "cart" ? cartPage() : searchPage());
}
const PRODS = [
  { t: "Футболка базовая, хлопок 160 г/м²", type: "F", p: 32000, old: 0, moq: 20 },
  { t: "Поло пике, 5 цветов", type: "F", p: 54000, old: 68000, moq: 10 },
  { t: RNAME, type: "R", p: 84200, moq: 10 },
  { t: "Футболка хлопковая базовая, 180 г/м²", type: "N", moq: 50 },
  { t: "Худи с начёсом, 320 г/м²", type: "R", p: 141000, moq: 20 },
  { t: "Свитшот оптом под нанесение", type: "N", moq: 1 },
  { t: "Майка спортивная", type: "F", p: 18500, old: 0, moq: 50 },
  { t: "Лонгслив хлопковый", type: "F", p: 47000, old: 52000, moq: 10 }];
function card(p) {
  const pr = p.type === "N" ? `<div class="pr1">Договорная цена</div><div class="moq">&nbsp;</div>` : p.type === "R" ? `<div class="pr1">от ${fmt(p.p)} сум</div><div class="moq">от ${p.moq} шт.</div>`
    : `<div class="pr1">${fmt(p.p)} сум ${p.old ? `<s class="small muted" style="font-weight:400">${fmt(p.old)}</s>` : ""}</div><div class="moq">${p.moq > 1 ? "мин. заказ " + p.moq + " шт." : "&nbsp;"}</div>`;
  const tag = { F: "Фиксированная", R: "По диапазонам", N: "Договорная" }[p.type];
  return `<div class="pcard"><div class="pimg">фото</div><span class="tagt">${tag}</span>${pr}<div class="tl">${p.t}</div><button class="btn ${p.type === "N" ? "out" : "pri"} sm">${p.type === "N" ? "Написать продавцу" : "В корзину"}</button></div>`;
}
function cards() {
  return `<div class="ptwrap"><div class="bc">Главная › Одежда › Футболки · 8 товаров</div><div class="grid-cards">${PRODS.map(card).join("")}</div>
   <p class="small muted mt8">Fixed: «X сум» (old price struck through); with «Разная цена» the lowest variant price. Range: «от X сум» = cheapest tier after discount, «от N шт.» = minimum. Negotiable: «Договорная цена», no price.</p></div>`;
}
function tierRows(q, d, mob) {
  const ti = tierOf(q);
  return `<div class="tiers">${TIERS.map((t, i) => `<div class="tr ${q >= TIERS[0][0] && i === ti ? "hl" : ""}"><span>${t[1] ? t[0] + " – " + t[1] + " шт." : "от " + t[0] + " шт."}</span><span>${d ? `<s>${fmt(t[2])}</s>` : ""}${fmt(disc(t[2], d))} сум</span></div>`).join("")}</div>`;
}
function rangeBuy(mob) {
  const q = S.q, ti = tierOf(q), up = disc(TIERS[ti][2], S.d), next = TIERS[ti + 1];
  const below = q < TIERS[0][0];
  return `${tierRows(q, S.d, mob)}<div class="small muted">Цена за шт. зависит от общего количества всех вариантов товара в заказе</div>
   <div class="row mt8" style="gap:14px;align-items:center"><span class="stp"><button data-a="qm">−</button><input id="q" value="${q}"><button data-a="qp">+</button></span>
   <div><b style="font-size:18px">${fmt(up * q)} сум</b><div class="small muted">${fmt(up)} сум за шт.</div></div></div>
   ${below ? `<div class="warnb">Минимальный заказ — ${TIERS[0][0]} шт. всего по всем вариантам товара</div>` : next ? `<div class="hintg">Добавьте ещё ${next[0] - q} шт. — цена ${fmt(disc(next[2], S.d))} сум за шт.</div>` : ""}`;
}
function rangePage() {
  return `<div class="ptwrap"><div class="bc">Главная › Одежда › Футболки</div><div class="pp"><div class="pimg">фото товара</div><div><h1>${RNAME}</h1>
   <div class="small muted">Продавец: <b>${SELL}</b> · Филиал Чиланзар · в наличии 640 шт.</div>
   <div class="bigp">от ${fmt(disc(84200, S.d))} сум ${S.d ? `<span class="old">${fmt(84200)} сум</span>` : ""}</div><div class="small">Минимальный заказ: 10 шт. всего</div>
   <div class="mt8"><b class="small">Цвет</b><div class="vpick"><span class="on">Белый</span><span>Чёрный</span><span>Бежевый</span></div></div>
   ${rangeBuy()}
   <div class="row mt8" style="gap:10px"><button class="btn pri big">Добавить в корзину</button></div>
   <div class="row mt8 small" style="gap:6px"><span>Демо: скидка</span><button class="btn out sm" data-a="d0">нет</button><button class="btn out sm" data-a="d10">10 %</button></div>
   <p class="small muted">«Купить сейчас» скрыт для товаров по диапазонам до решения PT20 ⚑ OQ-PT24.</p></div></div></div>`;
}
function fixedPage() {
  return `<div class="ptwrap"><div class="bc">Главная › Одежда › Футболки</div><div class="pp"><div class="pimg">фото товара</div><div><h1>Футболка базовая, хлопок 160 г/м²</h1>
   <div class="small muted">Продавец: ТехноТекстиль · Филиал Юнусабад</div><div class="bigp">32 000 сум</div><div class="small">Минимальный заказ: 20 шт.</div>
   <div class="row mt8" style="gap:14px;align-items:center"><span class="stp"><button data-a="fm">−</button><input id="fq" value="${S.fq}"><button data-a="fp">+</button></span><b>${fmt(32000 * S.fq)} сум</b></div>
   ${S.fErr ? `<div class="errb">${S.fErr}</div>` : ""}<div class="row mt8" style="gap:10px"><button class="btn pri big">Добавить в корзину</button><button class="btn out big">Купить сейчас</button></div>
   <p class="small muted">Type a number below 20 in the stepper and leave the field: it is refused and returns to 20. Any quantity ≥ 20 is accepted up to the branch stock (fixes F-PT1).</p></div></div></div>`;
}
function negPage() {
  return `<div class="ptwrap"><div class="bc">Главная › Одежда › Футболки</div><div class="pp"><div class="pimg">фото товара</div><div><h1>Футболка хлопковая базовая, 180 г/м²</h1>
   <div class="small muted">Продавец: Ташкент Текстиль</div><div class="bigp">Договорная цена</div><div class="small">Минимальный заказ: 50 шт.</div>
   <div class="row mt8"><button class="btn pri big">✉ Написать продавцу</button></div><p class="small muted">The chat and the price offer are in prototype P-PT3 (<a href="p-pt3-negotiation.html?s=0">open</a>).</p></div></div></div>`;
}
// ---------------- cart
function L(id, v, q, br, sel, x) { return Object.assign({ id, v, q, br: br || "A", sel: sel !== false, type: "R" }, x || {}); }
function cartPage() {
  const groups = {};
  S.lines.forEach(l => (groups[l.br] = groups[l.br] || []).push(l));
  let tot = 0, h = "";
  for (const br of Object.keys(groups)) {
    const ls = groups[br], rl = ls.filter(l => l.type === "R" && l.sel && !l.aside);
    const tq = rl.reduce((a, l) => a + l.q, 0), ti = tierOf(tq), below = tq > 0 && tq < TIERS[0][0];
    const up = disc(TIERS[below ? 0 : ti][2], S.d), next = TIERS[ti + 1];
    h += `<div class="cgrp"><div class="gh"><span>${SELL} · ${br === "A" ? "Филиал Чиланзар" : "Склад Сергели"}</span><span class="small muted">один филиал = один заказ</span></div>`;
    for (const l of ls) {
      const own = disc(TIERS[l.q < TIERS[0][0] ? 0 : tierOf(l.q)][2], S.d);
      const p = l.type === "F" ? l.p : l.sel ? up : own;
      if (l.sel && !l.aside) tot += p * l.q;
      h += `<div class="cl" style="${l.aside ? "opacity:.5" : ""}"><input type="checkbox" data-a="sel" data-i="${l.id}" ${l.sel ? "checked" : ""}><span class="th"></span><div>${l.type === "F" ? l.t : RNAME}<div class="small muted">${l.type === "F" ? "Фиксированная цена" : "Цвет: " + l.v}${l.aside ? " · <b>Нет в наличии</b>" : ""}</div></div>
        <span class="stp"><button data-a="m" data-i="${l.id}">−</button><input value="${l.q}" data-q="${l.id}"><button data-a="p" data-i="${l.id}">+</button></span>
        <div class="pr">${fmt(p * l.q)} сум<small>${S.d && l.type === "R" ? `<s>${fmt(TIERS[below ? 0 : ti][2])}</s> ` : ""}${fmt(p)} сум/шт.</small></div></div>`;
    }
    if (below) h += `<div class="errb">Минимальный заказ товара «${RNAME}» — ${TIERS[0][0]} шт. всего, сейчас ${tq} шт.</div><div class="small muted">«Оформить заказ» для этого филиала недоступно, пока не наберётся минимум.</div>`;
    else if (tq && next) h += `<div class="hintg">Добавьте ещё ${next[0] - tq} шт. — цена ${fmt(disc(next[2], S.d))} сум за шт.</div>`;
    if (tq) h += `<div class="small muted">Цена по диапазону для ${tq} шт. (сумма выбранных вариантов этого филиала).</div>`;
    h += `<div class="row mt8" style="justify-content:flex-end"><button class="btn pri" data-a="checkout" ${below || !tq && !ls.some(l => l.type === "F" && l.sel) ? "disabled" : ""}>Оформить заказ</button></div></div>`;
  }
  const dlg = S.payDlg ? `<div class="modal-bg"><div class="modal"><h3>Цена изменилась</h3><p class="sub">${S.payDlg}</p><div class="acts"><button class="btn out" data-a="pno">Отмена</button><button class="btn pri" data-a="pyes">Продолжить</button></div></div></div>` : "";
  return `<div class="ptwrap"><h2 style="margin:0 0 14px">${S.checkout ? "Оформление заказа" : "Корзина"}</h2><div class="cart"><div>${h}</div><div class="aside-sum"><b>Итого по выбранным</b><div class="r" style="font-weight:700;font-size:16px"><span>Итого</span><span>${fmt(tot)} сум</span></div>
   ${S.checkout ? `<button class="btn pri big" style="width:100%" data-a="pay">Оплатить</button>` : ""}<div class="small muted mt8">Tiers: 10 – 99 · 90 800; 100 – 499 · 88 420; 500+ · 84 200. Change quantities, tick or untick lines to see the recalculation.</div></div></div></div>${dlg}`;
}
// ---------------- search / filters
function searchPage() {
  let list = PRODS.map((p, i) => Object.assign({ i }, p));
  const from = +S.pfrom || 0, to = +S.pto || 0, priced = from || to;
  if (S.neg) list = list.filter(p => p.type === "N");
  else if (priced) list = list.filter(p => p.type !== "N" && (!from || p.p >= from) && (!to || p.p <= to));
  if (S.sort !== "pop") { const pr = list.filter(p => p.type !== "N").sort((a, b) => S.sort === "asc" ? a.p - b.p : b.p - a.p); list = pr.concat(list.filter(p => p.type === "N")); }
  return `<div class="ptwrap"><div class="srchp"><div class="fpanel"><b>Фильтры</b><h5>Цена, сум</h5><div class="row" style="gap:6px"><input type="number" id="pf" placeholder="от" value="${S.pfrom}" ${S.neg ? "disabled" : ""}><input type="number" id="pt" placeholder="до" value="${S.pto}" ${S.neg ? "disabled" : ""}></div>
   ${S.neg ? `<div class="small muted mt8">Не используется с договорной ценой</div>` : ""}
   <h5>Договорная цена</h5><label class="row small" style="gap:8px"><span class="toggle ${S.neg ? "on" : ""}" data-a="neg"></span> Только с договорной ценой</label>
   <h5>В наличии</h5><label class="row small"><input type="checkbox" checked> В наличии</label><button class="btn out sm mt8" data-a="apply">Показать</button></div>
   <div><div class="sortb"><span>Сортировка:</span>${[["pop", "Популярные"], ["asc", "Дешевле"], ["desc", "Дороже"]].map(s => `<button class="btn ${S.sort === s[0] ? "pri" : "out"} sm" data-a="sort" data-s="${s[0]}">${s[1]}</button>`).join("")}<span class="sp"></span><span class="muted">${list.length} товаров</span></div>
   <div class="grid-cards" style="grid-template-columns:repeat(3,1fr)">${list.map(card).join("") || "<p>Ничего не найдено.</p>"}</div></div></div></div>`;
}
function appPage() {
  return `<div class="phonewrap"><div class="phone"><div class="sb"><span>9:41</span><span>▮▮▮ ◔</span></div><div style="padding:12px 14px;background:#fff">
   <div class="pimg" style="aspect-ratio:16/10">фото</div><h3 style="margin:10px 0 2px;font-size:16px">${RNAME}</h3><div class="bigp" style="font-size:20px;margin:4px 0">от 84 200 сум</div><div class="small">Минимальный заказ: 10 шт. всего</div>
   ${rangeBuy(true)}</div><div class="botbar"><button class="btn pri" style="width:100%;justify-content:center">Добавить в корзину</button></div>
   <div class="tabbar"><span>Главная</span><span class="on">Каталог</span><span>Корзина</span><span>Заказы</span><span>Профиль</span></div></div></div>`;
}
// ---------------- events
document.addEventListener("click", e => {
  const t = e.target.closest("[data-a]"); if (!t) return; const a = t.dataset.a, id = t.dataset.i;
  const ln = id ? S.lines.find(l => l.id === id) : null;
  if (a === "qm") S.q = Math.max(1, S.q - 10); else if (a === "qp") S.q += 10;
  else if (a === "d0") S.d = 0; else if (a === "d10") S.d = 10;
  else if (a === "fm") { if (S.fq - 1 < 20) { S.fErr = "Минимальный заказ — 20 шт."; } else S.fq--; }
  else if (a === "fp") { S.fq++; S.fErr = ""; }
  else if (a === "sel") ln.sel = !ln.sel; else if (a === "m") ln.q = Math.max(1, ln.q - 10); else if (a === "p") ln.q += 10;
  else if (a === "checkout") S.checkout = true;
  else if (a === "pay") {
    if (S.changeAt) { S.changeAt(); render(); return; }
    toast("Оплата началась (Paylov)"); return;
  }
  else if (a === "pno") { S.payDlg = false; } else if (a === "pyes") { S.payDlg = false; toast("Оплата по новым ценам"); }
  else if (a === "neg") { S.neg = !S.neg; } else if (a === "sort") S.sort = t.dataset.s;
  else if (a === "apply") { S.pfrom = $("#pf").value; S.pto = $("#pt").value; }
  else return;
  render();
});
document.addEventListener("change", e => {
  const t = e.target;
  if (t.id === "q") { S.q = Math.max(1, parseInt(t.value) || 1); render(); }
  if (t.id === "fq") { const v = parseInt(t.value) || 0; if (v < 20) { S.fErr = "Минимальный заказ — 20 шт."; S.fq = 20; } else { S.fq = v; S.fErr = ""; } render(); }
  if (t.dataset.q) { const l = S.lines.find(x => x.id === t.dataset.q); l.q = Math.max(1, parseInt(t.value) || 1); render(); }
});
const SC = [
 { label: "Catalogue · cards of each type", apply: () => base({ view: "cards" }), notes: ["Fixed «X сум» (old price struck through when discounted; «мин. заказ» when above 1).", "Range «от X сум» = cheapest tier after discount + «от N шт.» = product minimum (PT12).", "Negotiable «Договорная цена», no price; its button opens the chat."], src: "US-BF-3.5-01 AC1" },
 { label: "Product page · range tiers", apply: () => base({ view: "range", q: 60 }), notes: ["Every tier as a row; the row of the stepper quantity is highlighted (PT13).", "Hint «Добавьте ещё N шт. — цена X» when a next tier exists (PT15). Note M-PT10 under the rows.", "Below 10 the note M-PT47 replaces the hint (⚑ OQ-PT7). The page counts only its own stepper (⚑ OQ-PT6). Try the 10 % discount demo."], src: "US-BF-3.5-01 AC2, AC3" },
 { label: "Product page · fixed, minimum order", apply: () => base({ view: "fixed", fq: 20 }), notes: ["«Минимальный заказ: 20 шт.»; the stepper starts at 20; below 20 is refused with M-PT7 and returns to 20.", "Any quantity above the minimum is accepted up to the branch stock — today the cart refuses it (F-PT1)."], src: "US-BF-3.5-01 AC4 · US-SF-2.2-04 AC9" },
 { label: "Product page · negotiable", apply: () => base({ view: "neg" }), notes: ["«Договорная цена», minimum when above 1, «Написать продавцу»; no cart or «Купить сейчас» buttons (PT13). The chat is in P-PT3."], src: "US-BF-3.5-01 AC6" },
 { label: "Cart · tier by product total", apply: () => base({ view: "cart", lines: [L("r", "Белый", 60), L("b", "Чёрный", 60)] }), notes: ["White 60 + black 60 at one branch = 120 → tier 100 – 499 for both lines: 88 420 (example R2).", "Change a quantity with − / +: every line of the product updates at once. Hint names the next tier."], src: "US-BF-5.1-03 AC1, AC4 · R2" },
 { label: "Cart · unselected line", apply: () => base({ view: "cart", lines: [L("r", "Белый", 60), L("b", "Чёрный", 60, "A", false)] }), notes: ["Black is unticked: it no longer counts. White is priced for 60 → 90 800; the unticked line shows the price for its own 60 (example R4, ⚑ OQ-PT6)."], src: "US-BF-5.1-03 AC2 · R4" },
 { label: "Cart · below the minimum", apply: () => base({ view: "cart", lines: [L("r", "Белый", 5), L("b", "Чёрный", 3)] }), notes: ["5 + 3 = 8 < minimum 10: lines priced at tier 1 (90 800), M-PT8 and «Оформить заказ» disabled for this branch (example R5).", "Raise one line to reach 10 in total: allowed (R6, ⚑ OQ-PT7)."], src: "US-BF-5.1-03 AC5 · R5, R6" },
 { label: "Cart · two branches", apply: () => base({ view: "cart", lines: [L("r", "Белый", 60, "A"), L("b", "Чёрный", 60, "B")] }), notes: ["The same product in two branch groups: each group has its own tier quantity (60 → 90 800 each) and becomes its own order (PT16, example R3)."], src: "US-BF-5.1-03 AC3 · R3" },
 { label: "«Оплатить» · price changed", apply: () => base({ view: "cart", checkout: true, lines: [L("r", "Белый", 60), L("b", "Чёрный", 60)], changeAt: () => { S.lines[1].aside = true; S.payDlg = "Цена изменилась: 88 420 → 90 800 сум за шт. Продолжить оплату?"; } }), notes: ["Click «Оплатить»: black is short at the branch and set aside, so white falls to the 10 – 99 tier. Payment does not start; M-PT33 asks to confirm the new price (example R13, ⚑ OQ-PT8).", "The same dialog appears when the seller edits the tiers during checkout (R9)."], src: "US-BF-5.1-03 AC9, AC10 · R9, R13" },
 { label: "Search · price filter, «Договорная цена», sort", apply: () => base({ view: "search" }), notes: ["Set «до 90 000» and «Показать»: negotiable products disappear; the range product «от 84 200» stays (PT17).", "Toggle «Только с договорной ценой»: only negotiable products; price fields disabled (PT18, T13).", "Sort «Дешевле» / «Дороже»: negotiable products always last."], src: "US-BF-2.4-04" },
 { label: "Buyer app · product page tiers", apply: () => base({ view: "app", q: 60 }), notes: ["Same tiers, highlight, hint and minimum note in the buyer app."], src: "US-BF-3.5-01 AC10" },
];
harness({ title: "P-PT4 Buyer: prices, tiers, cart and filters", stories: "US-BF-3.5-01, US-BF-5.1-03, US-BF-2.4-04, US-SF-2.2-04", version: "1.0" }, SC);
