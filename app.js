const WORLD = {
  width: 1280,
  height: 720,
  groundY: 590,
  gravity: 980,
};

const WEAPON_LIBRARY = {
  unarmed: {
    key: "unarmed",
    label: "空手",
    noun: "拳肘",
    reach: 34,
    damage: 16,
    bleed: 0.55,
    sever: 0.55,
    weight: 0.55,
    guard: 0.9,
    hitWords: ["以肘斩入", "近身爆拳", "反手砸裂"],
  },
  gauntlet: {
    key: "gauntlet",
    label: "碎骨拳套",
    noun: "拳套",
    reach: 40,
    damage: 18,
    bleed: 0.72,
    sever: 0.66,
    weight: 0.72,
    guard: 0.94,
    hitWords: ["连拳凿穿", "拳套轰碎", "重击撕开"],
  },
  blade: {
    key: "blade",
    label: "短刀",
    noun: "短刀",
    reach: 46,
    damage: 20,
    bleed: 1.15,
    sever: 1.14,
    weight: 0.58,
    guard: 0.82,
    hitWords: ["贴身抹喉", "回身割裂", "短刀挑开"],
  },
  sword: {
    key: "sword",
    label: "长剑",
    noun: "长剑",
    reach: 62,
    damage: 24,
    bleed: 0.94,
    sever: 1.02,
    weight: 0.74,
    guard: 0.98,
    hitWords: ["剑锋斩开", "沉肩劈下", "滑步切入"],
  },
  spear: {
    key: "spear",
    label: "长枪",
    noun: "长枪",
    reach: 88,
    damage: 22,
    bleed: 0.88,
    sever: 0.9,
    weight: 0.76,
    guard: 1.02,
    hitWords: ["长枪贯穿", "借势突刺", "滑枪点碎"],
  },
  hammer: {
    key: "hammer",
    label: "战锤",
    noun: "战锤",
    reach: 54,
    damage: 30,
    bleed: 0.62,
    sever: 0.82,
    weight: 1.18,
    guard: 0.88,
    hitWords: ["战锤爆颅", "锤面震碎", "暴力砸塌"],
  },
  axe: {
    key: "axe",
    label: "巨斧",
    noun: "巨斧",
    reach: 60,
    damage: 28,
    bleed: 1.22,
    sever: 1.3,
    weight: 1.04,
    guard: 0.9,
    hitWords: ["斧刃劈断", "巨斧剁裂", "横斩掀飞"],
  },
  chain: {
    key: "chain",
    label: "锁链镰",
    noun: "锁链镰",
    reach: 76,
    damage: 21,
    bleed: 0.94,
    sever: 1.08,
    weight: 0.82,
    guard: 0.8,
    hitWords: ["链刃抽裂", "锁链拖斩", "回荡抽穿"],
  },
  staff: {
    key: "staff",
    label: "棍杖",
    noun: "棍杖",
    reach: 70,
    damage: 20,
    bleed: 0.52,
    sever: 0.7,
    weight: 0.74,
    guard: 1.14,
    hitWords: ["棍杖点翻", "横棍扫落", "连杆抽塌"],
  },
  claws: {
    key: "claws",
    label: "裂爪",
    noun: "裂爪",
    reach: 42,
    damage: 19,
    bleed: 1.3,
    sever: 1.06,
    weight: 0.5,
    guard: 0.78,
    hitWords: ["裂爪抠开", "爪锋撕断", "狂扑抓穿"],
  },
};

const STYLE_LIBRARY = {
  brawler: {
    key: "brawler",
    label: "街垒拳师",
    description: "压距离、打连击、持续逼身。",
    aggression: 1.22,
    precision: 0.92,
    combo: 1.24,
    mobility: 1.14,
    guard: 0.88,
    preferredWeapons: ["gauntlet", "unarmed", "claws"],
    targetBias: { head: 1.1, torso: 1.25, armL: 1, armR: 1.04, legL: 0.92, legR: 0.92 },
  },
  duelist: {
    key: "duelist",
    label: "镜锋决斗家",
    description: "节奏克制，精准切割四肢。",
    aggression: 0.96,
    precision: 1.24,
    combo: 1.08,
    mobility: 1.08,
    guard: 1.02,
    preferredWeapons: ["sword", "blade", "staff"],
    targetBias: { head: 0.98, torso: 0.95, armL: 1.16, armR: 1.16, legL: 1.1, legR: 1.1 },
  },
  lancer: {
    key: "lancer",
    label: "长驱猎枪手",
    description: "保距离，用武器长度压制。",
    aggression: 0.9,
    precision: 1.12,
    combo: 0.94,
    mobility: 1.02,
    guard: 1.08,
    preferredWeapons: ["spear", "staff", "chain"],
    targetBias: { head: 1.04, torso: 1.2, armL: 0.94, armR: 0.94, legL: 1.08, legR: 1.08 },
  },
  berserker: {
    key: "berserker",
    label: "裂骨狂兵",
    description: "重武器强压，优先打碎肢体。",
    aggression: 1.34,
    precision: 0.84,
    combo: 0.82,
    mobility: 0.94,
    guard: 0.74,
    preferredWeapons: ["axe", "hammer", "claws"],
    targetBias: { head: 0.95, torso: 1.18, armL: 1.1, armR: 1.1, legL: 1.15, legR: 1.15 },
  },
  monk: {
    key: "monk",
    label: "静脉武僧",
    description: "空手多段，依靠闪避和失血战。",
    aggression: 1.08,
    precision: 1.02,
    combo: 1.34,
    mobility: 1.24,
    guard: 0.84,
    preferredWeapons: ["unarmed", "gauntlet", "staff"],
    targetBias: { head: 1.12, torso: 1.02, armL: 1.08, armR: 1.08, legL: 0.98, legR: 0.98 },
  },
  reaper: {
    key: "reaper",
    label: "收割夜行者",
    description: "追求断肢和流血，以致命切线结束战斗。",
    aggression: 1.18,
    precision: 1.18,
    combo: 1.02,
    mobility: 1.18,
    guard: 0.8,
    preferredWeapons: ["chain", "blade", "axe"],
    targetBias: { head: 1.06, torso: 0.94, armL: 1.22, armR: 1.22, legL: 1.16, legR: 1.16 },
  },
};

const BODY_LIBRARY = {
  balanced: { key: "balanced", label: "均衡体", description: "身材稳健，容错高。", mass: 0.98, agility: 1, durability: 1.04, reachBoost: 0, headScale: 1 },
  colossus: { key: "colossus", label: "巨像体", description: "沉重、耐打、挥击恐怖。", mass: 1.18, agility: 0.86, durability: 1.18, reachBoost: 4, headScale: 0.96 },
  sprinter: { key: "sprinter", label: "疾影体", description: "爆发迅速，腿部位移极快。", mass: 0.88, agility: 1.24, durability: 0.9, reachBoost: 6, headScale: 0.98 },
  bulwark: { key: "bulwark", label: "壁垒体", description: "上肢厚重，护体能力强。", mass: 1.08, agility: 0.92, durability: 1.16, reachBoost: 2, headScale: 0.94 },
  reaver: { key: "reaver", label: "猎剥体", description: "四肢长、切线刁钻、出血压制快。", mass: 0.94, agility: 1.12, durability: 0.96, reachBoost: 10, headScale: 1.02 },
};

const LIMB_ORDER = ["head", "torso", "armL", "armR", "legL", "legR"];
const LIMB_LABELS = {
  head: "头部",
  torso: "躯干",
  armL: "左臂",
  armR: "右臂",
  legL: "左腿",
  legR: "右腿",
};

const CALLSIGN_FIRST = ["焰", "镜", "灰", "裂", "霜", "曜", "铁", "炽", "猎", "荒"];
const CALLSIGN_SECOND = ["刃", "骨", "脊", "锋", "翼", "冠", "槌", "獠", "壳", "牙"];
const CALLSIGN_SUFFIX = ["客", "兵", "者", "魁", "徒", "卫", "王", "手", "魂", "影"];

const dom = {
  uploads: { A: document.querySelector("#uploadA"), B: document.querySelector("#uploadB") },
  portraits: { A: document.querySelector("#portraitA"), B: document.querySelector("#portraitB") },
  portraitWrap: { A: document.querySelector("#portraitWrapA"), B: document.querySelector("#portraitWrapB") },
  placeholders: { A: document.querySelector("#placeholderA"), B: document.querySelector("#placeholderB") },
  meta: { A: document.querySelector("#metaA"), B: document.querySelector("#metaB") },
  names: { A: document.querySelector("#nameA"), B: document.querySelector("#nameB") },
  regen: { A: document.querySelector("#regenA"), B: document.querySelector("#regenB") },
  playButton: document.querySelector("#playButton"),
  restartBattleButton: document.querySelector("#restartBattleButton"),
  resetRosterButton: document.querySelector("#resetRosterButton"),
  backToLobbyButton: document.querySelector("#backToLobbyButton"),
  combatFeed: document.querySelector("#combatFeed"),
  statusText: document.querySelector("#statusText"),
  resultPanel: document.querySelector("#resultPanel"),
  resultTitle: document.querySelector("#resultTitle"),
  resultSummary: document.querySelector("#resultSummary"),
  shareButton: document.querySelector("#shareButton"),
  copyLinkButton: document.querySelector("#copyLinkButton"),
  shareBanner: document.querySelector("#shareBanner"),
  shareBannerContent: document.querySelector("#shareBannerContent"),
  hud: {
    nameA: document.querySelector("#hudNameA"),
    stateA: document.querySelector("#hudStateA"),
    healthA: document.querySelector("#hudHealthA"),
    bleedA: document.querySelector("#hudBleedA"),
    fillA: document.querySelector("#healthFillA"),
    nameB: document.querySelector("#hudNameB"),
    stateB: document.querySelector("#hudStateB"),
    healthB: document.querySelector("#hudHealthB"),
    bleedB: document.querySelector("#hudBleedB"),
    fillB: document.querySelector("#healthFillB"),
  },
  clockDisplay: document.querySelector("#clockDisplay"),
  roundState: document.querySelector("#roundState"),
  arenaCanvas: document.querySelector("#arenaCanvas"),
  posterDialog: document.querySelector("#posterDialog"),
  posterPreview: document.querySelector("#posterPreview"),
  downloadPosterLink: document.querySelector("#downloadPosterLink"),
  shareNativeButton: document.querySelector("#shareNativeButton"),
};

const arenaCtx = dom.arenaCanvas.getContext("2d");
const resizeObserver = new ResizeObserver(() => resizeArenaCanvas());

const state = {
  uploads: { A: null, B: null },
  roster: { A: null, B: null },
  previewFighters: [],
  battle: createBattleState(),
  renderHandle: 0,
  previousFrameTime: 0,
  posterUrl: "",
  posterFile: null,
  sharePayload: null,
};

function createBattleState() {
  return {
    status: "idle",
    fighters: [],
    particles: [],
    debris: [],
    logs: ["等待斗士登场。"],
    time: 0,
    winner: null,
    loser: null,
    shareUrl: "",
  };
}

function init() {
  bindEvents();
  resizeArenaCanvas();
  resizeObserver.observe(dom.arenaCanvas.parentElement);
  hydrateShareBanner();
  refreshPreview();
  updateUI();
  startRenderLoop();
}

function bindEvents() {
  dom.uploads.A.addEventListener("change", (event) => handleUpload("A", event));
  dom.uploads.B.addEventListener("change", (event) => handleUpload("B", event));
  dom.regen.A.addEventListener("click", () => regenerateFighter("A"));
  dom.regen.B.addEventListener("click", () => regenerateFighter("B"));
  dom.playButton.addEventListener("click", startBattle);
  dom.restartBattleButton.addEventListener("click", restartBattle);
  dom.resetRosterButton.addEventListener("click", clearRoster);
  dom.backToLobbyButton.addEventListener("click", backToLobby);
  dom.copyLinkButton.addEventListener("click", copyShareLink);
  dom.shareButton.addEventListener("click", preparePosterAndOpen);
  dom.shareNativeButton.addEventListener("click", sharePosterNatively);
}

async function handleUpload(slot, event) {
  const [file] = event.currentTarget.files || [];
  event.currentTarget.value = "";
  if (!file) return;

  setStatus(`正在分析斗士${slot}的人像特征...`);

  try {
    const dataUrl = await readFileAsDataURL(file);
    const image = await loadImage(dataUrl);
    const features = extractPortraitFeatures(image);

    state.uploads[slot] = { fileName: file.name, dataUrl, image, features };
    state.roster[slot] = buildFighter(slot, state.uploads[slot], Date.now());
    refreshPreview();
    pushLog(`斗士${slot}完成塑形，准备登场。`);
    updateUI();
  } catch (error) {
    console.error(error);
    setStatus(`斗士${slot}生成失败，请换一张清晰照片重试。`);
  }
}

function regenerateFighter(slot) {
  const source = state.uploads[slot];
  if (!source) return;
  state.roster[slot] = buildFighter(slot, source, Date.now());
  refreshPreview();
  pushLog(`斗士${slot}以新的时间戳重铸完成。`);
  updateUI();
}

function clearRoster() {
  state.uploads = { A: null, B: null };
  state.roster = { A: null, B: null };
  state.previewFighters = [];
  resetPosterState();
  state.battle = createBattleState();
  updateUI();
}

function backToLobby() {
  clearRoster();
  setStatus("斗士已离场，可以重新选择两张照片。");
}

function startBattle() {
  if (!state.roster.A || !state.roster.B) return;
  resetPosterState();
  state.battle = createBattleState();
  state.battle.status = "fighting";
  state.battle.fighters = [createCombatant(state.roster.A, 290), createCombatant(state.roster.B, 990)];
  state.battle.logs = [`${state.roster.A.displayName} 对阵 ${state.roster.B.displayName}。`, "双方武器和身体配置已锁定，战斗开始。"];
  updateUI();
}

function restartBattle() {
  if (!state.roster.A || !state.roster.B) return;
  startBattle();
}

function refreshPreview() {
  state.previewFighters = [];
  if (state.roster.A) state.previewFighters.push(createPreviewCombatant(state.roster.A, 290));
  if (state.roster.B) state.previewFighters.push(createPreviewCombatant(state.roster.B, 990));
  if (state.battle.status === "idle" || state.battle.status === "preview") {
    state.battle.status = state.previewFighters.length ? "preview" : "idle";
  }
}

function updateUI() {
  updateFighterCard("A");
  updateFighterCard("B");
  updateFeed();
  updateArenaHud();

  const ready = Boolean(state.roster.A && state.roster.B);
  const fighting = state.battle.status === "fighting";
  const finished = state.battle.status === "finished";

  dom.playButton.disabled = !ready || fighting;
  dom.restartBattleButton.disabled = !ready || fighting;
  dom.regen.A.disabled = !state.uploads.A || fighting;
  dom.regen.B.disabled = !state.uploads.B || fighting;
  dom.resultPanel.hidden = !finished;

  if (finished) {
    dom.resultTitle.textContent = `${state.battle.winner.roster.displayName} 获胜`;
    dom.resultSummary.textContent = buildResultSummary();
    dom.roundState.textContent = "胜负已分";
    dom.statusText.textContent = "胜者已摆出终局姿态，败者保持死亡状态留在原地。";
  } else if (fighting) {
    dom.statusText.textContent = "斗士自动交战中，肢体破坏会显著提升失血速度。";
  } else if (ready) {
    dom.statusText.textContent = "斗士已就位，可以开战或继续重铸任意一侧。";
  } else {
    dom.statusText.textContent = "先为两侧都上传照片并完成生成，然后点击 Play。";
  }
}

function updateFighterCard(slot) {
  const source = state.uploads[slot];
  const fighter = state.roster[slot];
  const portrait = dom.portraits[slot];
  const wrap = dom.portraitWrap[slot];
  const placeholder = dom.placeholders[slot];
  const nameNode = dom.names[slot];
  const meta = dom.meta[slot];

  if (!source || !fighter) {
    portrait.hidden = true;
    portrait.removeAttribute("src");
    wrap.classList.add("empty");
    placeholder.hidden = false;
    nameNode.textContent = "等待上传";
    meta.innerHTML = `<p class="hint">尚未生成斗士。</p>`;
    return;
  }

  portrait.src = source.dataUrl;
  portrait.hidden = false;
  wrap.classList.remove("empty");
  placeholder.hidden = true;
  nameNode.textContent = fighter.displayName;

  meta.innerHTML = `
    <div class="meta-title">
      <p>${fighter.style.label}</p>
      <span class="meta-chip">${fighter.weapon.label}</span>
      <span class="meta-chip">${fighter.body.label}</span>
    </div>
    <dl class="meta-rows">
      <dt>斗法</dt>
      <dd>${fighter.style.description}</dd>
      <dt>身体</dt>
      <dd>${fighter.body.description}</dd>
      <dt>生成种子</dt>
      <dd>${fighter.seed >>> 0} / ${new Date(fighter.generatedAt).toLocaleTimeString("zh-CN", { hour12: false })}</dd>
      <dt>人像特征</dt>
      <dd>暖调 ${Math.round(fighter.features.warmth * 100)} · 细节 ${Math.round(fighter.features.detail * 100)} · 对称 ${Math.round(fighter.features.symmetry * 100)}</dd>
    </dl>
    <div class="stat-grid">
      <div class="stat-card"><span>力量</span><strong>${fighter.stats.power}</strong></div>
      <div class="stat-card"><span>速度</span><strong>${fighter.stats.speed}</strong></div>
      <div class="stat-card"><span>护体</span><strong>${fighter.stats.guard}</strong></div>
      <div class="stat-card"><span>血性</span><strong>${fighter.stats.grit}</strong></div>
    </div>
  `;
}

function updateFeed() {
  dom.combatFeed.innerHTML = "";
  state.battle.logs.slice(0, 7).forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    dom.combatFeed.append(item);
  });
}

function updateArenaHud() {
  const fighters = state.battle.status === "fighting" || state.battle.status === "finished" ? state.battle.fighters : state.previewFighters;
  updateHudSide("A", fighters.find((fighter) => fighter.roster.slot === "A"));
  updateHudSide("B", fighters.find((fighter) => fighter.roster.slot === "B"));

  dom.clockDisplay.textContent = state.battle.status === "fighting" || state.battle.status === "finished" ? `${state.battle.time.toFixed(1)}s` : "00.0s";

  if (state.battle.status === "fighting") dom.roundState.textContent = "自动交战中";
  else if (state.battle.status === "finished") dom.roundState.textContent = "终局定格";
  else if (state.previewFighters.length === 2) dom.roundState.textContent = "斗士就位";
  else if (state.previewFighters.length === 1) dom.roundState.textContent = "等待另一名斗士";
  else dom.roundState.textContent = "等待斗士生成";
}

function updateHudSide(slot, fighter) {
  const hudName = dom.hud[`name${slot}`];
  const hudState = dom.hud[`state${slot}`];
  const hudHealth = dom.hud[`health${slot}`];
  const hudBleed = dom.hud[`bleed${slot}`];
  const hudFill = dom.hud[`fill${slot}`];

  if (!fighter) {
    hudName.textContent = "未就绪";
    hudState.textContent = "待机";
    hudHealth.textContent = "HP 0";
    hudBleed.textContent = "流血 0.0/s";
    hudFill.style.transform = "scaleX(0)";
    return;
  }

  hudName.textContent = fighter.roster.displayName;
  hudState.textContent = describeCombatState(fighter);
  hudHealth.textContent = `HP ${Math.max(0, Math.round(fighter.health))} / ${Math.round(fighter.maxHealth)}`;
  hudBleed.textContent = `流血 ${fighter.bleedRate.toFixed(1)}/s`;
  hudFill.style.transform = `scaleX(${clamp(fighter.health / fighter.maxHealth, 0, 1)})`;
}

function describeCombatState(fighter) {
  if (fighter.dead) return "死亡";
  if (fighter.victoryPose) return "胜利姿态";
  if (fighter.action === "attack") return "进攻";
  if (fighter.action === "hit") return "失衡";
  if (fighter.bleedRate > 10) return "大量失血";
  if (Math.abs(fighter.velocity) > 8) return "机动";
  return "待机";
}

function setStatus(text) {
  dom.statusText.textContent = text;
}

function pushLog(message) {
  state.battle.logs.unshift(message);
  state.battle.logs = state.battle.logs.slice(0, 12);
  updateFeed();
}

function buildFighter(slot, source, generatedAt) {
  const seed = hashString(`${slot}|${generatedAt}|${source.features.hash}|${source.fileName}|${source.features.detail.toFixed(4)}`);
  const rand = mulberry32(seed);
  const style = pickStyle(rand, source.features);
  const body = pickBody(rand, source.features);
  const weapon = pickWeapon(rand, style, source.features);
  const palette = derivePalette(source.features, rand);
  const stats = deriveStats(style, weapon, body, source.features, rand);
  const dimensions = deriveBodyDimensions(body, stats, rand);
  const callsign = generateCallsign(rand);

  return {
    slot,
    displayName: `斗士${slot}·${callsign}`,
    seed,
    generatedAt,
    portrait: { src: source.dataUrl, image: source.image },
    features: source.features,
    style,
    weapon,
    body,
    palette,
    stats,
    dimensions,
  };
}

function pickStyle(rand, features) {
  const candidates = Object.values(STYLE_LIBRARY).map((style) => {
    let score = rand();
    score += features.detail * (style.key === "duelist" || style.key === "reaper" ? 0.58 : 0.18);
    score += features.symmetry * (style.key === "duelist" || style.key === "lancer" ? 0.42 : 0.12);
    score += features.contrast * (style.key === "berserker" || style.key === "brawler" ? 0.44 : 0.08);
    score += features.warmth * (style.key === "berserker" || style.key === "brawler" ? 0.26 : 0.1);
    score += (1 - features.brightness) * (style.key === "reaper" ? 0.28 : 0.04);
    score += features.verticalFocus * (style.key === "lancer" ? 0.26 : 0.07);
    score += features.edgeBalance * (style.key === "monk" ? 0.24 : 0.08);
    return { style, score };
  });
  candidates.sort((left, right) => right.score - left.score);
  return candidates[0].style;
}

function pickBody(rand, features) {
  const entries = Object.values(BODY_LIBRARY).map((body) => {
    let score = rand();
    score += features.verticalFocus * (body.key === "reaver" || body.key === "sprinter" ? 0.4 : 0.12);
    score += features.detail * (body.key === "sprinter" ? 0.22 : 0.1);
    score += (1 - features.brightness) * (body.key === "colossus" || body.key === "bulwark" ? 0.26 : 0.08);
    score += features.contrast * (body.key === "bulwark" ? 0.22 : 0.1);
    score += features.symmetry * (body.key === "balanced" ? 0.24 : 0.08);
    return { body, score };
  });
  entries.sort((left, right) => right.score - left.score);
  return entries[0].body;
}

function pickWeapon(rand, style, features) {
  const pool = style.preferredWeapons.map((key, index) => ({ weapon: WEAPON_LIBRARY[key], score: 1.2 - index * 0.12 + rand() * 0.6 }));
  if (features.detail > 0.58) pool.push({ weapon: WEAPON_LIBRARY.blade, score: 1 + rand() * 0.5 });
  if (features.contrast > 0.55) pool.push({ weapon: WEAPON_LIBRARY.axe, score: 0.95 + rand() * 0.48 });
  if (features.symmetry > 0.64) pool.push({ weapon: WEAPON_LIBRARY.spear, score: 0.9 + rand() * 0.46 });
  if (rand() < 0.18 + features.edgeBalance * 0.14) pool.push({ weapon: WEAPON_LIBRARY.unarmed, score: 1.4 + rand() * 0.5 });
  pool.sort((left, right) => right.score - left.score);
  return pool[0].weapon;
}

function deriveStats(style, weapon, body, features, rand) {
  const power = Math.round(clamp(54 + style.aggression * 12 + weapon.damage * 0.56 + body.mass * 12 + features.contrast * 14 + rand() * 8, 48, 99));
  const speed = Math.round(clamp(50 + style.mobility * 16 + body.agility * 16 - weapon.weight * 7 + features.detail * 10 + rand() * 7, 42, 99));
  const guard = Math.round(clamp(46 + style.guard * 18 + weapon.guard * 10 + body.durability * 12 + features.symmetry * 14 + rand() * 8, 40, 98));
  const grit = Math.round(clamp(58 + body.durability * 18 + body.mass * 10 + (1 - features.brightness) * 12 + features.contrast * 8 + rand() * 8, 52, 99));
  const finesse = Math.round(clamp(48 + style.precision * 18 + features.detail * 20 + features.symmetry * 10 + rand() * 8, 42, 98));
  const maxHealth = Math.round(150 + grit * 1.45 + guard * 0.4 + body.mass * 18);
  const bleedResistance = clamp(0.74 + body.durability * 0.22 + guard / 280, 0.78, 1.42);
  const moveSpeed = clamp(speed * 1.18 + body.agility * 16 - weapon.weight * 10, 42, 118);
  const reach = Math.round(weapon.reach + body.reachBoost + finesse * 0.16 + style.precision * 6);
  return { power, speed, guard, grit, finesse, maxHealth, bleedResistance, moveSpeed, reach };
}

function deriveBodyDimensions(body, stats, rand) {
  return {
    torso: Math.round(132 + body.mass * 18 + stats.grit * 0.2 + rand() * 8),
    arm: Math.round(86 + body.reachBoost * 0.9 + stats.finesse * 0.13 + rand() * 8),
    leg: Math.round(104 + body.reachBoost * 1.1 + stats.speed * 0.1 + rand() * 8),
    shoulder: Math.round(30 + body.mass * 7 + stats.power * 0.1),
    hip: Math.round(22 + body.durability * 6 + rand() * 4),
    head: Math.round(32 * body.headScale + stats.finesse * 0.03),
    line: clamp(8 + body.mass * 1.6 + stats.grit * 0.018, 8, 14),
  };
}

function derivePalette(features, rand) {
  const hue = (features.avgHue * 360 + rand() * 40 + 360) % 360;
  const accentHue = (hue + 120 + rand() * 40) % 360;
  return {
    primary: `hsl(${hue.toFixed(0)} 68% ${clamp(38 + features.brightness * 18, 30, 62).toFixed(0)}%)`,
    secondary: `hsl(${accentHue.toFixed(0)} 76% ${clamp(44 + features.contrast * 18, 36, 70).toFixed(0)}%)`,
    metal: `hsl(${(hue + 18).toFixed(0)} 24% 78%)`,
    blood: `hsl(${clamp(350 + rand() * 8, 346, 359).toFixed(0)} 88% 54%)`,
  };
}

function generateCallsign(rand) {
  return `${CALLSIGN_FIRST[Math.floor(rand() * CALLSIGN_FIRST.length)]}${CALLSIGN_SECOND[Math.floor(rand() * CALLSIGN_SECOND.length)]}${CALLSIGN_SUFFIX[Math.floor(rand() * CALLSIGN_SUFFIX.length)]}`;
}

function createPreviewCombatant(roster, x) {
  const fighter = createCombatant(roster, x);
  fighter.action = "idle";
  return fighter;
}

function createCombatant(roster, x) {
  const limbMax = {
    head: 42 + roster.stats.guard * 0.18,
    torso: 88 + roster.stats.grit * 0.46,
    armL: 48 + roster.stats.power * 0.18,
    armR: 52 + roster.stats.power * 0.2,
    legL: 56 + roster.stats.grit * 0.2,
    legR: 56 + roster.stats.grit * 0.2,
  };

  return {
    roster,
    x,
    y: WORLD.groundY,
    velocity: 0,
    facing: roster.slot === "A" ? 1 : -1,
    action: "idle",
    actionTime: 0,
    comboClock: 0,
    cooldown: 0.32,
    stagger: 0,
    bleedRate: 0,
    health: roster.stats.maxHealth,
    maxHealth: roster.stats.maxHealth,
    dead: false,
    deathPose: null,
    victoryPose: null,
    fallen: false,
    weaponDropped: false,
    usedWeapon: roster.weapon.key !== "unarmed",
    rand: mulberry32(roster.seed ^ 0xa53f9c1d),
    limbs: {
      head: createLimb("head", limbMax.head, 2.5),
      torso: createLimb("torso", limbMax.torso, 2.2),
      armL: createLimb("armL", limbMax.armL, 1.5),
      armR: createLimb("armR", limbMax.armR, 1.7),
      legL: createLimb("legL", limbMax.legL, 1.8),
      legR: createLimb("legR", limbMax.legR, 1.8),
    },
  };
}

function createLimb(key, maxHp, bleedFactor) {
  return { key, maxHp, hp: maxHp, attached: true, destroyed: false, bleedFactor, trauma: 0 };
}

function startRenderLoop() {
  if (state.renderHandle) cancelAnimationFrame(state.renderHandle);

  const frame = (timestamp) => {
    if (!state.previousFrameTime) state.previousFrameTime = timestamp;
    const dt = Math.min((timestamp - state.previousFrameTime) / 1000, 0.034);
    state.previousFrameTime = timestamp;
    updateBattle(dt);
    renderArena();
    state.renderHandle = requestAnimationFrame(frame);
  };

  state.renderHandle = requestAnimationFrame(frame);
}

function updateBattle(dt) {
  if (state.battle.status !== "fighting") {
    updateParticles(dt);
    updateDebris(dt);
    return;
  }

  state.battle.time += dt;
  const [fighterA, fighterB] = state.battle.fighters;
  resolveCombatant(fighterA, fighterB, dt);
  resolveCombatant(fighterB, fighterA, dt);
  updateParticles(dt);
  updateDebris(dt);
  updateArenaHud();

  const alive = state.battle.fighters.filter((fighter) => !fighter.dead);
  if (alive.length <= 1) {
    finishBattle(alive[0] || fighterA, alive[0] === fighterA ? fighterB : fighterA);
    updateUI();
  }
}

function resolveCombatant(fighter, enemy, dt) {
  fighter.bleedRate = computeBleedRate(fighter);
  fighter.health = Math.max(0, fighter.health - fighter.bleedRate * dt);

  if (!fighter.dead && fighter.health <= 0) {
    killCombatant(fighter, enemy, "失血过量倒下");
    return;
  }

  if (fighter.dead) {
    fighter.actionTime += dt;
    return;
  }

  fighter.cooldown = Math.max(0, fighter.cooldown - dt);
  fighter.comboClock = Math.max(0, fighter.comboClock - dt);
  fighter.stagger = Math.max(0, fighter.stagger - dt);
  fighter.actionTime += dt;

  const dx = enemy.x - fighter.x;
  const distance = Math.abs(dx);
  fighter.facing = dx >= 0 ? 1 : -1;

  const availableLegs = countAttachedLegs(fighter);
  const mobilityFactor = availableLegs === 0 ? 0.18 : availableLegs === 1 ? 0.52 : 1;
  const targetDistance = clamp(fighter.roster.stats.reach + 28 - fighter.roster.style.aggression * 18, 52, 132);

  if (distance > targetDistance + 16 && fighter.stagger === 0) {
    fighter.velocity = fighter.facing * fighter.roster.stats.moveSpeed * mobilityFactor;
    fighter.x += fighter.velocity * dt;
    fighter.action = "move";
  } else if (distance < targetDistance - 20 && fighter.stagger === 0 && fighter.roster.style.key !== "brawler") {
    fighter.velocity = -fighter.facing * fighter.roster.stats.moveSpeed * 0.4 * mobilityFactor;
    fighter.x += fighter.velocity * dt;
    fighter.action = "move";
  } else {
    fighter.velocity = 0;
    if (fighter.action !== "attack" && fighter.action !== "hit") fighter.action = "idle";
  }

  fighter.x = clamp(fighter.x, 110, WORLD.width - 110);
  if (fighter.cooldown > 0 || fighter.stagger > 0 || enemy.dead) return;

  const reach = currentAttackReach(fighter);
  if (distance <= reach + 18) executeAttack(fighter, enemy);
}

function executeAttack(attacker, defender) {
  const attackWord = attacker.roster.weapon.hitWords[Math.floor(attacker.rand() * attacker.roster.weapon.hitWords.length)];
  const targetKey = chooseTargetLimb(attacker, defender);
  const target = defender.limbs[targetKey];
  if (!target || !target.attached) {
    attacker.cooldown = 0.22;
    return;
  }

  attacker.action = "attack";
  attacker.actionTime = 0;

  const evasion =
    clamp(
      defender.roster.stats.speed / 210 +
        countAttachedLegs(defender) * 0.02 -
        attacker.roster.stats.finesse / 420,
      0.04,
      0.28,
    ) * (defender.stagger > 0 ? 0.35 : 1);

  if (attacker.rand() < evasion) {
    defender.action = "move";
    defender.actionTime = 0;
    pushLog(`${defender.roster.displayName} 闪开了 ${attacker.roster.displayName} 的攻势。`);
    attacker.cooldown = clamp(0.42 + attacker.roster.weapon.weight * 0.16 - attacker.roster.style.combo * 0.08, 0.26, 0.74);
    return;
  }

  const baseDamage =
    attacker.roster.stats.power * 0.28 +
    attacker.roster.weapon.damage +
    attacker.roster.style.aggression * 8 +
    attacker.roster.stats.finesse * 0.08;
  const damage = baseDamage * (0.84 + attacker.rand() * 0.42);
  const guardMitigation =
    clamp(
      defender.roster.stats.guard / 170 +
        (defender.limbs.armL.attached || defender.limbs.armR.attached ? 0.06 : -0.04),
      0.08,
      0.34,
    ) * (targetKey === "head" || targetKey === "torso" ? 1 : 0.76);
  const netDamage = Math.max(8, damage * (1 - guardMitigation));
  const bleedDamage = attacker.roster.weapon.bleed * (0.5 + attacker.roster.style.precision * 0.34);
  const severChance =
    (attacker.roster.weapon.sever * 0.24 +
      attacker.roster.style.aggression * 0.06 +
      (targetKey === "armL" || targetKey === "armR" || targetKey === "legL" || targetKey === "legR" ? 0.08 : 0)) *
    (1 - (target.hp / target.maxHp) * 0.45);

  target.hp = Math.max(0, target.hp - netDamage);
  target.trauma = clamp(target.trauma + netDamage * 0.18 + bleedDamage * 4, 0, 100);
  defender.health = Math.max(0, defender.health - netDamage * 0.65);
  defender.stagger = clamp(netDamage / 54, 0.08, 0.45);
  defender.action = "hit";
  defender.actionTime = 0;
  defender.fallen = countAttachedLegs(defender) === 0;

  const skeleton = getSkeleton(defender, state.battle.time);
  const impact = impactPositionForLimb(skeleton, targetKey);
  spawnBlood(impact.x, impact.y, 8 + Math.round(netDamage / 8), defender.roster.palette.blood);

  pushLog(`${attacker.roster.displayName}${attackWord}${defender.roster.displayName}的${LIMB_LABELS[targetKey]}。`);

  if (target.attached && (target.hp <= 0 || attacker.rand() < severChance) && targetKey !== "torso") {
    detachLimb(defender, targetKey, impact);
    pushLog(`${defender.roster.displayName} 的${LIMB_LABELS[targetKey]}被彻底斩断。`);
  } else if (target.hp / target.maxHp < 0.28 && targetKey !== "torso") {
    pushLog(`${defender.roster.displayName} 的${LIMB_LABELS[targetKey]}几乎报废。`);
  }

  if (targetKey === "head" && target.hp <= 0) {
    defender.health = 0;
    killCombatant(defender, attacker, "头部遭到致命破坏");
  } else if (targetKey === "torso" && target.hp <= 0) {
    defender.health = 0;
    killCombatant(defender, attacker, "躯干崩溃，彻底失去生命体征");
  } else if (defender.health <= 0) {
    killCombatant(defender, attacker, "受创倒下");
  }

  attacker.cooldown = clamp(
    0.54 +
      attacker.roster.weapon.weight * 0.12 -
      attacker.roster.style.combo * 0.18 -
      attacker.roster.stats.speed * 0.0032,
    0.18,
    0.92,
  );
}

function chooseTargetLimb(attacker, defender) {
  const entries = LIMB_ORDER.map((key) => {
    const limb = defender.limbs[key];
    if (!limb.attached && key !== "torso") return { key, weight: 0 };

    let weight = attacker.roster.style.targetBias[key] || 1;
    if (key === "head" && defender.health < defender.maxHealth * 0.36) weight += 0.4;
    if ((key === "legL" || key === "legR") && countAttachedLegs(defender) > 0) weight += 0.08 * attacker.roster.style.aggression;
    if ((key === "armL" || key === "armR") && defender.usedWeapon) weight += 0.15;
    if (limb.hp / limb.maxHp < 0.4) weight += 0.25;
    return { key, weight };
  });

  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = attacker.rand() * total;
  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.key;
  }
  return "torso";
}

function detachLimb(fighter, limbKey, impact) {
  const limb = fighter.limbs[limbKey];
  if (!limb.attached) return;

  limb.attached = false;
  limb.destroyed = true;
  limb.hp = 0;
  fighter.health = Math.max(0, fighter.health - limb.maxHp * 0.18);
  fighter.fallen = countAttachedLegs(fighter) === 0;
  if (limbKey === "armR") fighter.weaponDropped = fighter.roster.weapon.key !== "unarmed";

  state.battle.debris.push({
    kind: limbKey,
    fighter,
    x: impact.x,
    y: impact.y,
    vx: (fighter.facing === 1 ? -1 : 1) * (50 + fighter.rand() * 120),
    vy: -180 - fighter.rand() * 120,
    rotation: fighter.rand() * Math.PI,
    rotationVelocity: (fighter.rand() - 0.5) * 7,
    settled: false,
  });

  spawnBlood(impact.x, impact.y, 16, fighter.roster.palette.blood);
}

function killCombatant(victim, attacker, reason) {
  if (victim.dead) return;
  victim.dead = true;
  victim.health = 0;
  victim.action = "dead";
  victim.actionTime = 0;
  victim.velocity = 0;
  victim.deathPose = deriveDeathPose(victim, attacker);
  pushLog(`${victim.roster.displayName}${reason}。`);
}

function finishBattle(aliveCandidate, otherCandidate) {
  const fighterA = state.battle.fighters[0];
  const fighterB = state.battle.fighters[1];
  let winner = aliveCandidate;
  let loser = otherCandidate;

  if (!winner || winner.dead) {
    winner = fighterA.health >= fighterB.health ? fighterA : fighterB;
    loser = winner === fighterA ? fighterB : fighterA;
    winner.dead = false;
    winner.health = Math.max(6, winner.health);
  }

  loser.dead = true;
  loser.health = 0;
  if (!loser.deathPose) loser.deathPose = deriveDeathPose(loser, winner);

  winner.victoryPose = deriveVictoryPose(winner);
  winner.action = "victory";
  winner.actionTime = 0;

  state.battle.status = "finished";
  state.battle.winner = winner;
  state.battle.loser = loser;
  state.battle.shareUrl = buildShareUrl();
  state.sharePayload = buildSharePayload();

  pushLog(`${winner.roster.displayName} 站到了最后。`);
}

function deriveVictoryPose(fighter) {
  const arms = countAttachedArms(fighter);
  const legs = countAttachedLegs(fighter);
  if (arms >= 2 && legs >= 2) return "salute";
  if (arms === 1 && legs >= 1) return "single-arm";
  if (arms === 0 && legs >= 1) return "torso-pride";
  return "crouch";
}

function deriveDeathPose(victim, attacker) {
  const fallenForward = attacker ? attacker.x < victim.x : true;
  if (countAttachedLegs(victim) === 0) return fallenForward ? "collapse-forward" : "collapse-back";
  if (countAttachedArms(victim) === 0) return fallenForward ? "slump-forward" : "slump-back";
  return fallenForward ? "sprawl-forward" : "sprawl-back";
}

function computeBleedRate(fighter) {
  let total = 0;
  for (const limbKey of LIMB_ORDER) {
    const limb = fighter.limbs[limbKey];
    if (limb.attached) {
      const damageRatio = 1 - limb.hp / limb.maxHp;
      total += limb.bleedFactor * damageRatio * (damageRatio > 0.48 ? 3.6 : 1.8);
    } else if (limbKey !== "torso") {
      total += limb.bleedFactor * 5.2;
    }
  }
  return total / fighter.roster.stats.bleedResistance;
}

function currentAttackReach(fighter) {
  const weaponReach = fighter.weaponDropped || !fighter.limbs.armR.attached ? WEAPON_LIBRARY.unarmed.reach : fighter.roster.weapon.reach;
  return weaponReach + fighter.roster.dimensions.arm + fighter.roster.body.reachBoost;
}

function countAttachedArms(fighter) {
  return Number(fighter.limbs.armL.attached) + Number(fighter.limbs.armR.attached);
}

function countAttachedLegs(fighter) {
  return Number(fighter.limbs.legL.attached) + Number(fighter.limbs.legR.attached);
}

function updateParticles(dt) {
  state.battle.particles = state.battle.particles.filter((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += WORLD.gravity * 0.65 * dt;
    particle.vx *= 0.992;
    return particle.life > 0;
  });
}

function updateDebris(dt) {
  state.battle.debris.forEach((chunk) => {
    if (chunk.settled) return;
    chunk.x += chunk.vx * dt;
    chunk.y += chunk.vy * dt;
    chunk.vy += WORLD.gravity * dt;
    chunk.rotation += chunk.rotationVelocity * dt;
    if (chunk.y >= WORLD.groundY + 8) {
      chunk.y = WORLD.groundY + 8;
      chunk.vy = 0;
      chunk.vx *= 0.82;
      chunk.rotationVelocity *= 0.7;
      if (Math.abs(chunk.vx) < 8) chunk.settled = true;
    }
  });
}

function spawnBlood(x, y, count, color) {
  for (let index = 0; index < count; index += 1) {
    state.battle.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 260,
      vy: -Math.random() * 260,
      radius: 3 + Math.random() * 4,
      life: 0.45 + Math.random() * 0.5,
      color,
    });
  }
}

function renderArena() {
  const ctx = arenaCtx;
  ctx.save();
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  drawBackdrop(ctx);
  drawGround(ctx);

  state.battle.debris.forEach((chunk) => drawDebris(ctx, chunk));

  const fighters = state.battle.status === "fighting" || state.battle.status === "finished" ? state.battle.fighters : state.previewFighters;
  const sorted = [...fighters].sort((left, right) => left.x - right.x);

  sorted.forEach((fighter) => drawShadow(ctx, fighter));
  sorted.forEach((fighter) => drawFighter(ctx, fighter));

  state.battle.particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawBackdrop(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  sky.addColorStop(0, "#20253d");
  sky.addColorStop(0.42, "#111728");
  sky.addColorStop(1, "#090a10");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  const time = state.battle.time || performance.now() * 0.001;
  for (let index = 0; index < 7; index += 1) {
    const x = 120 + index * 180 + Math.sin(time * 0.15 + index) * 14;
    const y = 80 + Math.cos(time * 0.18 + index * 0.7) * 10;
    const radius = 80 + index * 14;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, index % 2 === 0 ? "rgba(255, 209, 102, 0.08)" : "rgba(64, 201, 255, 0.07)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(ctx) {
  const floor = ctx.createLinearGradient(0, WORLD.groundY - 40, 0, WORLD.height);
  floor.addColorStop(0, "#1a1e2d");
  floor.addColorStop(1, "#07080d");
  ctx.fillStyle = floor;
  ctx.fillRect(0, WORLD.groundY, WORLD.width, WORLD.height - WORLD.groundY);

  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, WORLD.groundY);
  ctx.lineTo(WORLD.width, WORLD.groundY);
  ctx.stroke();

  for (let index = 0; index < 24; index += 1) {
    const x = index * 60 + 20;
    ctx.fillStyle = `rgba(255, 70, 109, ${0.03 + (index % 4) * 0.01})`;
    ctx.beginPath();
    ctx.ellipse(x + Math.sin(index) * 16, WORLD.groundY + 24 + (index % 3) * 5, 36, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShadow(ctx, fighter) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.beginPath();
  ctx.ellipse(fighter.x, WORLD.groundY + 14, fighter.roster.dimensions.leg * 0.54, 18, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFighter(ctx, fighter) {
  const skeleton = getSkeleton(fighter, state.battle.time);
  drawWeapon(ctx, fighter, skeleton);
  drawTorso(ctx, fighter, skeleton);
  drawLimb(ctx, fighter, skeleton, "legL");
  drawLimb(ctx, fighter, skeleton, "legR");
  drawLimb(ctx, fighter, skeleton, "armL");
  drawLimb(ctx, fighter, skeleton, "armR");
  drawHead(ctx, fighter, skeleton);

  if (fighter.bleedRate > 6 && !fighter.dead) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.font = '700 20px "Chakra Petch", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`${fighter.bleedRate.toFixed(1)}/s`, fighter.x, skeleton.head.y - fighter.roster.dimensions.head - 26);
  }
}

function drawTorso(ctx, fighter, skeleton) {
  const torso = fighter.limbs.torso;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = fighter.dead ? "rgba(255,255,255,0.35)" : fighter.roster.palette.primary;
  ctx.lineWidth = fighter.roster.dimensions.line + 1;
  ctx.beginPath();
  ctx.moveTo(skeleton.hip.x, skeleton.hip.y);
  ctx.lineTo(skeleton.neck.x, skeleton.neck.y);
  ctx.stroke();

  if (torso.hp / torso.maxHp < 0.55 || fighter.dead) {
    ctx.strokeStyle = "rgba(255, 77, 109, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lerp(skeleton.hip.x, skeleton.neck.x, 0.35), lerp(skeleton.hip.y, skeleton.neck.y, 0.35));
    ctx.lineTo(lerp(skeleton.hip.x, skeleton.neck.x, 0.62), lerp(skeleton.hip.y, skeleton.neck.y, 0.62));
    ctx.stroke();
  }
}

function drawLimb(ctx, fighter, skeleton, limbKey) {
  const limb = fighter.limbs[limbKey];
  const start = limbKey.startsWith("arm") ? skeleton.shoulders[limbKey] : skeleton.hips[limbKey];
  if (!limb.attached) {
    ctx.fillStyle = fighter.roster.palette.blood;
    ctx.beginPath();
    ctx.arc(start.x, start.y, fighter.roster.dimensions.line * 0.52, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const end = skeleton.limbEnds[limbKey];
  const ratio = limb.hp / limb.maxHp;
  ctx.strokeStyle = ratio < 0.4 ? fighter.roster.palette.blood : fighter.roster.palette.secondary;
  ctx.lineWidth = fighter.roster.dimensions.line;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function drawHead(ctx, fighter, skeleton) {
  if (!fighter.limbs.head.attached) return;

  const radius = fighter.roster.dimensions.head;
  ctx.save();
  ctx.beginPath();
  ctx.arc(skeleton.head.x, skeleton.head.y, radius, 0, Math.PI * 2);
  ctx.clip();
  drawImageCover(ctx, fighter.roster.portrait.image, skeleton.head.x - radius, skeleton.head.y - radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.strokeStyle = fighter.dead ? "rgba(255,255,255,0.48)" : fighter.roster.palette.metal;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(skeleton.head.x, skeleton.head.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  if (fighter.limbs.head.hp / fighter.limbs.head.maxHp < 0.38) {
    ctx.strokeStyle = fighter.roster.palette.blood;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(skeleton.head.x - radius * 0.35, skeleton.head.y - radius * 0.15);
    ctx.lineTo(skeleton.head.x + radius * 0.24, skeleton.head.y + radius * 0.28);
    ctx.stroke();
  }
}

function drawWeapon(ctx, fighter, skeleton) {
  if (fighter.weaponDropped || !fighter.limbs.armR.attached || fighter.roster.weapon.key === "unarmed") return;

  const hand = skeleton.limbEnds.armR;
  const shoulder = skeleton.shoulders.armR;
  const angle = Math.atan2(hand.y - shoulder.y, hand.x - shoulder.x);
  const length = fighter.roster.weapon.reach * 0.8;
  const tip = { x: hand.x + Math.cos(angle) * length, y: hand.y + Math.sin(angle) * length };

  ctx.strokeStyle = fighter.roster.palette.metal;
  ctx.lineWidth = Math.max(4, fighter.roster.dimensions.line * 0.42);
  ctx.beginPath();
  ctx.moveTo(hand.x, hand.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  ctx.fillStyle = fighter.roster.palette.secondary;
  ctx.beginPath();
  ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawDebris(ctx, chunk) {
  ctx.save();
  ctx.translate(chunk.x, chunk.y);
  ctx.rotate(chunk.rotation);

  if (chunk.kind === "head") {
    const radius = chunk.fighter.roster.dimensions.head * 0.82;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.clip();
    drawImageCover(ctx, chunk.fighter.roster.portrait.image, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
    return;
  }

  ctx.strokeStyle = chunk.fighter.roster.palette.secondary;
  ctx.lineWidth = Math.max(6, chunk.fighter.roster.dimensions.line * 0.85);
  ctx.beginPath();
  ctx.moveTo(-22, 0);
  ctx.lineTo(22, 0);
  ctx.stroke();

  ctx.fillStyle = chunk.fighter.roster.palette.blood;
  ctx.beginPath();
  ctx.arc(-22, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function getSkeleton(fighter, time) {
  if (fighter.dead && fighter.deathPose) return deriveDeathSkeleton(fighter);
  if (fighter.victoryPose) return deriveVictorySkeleton(fighter);

  const dims = fighter.roster.dimensions;
  const t = time + (fighter.roster.seed % 1000) * 0.0001;
  const facing = fighter.facing;
  const motion = clamp(Math.abs(fighter.velocity) / 120, 0, 1);
  const swing = Math.sin(t * (fighter.dead ? 2.2 : 7.2) + fighter.roster.seed) * 0.28;

  let torsoLean = facing * 0.06;
  let armLAngle = mirrorAngle(2.12, facing) + swing * 0.45 * motion;
  let armRAngle = mirrorAngle(1.02, facing) - swing * 0.52 * motion;
  let legLAngle = mirrorAngle(1.7, facing) - swing * 0.55 * motion;
  let legRAngle = mirrorAngle(1.48, facing) + swing * 0.55 * motion;
  let yOffset = 0;

  if (fighter.action === "attack") {
    torsoLean = facing * 0.18;
    armRAngle = mirrorAngle(0.28, facing);
    armLAngle = mirrorAngle(2.4, facing);
    legLAngle = mirrorAngle(1.86, facing);
    legRAngle = mirrorAngle(1.18, facing);
  } else if (fighter.action === "hit") {
    torsoLean = -facing * 0.14;
    armLAngle = mirrorAngle(2.42, facing);
    armRAngle = mirrorAngle(0.84, facing);
  }

  if (countAttachedLegs(fighter) === 0) {
    yOffset = 36;
    torsoLean = facing * 0.24;
    legLAngle = mirrorAngle(1.5, facing);
    legRAngle = mirrorAngle(1.62, facing);
  } else if (countAttachedLegs(fighter) === 1) {
    yOffset = 18;
  }

  const hip = { x: fighter.x, y: fighter.y + yOffset };
  const neck = pointFromAngle(hip, dims.torso, -Math.PI / 2 + torsoLean);
  const head = pointFromAngle(neck, dims.head + 8, -Math.PI / 2 + torsoLean * 0.5);
  const shoulderOffset = perpendicularUnit(-Math.PI / 2 + torsoLean);
  const hipOffset = perpendicularUnit(-Math.PI / 2 + torsoLean);
  const shoulders = {
    armL: { x: neck.x - shoulderOffset.x * dims.shoulder, y: neck.y - shoulderOffset.y * dims.shoulder },
    armR: { x: neck.x + shoulderOffset.x * dims.shoulder, y: neck.y + shoulderOffset.y * dims.shoulder },
  };
  const hips = {
    legL: { x: hip.x - hipOffset.x * dims.hip, y: hip.y - hipOffset.y * dims.hip },
    legR: { x: hip.x + hipOffset.x * dims.hip, y: hip.y + hipOffset.y * dims.hip },
  };

  return {
    hip,
    neck,
    head,
    shoulders,
    hips,
    limbEnds: {
      armL: pointFromAngle(shoulders.armL, dims.arm, armLAngle),
      armR: pointFromAngle(shoulders.armR, dims.arm, armRAngle),
      legL: pointFromAngle(hips.legL, dims.leg, legLAngle),
      legR: pointFromAngle(hips.legR, dims.leg, legRAngle),
    },
  };
}

function deriveVictorySkeleton(fighter) {
  const dims = fighter.roster.dimensions;
  const facing = fighter.facing;
  const hip = { x: fighter.x, y: fighter.y + (countAttachedLegs(fighter) < 2 ? 18 : 0) };
  const neck = pointFromAngle(hip, dims.torso, -Math.PI / 2 + facing * 0.04);
  const head = pointFromAngle(neck, dims.head + 8, -Math.PI / 2);
  const offset = perpendicularUnit(-Math.PI / 2);
  const shoulders = {
    armL: { x: neck.x - offset.x * dims.shoulder, y: neck.y - offset.y * dims.shoulder },
    armR: { x: neck.x + offset.x * dims.shoulder, y: neck.y + offset.y * dims.shoulder },
  };
  const hips = {
    legL: { x: hip.x - offset.x * dims.hip, y: hip.y - offset.y * dims.hip },
    legR: { x: hip.x + offset.x * dims.hip, y: hip.y + offset.y * dims.hip },
  };

  let armLAngle = mirrorAngle(2.3, facing);
  let armRAngle = mirrorAngle(0.82, facing);
  let legLAngle = mirrorAngle(1.64, facing);
  let legRAngle = mirrorAngle(1.44, facing);

  switch (fighter.victoryPose) {
    case "salute":
      armLAngle = mirrorAngle(4.22, facing);
      armRAngle = mirrorAngle(5.3, facing);
      break;
    case "single-arm":
      armLAngle = fighter.limbs.armL.attached ? mirrorAngle(4.12, facing) : mirrorAngle(2.16, facing);
      armRAngle = fighter.limbs.armR.attached ? mirrorAngle(5.46, facing) : mirrorAngle(0.88, facing);
      break;
    case "torso-pride":
      armLAngle = mirrorAngle(2.54, facing);
      armRAngle = mirrorAngle(0.56, facing);
      break;
    case "crouch":
      armLAngle = mirrorAngle(2.08, facing);
      armRAngle = mirrorAngle(0.96, facing);
      legLAngle = mirrorAngle(1.84, facing);
      legRAngle = mirrorAngle(1.26, facing);
      break;
  }

  return {
    hip,
    neck,
    head,
    shoulders,
    hips,
    limbEnds: {
      armL: pointFromAngle(shoulders.armL, dims.arm, armLAngle),
      armR: pointFromAngle(shoulders.armR, dims.arm, armRAngle),
      legL: pointFromAngle(hips.legL, dims.leg, legLAngle),
      legR: pointFromAngle(hips.legR, dims.leg, legRAngle),
    },
  };
}

function deriveDeathSkeleton(fighter) {
  const pose = fighter.deathPose || "sprawl-forward";
  const hip = { x: fighter.x, y: fighter.y + 42 };
  const neck = { x: hip.x + (pose.includes("forward") ? 52 : -52), y: hip.y - 26 };
  const head = { x: neck.x + (pose.includes("forward") ? 24 : -24), y: neck.y + 12 };
  const shoulders = { armL: { x: neck.x - 10, y: neck.y - 10 }, armR: { x: neck.x + 10, y: neck.y + 10 } };
  const hips = { legL: { x: hip.x - 16, y: hip.y + 8 }, legR: { x: hip.x + 16, y: hip.y - 6 } };

  return {
    hip,
    neck,
    head,
    shoulders,
    hips,
    limbEnds: {
      armL: { x: shoulders.armL.x - 56, y: shoulders.armL.y + (pose.includes("forward") ? 28 : 4) },
      armR: { x: shoulders.armR.x + 56, y: shoulders.armR.y + (pose.includes("forward") ? 8 : 26) },
      legL: { x: hips.legL.x - 70, y: hips.legL.y + 32 },
      legR: { x: hips.legR.x + 70, y: hips.legR.y + 20 },
    },
  };
}

function impactPositionForLimb(skeleton, limbKey) {
  switch (limbKey) {
    case "head":
      return skeleton.head;
    case "torso":
      return { x: lerp(skeleton.hip.x, skeleton.neck.x, 0.62), y: lerp(skeleton.hip.y, skeleton.neck.y, 0.62) };
    default:
      if (limbKey.startsWith("arm")) return midpoint(skeleton.shoulders[limbKey], skeleton.limbEnds[limbKey]);
      return midpoint(skeleton.hips[limbKey], skeleton.limbEnds[limbKey]);
  }
}

function buildResultSummary() {
  if (!state.battle.winner || !state.battle.loser) return "";

  const winner = state.battle.winner;
  const loser = state.battle.loser;
  const winnerArms = countAttachedArms(winner);
  const winnerLegs = countAttachedLegs(winner);
  const loserBleed = computeBleedRate(loser);

  return `${winner.roster.displayName} 以 ${Math.round(winner.health)} 点剩余生命存活，终局姿态为「${victoryLabel(winner.victoryPose)}」。${loser.roster.displayName} 倒下时流血速度达到 ${loserBleed.toFixed(1)}/s。胜者剩余手臂 ${winnerArms} 条、腿部 ${winnerLegs} 条。`;
}

function victoryLabel(pose) {
  switch (pose) {
    case "salute":
      return "凯旋举臂";
    case "single-arm":
      return "独臂示威";
    case "torso-pride":
      return "挺胸怒吼";
    case "crouch":
      return "残躯蹲踞";
    default:
      return "终局定格";
  }
}

function buildSharePayload() {
  if (!state.battle.winner || !state.battle.loser) return null;

  return {
    version: 1,
    finishedAt: Date.now(),
    winnerSlot: state.battle.winner.roster.slot,
    elapsed: Number(state.battle.time.toFixed(1)),
    fighters: ["A", "B"].map((slot) => {
      const roster = state.roster[slot];
      return { slot, name: roster.displayName, style: roster.style.label, weapon: roster.weapon.label, body: roster.body.label, seed: roster.seed >>> 0 };
    }),
  };
}

function buildShareUrl() {
  const payload = buildSharePayload();
  if (!payload) return "";
  const encoded = encodePayload(payload);
  return `${location.origin}${location.pathname}?share=${encoded}`;
}

function hydrateShareBanner() {
  const payload = readPayloadFromLocation();
  if (!payload) {
    dom.shareBanner.hidden = true;
    return;
  }

  dom.shareBanner.hidden = false;
  dom.shareBannerContent.innerHTML = "";

  const winner = payload.fighters.find((fighter) => fighter.slot === payload.winnerSlot);
  const loser = payload.fighters.find((fighter) => fighter.slot !== payload.winnerSlot);

  const lead = document.createElement("p");
  lead.textContent = `${winner.name} 在 ${payload.elapsed.toFixed(1)} 秒时击败了 ${loser.name}。`;

  const meta = document.createElement("p");
  meta.className = "meta-line";
  meta.textContent = `${winner.style} / ${winner.weapon} / ${winner.body}`;

  const reminder = document.createElement("p");
  reminder.textContent = "这条链接只保留战报，不会携带原始照片。要重现玩法，请重新上传两张人像。";

  dom.shareBannerContent.append(lead, meta, reminder);
}

async function copyShareLink() {
  const url = state.battle.shareUrl || buildShareUrl();
  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);
    pushLog("战报链接已复制。");
  } catch (error) {
    console.error(error);
    pushLog("当前环境无法自动复制链接，请手动复制地址栏。");
  }
}

async function preparePosterAndOpen() {
  if (state.battle.status !== "finished") return;
  const blob = await renderPoster();
  if (!blob) return;

  resetPosterState();
  state.posterFile = new File([blob], "portrait-pit-poster.png", { type: "image/png" });
  state.posterUrl = URL.createObjectURL(blob);
  dom.posterPreview.src = state.posterUrl;
  dom.downloadPosterLink.href = state.posterUrl;
  dom.posterDialog.showModal();
}

async function sharePosterNatively() {
  if (!state.posterFile) return;

  const shareData = {
    title: "Portrait Pit 战报",
    text: `${state.battle.winner.roster.displayName} 成为了斗场赢家。`,
    url: state.battle.shareUrl,
    files: [state.posterFile],
  };

  try {
    if (navigator.canShare && navigator.canShare({ files: shareData.files })) {
      await navigator.share(shareData);
      pushLog("已调用系统分享。");
    } else if (navigator.share) {
      await navigator.share({ title: shareData.title, text: `${shareData.text}\n${shareData.url}` });
      pushLog("当前设备不支持分享图片文件，已分享文字链接。");
    } else {
      pushLog("浏览器不支持系统分享，请下载海报并手动发送。");
    }
  } catch (error) {
    console.error(error);
    pushLog("分享被取消或失败。");
  }
}

async function renderPoster() {
  if (!state.battle.winner || !state.battle.loser) return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#161b2e");
  gradient.addColorStop(0.54, "#0f121d");
  gradient.addColorStop(1, "#07080d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let index = 0; index < 18; index += 1) {
    ctx.fillRect(60 + (index % 6) * 165, 120 + Math.floor(index / 6) * 132, 120, 2);
  }

  ctx.fillStyle = "#ffd166";
  ctx.font = '700 46px "Chakra Petch", "Noto Sans SC", sans-serif';
  ctx.fillText("PORTRAIT PIT", 84, 122);

  ctx.fillStyle = "#f5f4ef";
  ctx.font = '900 88px "Noto Sans SC", "Chakra Petch", sans-serif';
  ctx.fillText("终局战报", 84, 230);

  const winner = state.battle.winner.roster;
  const loser = state.battle.loser.roster;
  drawPosterCard(ctx, winner, 84, 320, 420, 640, true);
  drawPosterCard(ctx, loser, 576, 412, 420, 640, false);

  ctx.fillStyle = "#ff6b35";
  ctx.font = '700 34px "Chakra Petch", sans-serif';
  ctx.fillText("WINNER", 84, 1030);
  ctx.fillStyle = "#f5f4ef";
  ctx.font = '700 72px "Noto Sans SC", sans-serif';
  ctx.fillText(winner.displayName, 84, 1118);

  ctx.fillStyle = "#a7acc4";
  ctx.font = '500 34px "Noto Sans SC", sans-serif';
  ctx.fillText(`用时 ${state.battle.time.toFixed(1)} 秒`, 84, 1180);
  ctx.fillText(`胜利姿态：${victoryLabel(state.battle.winner.victoryPose)}`, 84, 1230);
  ctx.fillText(`剩余血量 ${Math.round(state.battle.winner.health)} / ${Math.round(state.battle.winner.maxHealth)}`, 84, 1280);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(84, 1360, 912, 336);

  ctx.fillStyle = "#ffd166";
  ctx.font = '700 28px "Chakra Petch", sans-serif';
  ctx.fillText("SHARE LINK", 120, 1428);

  wrapPosterText(ctx, state.battle.shareUrl || buildShareUrl(), 120, 1488, 840, 42);

  ctx.fillStyle = "#a7acc4";
  wrapPosterText(
    ctx,
    "原始照片仅在本地参与生成与海报绘制，不进入分享链接。打开链接后可查看战报并重新上传照片试玩。",
    120,
    1608,
    840,
    40,
  );

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function drawPosterCard(ctx, roster, x, y, width, height, highlight) {
  ctx.save();
  ctx.fillStyle = highlight ? "rgba(255, 107, 53, 0.14)" : "rgba(255, 255, 255, 0.06)";
  ctx.strokeStyle = highlight ? "rgba(255, 209, 102, 0.45)" : "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, 32);
  ctx.fill();
  ctx.stroke();

  roundedRect(ctx, x + 30, y + 26, width - 60, 318, 28);
  ctx.save();
  ctx.clip();
  drawImageCover(ctx, roster.portrait.image, x + 30, y + 26, width - 60, 318);
  ctx.restore();

  ctx.fillStyle = "#f5f4ef";
  ctx.font = '700 48px "Noto Sans SC", sans-serif';
  ctx.fillText(roster.displayName, x + 30, y + 406);

  ctx.fillStyle = highlight ? "#ffd166" : "#a7acc4";
  ctx.font = '700 24px "Chakra Petch", sans-serif';
  ctx.fillText(roster.style.label, x + 30, y + 456);

  ctx.fillStyle = "#a7acc4";
  ctx.font = '500 26px "Noto Sans SC", sans-serif';
  ctx.fillText(roster.weapon.label, x + 30, y + 506);
  ctx.fillText(roster.body.label, x + 30, y + 548);
  ctx.fillText(`力量 ${roster.stats.power} / 速度 ${roster.stats.speed}`, x + 30, y + 598);
  ctx.restore();
}

function wrapPosterText(ctx, text, x, y, maxWidth, lineHeight) {
  ctx.fillStyle = ctx.fillStyle || "#f5f4ef";
  ctx.font = '500 30px "Noto Sans SC", sans-serif';
  const chars = [...text];
  let line = "";
  let row = 0;

  chars.forEach((char) => {
    const candidate = line + char;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, y + row * lineHeight);
      line = char;
      row += 1;
    } else {
      line = candidate;
    }
  });

  if (line) ctx.fillText(line, x, y + row * lineHeight);
}

function resetPosterState() {
  if (state.posterUrl) URL.revokeObjectURL(state.posterUrl);
  state.posterUrl = "";
  state.posterFile = null;
}

function resizeArenaCanvas() {
  const rect = dom.arenaCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const targetWidth = Math.max(1, Math.round(rect.width * dpr));
  const targetHeight = Math.max(1, Math.round(rect.height * dpr));

  if (dom.arenaCanvas.width !== targetWidth || dom.arenaCanvas.height !== targetHeight) {
    dom.arenaCanvas.width = targetWidth;
    dom.arenaCanvas.height = targetHeight;
  }

  arenaCtx.setTransform(targetWidth / WORLD.width, 0, 0, targetHeight / WORLD.height, 0, 0);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function extractPortraitFeatures(image) {
  const canvas = document.createElement("canvas");
  const size = 96;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  drawImageCover(ctx, image, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  let brightnessSum = 0;
  let contrastAccumulator = 0;
  let saturationSum = 0;
  let warmthSum = 0;
  let detailSum = 0;
  let symmetryDiff = 0;
  let weightedY = 0;
  let hueVectorX = 0;
  let hueVectorY = 0;
  let edgeTop = 0;
  let edgeBottom = 0;
  const luminanceGrid = Array.from({ length: size }, () => Array(size).fill(0));

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const r = data[index] / 255;
      const g = data[index + 1] / 255;
      const b = data[index + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const saturation = max === 0 ? 0 : (max - min) / max;
      const warmth = clamp((r - b + 1) / 2, 0, 1);
      const hue = rgbToHue(r, g, b);

      luminanceGrid[y][x] = luminance;
      brightnessSum += luminance;
      contrastAccumulator += (luminance - 0.5) ** 2;
      saturationSum += saturation;
      warmthSum += warmth;
      weightedY += luminance * (1 - y / (size - 1));
      hueVectorX += Math.cos(hue * Math.PI * 2);
      hueVectorY += Math.sin(hue * Math.PI * 2);
      if (y < size / 2) edgeTop += saturation;
      else edgeBottom += saturation;

      if (x < size / 2) {
        const mirrorIndex = (y * size + (size - 1 - x)) * 4;
        symmetryDiff += Math.abs(r - data[mirrorIndex] / 255);
        symmetryDiff += Math.abs(g - data[mirrorIndex + 1] / 255);
        symmetryDiff += Math.abs(b - data[mirrorIndex + 2] / 255);
      }
    }
  }

  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const lum = luminanceGrid[y][x];
      detailSum += Math.abs(lum - luminanceGrid[y][x + 1]);
      detailSum += Math.abs(lum - luminanceGrid[y + 1][x]);
    }
  }

  const pixels = size * size;
  const avgBrightness = brightnessSum / pixels;
  const contrast = Math.sqrt(contrastAccumulator / pixels) * 2.5;
  const detail = clamp(detailSum / (pixels * 2.2), 0, 1);
  const symmetry = clamp(1 - symmetryDiff / (pixels * 1.12), 0, 1);
  const avgHue = ((Math.atan2(hueVectorY, hueVectorX) / (Math.PI * 2)) + 1) % 1;

  return {
    brightness: clamp(avgBrightness, 0, 1),
    contrast: clamp(contrast, 0, 1),
    saturation: clamp(saturationSum / pixels, 0, 1),
    warmth: clamp(warmthSum / pixels, 0, 1),
    detail,
    symmetry,
    verticalFocus: clamp(weightedY / brightnessSum, 0, 1),
    edgeBalance: clamp(edgeTop / Math.max(1, edgeBottom), 0.55, 1.45) / 1.45,
    avgHue,
    hash: hashString([avgBrightness.toFixed(4), contrast.toFixed(4), detail.toFixed(4), symmetry.toFixed(4), avgHue.toFixed(4)].join("|")),
  };
}

function drawImageCover(ctx, image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  let drawWidth;
  let drawHeight;
  if (imageRatio > targetRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
  }
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function rgbToHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  if (max === r) return (((g - b) / delta) % 6) / 6;
  if (max === g) return ((b - r) / delta + 2) / 6;
  return ((r - g) / delta + 4) / 6;
}

function pointFromAngle(origin, length, angle) {
  return { x: origin.x + Math.cos(angle) * length, y: origin.y + Math.sin(angle) * length };
}

function perpendicularUnit(angle) {
  return { x: Math.cos(angle + Math.PI / 2), y: Math.sin(angle + Math.PI / 2) };
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function mirrorAngle(baseAngleRightFacing, facing) {
  return facing === 1 ? baseAngleRightFacing : Math.PI - baseAngleRightFacing;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return function next() {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function encodePayload(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodePayload(payload) {
  const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = padded + "=".repeat((4 - (padded.length % 4 || 4)) % 4);
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function readPayloadFromLocation() {
  const params = new URLSearchParams(location.search);
  const encoded = params.get("share");
  if (!encoded) return null;
  try {
    return decodePayload(encoded);
  } catch (error) {
    console.error(error);
    return null;
  }
}

init();
