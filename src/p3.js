// P-PT3 Negotiation: product chat, price offer, answer, cart, order, admin, notifications. Example data only.
const PROD = "Футболка хлопковая базовая, 180 г/м²", SELL = "Ташкент Текстиль", BUYER = "Азиз Хамидов", SUSER = "Камола Р.";
const BRS = { ch: "Филиал Чиланзар, Ташкент", se: "Склад Сергели, Ташкент" };
const STOCK = { ch: { w: 500, b: 300, n: 0 }, se: { w: 120, b: 80, n: 400 } };
const VN = { w: "Белый", b: "Чёрный", n: "Синий" };
const MOQ = 50;
const LBL = { 1: ["Ожидает ответа", "g"], 2: ["Принято, ждёт оплаты", "b"], 3: ["Оплачено", "v"], 4: ["Отклонено", "r"], 5: ["Отозвано продавцом", "n"], 6: ["Заменено новым предложением", "n"], 7: ["Истекло", "n"], 8: ["Недоступно", "a"] };
const pill = (l, c) => `<span class="pill ${c}">${l}</span>`;
const fmt = n => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ").replace(/ /g, " ");
const tot = o => o.lines.reduce((a, l) => a + l[1] * l[2], 0), qty = o => o.lines.reduce((a, l) => a + l[1], 0);
let S = {};
function O(no, st, lines, x) { return Object.assign({ no, st, br: "ch", lines, days: 3, sent: "14.11.2026 15:20", exp: "17.11.2026", cmt: "", by: SUSER, reason: "", left: "", ev: [["14.11.2026 15:20", "Sent", "Продавец · " + SUSER]] }, x || {}); }
const A0 = () => O(100244, 6, [["w", 200, 41000], ["b", 100, 43000]], { cmt: "Доставка нашим транспортом по Ташкенту бесплатно.", ev: [["14.11.2026 15:20", "Sent", "Продавец · Камола Р."], ["14.11.2026 16:05", "Replaced (by № 100245)", "Продавец · Камола Р."]] });
const B0 = () => O(100245, 1, [["w", 200, 40000], ["b", 100, 43000]], { sent: "14.11.2026 16:05", cmt: "Цена на белые снижена до 40 000.", ev: [["14.11.2026 16:05", "Sent", "Продавец · Камола Р."]] });
function base(o) {
  closeModal();
  S = Object.assign({ view: "bchat", side: "b", chat: true, offers: [], msgs: [], cart: null, form: null, short: false, order: null, flt: "all", ask: null, hist: true }, o || {});
  render();
}
const off = no => S.offers.find(o => o.no === no);
const pend = () => S.offers.find(o => o.st === 1), acc = () => S.offers.find(o => o.st === 2);
function stdMsgs(withB) {
  const m = [{ k: "card" }, { k: "t", me: "b", t: "Здравствуйте! Нужно 200 белых и 100 чёрных, размеры M–XL. Какая будет цена?", tm: "14:58" },
    { k: "t", me: "s", t: "Добрый день! Сейчас пришлю предложение.", tm: "15:12" }, { k: "o", no: 100244 },
    { k: "t", me: "b", t: "Сделайте 40 000 за белые — возьмём сразу.", tm: "15:48" }];
  if (withB) m.push({ k: "o", no: 100245 });
  return m;
}
// ---------------------------------------------------------------- shells
function bHeader() {
  return `<div class="strip"><span>➤ Ташкент, Юнусабад, 4-й квартал, 21</span><span>О компании · Связаться с нами · Доставка и оплата</span></div>
  <div class="bh">${LOGO}<button class="btn pri">☰ Каталог</button><div class="srch"><input placeholder="Что вы ищете?"><button>Найти</button></div><span class="small">Русский · Избранное · <a data-a="tocart">Корзина</a> · <a data-a="tochat">Сообщения</a> · <b>Профиль</b></span></div>`;
}
function render() {
  const v = S.view; let h = "";
  if (v === "bprod") h = bHeader() + bProd();
  else if (v === "bchat") h = bHeader() + `<div class="ptwrap"><div class="bc">Профиль › Сообщения</div>${chatBox("b")}</div>`;
  else if (v === "schat") h = sellerShell("ch", "Чаты › <b>" + BUYER + "</b>", `<div style="padding:18px 22px">${chatBox("s")}</div>`) + (S.form ? formPanel() : "");
  else if (v === "cart") h = bHeader() + cartPage();
  else if (v === "order") h = bHeader() + orderPage();
  else if (v === "slist") h = sellerShell("ch", "Чаты › <b>Предложения цены</b>", sList());
  else if (v === "admin") h = adminPage();
  else if (v === "app") h = appPage();
  else if (v === "notif") h = notifPage();
  $("#app").innerHTML = h;
  const cb = $(".cbody"); if (cb) cb.scrollTop = cb.scrollHeight;
}
// ---------------------------------------------------------------- buyer product page
function bProd() {
  return `<div class="ptwrap"><div class="bc">Главная › Одежда › Футболки</div><div class="pp"><div class="pimg">фото товара</div><div>
    <h1>${PROD}</h1><div class="small muted">Продавец: <b>${SELL}</b> · ★ 4.8 · Ташкент</div>
    <div class="bigp">Договорная цена</div><div class="small">Минимальный заказ: ${MOQ} шт.</div>
    <div class="mt8"><b class="small">Цвет</b><div class="vpick"><span class="on">Белый</span><span>Чёрный</span><span>Синий</span></div></div>
    <div class="infob">Цену продавец предложит в чате. Принятое предложение вы оплатите на Optom, как обычный заказ.</div>
    <div class="row mt8" style="gap:10px"><button class="btn pri big" data-a="write">✉ Написать продавцу</button></div>
    <p class="small muted mt8">Нет кнопок «Добавить в корзину» и «Купить сейчас» (PT13).</p></div></div></div>`;
}
// ---------------------------------------------------------------- chat
function chatList(side) {
  const other = side === "b" ? SELL : BUYER;
  return `<div class="clist"><div style="padding:12px 14px;font-weight:600">Сообщения</div>
    <div class="ci on"><span class="th"></span><div><b>${other}</b><small>${PROD.slice(0, 30)}…</small><small>Предложение цены</small></div></div>
    <div class="ci"><span class="th" style="background:#eee"></span><div><b>${side === "b" ? "ТехноОпт" : "Нодира С."}</b><small>Заказ №68726458</small></div></div></div>`;
}
function chatBox(side) {
  const other = side === "b" ? SELL : BUYER;
  const neg = S.negOff ? false : true;
  const head = `<div class="chead"><span class="th"></span><div><b>${PROD}</b><div class="small muted">${neg ? "Договорная цена" : "Цена по диапазонам"} · <a>открыть товар</a> · ${other}</div></div><span class="sp"></span>
    ${side === "s" ? (neg ? `<button class="btn pri" data-a="propose">₸ Предложить цену</button>` : `<span class="small muted">«Предложить цену» скрыта: товар больше не договорной</span>`) : ""}
    ${side === "s" ? `<button class="btn out sm" data-a="toslist">Все предложения</button>` : ""}</div>`;
  let body = "";
  if (!S.chat) body = `<div class="sysm">Новый чат</div>`;
  for (const m of S.msgs) {
    if (m.k === "card") body += `<div class="pcm"><span class="th"></span><div><b class="small">${PROD}</b><div class="small">Договорная цена · мин. заказ ${MOQ} шт.</div><a class="small">Открыть товар</a></div></div>`;
    else if (m.k === "t") body += `<div class="msg ${m.me === side ? "me" : ""}">${esc(m.t)}<small>${m.tm}</small></div>`;
    else if (m.k === "sys") body += `<div class="sysm">${esc(m.t)}</div>`;
    else if (m.k === "o") body += offerCard(off(m.no), side);
  }
  const ph = side === "b" && S.msgs.length <= 1 ? "Напишите, какие варианты и сколько штук нужно" : "Сообщение…";
  return `<div class="chatw">${chatList(side)}<div class="cmain">${head}<div class="cbody">${body}</div>
    <div class="cinput"><input id="msgin" placeholder="${ph}" ${S.focus ? "autofocus" : ""}><button class="btn pri" data-a="send">Отправить</button></div></div></div>`;
}
function offerCard(o, side, ro) {
  if (!o) return "";
  const dead = [4, 5, 6, 7, 8].includes(o.st);
  const lab = o.st === 3 ? `Оплачено · заказ № ${S.order || "68731205"}` : LBL[o.st][0];
  const lines = o.lines.map(l => `<div class="ln"><span>${VN[l[0]]}</span><span>${fmt(l[1])} шт. × ${fmt(l[2])} сум = <b>${fmt(l[1] * l[2])} сум</b></span></div>`).join("");
  let acts = "";
  if (!ro) {
    if (side === "b") {
      if (o.st === 1) acts = `<button class="btn pri" data-a="accept" data-n="${o.no}">Принять</button><button class="btn out" data-a="reject" data-n="${o.no}">Отклонить</button>`;
      if (o.st === 2) acts = (S.cart && S.cart.offer === o.no && !S.cart.removed ? `<button class="btn pri" data-a="tocart">Перейти в корзину</button>` : `<button class="btn pri" data-a="readd" data-n="${o.no}">Добавить в корзину</button>`)
        + `<button class="btn out" data-a="decline" data-n="${o.no}" ${S.paying ? "disabled title='Идёт оплата'" : ""}>Отказаться</button>${S.paying ? '<span class="small muted">Идёт оплата</span>' : ""}`;
      if (o.st === 3) acts = `<button class="btn out" data-a="toorder">Заказ № ${S.order || "68731205"}</button>`;
    } else {
      if (o.st === 1) acts = `<button class="btn out" data-a="withdraw" data-n="${o.no}">Отозвать</button>`;
      if (o.st === 2) acts = `<span class="small">Принято, ждёт оплаты до ${o.exp} 23:59</span>`;
      if (o.st === 3) acts = `<button class="btn out" data-a="toorder">Заказ № ${S.order || "68731205"}</button>`;
    }
  }
  const cd = (o.st === 1 || o.st === 2) && o.left ? `<span class="cd">Осталось ${o.left} ч</span>` : "";
  const rs = o.st === 4 && o.reason ? `<div class="cmt">Причина: ${esc(o.reason)}</div>` : "";
  const me = side === "s" ? "me" : "them";
  return `<div class="ofr ${me} ${dead ? "dead" : ""}"><h4><span>Предложение цены № ${o.no}</span>${pill(lab, LBL[o.st][1])}</h4>${lines}
    <div class="tot"><span>Итого · ${fmt(qty(o))} шт.</span><span>${fmt(tot(o))} сум</span></div>
    <div class="meta">${BRS[o.br]} · Действует до ${o.exp} 23:59 ${cd}${side === "s" ? " · Отправил: " + o.by : ""}</div>
    ${o.cmt ? `<div class="cmt">${esc(o.cmt)}</div>` : ""}${rs}${acts ? `<div class="acts">${acts}</div>` : ""}</div>`;
}
// ---------------------------------------------------------------- offer form (seller)
function newForm(pre) {
  if (pre) return { br: pre.br, lines: pre.lines.map(l => ({ v: l[0], q: l[1], p: l[2] })), days: pre.days, cmt: pre.cmt, errs: {}, replace: pre.no };
  return { br: "ch", lines: [{ v: "", q: "", p: "" }], days: 3, cmt: "", errs: {}, replace: null };
}
function untilDate(d) { return { 1: "15.11.2026", 3: "17.11.2026", 7: "21.11.2026" }[d]; }
function formPanel() {
  const f = S.form, used = f.lines.map(l => l.v);
  const ac = acc();
  const rows = f.lines.map((l, i) => {
    const e = f.errs[i] || {};
    const opts = `<option value="">Вариант…</option>` + Object.keys(VN).map(k => `<option value="${k}" ${l.v === k ? "selected" : ""} ${used.includes(k) && l.v !== k ? "disabled" : ""}>${VN[k]} (${STOCK[f.br][k]} шт.)</option>`).join("");
    const lt = (+l.q || 0) * (+l.p || 0);
    return `<div class="oline"><select data-f="v" data-i="${i}" class="${e.v ? "e" : ""}">${opts}</select>
      <input data-f="q" data-i="${i}" placeholder="Кол-во" value="${l.q}" class="${e.q ? "e" : ""}"><input data-f="p" data-i="${i}" placeholder="Цена за шт." value="${l.p ? fmt(l.p) : ""}" class="${e.p ? "e" : ""}">
      <div class="lt">${lt ? fmt(lt) : "—"}</div><button class="x" data-a="dline" data-i="${i}" title="Удалить">×</button>
      ${e.t ? `<div class="et">${e.t}</div>` : ""}</div>`;
  }).join("");
  const T = f.lines.reduce((a, l) => a + (+l.q || 0) * (+l.p || 0), 0), Q = f.lines.reduce((a, l) => a + (+l.q || 0), 0);
  return `<div class="modal-bg" style="background:rgba(16,18,22,.25)"></div><div class="ofp"><div class="hd"><b style="font-size:16px">${f.replace ? "Новое предложение вместо № " + f.replace : "Предложение цены"}</b><button class="btn link" data-a="fclose">✕</button></div>
   <div class="bd">${ac && !f.replace ? `<div class="infob">Покупатель принял предложение № ${ac.no}. Оно действует, пока покупатель не примет новое или не оплатит его.</div>` : ""}
   <div class="small muted">Товар</div><b>${PROD}</b>
   <div class="field mt8"><label class="small muted">Филиал</label><select data-f="br">${Object.keys(BRS).map(k => `<option value="${k}" ${f.br === k ? "selected" : ""}>${BRS[k]}</option>`).join("")}</select></div>
   <div class="oline small muted" style="margin-bottom:-4px"><span>Вариант</span><span>Количество, шт.</span><span>Цена за шт., сум</span><span style="text-align:right">Сумма</span><span></span></div>${rows}
   <button class="btn out sm" data-a="aline" ${f.lines.length >= 20 ? "disabled" : ""}>+ Добавить позицию</button>
   <div class="row mt8" style="justify-content:space-between;font-weight:700;border-top:1px solid var(--line);padding-top:10px"><span>Итого · ${fmt(Q)} шт.</span><span>${fmt(T)} сум</span></div>
   <div class="field mt8"><label class="small muted">Срок действия</label><div class="segm">${[1, 3, 7].map(d => `<span data-a="days" data-d="${d}" class="${f.days === d ? "on" : ""}">${d} ${d === 1 ? "день" : d === 3 ? "дня" : "дней"}</span>`).join("")}</div>
     <div class="small muted mt8">Действует до ${untilDate(f.days)} 23:59 (Ташкент)</div></div>
   <div class="field mt8"><label class="small muted">Комментарий (необязательно)</label><textarea data-f="cmt" rows="3" maxlength="500">${esc(f.cmt)}</textarea><div class="small muted">${f.cmt.length} / 500</div></div>
   ${f.banner ? `<div class="errb">${f.banner}</div>` : ""}</div>
   <div class="ft"><button class="btn out" data-a="fclose">Отмена</button><button class="btn pri" data-a="fsend">Отправить предложение</button></div></div>`;
}
function validate() {
  const f = S.form; f.errs = {}; let bad = false;
  const seen = {};
  f.lines.forEach((l, i) => {
    const e = {};
    if (!l.v) { e.v = 1; e.t = "Выберите вариант"; }
    else if (seen[l.v]) { e.v = 1; e.t = "Этот вариант уже есть в предложении"; }
    seen[l.v] = 1;
    const q = +l.q, p = +l.p;
    if (!e.t && (!q || q < 1 || q > 100000)) { e.q = 1; e.t = "Количество — от 1 до 100 000 шт."; }
    else if (!e.t && q > STOCK[f.br][l.v]) { e.q = 1; e.t = `На складе филиала «${BRS[f.br].split(",")[0].replace(/^(Филиал|Склад) /, "")}» только ${STOCK[f.br][l.v]} шт. «${VN[l.v]}»`; }
    if (!e.t && (!p || p < 1 || p > 999999999)) { e.p = 1; e.t = p ? "Цена за шт. — от 1 до 999 999 999 сум" : "Укажите цену"; }
    if (e.t) { f.errs[i] = e; bad = true; }
  });
  f.banner = bad ? "Исправьте ошибки в позициях." : "";
  return !bad;
}
function sendOffer() {
  const f = S.form;
  const no = 100245 + S.offers.filter(o => o.no > 100245).length + 1;
  const p = pend();
  if (p) { p.st = 6; p.ev.push(["14.11.2026 17:02", "Replaced (by № " + no + ")", "Продавец · " + SUSER]); }
  const o = O(no, 1, f.lines.map(l => [l.v, +l.q, +l.p]), { br: f.br, days: f.days, exp: untilDate(f.days), cmt: f.cmt, sent: "14.11.2026 17:02", ev: [["14.11.2026 17:02", "Sent", "Продавец · " + SUSER]] });
  S.offers.push(o); S.msgs.push({ k: "o", no }); S.form = null; closeModal(); render(); toast("Предложение № " + no + " отправлено");
}
// ---------------------------------------------------------------- cart / order
function cartPage() {
  const o = S.cart && off(S.cart.offer);
  const inCart = o && !S.cart.removed && o.st === 2;
  const aside = o && (o.st === 7 || o.st === 8) && !S.cart.removed;
  const extra = S.cart && S.cart.extra;
  const ex = { t: "Сумка-шопер хлопковая", q: 100, p: 12000 };
  let groups = "";
  if (inCart || extra) {
    groups += `<div class="cgrp"><div class="gh"><span>${SELL} · Филиал Чиланзар</span><span class="small muted">Отправка из: Филиал Чиланзар</span></div>`;
    if (inCart) groups += `<div class="offg"><div class="oh"><span><input type="checkbox" checked> 🔒 Цена по договорённости · предложение № ${o.no} · оплатить до ${o.exp} 23:59</span><a data-a="cdel">Удалить</a></div>
      ${o.lines.map(l => `<div class="cl"><span></span><span class="th"></span><div>${PROD}<div class="small muted">Цвет: ${VN[l[0]]}</div></div><span class="stp lock"><button disabled>−</button><input value="${l[1]}" disabled><button disabled>+</button></span><div class="pr">${fmt(l[1] * l[2])} сум<small>${fmt(l[2])} сум/шт.</small></div></div>`).join("")}
      <div class="small muted">Количество, цена и филиал заданы предложением и не меняются. Промокоды не применяются.</div></div>`;
    if (extra) groups += `<div class="cl"><input type="checkbox" checked><span class="th" style="background:#e8e2d6"></span><div>${ex.t}<div class="small muted">Фиксированная цена · мин. заказ 50 шт.</div></div><span class="stp"><button>−</button><input value="${ex.q}"><button>+</button></span><div class="pr">${fmt(ex.q * ex.p)} сум<small>${fmt(ex.p)} сум/шт.</small></div></div>`;
    groups += `</div>`;
  }
  let sa = "";
  if (aside) sa = `<div class="setaside"><b>Нет в наличии</b><div class="offg" style="opacity:.75"><div class="oh"><span>Цена по договорённости · предложение № ${o.no}</span><a data-a="cdel">Удалить</a></div>
      ${o.lines.map(l => `<div class="small">${VN[l[0]]} · ${l[1]} шт. × ${fmt(l[2])} сум</div>`).join("")}
      <div class="${o.st === 7 ? "warnb" : "errb"}">${o.st === 7 ? "Предложение истекло. Попросите продавца прислать новое." : "Предложение больше недоступно"} <a data-a="tochat">Открыть чат</a></div><div class="small muted">Строки удалятся из корзины через 7 дней ⚑ OQ-PT12.</div></div></div>`;
  if (S.short && inCart) sa = `<div class="setaside"><b>Нет в наличии</b><div class="errb">Сейчас на складе только 150 шт. «Белый». Попросите продавца прислать новое предложение. <a data-a="tochat">Открыть чат</a></div></div>`;
  const sum = (inCart && !S.short ? tot(o) : 0) + (extra ? ex.q * ex.p : 0);
  const empty = !groups && !sa ? `<div class="cgrp">Корзина пуста.</div>` : "";
  return `<div class="ptwrap"><h2 style="margin:0 0 14px">Корзина</h2><div class="cart"><div>${groups}${sa}${empty}</div>
    <div class="aside-sum"><b>Ваш заказ</b><div class="r"><span>Товары</span><span>${fmt(sum)} сум</span></div><div class="r small muted"><span>Промокод</span><span>не применяется к предложению</span></div>
    <div class="r" style="font-weight:700;font-size:16px"><span>Итого</span><span>${fmt(sum)} сум</span></div>
    <button class="btn pri big" style="width:100%" data-a="pay" ${sum ? "" : "disabled"}>Оформить и оплатить</button>
    <div class="small muted mt8">Доставка выбирается при оформлении. Для бесплатной доставки продавцом строка предложения учитывается по договорной цене и количеству.</div></div></div></div>`;
}
function orderPage() {
  const o = off(S.cart.offer);
  return `<div class="ptwrap"><div class="bc">Профиль › Заказы</div><div class="card"><h3 style="margin:0">Заказ № ${S.order}</h3><div class="small muted">Оплачен 15.11.2026 в 10:42 · ${SELL} · Филиал Чиланзар</div>
    <div class="mt8">${pill("Новый", "g")}</div>
    ${o.lines.map(l => `<div class="cl" style="grid-template-columns:52px 1fr 220px"><span class="th"></span><div>${PROD}<div class="small muted">Цвет: ${VN[l[0]]} · ${l[1]} шт.</div></div><div class="pr">${fmt(l[1] * l[2])} сум<small>${fmt(l[2])} сум/шт. · <b>Цена по договорённости</b> · <a data-a="tochat">Предложение № ${o.no}</a></small></div></div>`).join("")}
    <div class="cl" style="grid-template-columns:52px 1fr 220px"><span class="th" style="background:#e8e2d6"></span><div>Сумка-шопер хлопковая<div class="small muted">100 шт.</div></div><div class="pr">1 200 000 сум<small>12 000 сум/шт.</small></div></div>
    <div class="row mt8" style="justify-content:space-between;font-weight:700"><span>Итого</span><span>${fmt(tot(o) + 1200000)} сум</span></div></div></div>`;
}
// ---------------------------------------------------------------- seller list / admin / app / notifications
function sList() {
  const rows = [[100245, "Футболка хлопковая базовая", BUYER, 12300000, 2, "17.11.2026", SUSER, "14.11.2026 16:05"],
    [100244, "Футболка хлопковая базовая", BUYER, 12500000, 6, "17.11.2026", SUSER, "14.11.2026 15:20"],
    [100231, "Худи с начёсом", "Нодира Саидова", 18400000, 3, "12.11.2026", "Бахтиёр К.", "10.11.2026 11:02"],
    [100219, "Футболка хлопковая базовая", "ООО «Стиль Плюс»", 6200000, 4, "11.11.2026", SUSER, "08.11.2026 09:40"],
    [100204, "Поло пике", "Жасур Т.", 3150000, 7, "09.11.2026", "Бахтиёр К.", "08.11.2026 18:15"],
    [100198, "Поло пике", "Малика Р.", 2700000, 5, "07.11.2026", SUSER, "06.11.2026 12:30"]];
  const f = S.flt;
  const vis = rows.filter(r => f === "all" || (f === "act" && [1, 2].includes(r[4])) || (f === "paid" && r[4] === 3) || (f === "closed" && [4, 5, 6, 7, 8].includes(r[4])));
  return `<div style="padding:18px 22px"><div class="h1">Предложения цены</div>
   <div class="fchips">${[["all", "Все"], ["act", "Ожидают ответа и оплаты"], ["paid", "Оплачено"], ["closed", "Закрыты"]].map(c => `<span data-a="flt" data-f="${c[0]}" class="${f === c[0] ? "on" : ""}">${c[1]}</span>`).join("")}<span>Товар ▾</span><span>Период: 01.11 – 14.11.2026 ▾</span></div>
   <table class="tbl"><tr><th>№</th><th>Товар</th><th>Покупатель</th><th>Сумма</th><th>Статус</th><th>Действует до</th><th>Отправил</th><th>Отправлено</th></tr>
   ${vis.map(r => `<tr data-a="toschat" style="cursor:pointer"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${fmt(r[3])} сум</td><td>${pill(r[4] === 3 ? "Оплачено" : LBL[r[4]][0], LBL[r[4]][1])}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td></tr>`).join("") || `<tr><td colspan="8">Предложений цены пока нет. Отправьте его из чата о товаре с договорной ценой.</td></tr>`}</table>
   <p class="small muted">20 строк на странице; строка открывает чат на карточке предложения.</p></div>`;
}
function adminPage() {
  const o = off(100245), a = off(100244);
  const hist = x => `<div class="histp"><b>История предложения № ${x.no}</b>${x.ev.map(e => `<div class="it"><span>${e[0]}</span><span>${e[1]}</span><span>${e[2]}</span></div>`).join("")}</div>`;
  return `<div class="ash"><aside class="aside">${LOGO}<div class="anav">Пользователи</div><div class="anav on">Жалобы</div><div class="anav">Заказы</div><div class="anav">Товары</div></aside>
   <div class="apanel" style="padding:18px 22px"><div class="small muted">Жалобы › Чат ${BUYER} — ${SELL}</div><h1 style="font-size:20px">Чат о товаре «${PROD}» <span class="tagt">только просмотр</span></h1>
   <div class="alert i"><span>Администратор видит предложения и их историю, но не может их менять (PT37). Заблокированный чат делает открытые предложения «Недоступно».</span></div>
   <div class="row" style="align-items:flex-start;gap:20px"><div style="flex:1;display:flex;flex-direction:column;gap:10px">${offerCard(a, "a", true)}${hist(a)}</div><div style="flex:1;display:flex;flex-direction:column;gap:10px">${offerCard(o, "a", true)}${hist(o)}</div></div></div></div>`;
}
function appPage() {
  const o = off(100245);
  return `<div class="phonewrap"><div class="phone"><div class="sb"><span>9:41</span><span>▮▮▮ ◔</span></div>
   <div class="ah" style="display:flex;gap:10px;align-items:center;padding:10px 14px;background:#fff;border-bottom:1px solid var(--line)"><span>‹</span><span class="thumb"></span><div><b class="small">${SELL}</b><div class="small muted">${PROD.slice(0, 26)}… · Договорная цена</div></div></div>
   <div class="cbody" style="max-height:600px;padding:10px">${S.msgs.slice(-3).map(m => m.k === "t" ? `<div class="msg ${m.me === "b" ? "me" : ""}" style="max-width:80%">${esc(m.t)}</div>` : m.k === "o" ? offerCard(off(m.no), "b").replace('class="ofr', 'style="width:100%" class="ofr') : "").join("")}</div>
   <div class="cinput" style="padding:8px"><input placeholder="Сообщение…"><button class="btn pri sm">➤</button></div></div></div>`;
}
function notifPage() {
  const it = [["OFR-01 · покупателю", "Новое предложение цены", `${SELL}: ${PROD.slice(0, 24)}… — 12 300 000 сум. Действует до 17.11.2026 23:59`],
    ["OFR-02 · продавцу", "Предложение принято", `${BUYER} принял предложение № 100245 на 12 300 000 сум. Ждём оплаты до 17.11.2026 23:59`],
    ["OFR-03 · покупателю, 17.11 в 10:00", "Предложение истекает сегодня", `${PROD.slice(0, 24)}… — 12 300 000 сум: предложение действует до 23:59`],
    ["OFR-04 · продавцу", "Предложение истекло", `Предложение № 100245 для ${BUYER} истекло без оплаты`]];
  return `<div class="ptwrap"><div class="row" style="align-items:flex-start;gap:30px"><div><b>Сайт: список уведомлений (pull)</b><div class="nlist mt8">${it.map(i => `<div class="ni"><span class="tagt">${i[0]}</span><b>${i[1]}</b><span class="small">${i[2]}</span></div>`).join("")}</div></div>
   <div><b>Приложение: push</b><div class="phone" style="min-height:520px;background:linear-gradient(160deg,#3a4a68,#1f2738)"><div class="sb" style="background:transparent;color:#fff"><span>9:41</span><span></span></div>${it.map(i => `<div class="push"><span class="small muted">optom · сейчас</span><b>${i[1]}</b>${i[2]}</div>`).join("")}</div></div></div>
   <p class="small muted mt8">Нет SMS и e-mail. Для карточки предложения обычное уведомление «новое сообщение в чате» не отправляется ⚑ OQ-PT19. Отклонение, отзыв, отказ и «Недоступно» — без уведомлений ⚑ OQ-PT31.</p></div>`;
}
// ---------------------------------------------------------------- actions
function confirmBox(title, body, yes, onYes, danger) {
  modal(`<h3>${title}</h3>${body ? `<p class="sub">${body}</p>` : ""}<div class="acts"><button class="btn out" id="mno">Отмена</button><button class="btn ${danger ? "danfill" : "pri"}" id="myes">${yes}</button></div>`);
  $("#mno").onclick = closeModal; $("#myes").onclick = () => { closeModal(); onYes(); };
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-a]"); if (!t) return;
  const a = t.dataset.a, n = +t.dataset.n;
  if (a === "write") { S.view = "bchat"; if (!S.msgs.length) S.msgs = [{ k: "card" }]; S.chat = true; render(); toast("Чат о товаре создан"); }
  else if (a === "tochat") { S.view = S.side === "s" ? "schat" : "bchat"; render(); }
  else if (a === "tocart") { S.view = "cart"; render(); }
  else if (a === "toorder") { S.view = "order"; render(); }
  else if (a === "toslist") { S.view = "slist"; render(); }
  else if (a === "toschat") { S.view = "schat"; render(); }
  else if (a === "flt") { S.flt = t.dataset.f; render(); }
  else if (a === "send") { const v = $("#msgin").value.trim(); if (v) { S.msgs.push({ k: "t", me: S.view === "schat" ? "s" : "b", t: v, tm: "17:10" }); render(); } }
  else if (a === "propose") { S.form = newForm(pend()); render(); }
  else if (a === "fclose") { S.form = null; render(); }
  else if (a === "aline") { if (S.form.lines.length < 20) S.form.lines.push({ v: "", q: "", p: "" }); render(); }
  else if (a === "dline") { S.form.lines.splice(+t.dataset.i, 1); if (!S.form.lines.length) S.form.lines.push({ v: "", q: "", p: "" }); render(); }
  else if (a === "days") { S.form.days = +t.dataset.d; render(); }
  else if (a === "fsend") {
    if (!validate()) { render(); return; }
    const low = S.form.lines.find(l => +l.q < MOQ);
    const go2 = () => { const p = pend(); if (p) confirmBox("Заменить предложение?", `Новое предложение заменит предложение № ${p.no}. Отправить?`, "Отправить", sendOffer); else sendOffer(); };
    if (low) confirmBox("Меньше минимального заказа", `Меньше минимального заказа (${MOQ} шт.). Всё равно отправить?`, "Отправить", go2); else go2();
  }
  else if (a === "withdraw") confirmBox("Отозвать предложение?", `Отозвать предложение № ${n}? Покупатель не сможет его принять.`, "Отозвать", () => { const o = off(n); o.st = 5; o.ev.push(["14.11.2026 17:20", "Withdrawn", "Продавец · " + SUSER]); S.msgs.push({ k: "sys", t: `Продавец отозвал предложение № ${n}` }); render(); }, true);
  else if (a === "accept") {
    const o = off(n);
    confirmBox("Принять предложение?", `Товары на ${fmt(tot(o))} сум попадут в корзину. Оплатить нужно до ${o.exp} 23:59.`, "Принять", () => {
      if (S.short) { toast("Сейчас на складе только 150 шт. «Белый». Попросите продавца прислать новое предложение."); modal(`<h3>Не удалось принять</h3><p class="sub">Сейчас на складе только 150 шт. «Белый». Попросите продавца прислать новое предложение.</p><div class="acts"><button class="btn pri" id="mno">Понятно</button></div>`); $("#mno").onclick = closeModal; return; }
      const prev = acc(); if (prev) { prev.st = 6; prev.ev.push(["15.11.2026 09:30", "Replaced (buyer accepted № " + n + ")", "Покупатель"]); }
      o.st = 2; o.ev.push(["15.11.2026 09:30", "Accepted", "Покупатель · " + BUYER]); S.cart = { offer: n, removed: false, extra: S.cart ? S.cart.extra : false };
      render(); toast("Предложение принято и добавлено в корзину");
    });
  }
  else if (a === "reject") {
    modal(`<h3>Отклонить предложение?</h3><p class="sub">Укажите причину, если хотите.</p><div class="fchips" id="rch">${["Высокая цена", "Не подходит количество", "Не подходят условия", "Уже не нужно", "Другое"].map(r => `<span>${r}</span>`).join("")}</div>
      <textarea id="rcm" rows="3" maxlength="300" style="width:100%;border:1px solid var(--line-2);border-radius:9px;padding:8px" placeholder="Комментарий (необязательно)"></textarea>
      <div class="acts"><button class="btn out" id="mno">Отмена</button><button class="btn danfill" id="myes">Отклонить</button></div>`);
    let r = "";
    document.querySelectorAll("#rch span").forEach(s => s.onclick = () => { document.querySelectorAll("#rch span").forEach(x => x.classList.remove("on")); if (r === s.textContent) { r = ""; } else { r = s.textContent; s.classList.add("on"); } });
    $("#mno").onclick = closeModal;
    $("#myes").onclick = () => { const o = off(n); o.st = 4; o.reason = r; o.ev.push(["15.11.2026 09:31", "Rejected" + (r ? " · " + r : ""), "Покупатель · " + BUYER]); S.msgs.push({ k: "sys", t: r ? `Покупатель отклонил предложение № ${n}: ${r}` : `Покупатель отклонил предложение № ${n}` }); closeModal(); render(); };
  }
  else if (a === "decline") confirmBox(`Отказаться от принятого предложения № ${n}?`, "Товары предложения будут удалены из корзины.", "Отказаться", () => { const o = off(n); o.st = 4; o.reason = ""; o.ev.push(["15.11.2026 11:00", "Declined", "Покупатель · " + BUYER]); if (S.cart && S.cart.offer === n) S.cart.removed = true; S.msgs.push({ k: "sys", t: `Покупатель отказался от принятого предложения № ${n}` }); render(); }, true);
  else if (a === "readd") { S.cart = { offer: n, removed: false, extra: S.cart ? S.cart.extra : false }; render(); toast("Предложение снова в корзине"); }
  else if (a === "cdel") { const o = off(S.cart.offer); confirmBox("Удалить предложение из корзины?", o.st === 2 ? `Вернуть его можно в чате до ${o.exp} 23:59.` : "", "Удалить", () => { S.cart.removed = true; render(); }); }
  else if (a === "pay") {
    const o = S.cart && off(S.cart.offer);
    if (o && o.st === 2 && !S.cart.removed && S.short) { render(); toast("Предложение перенесено в «Нет в наличии»"); return; }
    S.order = "68731205"; if (o && o.st === 2 && !S.cart.removed) { o.st = 3; o.ev.push(["15.11.2026 10:42", "PaymentStarted", "Покупатель"], ["15.11.2026 10:42", "Ordered (заказ № 68731205)", "Платформа"]); }
    S.view = "order"; render(); toast("Оплата прошла. Заказ № 68731205 создан");
  }
});
document.addEventListener("input", e => {
  const t = e.target; if (!S.form || !t.dataset.f) return;
  const f = t.dataset.f, i = +t.dataset.i;
  if (f === "cmt") { S.form.cmt = t.value; const c = t.nextElementSibling; if (c) c.textContent = t.value.length + " / 500"; return; }
  if (f === "q" || f === "p") { S.form.lines[i][f] = t.value.replace(/\D/g, ""); }
});
document.addEventListener("change", e => {
  const t = e.target; if (!S.form || !t.dataset.f) return;
  if (t.dataset.f === "br") S.form.br = t.value; else if (t.dataset.f === "v") S.form.lines[+t.dataset.i].v = t.value; else return;
  render();
});
document.addEventListener("focusout", e => { const t = e.target; if (S.form && (t.dataset.f === "q" || t.dataset.f === "p")) render(); });

// ---------------------------------------------------------------- scenarios
const SC = [
 { label: "Buyer · negotiable product page", apply: () => base({ view: "bprod", chat: false, msgs: [] }),
   notes: ["«Договорная цена», minimum order (shown when above 1, ⚑ OQ-PT32) and one button «Написать продавцу»; no «Добавить в корзину», no «Купить сейчас» (PT13).", "No «Запросить цену» request form (PT22) and no price hint (later, OQ-PT21).", "Click «Написать продавцу» to create the product chat."], src: "US-BF-3.5-01 AC6 · US-BF-4.1-03" },
 { label: "Buyer · new chat about the product", apply: () => base({ view: "bchat", msgs: [{ k: "card" }] }),
   notes: ["One chat per buyer + seller + product (PT21). Created once; the product card is its first message (PT22).", "Header and list row show the product. Placeholder T14 guides the buyer: variants and quantity.", "Clicking «Написать продавцу» again opens the same chat, no second card."], src: "US-BF-4.1-03 AC2 – AC4" },
 { label: "Seller · product chat, «Предложить цену»", apply: () => base({ view: "schat", side: "s", msgs: stdMsgs(false).slice(0, 2) }),
   notes: ["Seller panel chat with the product in the header and «Предложить цену» (only while the product is Negotiable, PT29).", "«Все предложения» opens the seller's offers list (scenario 17).", "Click «Предложить цену» to open the offer form."], src: "US-SF-4.2-01 AC1 · US-BF-4.1-03 AC6" },
 { label: "Seller · offer form, filled", apply: () => base({ view: "schat", side: "s", msgs: stdMsgs(false).slice(0, 3), form: { br: "ch", lines: [{ v: "w", q: "200", p: "41000" }, { v: "b", q: "100", p: "43000" }], days: 3, cmt: "Доставка нашим транспортом по Ташкенту бесплатно.", errs: {}, replace: null } }),
   notes: ["Branch, lines (variant with stock at the branch, quantity, price, line total), «Добавить позицию» up to 20, total and total quantity, validity 1 / 3 / 7 days with the end date, comment ≤ 500.", "A variant already used is disabled in the other pickers.", "«Отправить предложение» runs the checks; try changing the branch to «Склад Сергели»: white has only 120 there."], src: "US-SF-4.2-01 AC2 – AC5, AC7" },
 { label: "Seller · offer form, errors", apply: () => { base({ view: "schat", side: "s", msgs: stdMsgs(false).slice(0, 3), form: { br: "ch", lines: [{ v: "w", q: "600", p: "41000" }, { v: "w", q: "100", p: "40000" }, { v: "b", q: "100", p: "" }], days: 3, cmt: "", errs: {}, replace: null } }); validate(); render(); },
   notes: ["Errors at the line: stock short at the branch (M-PT15), duplicate variant (M-PT16), empty price (M-PT5). Nothing is sent; the form keeps the data.", "Below the minimum order (50 here) the seller is asked M-PT20 and may send anyway (⚑ OQ-PT9)."], src: "US-SF-4.2-01 AC5, AC6" },
 { label: "Seller · replace a waiting offer", apply: () => base({ view: "schat", side: "s", offers: [O(100244, 1, [["w", 200, 41000], ["b", 100, 43000]], { cmt: "Доставка нашим транспортом по Ташкенту бесплатно." })], msgs: stdMsgs(false) }),
   notes: ["An offer is waiting. «Предложить цену» opens the form pre-filled with it; sending asks M-PT14 and the old offer becomes «Заменено новым предложением».", "Try: open the form, change the white price to 40 000, send."], src: "US-SF-4.2-01 AC8" },
 { label: "Buyer · offer waiting for an answer", apply: () => base({ view: "bchat", offers: [A0(), Object.assign(B0(), { left: 7 })], msgs: stdMsgs(true) }),
   notes: ["Card: number, lines, total and quantity, branch, «Действует до … 23:59», comment, status. «Принять» and «Отклонить».", "The replaced offer stays in the history, greyed, without buttons.", "Countdown «Осталось N ч» in the last 24 hours (M-PT42).", "To renegotiate the buyer just writes in the chat (PT24)."], src: "US-BF-4.2-01 AC1, AC8, AC12" },
 { label: "Buyer · «Принять»: confirmation", apply: () => { base({ view: "bchat", offers: [A0(), B0()], msgs: stdMsgs(true) }); setTimeout(() => document.querySelector('[data-a="accept"]').click(), 50); },
   notes: ["M-PT23 states the total and the payment deadline. After «Принять» the offer is «Принято, ждёт оплаты», its lines go to the cart as a locked group and the seller gets OFR-02.", "Checks run in one transaction: still waiting, not ended, product and branch available, stock ≥ quantity, no payment in progress for an earlier accepted offer."], src: "US-BF-4.2-01 AC2 – AC4" },
 { label: "Buyer · «Принять» refused: stock short", apply: () => base({ view: "bchat", offers: [A0(), B0()], msgs: stdMsgs(true), short: true }),
   notes: ["Try «Принять»: white is down to 150 at the branch, so acceptance is refused with M-PT25 and the offer stays waiting.", "Other refusals: replaced/withdrawn/expired → M-PT24; product on moderation → M-PT45; unavailable → M-PT46."], src: "US-BF-4.2-01 AC6" },
 { label: "Buyer · «Отклонить» with a reason", apply: () => { base({ view: "bchat", offers: [A0(), B0()], msgs: stdMsgs(true) }); setTimeout(() => document.querySelector('[data-a="reject"]').click(), 50); },
   notes: ["Optional reason chips (L-PT8, ⚑ OQ-PT16) and comment ≤ 300. The system message M-PT28 (or M-PT28b without a reason) appears for both sides.", "No notification to the seller (⚑ OQ-PT31); the seller may send a new offer."], src: "US-BF-4.2-01 AC7" },
 { label: "Buyer · accepted offer: cart, «Отказаться»", apply: () => base({ view: "bchat", offers: [A0(), Object.assign(B0(), { st: 2, left: 20 })], msgs: stdMsgs(true), cart: { offer: 100245, removed: false, extra: false } }),
   notes: ["Accepted card: «Перейти в корзину» (or «Добавить в корзину» if removed) and «Отказаться» (⚑ OQ-PT30): declining closes the offer as «Отклонено» and removes its cart lines.", "While a payment is in progress «Отказаться» is disabled («Идёт оплата»)."], src: "US-BF-4.2-01 AC9 – AC11" },
 { label: "Seller · offer history in the chat", apply: () => base({ view: "schat", side: "s", offers: [A0(), Object.assign(B0(), { st: 4, reason: "Высокая цена", ev: [["14.11.2026 16:05", "Sent", "Продавец · Камола Р."], ["14.11.2026 18:40", "Rejected · Высокая цена", "Покупатель"]] }), O(100247, 2, [["w", 200, 39500], ["b", 100, 42500]], { sent: "15.11.2026 09:10", exp: "18.11.2026", by: "Бахтиёр К." })], msgs: stdMsgs(true).concat([{ k: "sys", t: "Покупатель отклонил предложение № 100245: Высокая цена" }, { k: "t", me: "s", t: "Понимаю, отправил новое с учётом объёма.", tm: "09:10" }, { k: "o", no: 100247 }]) }),
   notes: ["Every offer stays in the chat in order with its final status; nothing is edited or hidden (BR-PT11).", "The seller side shows who sent each offer («Отправил»).", "The accepted offer cannot be withdrawn (PT26)."], src: "US-SF-4.2-01 AC11, AC14" },
 { label: "Seller · «Отозвать»", apply: () => { base({ view: "schat", side: "s", offers: [A0(), B0()], msgs: stdMsgs(true) }); setTimeout(() => document.querySelector('[data-a="withdraw"]').click(), 50); },
   notes: ["Only a waiting offer can be withdrawn. Confirmation M-PT35; then «Отозвано продавцом» and the system message M-PT29; no notification (⚑ OQ-PT31)."], src: "US-SF-4.2-01 AC10" },
 { label: "Buyer · cart: locked offer group", apply: () => base({ view: "cart", offers: [Object.assign(B0(), { st: 2 })], msgs: stdMsgs(true), cart: { offer: 100245, removed: false, extra: true } }),
   notes: ["The offer is one locked group in the branch group of its branch: no stepper, no branch change, no price change; selected and removed as a whole (M-PT30 keeps the offer accepted).", "Ordinary lines of the same branch go in the same order (PT33). No promo codes on offer lines (PT34).", "Click «Оформить и оплатить» to create the order (payment shortened in this prototype)."], src: "US-BF-4.2-02 AC1 – AC6, AC8" },
 { label: "Buyer · cart: offer expired or unavailable", apply: () => base({ view: "cart", offers: [Object.assign(B0(), { st: 7 })], msgs: stdMsgs(true), cart: { offer: 100245, removed: false, extra: true } }),
   notes: ["An offer that ended unpaid moves to «Нет в наличии» with M-PT32 and «Открыть чат»; the other lines can be paid.", "Unavailable (branch off, product blocked…) looks the same with M-PT46. Lines are removed after 7 days (⚑ OQ-PT12).", "Stock short at «Оплатить» moves the group the same way with M-PT25."], src: "US-BF-4.2-02 AC7, AC10 – AC12" },
 { label: "Buyer · order with «Цена по договорённости»", apply: () => base({ view: "order", offers: [Object.assign(B0(), { st: 3 })], msgs: stdMsgs(true), cart: { offer: 100245, removed: false, extra: true }, order: "68731205" }),
   notes: ["Order lines keep the agreed price with «Цена по договорённости» (M-PT13) and a link to the offer (PT36).", "The offer becomes «Оплачено · заказ № …». Cancelling the order does not reopen it (⚑ OQ-PT11)."], src: "US-BF-4.2-02 AC8, AC13, AC14" },
 { label: "Seller · list «Предложения цены»", apply: () => base({ view: "slist", side: "s", offers: [A0(), Object.assign(B0(), { st: 2 })], msgs: stdMsgs(true) }),
   notes: ["All offers of the seller account, newest first, with status filters, product and period (⚑ OQ-PT15). A row opens the chat at the card.", "Only the account's own offers are listed."], src: "US-AF-2.1-04 AC6 – AC8" },
 { label: "Admin · offers read-only with the log", apply: () => base({ view: "admin", offers: [A0(), Object.assign(B0(), { st: 3, ev: [["14.11.2026 16:05", "Sent", "Продавец · Камола Р."], ["15.11.2026 09:30", "Accepted", "Покупатель · Азиз Хамидов"], ["15.11.2026 10:40", "PaymentStarted", "Покупатель"], ["15.11.2026 10:42", "Ordered (заказ № 68731205)", "Платформа"]] })], msgs: stdMsgs(true), order: "68731205" }),
   notes: ["Cards without buttons plus the event history: event, who, when (PT37).", "No admin action changes an offer; an admin API call to do so gets HTTP 403. Blocking the chat makes open offers «Недоступно»."], src: "US-AF-2.1-04 AC1 – AC4" },
 { label: "Buyer app · chat and offer card", apply: () => base({ view: "app", offers: [A0(), Object.assign(B0(), { left: 7 })], msgs: stdMsgs(true) }),
   notes: ["The same card and buttons in the buyer app. After «Принять» the app shows a snackbar «В корзину» (⚑ OQ-PT28)."], src: "US-BF-4.1-03 AC10 · US-BF-4.2-01 AC15" },
 { label: "Notifications OFR-01 – OFR-04", apply: () => base({ view: "notif" }),
   notes: ["Four notifications (PT38): web in-app list, push in the mobile apps; no SMS or e-mail.", "OFR-03 at 10:00 on the last day (⚑ OQ-PT13). Texts from PRD section 8 (RU shown)."], src: "US-BF-8.1-06" },
];
harness({ title: "P-PT3 Negotiation: chat, offer, cart, order", stories: "US-BF-4.1-03, US-SF-4.2-01, US-BF-4.2-01, US-BF-4.2-02, US-AF-2.1-04, US-BF-8.1-06", version: "1.0" }, SC);
