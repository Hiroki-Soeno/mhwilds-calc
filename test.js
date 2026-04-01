// MHWilds Damage Calculator - Automated Test Cases
// Extracted calculation logic from index.html

// === DATA TABLES ===
const WN=["大剣","太刀","片手剣","双剣","ハンマー","狩猟笛","ランス","ガンランス","スラアク","チャアク","操虫棍","弓","ライトボウガン","ヘビィボウガン"];
const W_ATK=190, W_AFF=5;
const W_BELEM=[450,270,260,250,320,320,270,370,260,270,260,210,0,0];
const W_PAB=[30,30,20,20,30,30,30,30,20,30,20,20,0,0];
const WIE=[80,50,30,20,50,50,50,50,30,50,30,30,0,0];
const WRE={0:[80,100,120,160,200],1:[60,80,100,120,140],2:[60,80,100,120,140],3:[40,60,80,100,120],4:[60,80,100,120,140],5:[80,100,120,160,200],6:[60,80,100,120,140],7:[60,80,100,120,140],8:[60,80,100,120,140],9:[60,80,100,120,140],10:[60,80,100,120,140],11:[40,60,80,100,120],12:[0,0,0,0,0],13:[0,0,0,0,0]};
const WRA={0:[10,12,14,16,18],1:[8,10,12,15,18],2:[8,10,12,15,18],3:[8,10,12,15,18],4:[8,10,12,15,18],5:[10,12,14,16,18],6:[8,10,12,15,18],7:[8,10,12,15,18],8:[8,10,12,15,18],9:[8,10,12,15,18],10:[8,10,12,15,18],11:[6,7,8,9,10],12:[6,7,8,9,10],13:[6,7,8,9,10]};
const ECH=new Set([0,4,5,13]);
const SH=[{n:"赤",r:.5,e:.25},{n:"橙",r:.75,e:.5},{n:"黄",r:1,e:.75},{n:"緑",r:1.05,e:1},{n:"青",r:1.2,e:1.0625},{n:"白",r:1.32,e:1.15}];
const W_DEF_MV=[110,30,22,12,70,38,30,35,35,25,24,12,20,25];
const W_DEF_EM=[1.5,1.0,1.15,0.7,1.15,1,1.1,1.1,1,1,0.85,0.9,0,0];

const GR=[{n:"なし",rF:0,aF:0,rM:1},{n:"ヌシの魂",rF:0,aF:0,rM:1.05},{n:"不屈(1乙)",rF:0,aF:0,rM:1.10},{n:"滑走強化",rF:0,aF:30,rM:1}];

const SEG=[
  {n:"なし",lvs:[{n:"─",c:0,rF:0,aF:0,eF:0,eM:1,rM:1}]},
  {n:"黒蝕一体",lvs:[{n:"Lv1",c:1,rF:0,aF:0,eF:0,eM:1,rM:1,cd:"muga"},{n:"Lv2",c:2,rF:15,aF:0,eF:0,eM:1,rM:1,cd:"muga"}]},
];

// === SKILLS ===
const SK=[
  {n:"攻撃",mx:5,a:(l,s)=>{s.rF+=[0,3,5,7,8,9][l];if(l>=4)s.rM*=[1,1,1,1,1.02,1.04][l];}},
  {n:"見切り",mx:5,a:(l,s)=>{s.aF+=[0,4,8,12,16,20][l];}},
  {n:"超会心",mx:5,a:(l,s)=>{s.cM=[1.25,1.28,1.31,1.34,1.37,1.40][l];}},
  {n:"攻めの守勢",mx:3,a:(l,s)=>{if(s.cd.offG)s.rM*=[1,1.05,1.10,1.15][l];}},
  {n:"チャージマスター",mx:3,a:(l,s)=>{if(s.cd.chrg){const w=s.cd.wt;const t=w===11?[1,1.05,1.10,1.15]:[1,1.15,1.20,1.25];s.eM*=t[l];}}},
  {n:"会心撃【属性】",mx:3,a:(l,s)=>{const h=ECH.has(s.cd.wt);s.ecM=h?[1,1.07,1.14,1.21][l]:[1,1.05,1.10,1.15][l];}},
  {n:"挑戦者",mx:5,a:(l,s)=>{if(s.cd.rage){s.rF+=[0,4,8,12,16,20][l];s.aF+=[0,3,5,7,10,15][l];}}},
  {n:"弱点特効",mx:5,a:(l,s)=>{if(s.cd.weak){s.aF+=[0,5,10,15,20,30][l];if(s.cd.wound)s.aF+=[0,3,5,10,15,20][l];}}},
  {n:"渾身",mx:3,a:(l,s)=>{if(s.cd.kons)s.aF+=[0,10,20,30][l];}},
  {n:"力の解放",mx:5,a:(l,s)=>{if(s.cd.mMig)s.aF+=l*10;}},
  {n:"無我の境地",mx:3,a:(l,s)=>{if(s.cd.muga)s.aF+=[0,3,6,10][l];}},
  {n:"連撃",mx:5,a:(l,s)=>{if(s.cd.chai&&l>0){const w=s.cd.wt!=null?s.cd.wt:0;s.rF+=(WRA[w]||WRA[1])[l-1];s.eF+=(WRE[w]||WRE[1])[l-1];}}},
  {n:"逆襲",mx:3,a:(l,s)=>{if(s.cd.gyak)s.rF+=[0,10,15,25][l];}},
  {n:"巧撃",mx:5,a:(l,s)=>{if(s.cd.koug)s.rF+=[0,10,15,20,25,30][l];}},
  {n:"フルチャージ",mx:5,a:(l,s)=>{if(s.cd.full)s.rF+=[0,3,6,10,15,20][l];}},
  {n:"逆恨み",mx:5,a:(l,s)=>{if(s.cd.red)s.rF+=[0,5,10,15,20,25][l];}},
  {n:"死中に活",mx:1,a:(l,s)=>{if(s.cd.shic)s.rF+=l*10;}},
  {n:"災禍転福",mx:3,a:(l,s)=>{if(s.cd.saik&&l>0){const lt=new Set([1,2,3,6,10,11]);const h=lt.has(s.cd.wt)?[1,1.05,1.10,1.15]:[1,1.10,1.20,1.30];s.eM*=h[l];}}},
  {n:"攻勢",mx:5,a:(l,s)=>{if(s.cd.kose){s.rF+=[0,6,8,10,12,15][l];s.aF+=[0,0,5,10,15,20][l];}}},
  ...["火","水","雷","氷","龍"].map(el=>({n:`${el}属性強化`,mx:3,a:(l,s)=>{if(s.cd.elem===el){s.eF+=[0,40,50,60][l];if(l>=2)s.eM*=[1,1,1.1,1.2][l];}}})),
];

// === CORE CALCULATION (exact replica from index.html lines 290-315) ===
function calculate(cfg) {
  const {
    wt, raw = W_ATK, bAff = W_AFF, sharp = 5, elem = "なし", eVal,
    mv, eMot, rHz = 45, eHz = 20,
    pAtk = 0, pAff = 0, pElem = false,
    intens = 0,
    se1 = {g:0,l:0}, se2 = {g:0,l:0}, grpSk = 0,
    C = {weak:true,wound:false,rage:true,kons:true,mMig:false,muga:false,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false},
    sLv = {},
    wB = {tR:0,dM:false,hS:false,hM:0,hC:false,hE:0,hK:false,sA:false,iE:0,bV:0},
    itemF = 6, // default: gofu only
  } = cfg;

  const sh = wt >= 11 ? {r:1, e:1} : SH[sharp];
  const cd = {...C, elem, wt};

  // Intensify
  const intB = intens === 1 ? {a:10,af:-15,el:0} : intens === 2 ? {a:-10,af:10,el:0} : intens === 3 ? {a:0,af:-5,el:WIE[wt]||0} : {a:0,af:0,el:0};

  const pElV = pElem ? (W_PAB[wt]||0) : 0;

  const bR = raw + pAtk*5 + 0/*art.atk*/ + intB.a;
  const bA = bAff + pAff*5 + 0/*art.aff*/ + intB.af;
  const bE = (eVal !== undefined ? eVal : W_BELEM[wt]) + pElV + 0/*art.elem*/ + intB.el;

  const s = {rF:0, rM:1, aF:0, cM:1.25, eF:0, eM:1, ecM:1.0, cd};
  s.rF += itemF;

  SK.forEach(sk => {
    const l = sLv[sk.n] || 0;
    if (l > 0) sk.a(l, s);
  });

  // Series skills
  [se1, se2].forEach(({g, l}) => {
    const sr = SEG[g]?.lvs[l];
    if (!sr || sr.c === 0) return;
    const srA = (!sr.cd || (sr.cd === "muga" ? cd.muga : sr.cd === "rage" ? cd.rage : cd[sr.cd]));
    if (sr.rF && srA) s.rF += sr.rF;
    if (sr.aF && srA) s.aF += sr.aF;
    if (sr.eF && srA) s.eF += sr.eF;
    if (sr.eM && sr.eM !== 1 && srA) s.eM *= sr.eM;
    if (sr.rM && sr.rM !== 1 && srA) s.rM *= sr.rM;
  });

  // Group skill
  const gr = GR[grpSk];
  if (gr.rM !== 1) s.rM *= gr.rM;
  if (gr.aF) s.aF += gr.aF;
  if (gr.rF) s.rF += gr.rF;

  // Weapon-specific buffs
  if (wt === 1) { s.rM *= [1, 1.05, 1.075, 1.10][wB.tR]; }
  if (wt === 3 && wB.dM) { s.rM *= 1.15; s.eM *= 1.3; }
  if (wt === 5) { if(wB.hS)s.rM*=1.2;s.rM*=[1,1.03,1.045,1.05,1.10][wB.hM];if(wB.hC)s.aF+=15;s.eM*=[1,1.08,1.10][(wB.hE||0)];if(wB.hK){s.rM*=1.1;s.aF+=25;} }
  if (wt === 8 && wB.sA) s.rF += 10;
  if (wt === 10) { s.rM *= [1, 1.1, 1.15][wB.iE]; }

  // 狂竜症克服 +15% affinity
  if (cd.muga) s.aF += 15;

  // Bow vine multiplier
  const bowVM = wt === 11 ? [1, 1.4, 1.3][wB.bV] : 1;

  const tR = bR * s.rM + s.rF;
  const eA = Math.min(100, Math.max(-100, bA + s.aF));
  const cF = eA >= 0 ? 1 + (eA/100) * (s.cM - 1) : 1 + (eA/100) * 0.25;
  const efr = tR * cF * sh.r * bowVM;
  const tE = elem !== "なし" ? bE * s.eM + s.eF : 0;
  const eCF = eA >= 0 ? 1 + (eA/100) * (s.ecM - 1) : 1;
  const efe = tE * eCF * sh.e;
  const ph = efr * (mv/100) * (rHz/100);
  const el = efe/10 * (eHz/100) * eMot;
  const tot = ph + el;

  return { tR, efr, eA, cM: s.cM, tE, efe, ph, el, tot };
}

// === TEST CASES ===
const r = (v) => Math.round(v * 10) / 10; // round to 1 decimal

function runTest(name, cfg, expected) {
  const result = calculate(cfg);
  let pass = true;
  const details = [];

  for (const [key, exp] of Object.entries(expected)) {
    const got = r(result[key]);
    const diff = Math.abs(got - exp);
    const ok = diff <= 0.15; // tolerance ±0.1 + floating point
    if (!ok) pass = false;
    const mark = ok ? "✅" : "❌";
    details.push(`  ${mark} ${key}: expected=${exp}, got=${got}${!ok ? ` (diff=${diff.toFixed(2)})` : ""}`);
  }

  console.log(`\n${pass ? "✅ PASS" : "❌ FAIL"} — ${name}`);
  details.forEach(d => console.log(d));
  return pass;
}

let passed = 0, failed = 0;

// TC1: 初期状態（双剣、変更なし）
runTest("TC1: 双剣 初期状態", {
  wt: 3, // 双剣
  raw: 190, bAff: 5, sharp: 5, elem: "なし",
  mv: 12, eMot: 0.7, rHz: 45, eHz: 20,
  itemF: 6, // 力の護符のみ
  C: {weak:true,wound:false,rage:true,kons:true,mMig:false,muga:false,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false},
  sLv: {},
}, {
  tR: 196.0, efr: 262.0, eA: 5, ph: 14.1, el: 0.0, tot: 14.1
}) ? passed++ : failed++;

// TC2: 太刀 赤ゲージ + 攻撃5 + 見切り5 + 弱特5(弱点+傷) + 火属性
runTest("TC2: 太刀 赤ゲージ+攻撃5+見切り5+弱特5+火", {
  wt: 1, // 太刀
  raw: 190, bAff: 5, sharp: 5, elem: "火",
  eVal: 270,
  mv: 30, eMot: 1.0, rHz: 45, eHz: 20,
  itemF: 6,
  wB: {tR:3,dM:false,hS:false,hM:0,hC:false,hE:0,hK:false,sA:false,iE:0,bV:0}, // 赤ゲージ = index 3
  C: {weak:true,wound:true,rage:true,kons:true,mMig:false,muga:false,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false},
  sLv: {"攻撃":5, "見切り":5, "弱点特効":5},
}, {
  tR: 232.4, efr: 364.2, eA: 75, ph: 49.2, el: 6.2, tot: 55.4
}) ? passed++ : failed++;

// TC3: 大剣 真溜めⅢ + 攻撃5 + 挑戦者5 + ヌシの魂 + フルアイテム
runTest("TC3: 大剣 真溜めⅢ+攻撃5+挑戦者5+ヌシ+フルアイテム", {
  wt: 0, // 大剣
  raw: 190, bAff: 5, sharp: 5, elem: "火",
  eVal: 450,
  mv: 209, eMot: 2.5, rHz: 65, eHz: 25,
  itemF: 33, // 6+10+7+10
  grpSk: 1, // ヌシの魂
  C: {weak:true,wound:false,rage:true,kons:true,mMig:false,muga:false,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false},
  sLv: {"攻撃":5, "挑戦者":5},
}, {
  tR: 269.5, efr: 373.5, eA: 20, ph: 507.4, el: 32.3, tot: 539.7
}) ? passed++ : failed++;

// TC4: 弓 接撃ビン + 火属性強化3
runTest("TC4: 弓 接撃ビン+火属性強化3", {
  wt: 11, // 弓
  raw: 190, bAff: 5, sharp: 5, elem: "火",
  eVal: 210,
  mv: 12, eMot: 0.9, rHz: 45, eHz: 20,
  itemF: 6,
  wB: {tR:0,dM:false,hS:false,hM:0,hC:false,hE:0,hK:false,sA:false,iE:0,bV:1}, // 接撃ビン = index 1
  C: {weak:true,wound:false,rage:true,kons:true,mMig:false,muga:false,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false,elem:"火"},
  sLv: {"火属性強化":3},
}, {
  tR: 196.0, efr: 277.8, eA: 5, ph: 15.0, el: 5.6, tot: 20.6
}) ? passed++ : failed++;

// TC5: 双剣 鬼人身躱し + 雷属性 + 連撃5
runTest("TC5: 双剣 鬼人身躱し+雷+連撃5", {
  wt: 3, // 双剣
  raw: 190, bAff: 5, sharp: 5, elem: "雷",
  eVal: 250,
  mv: 12, eMot: 0.7, rHz: 45, eHz: 20,
  itemF: 6,
  wB: {tR:0,dM:true,hS:false,hM:0,hC:false,hE:0,hK:false,sA:false,iE:0,bV:0}, // 鬼人身躱し ON
  C: {weak:true,wound:false,rage:true,kons:true,mMig:false,muga:false,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false,elem:"雷"},
  sLv: {"雷属性強化":3, "連撃":5},
}, {
  tR: 242.5, efr: 324.1, eA: 5, ph: 17.5, el: 9.2, tot: 26.7
}) ? passed++ : failed++;

// TC6: 太刀 ガチビルド（復元なし、激化なし）
runTest("TC6: 太刀 ガチビルド", {
  wt: 1, // 太刀
  raw: 190, bAff: 5, sharp: 5, elem: "火",
  eVal: 270,
  mv: 30, eMot: 1.0, rHz: 45, eHz: 20,
  itemF: 33, // 6+10+7+10
  wB: {tR:3,dM:false,hS:false,hM:0,hC:false,hE:0,hK:false,sA:false,iE:0,bV:0}, // 赤ゲージ
  grpSk: 1, // ヌシの魂
  se1: {g:1, l:1}, // 黒蝕一体 Lv2
  C: {weak:true,wound:true,rage:true,kons:true,mMig:false,muga:true,chai:true,gyak:false,koug:false,full:false,red:false,shic:false,offG:false,chrg:false,saik:false,kose:false},
  sLv: {"攻撃":5, "見切り":5, "超会心":3, "挑戦者":5, "弱点特効":5, "連撃":1},
}, {
  tR: 313.2, efr: 554.0, eA: 100, ph: 74.8, el: 7.6, tot: 82.4
}) ? passed++ : failed++;

console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed+failed}`);
process.exit(failed > 0 ? 1 : 0);
