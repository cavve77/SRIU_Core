export const WORLD = {
  width: 1280,
  height: 760,
  groundY: 640,
  gravity: 980,
};

export const LIMB_ORDER = ["head", "torso", "armL", "armR", "legL", "legR"];
export const LIMB_LABELS = {
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

const WEAPON_LIBRARY = {
  unarmed: { key: "unarmed", label: "空手", stance: "close", damage: 18, bleed: 0.72, sever: 0.5, weight: 0.46, reach: 66, block: 0.82, ranged: false },
  gauntlet: { key: "gauntlet", label: "战斗拳套", stance: "close", damage: 22, bleed: 0.82, sever: 0.62, weight: 0.58, reach: 76, block: 0.94, ranged: false },
  knife: { key: "knife", label: "军刀", stance: "close", damage: 24, bleed: 1.18, sever: 1.08, weight: 0.52, reach: 84, block: 0.86, ranged: false },
  rifle: { key: "rifle", label: "突击步枪", stance: "ranged", damage: 19, bleed: 0.64, sever: 0.42, weight: 0.68, reach: 156, block: 0.72, ranged: true },
  shotgun: { key: "shotgun", label: "霰弹枪", stance: "ranged", damage: 27, bleed: 0.78, sever: 0.6, weight: 0.94, reach: 132, block: 0.68, ranged: true },
  spear: { key: "spear", label: "长枪", stance: "mid", damage: 24, bleed: 0.92, sever: 0.88, weight: 0.8, reach: 134, block: 1.04, ranged: false },
  hammer: { key: "hammer", label: "战锤", stance: "mid", damage: 31, bleed: 0.58, sever: 0.82, weight: 1.16, reach: 102, block: 0.84, ranged: false },
  axe: { key: "axe", label: "重斧", stance: "mid", damage: 30, bleed: 1.18, sever: 1.34, weight: 1.08, reach: 108, block: 0.78, ranged: false },
  chain: { key: "chain", label: "链刃", stance: "mid", damage: 25, bleed: 1.24, sever: 1.16, weight: 0.72, reach: 122, block: 0.76, ranged: false },
};

const STYLE_LIBRARY = {
  commando: {
    key: "commando",
    label: "突击佣兵",
    description: "推进、压枪、快速换节奏。",
    aggression: 1.16,
    precision: 1.02,
    combo: 1.12,
    mobility: 1.08,
    guard: 0.92,
    spacing: 16,
    preferredWeapons: ["rifle", "shotgun", "knife"],
    targetBias: { head: 1.08, torso: 1.2, armL: 0.94, armR: 1.04, legL: 0.96, legR: 0.96 },
  },
  duelist: {
    key: "duelist",
    label: "镜锋决斗兵",
    description: "拉扯站位，优先切碎四肢。",
    aggression: 0.98,
    precision: 1.28,
    combo: 1.04,
    mobility: 1.1,
    guard: 1.06,
    spacing: 22,
    preferredWeapons: ["knife", "spear", "chain"],
    targetBias: { head: 0.96, torso: 0.92, armL: 1.2, armR: 1.2, legL: 1.16, legR: 1.16 },
  },
  berserker: {
    key: "berserker",
    label: "裂骨狂兵",
    description: "重击压制，硬拆护体。",
    aggression: 1.34,
    precision: 0.84,
    combo: 0.88,
    mobility: 0.92,
    guard: 0.74,
    spacing: 6,
    preferredWeapons: ["axe", "hammer", "gauntlet"],
    targetBias: { head: 0.94, torso: 1.18, armL: 1.06, armR: 1.06, legL: 1.18, legR: 1.18 },
  },
  phantom: {
    key: "phantom",
    label: "收割夜行者",
    description: "失血压制、切线怪异、断肢凶狠。",
    aggression: 1.14,
    precision: 1.22,
    combo: 1.1,
    mobility: 1.2,
    guard: 0.8,
    spacing: 18,
    preferredWeapons: ["chain", "knife", "rifle"],
    targetBias: { head: 1.06, torso: 0.9, armL: 1.24, armR: 1.24, legL: 1.12, legR: 1.12 },
  },
  monk: {
    key: "monk",
    label: "静脉武僧",
    description: "空手连段、格挡反打、近身凿穿。",
    aggression: 1.08,
    precision: 1.08,
    combo: 1.3,
    mobility: 1.26,
    guard: 0.9,
    spacing: 8,
    preferredWeapons: ["unarmed", "gauntlet", "spear"],
    targetBias: { head: 1.08, torso: 1.06, armL: 1.08, armR: 1.08, legL: 0.96, legR: 0.96 },
  },
  ranger: {
    key: "ranger",
    label: "游猎枪骑",
    description: "中距离压制，刺突与后撤交替。",
    aggression: 0.94,
    precision: 1.12,
    combo: 0.96,
    mobility: 1.04,
    guard: 1.04,
    spacing: 34,
    preferredWeapons: ["spear", "rifle", "shotgun"],
    targetBias: { head: 1, torso: 1.24, armL: 0.92, armR: 0.92, legL: 1.08, legR: 1.08 },
  },
};

const BODY_LIBRARY = {
  ranger: { key: "ranger", label: "游骑型体格", description: "肩宽适中，步幅稳，兼顾速度与厚度。", mass: 1, agility: 1.04, durability: 1.02, torsoScale: 1, armScale: 1, legScale: 1.02, headScale: 1 },
  brute: { key: "brute", label: "重装型体格", description: "胸背厚重，臂围夸张，扛打能力强。", mass: 1.2, agility: 0.86, durability: 1.22, torsoScale: 1.18, armScale: 1.16, legScale: 0.98, headScale: 0.94 },
  striker: { key: "striker", label: "突袭型体格", description: "腰窄腿长，冲刺和后撤更迅速。", mass: 0.92, agility: 1.22, durability: 0.94, torsoScale: 0.92, armScale: 0.96, legScale: 1.12, headScale: 0.98 },
  reaver: { key: "reaver", label: "猎剥型体格", description: "四肢修长，切线刁钻，擅长压出血。", mass: 0.96, agility: 1.12, durability: 0.98, torsoScale: 0.94, armScale: 1.1, legScale: 1.06, headScale: 1.02 },
  bulwark: { key: "bulwark", label: "壁垒型体格", description: "上半身宽厚，站桩和格挡性能更强。", mass: 1.1, agility: 0.94, durability: 1.16, torsoScale: 1.1, armScale: 1.04, legScale: 1, headScale: 0.96 },
};

const ATTACK_LIBRARY = {
  rushCombo: { key: "rushCombo", label: "狂袭连段", damage: 0.74, bleed: 0.92, sever: 0.72, recovery: 0.28, hits: 2, reachBonus: 10, advance: 24, knockback: 14, pose: "combo" },
  heavyCleave: { key: "heavyCleave", label: "重斩", damage: 1.26, bleed: 1.04, sever: 1.24, recovery: 0.7, hits: 1, reachBonus: 8, advance: 18, knockback: 26, pose: "heavy" },
  lungingThrust: { key: "lungingThrust", label: "突刺", damage: 0.92, bleed: 0.96, sever: 0.9, recovery: 0.44, hits: 1, reachBonus: 34, advance: 52, knockback: 18, pose: "lunge" },
  breaker: { key: "breaker", label: "破防重击", damage: 1.1, bleed: 0.86, sever: 0.88, recovery: 0.62, hits: 1, reachBonus: 12, advance: 18, knockback: 22, guardBreak: 1.35, pose: "breaker" },
  reap: { key: "reap", label: "收割横斩", damage: 0.98, bleed: 1.28, sever: 1.34, recovery: 0.56, hits: 1, reachBonus: 16, advance: 20, knockback: 20, pose: "reap" },
  burstFire: { key: "burstFire", label: "点射", damage: 0.54, bleed: 0.62, sever: 0.34, recovery: 0.34, hits: 3, reachBonus: 54, advance: 0, knockback: 10, ranged: true, pose: "burst" },
  buckshot: { key: "buckshot", label: "近距轰喷", damage: 0.92, bleed: 0.74, sever: 0.52, recovery: 0.6, hits: 2, reachBonus: 36, advance: 0, knockback: 24, ranged: true, pose: "burst" },
};

export function createBattleState() {
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

export function defaultFaceSelection() {
  return { x: 0.5, y: 0.34, size: 0.42 };
}

export async function createFaceSnapshot(image, selection) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  const minSide = Math.min(image.width, image.height);
  const cropSize = clamp(selection.size, 0.18, 0.78) * minSide;
  const centerX = clamp(selection.x, 0, 1) * image.width;
  const centerY = clamp(selection.y, 0, 1) * image.height;
  const sx = clamp(centerX - cropSize / 2, 0, image.width - cropSize);
  const sy = clamp(centerY - cropSize / 2, 0, image.height - cropSize);

  ctx.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/png");
  const faceImage = await loadImage(dataUrl);
  const features = extractPortraitFeatures(faceImage);
  return {
    selection: {
      x: clamp(selection.x, 0, 1),
      y: clamp(selection.y, 0, 1),
      size: clamp(selection.size, 0.18, 0.78),
    },
    dataUrl,
    image: faceImage,
    features,
  };
}

export function extractPortraitFeatures(image) {
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
    verticalFocus: clamp(weightedY / Math.max(brightnessSum, 0.0001), 0, 1),
    edgeBalance: clamp(edgeTop / Math.max(1, edgeBottom), 0.55, 1.45) / 1.45,
    avgHue,
    hash: hashString([avgBrightness.toFixed(4), contrast.toFixed(4), detail.toFixed(4), symmetry.toFixed(4), avgHue.toFixed(4)].join("|")),
  };
}

export function buildFighter(slot, upload, generatedAt) {
  const full = upload.features;
  const face = upload.face.features;
  const combined = blendFeatures(full, face);
  const seed = hashString(`${slot}|${generatedAt}|${upload.fileName}|${full.hash}|${face.hash}|${upload.face.selection.x.toFixed(3)}`);
  const rand = mulberry32(seed);
  const style = pickStyle(rand, combined);
  const body = pickBody(rand, combined);
  const weapon = pickWeapon(rand, style, combined);
  const palette = derivePalette(combined, rand);
  const stats = deriveStats(style, weapon, body, combined, rand);
  const dimensions = deriveDimensions(body, stats, rand);

  return {
    slot,
    seed,
    generatedAt,
    displayName: `斗士${slot}·${generateCallsign(rand)}`,
    features: combined,
    fullFeatures: full,
    faceFeatures: face,
    portrait: { src: upload.dataUrl, image: upload.image },
    face: { src: upload.face.dataUrl, image: upload.face.image, selection: upload.face.selection },
    style,
    body,
    weapon,
    palette,
    stats,
    dimensions,
  };
}

export function createPreviewCombatant(roster, x) {
  const fighter = createCombatant(roster, x);
  fighter.action = "idle";
  fighter.cooldown = 0.4;
  return fighter;
}

export function createBattle(rosterA, rosterB) {
  return {
    status: "fighting",
    fighters: [createCombatant(rosterA, 270), createCombatant(rosterB, 1010)],
    particles: [],
    debris: [],
    logs: [`${rosterA.displayName} 与 ${rosterB.displayName} 踏入斗场。`],
    time: 0,
    winner: null,
    loser: null,
    shareUrl: "",
  };
}

export function stepBattle(battle, dt, emitLog = () => {}) {
  if (battle.status !== "fighting") {
    updateParticles(battle, dt);
    updateDebris(battle, dt);
    return;
  }

  battle.time += dt;
  const [fighterA, fighterB] = battle.fighters;
  resolveCombatant(fighterA, fighterB, battle, dt, emitLog);
  resolveCombatant(fighterB, fighterA, battle, dt, emitLog);
  updateParticles(battle, dt);
  updateDebris(battle, dt);

  const alive = battle.fighters.filter((fighter) => !fighter.dead);
  if (alive.length <= 1) {
    finishBattle(battle, alive[0], emitLog);
  }
}

export function describeCombatState(fighter) {
  if (fighter.dead) return "死亡";
  if (fighter.victoryPose) return "胜利姿态";
  if (fighter.guardTime > 0.05) return "格挡";
  if (fighter.action === "attack") return "猛攻";
  if (fighter.action === "dash") return "冲刺";
  if (fighter.action === "hit") return "失衡";
  if (fighter.bleedRate > 12) return "大量失血";
  if (Math.abs(fighter.velocity) > 14) return "机动";
  return "待机";
}

export function countAttachedArms(fighter) {
  return Number(fighter.limbs.armL.attached) + Number(fighter.limbs.armR.attached);
}

export function countAttachedLegs(fighter) {
  return Number(fighter.limbs.legL.attached) + Number(fighter.limbs.legR.attached);
}

export function computeBleedRate(fighter) {
  let total = 0;
  for (const limbKey of LIMB_ORDER) {
    const limb = fighter.limbs[limbKey];
    if (limb.attached) {
      const damageRatio = 1 - limb.hp / limb.maxHp;
      total += limb.bleedFactor * damageRatio * (damageRatio > 0.52 ? 3.2 : 1.45);
    } else if (limbKey !== "torso") {
      total += limb.bleedFactor * 5.8;
    }
  }
  return total / fighter.roster.stats.bleedResistance;
}

export function buildResultSummary(battle) {
  if (!battle.winner || !battle.loser) return "";
  const winner = battle.winner;
  const loser = battle.loser;
  return `${winner.roster.displayName} 以 ${Math.round(winner.health)} 点剩余生命存活，终局姿态为「${victoryLabel(winner.victoryPose)}」。${loser.roster.displayName} 倒下时流血速度达到 ${computeBleedRate(loser).toFixed(1)}/s，失去手臂 ${2 - countAttachedArms(loser)} 条、腿部 ${2 - countAttachedLegs(loser)} 条。`;
}

export function victoryLabel(pose) {
  switch (pose) {
    case "salute":
      return "凯旋举枪";
    case "singleArm":
      return "独臂示威";
    case "torsoPride":
      return "挺胸怒吼";
    case "kneel":
      return "残躯半跪";
    default:
      return "终局定格";
  }
}

export function encodePayload(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodePayload(payload) {
  const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = padded + "=".repeat((4 - (padded.length % 4 || 4)) % 4);
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

export function pointFromAngle(origin, length, angle) {
  return { x: origin.x + Math.cos(angle) * length, y: origin.y + Math.sin(angle) * length };
}

export function perpendicularUnit(angle) {
  return { x: Math.cos(angle + Math.PI / 2), y: Math.sin(angle + Math.PI / 2) };
}

export function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function mirrorAngle(baseAngleRightFacing, facing) {
  return facing === 1 ? baseAngleRightFacing : Math.PI - baseAngleRightFacing;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function createCombatant(roster, x) {
  const limbMax = {
    head: 52 + roster.stats.guard * 0.24,
    torso: 120 + roster.stats.grit * 0.6,
    armL: 66 + roster.stats.power * 0.2,
    armR: 72 + roster.stats.power * 0.22,
    legL: 80 + roster.stats.grit * 0.24,
    legR: 80 + roster.stats.grit * 0.24,
  };
  return {
    roster,
    x,
    y: WORLD.groundY,
    velocity: 0,
    facing: roster.slot === "A" ? 1 : -1,
    action: "idle",
    actionTime: 0,
    cooldown: 0.45,
    stagger: 0,
    guardTime: 0,
    retreatTime: 0,
    dashTime: 0,
    decisionTime: 0,
    currentAttack: null,
    comboHeat: 0,
    bleedRate: 0,
    health: roster.stats.maxHealth,
    maxHealth: roster.stats.maxHealth,
    dead: false,
    deathPose: null,
    victoryPose: null,
    fallen: false,
    weaponDropped: false,
    rand: mulberry32(roster.seed ^ 0x71c39a4f),
    limbs: {
      head: createLimb("head", limbMax.head, 2.9),
      torso: createLimb("torso", limbMax.torso, 2.3),
      armL: createLimb("armL", limbMax.armL, 1.6),
      armR: createLimb("armR", limbMax.armR, 1.8),
      legL: createLimb("legL", limbMax.legL, 1.95),
      legR: createLimb("legR", limbMax.legR, 1.95),
    },
  };
}

function createLimb(key, maxHp, bleedFactor) {
  return { key, maxHp, hp: maxHp, attached: true, destroyed: false, bleedFactor, trauma: 0 };
}

function resolveCombatant(fighter, enemy, battle, dt, emitLog) {
  fighter.bleedRate = computeBleedRate(fighter);
  fighter.health = Math.max(0, fighter.health - fighter.bleedRate * dt);
  fighter.actionTime += dt;
  fighter.cooldown = Math.max(0, fighter.cooldown - dt);
  fighter.stagger = Math.max(0, fighter.stagger - dt);
  fighter.guardTime = Math.max(0, fighter.guardTime - dt);
  fighter.retreatTime = Math.max(0, fighter.retreatTime - dt);
  fighter.dashTime = Math.max(0, fighter.dashTime - dt);
  fighter.decisionTime = Math.max(0, fighter.decisionTime - dt);
  fighter.comboHeat = Math.max(0, fighter.comboHeat - dt * 0.45);

  if (!fighter.dead && fighter.health <= 0) {
    killCombatant(fighter, enemy, emitLog, "失血过量倒下");
    return;
  }

  if (fighter.dead) return;
  if (fighter.currentAttack && fighter.actionTime > fighter.currentAttack.recovery) {
    fighter.currentAttack = null;
    if (fighter.action === "attack") fighter.action = "idle";
  }

  const dx = enemy.x - fighter.x;
  const distance = Math.abs(dx);
  fighter.facing = dx >= 0 ? 1 : -1;
  const legs = countAttachedLegs(fighter);
  const arms = countAttachedArms(fighter);
  const mobility = legs === 0 ? 0.12 : legs === 1 ? 0.56 : 1;

  if (enemy.currentAttack && !enemy.dead && distance < currentAttackReach(enemy) + 68 && arms > 0 && fighter.stagger === 0) {
    const blockChance = fighter.guardTime > 0 ? 0.86 : clamp(0.08 + fighter.roster.stats.guard / 240 + fighter.roster.style.guard * 0.06, 0.1, 0.44);
    if (fighter.rand() < blockChance && fighter.guardTime <= 0.01) {
      fighter.guardTime = 0.24 + fighter.rand() * 0.22;
      fighter.action = "guard";
      fighter.actionTime = 0;
    } else if (legs > 0 && fighter.rand() < 0.12 + fighter.roster.stats.speed / 360) {
      fighter.retreatTime = 0.16 + fighter.rand() * 0.18;
    }
  }

  if (fighter.stagger > 0) {
    fighter.velocity *= 0.86;
    fighter.x += fighter.velocity * dt;
    fighter.action = "hit";
    fighter.x = clamp(fighter.x, 110, WORLD.width - 110);
    return;
  }

  if (enemy.dead) {
    fighter.velocity *= 0.86;
    fighter.action = "idle";
    return;
  }

  const preferredDistance = clamp(
    currentAttackReach(fighter) * (fighter.roster.weapon.stance === "ranged" ? 0.88 : 0.62) + fighter.roster.style.spacing,
    72,
    220,
  );

  let moveIntent = 0;
  if (fighter.retreatTime > 0) {
    moveIntent = -fighter.facing;
  } else if (distance > preferredDistance + 18) {
    moveIntent = fighter.facing;
  } else if (distance < preferredDistance - 22 && (fighter.roster.weapon.ranged || fighter.roster.style.key === "duelist" || fighter.roster.style.key === "ranger")) {
    moveIntent = -fighter.facing;
  } else if (distance < preferredDistance - 34 && fighter.rand() < 0.26) {
    moveIntent = -fighter.facing;
  }

  if (fighter.dashTime > 0) moveIntent = fighter.facing;
  const speedBoost = fighter.dashTime > 0 ? 1.68 : fighter.guardTime > 0 ? 0.48 : 1;
  fighter.velocity = moveIntent * fighter.roster.stats.moveSpeed * mobility * speedBoost;
  fighter.x += fighter.velocity * dt;
  fighter.x = clamp(fighter.x, 110, WORLD.width - 110);

  if (moveIntent !== 0) {
    fighter.action = fighter.dashTime > 0 ? "dash" : fighter.guardTime > 0 ? "guard" : "move";
  } else if (fighter.guardTime > 0) {
    fighter.action = "guard";
  } else if (fighter.action !== "attack") {
    fighter.action = "idle";
  }

  if (fighter.cooldown > 0 || fighter.decisionTime > 0) return;

  if (distance > preferredDistance + 54 && legs > 0 && fighter.rand() < 0.08 + fighter.roster.style.aggression * 0.04) {
    fighter.dashTime = 0.18 + fighter.rand() * 0.14;
    fighter.decisionTime = 0.16;
    fighter.action = "dash";
    fighter.actionTime = 0;
    return;
  }

  if (distance <= currentAttackReach(fighter) + 18) {
    const profile = chooseAttackProfile(fighter, enemy, distance);
    executeAttack(fighter, enemy, battle, profile, emitLog);
  }
}

function chooseAttackProfile(fighter, enemy, distance) {
  const entries = [];
  const push = (profile, score) => entries.push({ profile, score });

  push(ATTACK_LIBRARY.rushCombo, 1 + fighter.roster.style.combo * 0.18 + fighter.comboHeat * 0.1);
  push(ATTACK_LIBRARY.heavyCleave, 0.76 + fighter.roster.weapon.weight * 0.26);
  push(ATTACK_LIBRARY.lungingThrust, 0.7 + Math.max(0, distance - currentAttackReach(fighter) * 0.62) / 90);
  push(ATTACK_LIBRARY.breaker, 0.62 + enemy.guardTime * 0.9);
  push(ATTACK_LIBRARY.reap, 0.62 + (1 - enemy.limbs.armR.hp / enemy.limbs.armR.maxHp) * 0.26);

  if (fighter.roster.weapon.key === "rifle") {
    push(ATTACK_LIBRARY.burstFire, 1.16 + distance / 170);
    push(ATTACK_LIBRARY.lungingThrust, 0.54);
  }
  if (fighter.roster.weapon.key === "shotgun") push(ATTACK_LIBRARY.buckshot, 1 + (distance < 150 ? 0.34 : -0.12));
  if (fighter.roster.weapon.key === "axe" || fighter.roster.weapon.key === "hammer") {
    push(ATTACK_LIBRARY.heavyCleave, 1.24);
    push(ATTACK_LIBRARY.breaker, 1.04);
  }
  if (fighter.roster.weapon.key === "chain" || fighter.roster.weapon.key === "knife") push(ATTACK_LIBRARY.reap, 1.18);
  if (fighter.roster.weapon.key === "unarmed" || fighter.roster.weapon.key === "gauntlet") {
    push(ATTACK_LIBRARY.rushCombo, 1.3);
    push(ATTACK_LIBRARY.breaker, 0.88);
  }

  const total = entries.reduce((sum, entry) => sum + entry.score, 0);
  let cursor = fighter.rand() * total;
  for (const entry of entries) {
    cursor -= entry.score;
    if (cursor <= 0) return entry.profile;
  }
  return ATTACK_LIBRARY.rushCombo;
}

function executeAttack(attacker, defender, battle, profile, emitLog) {
  attacker.action = "attack";
  attacker.currentAttack = profile;
  attacker.actionTime = 0;
  attacker.cooldown = profile.recovery + attacker.roster.weapon.weight * 0.08 - attacker.roster.style.combo * 0.06;
  attacker.comboHeat = clamp(attacker.comboHeat + 0.18, 0, 1.2);

  if (profile.advance > 0) {
    attacker.x += attacker.facing * Math.min(profile.advance, Math.max(0, Math.abs(defender.x - attacker.x) - 24));
    attacker.x = clamp(attacker.x, 110, WORLD.width - 110);
  }

  const defense = resolveDefense(attacker, defender, profile, emitLog);
  if (defense === "parried" || defense === "dodged") return;

  for (let hitIndex = 0; hitIndex < profile.hits; hitIndex += 1) {
    if (defender.dead) break;
    applyHit(attacker, defender, battle, profile, defense, hitIndex, emitLog);
  }
}

function resolveDefense(attacker, defender, profile, emitLog) {
  const arms = countAttachedArms(defender);
  const legs = countAttachedLegs(defender);
  const activeGuard = defender.guardTime > 0.05 && arms > 0;
  const blockChance = activeGuard ? clamp(0.62 + defender.roster.stats.guard / 220 + defender.roster.style.guard * 0.08, 0.62, 0.92) : clamp(0.06 + defender.roster.stats.guard / 420 + arms * 0.04, 0.08, 0.3);
  const dodgeChance = activeGuard ? 0 : clamp(0.08 + defender.roster.stats.speed / 360 + legs * 0.03 - attacker.roster.stats.finesse / 520, 0.06, 0.24);

  if (activeGuard && defender.rand() < 0.11 + defender.roster.stats.finesse / 520 && !profile.ranged) {
    attacker.stagger = 0.38 + defender.rand() * 0.2;
    attacker.velocity = -attacker.facing * (60 + defender.roster.stats.power * 0.5);
    attacker.action = "hit";
    attacker.actionTime = 0;
    emitLog(`${defender.roster.displayName} 架住来势并反震了 ${attacker.roster.displayName}。`);
    return "parried";
  }
  if (defender.rand() < blockChance) {
    emitLog(`${defender.roster.displayName} 挡住了 ${attacker.roster.displayName} 的${profile.label}。`);
    return "blocked";
  }
  if (legs > 0 && defender.rand() < dodgeChance) {
    defender.retreatTime = 0.18 + defender.rand() * 0.14;
    defender.velocity = -defender.facing * defender.roster.stats.moveSpeed * 0.72;
    emitLog(`${defender.roster.displayName} 侧身闪开了 ${attacker.roster.displayName} 的${profile.label}。`);
    return "dodged";
  }
  return "open";
}

function applyHit(attacker, defender, battle, profile, defense, hitIndex, emitLog) {
  const targetKey = chooseTargetLimb(attacker, defender);
  const target = defender.limbs[targetKey];
  if (!target || !target.attached) return;

  const blockMitigation = defense === "blocked" ? clamp(0.38 + defender.roster.stats.guard / 180 - (profile.guardBreak || 1) * 0.08, 0.18, 0.72) : 0;
  const baseDamage = attacker.roster.stats.power * 0.14 + attacker.roster.weapon.damage * 0.82 + attacker.roster.style.aggression * 5.2 + attacker.roster.stats.finesse * 0.06;
  const perHitFactor = profile.damage * (0.82 + attacker.rand() * 0.34) / (profile.hits > 1 ? 1 + (profile.hits - 1) * 0.28 : 1);
  const damage = Math.max(8, baseDamage * perHitFactor * (1 - blockMitigation));
  const bleed = attacker.roster.weapon.bleed * profile.bleed * (0.46 + attacker.roster.style.precision * 0.28);
  const severChance = (attacker.roster.weapon.sever * 0.1 + profile.sever * 0.11 + attacker.roster.style.precision * 0.04 + (targetKey !== "torso" ? 0.04 : -0.02)) * (1 - (target.hp / target.maxHp) * 0.7);

  target.hp = Math.max(0, target.hp - damage);
  target.trauma = clamp(target.trauma + damage * 0.22 + bleed * 4.2, 0, 100);
  defender.health = Math.max(0, defender.health - damage * (targetKey === "torso" ? 0.72 : 0.6));
  defender.stagger = clamp(damage / defender.roster.stats.poise + profile.knockback / 70, 0.08, 0.48);
  defender.velocity = attacker.facing * profile.knockback;
  defender.action = "hit";
  defender.actionTime = 0;

  const impact = approximateImpact(defender, targetKey);
  spawnBlood(battle, impact.x, impact.y, 8 + Math.round(damage / 8), defender.roster.palette.blood);
  if (attacker.roster.weapon.ranged) spawnSpark(battle, impact.x, impact.y, 6, attacker.roster.palette.metal);

  emitLog(`${attacker.roster.displayName}${buildHitVerb(attacker, profile, hitIndex, targetKey)}${defender.roster.displayName}的${LIMB_LABELS[targetKey]}。`);

  if (targetKey !== "torso" && target.attached && (target.hp <= 0 || attacker.rand() < severChance)) {
    detachLimb(defender, targetKey, battle, impact);
    emitLog(`${defender.roster.displayName} 的${LIMB_LABELS[targetKey]}被彻底打断。`);
  } else if (targetKey !== "torso" && target.hp / target.maxHp < 0.26) {
    emitLog(`${defender.roster.displayName} 的${LIMB_LABELS[targetKey]}已经接近报废。`);
  }

  if (targetKey === "head" && target.hp <= 0) {
    defender.health = 0;
    killCombatant(defender, attacker, emitLog, "头部遭到致命破坏");
  } else if (targetKey === "torso" && target.hp <= 0) {
    defender.health = 0;
    killCombatant(defender, attacker, emitLog, "躯干崩溃，彻底失去生命体征");
  } else if (defender.health <= 0) {
    killCombatant(defender, attacker, emitLog, "受创倒下");
  }
}

function buildHitVerb(attacker, profile, hitIndex, targetKey) {
  if (attacker.roster.weapon.ranged) return profile.key === "buckshot" ? "以近距枪焰轰穿" : "用点射撕开";
  if (profile.key === "reap") return "横斩掀裂";
  if (profile.key === "heavyCleave") return "以重击砸碎";
  if (profile.key === "breaker") return "用破防重击凿开";
  if (profile.key === "lungingThrust") return "突刺贯穿";
  if (profile.key === "rushCombo" && hitIndex === 1) return "追打补穿";
  if (targetKey === "head") return "一记暴烈上挑砸中";
  return "猛扑切开";
}

function chooseTargetLimb(attacker, defender) {
  const entries = LIMB_ORDER.map((key) => {
    const limb = defender.limbs[key];
    if (!limb.attached && key !== "torso") return { key, weight: 0 };
    let weight = attacker.roster.style.targetBias[key] || 1;
    if (key === "head" && defender.health < defender.maxHealth * 0.42) weight += 0.36;
    if ((key === "armL" || key === "armR") && !defender.weaponDropped) weight += 0.18;
    if ((key === "legL" || key === "legR") && countAttachedLegs(defender) > 0) weight += 0.1;
    if (limb.hp / limb.maxHp < 0.46) weight += 0.24;
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

function currentAttackReach(fighter) {
  const armed = !fighter.weaponDropped && fighter.limbs.armR.attached;
  const weaponReach = armed ? fighter.roster.weapon.reach : WEAPON_LIBRARY.unarmed.reach;
  return weaponReach + fighter.roster.dimensions.upperArm + fighter.roster.dimensions.foreArm * 0.72;
}

function approximateImpact(fighter, targetKey) {
  const headY = fighter.y - fighter.roster.dimensions.upperLeg - fighter.roster.dimensions.lowerLeg - fighter.roster.dimensions.torsoHeight - 40;
  switch (targetKey) {
    case "head":
      return { x: fighter.x, y: headY };
    case "torso":
      return { x: fighter.x, y: headY + fighter.roster.dimensions.torsoHeight * 0.62 };
    case "armL":
      return { x: fighter.x - fighter.roster.dimensions.chestWidth * 0.75, y: headY + 90 };
    case "armR":
      return { x: fighter.x + fighter.roster.dimensions.chestWidth * 0.75, y: headY + 90 };
    case "legL":
      return { x: fighter.x - fighter.roster.dimensions.waistWidth * 0.5, y: fighter.y - fighter.roster.dimensions.lowerLeg * 0.72 };
    default:
      return { x: fighter.x + fighter.roster.dimensions.waistWidth * 0.5, y: fighter.y - fighter.roster.dimensions.lowerLeg * 0.72 };
  }
}

function detachLimb(fighter, limbKey, battle, impact) {
  const limb = fighter.limbs[limbKey];
  if (!limb.attached) return;
  limb.attached = false;
  limb.destroyed = true;
  limb.hp = 0;
  fighter.health = Math.max(0, fighter.health - limb.maxHp * 0.2);
  fighter.fallen = countAttachedLegs(fighter) === 0;
  if (limbKey === "armR") fighter.weaponDropped = fighter.roster.weapon.key !== "unarmed";

  battle.debris.push({
    kind: limbKey,
    fighter,
    x: impact.x,
    y: impact.y,
    vx: (fighter.facing === 1 ? -1 : 1) * (60 + fighter.rand() * 140),
    vy: -220 - fighter.rand() * 120,
    rotation: fighter.rand() * Math.PI,
    rotationVelocity: (fighter.rand() - 0.5) * 6,
    settled: false,
  });
  spawnBlood(battle, impact.x, impact.y, 18, fighter.roster.palette.blood);
}

function killCombatant(victim, attacker, emitLog, reason) {
  if (victim.dead) return;
  victim.dead = true;
  victim.health = 0;
  victim.action = "dead";
  victim.actionTime = 0;
  victim.velocity = 0;
  victim.deathPose = deriveDeathPose(victim, attacker);
  emitLog(`${victim.roster.displayName}${reason}。`);
}

function deriveDeathPose(victim, attacker) {
  const forward = attacker ? attacker.x < victim.x : true;
  if (countAttachedLegs(victim) === 0) return forward ? "collapseForward" : "collapseBack";
  if (countAttachedArms(victim) === 0) return forward ? "slumpForward" : "slumpBack";
  return forward ? "sprawlForward" : "sprawlBack";
}

function finishBattle(battle, survivor, emitLog) {
  const [fighterA, fighterB] = battle.fighters;
  let winner = survivor;
  let loser = survivor === fighterA ? fighterB : fighterA;
  if (!winner || winner.dead) {
    winner = fighterA.health >= fighterB.health ? fighterA : fighterB;
    loser = winner === fighterA ? fighterB : fighterA;
    winner.dead = false;
    winner.health = Math.max(8, winner.health);
  }
  loser.dead = true;
  loser.health = 0;
  if (!loser.deathPose) loser.deathPose = deriveDeathPose(loser, winner);

  winner.victoryPose = deriveVictoryPose(winner);
  winner.action = "victory";
  winner.actionTime = 0;
  battle.status = "finished";
  battle.winner = winner;
  battle.loser = loser;
  emitLog(`${winner.roster.displayName} 站到了最后。`);
}

function deriveVictoryPose(fighter) {
  const arms = countAttachedArms(fighter);
  const legs = countAttachedLegs(fighter);
  if (fighter.roster.weapon.ranged && arms >= 2 && legs >= 1) return "salute";
  if (arms === 1 && legs >= 1) return "singleArm";
  if (legs === 0) return "kneel";
  return "torsoPride";
}

function updateParticles(battle, dt) {
  battle.particles = battle.particles.filter((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += WORLD.gravity * particle.gravity * dt;
    particle.vx *= particle.drag;
    return particle.life > 0;
  });
}

function updateDebris(battle, dt) {
  battle.debris.forEach((chunk) => {
    if (chunk.settled) return;
    chunk.x += chunk.vx * dt;
    chunk.y += chunk.vy * dt;
    chunk.vy += WORLD.gravity * dt;
    chunk.rotation += chunk.rotationVelocity * dt;
    if (chunk.y >= WORLD.groundY + 6) {
      chunk.y = WORLD.groundY + 6;
      chunk.vy = 0;
      chunk.vx *= 0.78;
      chunk.rotationVelocity *= 0.72;
      if (Math.abs(chunk.vx) < 8) chunk.settled = true;
    }
  });
}

function spawnBlood(battle, x, y, count, color) {
  for (let index = 0; index < count; index += 1) {
    battle.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 260,
      vy: -Math.random() * 260,
      radius: 2.5 + Math.random() * 4.2,
      life: 0.4 + Math.random() * 0.56,
      color,
      drag: 0.992,
      gravity: 0.62,
      shape: "circle",
    });
  }
}

function spawnSpark(battle, x, y, count, color) {
  for (let index = 0; index < count; index += 1) {
    battle.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 320,
      vy: -80 - Math.random() * 180,
      radius: 1.4 + Math.random() * 2.6,
      life: 0.18 + Math.random() * 0.18,
      color,
      drag: 0.985,
      gravity: 0.42,
      shape: "square",
    });
  }
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

function rgbToHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  if (max === r) return (((g - b) / delta) % 6) / 6;
  if (max === g) return ((b - r) / delta + 2) / 6;
  return ((r - g) / delta + 4) / 6;
}

function hashString(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
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

function blendFeatures(full, face) {
  return {
    brightness: lerp(full.brightness, face.brightness, 0.38),
    contrast: lerp(full.contrast, face.contrast, 0.56),
    saturation: lerp(full.saturation, face.saturation, 0.52),
    warmth: lerp(full.warmth, face.warmth, 0.62),
    detail: lerp(full.detail, face.detail, 0.6),
    symmetry: lerp(full.symmetry, face.symmetry, 0.72),
    verticalFocus: full.verticalFocus,
    edgeBalance: lerp(full.edgeBalance, face.edgeBalance, 0.3),
    avgHue: lerp(full.avgHue, face.avgHue, 0.46),
    hash: hashString(`${full.hash}|${face.hash}`),
  };
}

function pickStyle(rand, features) {
  const entries = Object.values(STYLE_LIBRARY).map((style) => {
    let score = rand();
    score += features.detail * (style.key === "duelist" || style.key === "phantom" ? 0.5 : 0.18);
    score += features.symmetry * (style.key === "duelist" || style.key === "ranger" ? 0.38 : 0.12);
    score += features.contrast * (style.key === "berserker" || style.key === "commando" ? 0.36 : 0.08);
    score += features.warmth * (style.key === "commando" || style.key === "berserker" ? 0.22 : 0.1);
    score += (1 - features.brightness) * (style.key === "phantom" ? 0.24 : 0.06);
    score += features.edgeBalance * (style.key === "monk" ? 0.2 : 0.08);
    return { style, score };
  });
  entries.sort((left, right) => right.score - left.score);
  return entries[0].style;
}

function pickBody(rand, features) {
  const entries = Object.values(BODY_LIBRARY).map((body) => {
    let score = rand();
    score += features.verticalFocus * (body.key === "striker" || body.key === "reaver" ? 0.34 : 0.12);
    score += features.contrast * (body.key === "bulwark" || body.key === "brute" ? 0.24 : 0.1);
    score += features.detail * (body.key === "striker" ? 0.22 : 0.08);
    score += features.symmetry * (body.key === "ranger" ? 0.24 : 0.06);
    score += (1 - features.brightness) * (body.key === "brute" ? 0.28 : 0.08);
    return { body, score };
  });
  entries.sort((left, right) => right.score - left.score);
  return entries[0].body;
}

function pickWeapon(rand, style, features) {
  const pool = style.preferredWeapons.map((key, index) => ({
    weapon: WEAPON_LIBRARY[key],
    score: 1.26 - index * 0.1 + rand() * 0.56,
  }));
  if (features.detail > 0.56) pool.push({ weapon: WEAPON_LIBRARY.knife, score: 0.98 + rand() * 0.5 });
  if (features.symmetry > 0.64) pool.push({ weapon: WEAPON_LIBRARY.rifle, score: 0.92 + rand() * 0.52 });
  if (features.contrast > 0.54) pool.push({ weapon: WEAPON_LIBRARY.axe, score: 0.94 + rand() * 0.5 });
  if (features.warmth > 0.6) pool.push({ weapon: WEAPON_LIBRARY.shotgun, score: 0.94 + rand() * 0.46 });
  if (rand() < 0.16 + features.edgeBalance * 0.14) pool.push({ weapon: WEAPON_LIBRARY.unarmed, score: 1.28 + rand() * 0.42 });
  pool.sort((left, right) => right.score - left.score);
  return pool[0].weapon;
}

function deriveStats(style, weapon, body, features, rand) {
  const power = Math.round(clamp(56 + style.aggression * 14 + weapon.damage * 0.72 + body.mass * 12 + features.contrast * 16 + rand() * 10, 52, 99));
  const speed = Math.round(clamp(52 + style.mobility * 16 + body.agility * 18 - weapon.weight * 7 + features.detail * 10 + rand() * 8, 44, 99));
  const guard = Math.round(clamp(46 + style.guard * 18 + weapon.block * 12 + body.durability * 12 + features.symmetry * 14 + rand() * 9, 40, 99));
  const grit = Math.round(clamp(62 + body.durability * 20 + body.mass * 12 + (1 - features.brightness) * 14 + features.contrast * 8 + rand() * 8, 58, 99));
  const finesse = Math.round(clamp(48 + style.precision * 18 + features.detail * 20 + features.symmetry * 10 + rand() * 8, 42, 98));
  const maxHealth = Math.round(278 + grit * 1.86 + guard * 0.92 + body.mass * 64);
  const bleedResistance = clamp(0.9 + body.durability * 0.24 + guard / 240, 0.92, 1.54);
  const moveSpeed = clamp(speed * 1.24 + body.agility * 18 - weapon.weight * 12, 68, 158);
  const reach = Math.round(weapon.reach + finesse * 0.36 + style.precision * 8);
  const poise = Math.round(clamp(grit * 0.72 + guard * 0.54 + body.mass * 18, 72, 140));
  return { power, speed, guard, grit, finesse, maxHealth, bleedResistance, moveSpeed, reach, poise };
}

function deriveDimensions(body, stats, rand) {
  return {
    chestWidth: Math.round((58 + body.mass * 10 + stats.power * 0.12) * body.torsoScale + rand() * 4),
    waistWidth: Math.round((42 + body.durability * 8 + rand() * 3) * body.torsoScale),
    upperArm: Math.round((50 + body.armScale * 8 + stats.finesse * 0.08) * body.armScale),
    foreArm: Math.round((42 + body.armScale * 5 + stats.finesse * 0.06) * body.armScale),
    hand: Math.round(13 + body.armScale * 2 + rand() * 2),
    upperLeg: Math.round((64 + body.legScale * 8 + stats.speed * 0.08) * body.legScale),
    lowerLeg: Math.round((58 + body.legScale * 7 + stats.speed * 0.06) * body.legScale),
    foot: Math.round(18 + body.legScale * 4 + rand() * 3),
    torsoHeight: Math.round(74 + body.torsoScale * 10 + stats.grit * 0.1 + rand() * 4),
    neck: Math.round(16 + body.torsoScale * 3 + rand() * 2),
    headW: Math.round((44 + stats.finesse * 0.06) * body.headScale),
    headH: Math.round((54 + stats.finesse * 0.04) * body.headScale),
    line: clamp(3 + body.mass * 1.4 + stats.grit * 0.01, 4, 7),
  };
}

function derivePalette(features, rand) {
  const hue = (features.avgHue * 360 + rand() * 40 + 360) % 360;
  const accentHue = (hue + 142 + rand() * 32) % 360;
  const strapHue = (hue + 48 + rand() * 20) % 360;
  const skinHue = clamp(18 + features.warmth * 18 + (features.brightness - 0.5) * 8 + rand() * 4, 8, 42);
  const skinSat = clamp(36 + features.saturation * 18 + rand() * 6, 28, 64);
  const skinLight = clamp(48 + features.brightness * 24 - features.contrast * 10 + rand() * 4, 32, 74);
  return {
    armor: `hsl(${hue.toFixed(0)} 54% ${clamp(34 + features.brightness * 18, 28, 56).toFixed(0)}%)`,
    armorShadow: `hsl(${hue.toFixed(0)} 48% ${clamp(20 + features.brightness * 10, 16, 38).toFixed(0)}%)`,
    accent: `hsl(${accentHue.toFixed(0)} 76% ${clamp(48 + features.contrast * 16, 40, 68).toFixed(0)}%)`,
    strap: `hsl(${strapHue.toFixed(0)} 28% 26%)`,
    joint: "hsl(220 12% 18%)",
    boot: "hsl(220 18% 13%)",
    metal: "hsl(200 10% 74%)",
    blood: "hsl(352 88% 54%)",
    skin: `hsl(${skinHue.toFixed(0)} ${skinSat.toFixed(0)}% ${skinLight.toFixed(0)}%)`,
    skinShadow: `hsl(${skinHue.toFixed(0)} ${clamp(skinSat - 4, 24, 60).toFixed(0)}% ${clamp(skinLight - 16, 18, 58).toFixed(0)}%)`,
    skinHighlight: `hsl(${skinHue.toFixed(0)} ${clamp(skinSat - 12, 18, 54).toFixed(0)}% ${clamp(skinLight + 10, 44, 84).toFixed(0)}%)`,
  };
}

function generateCallsign(rand) {
  return `${CALLSIGN_FIRST[Math.floor(rand() * CALLSIGN_FIRST.length)]}${CALLSIGN_SECOND[Math.floor(rand() * CALLSIGN_SECOND.length)]}${CALLSIGN_SUFFIX[Math.floor(rand() * CALLSIGN_SUFFIX.length)]}`;
}
