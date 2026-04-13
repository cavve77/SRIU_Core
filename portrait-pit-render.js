import {
  WORLD,
  clamp,
  countAttachedArms,
  countAttachedLegs,
  mirrorAngle,
  pointFromAngle,
} from "./portrait-pit-core.js";

export function renderArena(ctx, { battle, previewFighters = [], time = 0 }) {
  const fighters = battle?.fighters?.length ? battle.fighters : previewFighters.filter(Boolean);
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);
  drawArenaBackdrop(ctx, time);

  fighters.forEach((fighter) => drawShadow(ctx, fighter));
  fighters.forEach((fighter) => drawCombatant(ctx, fighter, time));

  if (battle?.debris?.length) {
    battle.debris.forEach((chunk) => drawDebris(ctx, chunk));
  }
  if (battle?.particles?.length) {
    battle.particles.forEach((particle) => drawParticle(ctx, particle));
  }

  drawArenaOverlays(ctx, battle, fighters, time);
}

export function renderFaceEditor(ctx, image, selection, pointer = null) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEditorGrid(ctx, canvas.width, canvas.height);
  if (!image) return;

  const geometry = getFaceSelectionGeometry(canvas, image, selection);
  ctx.drawImage(image, geometry.imageX, geometry.imageY, geometry.imageWidth, geometry.imageHeight);

  ctx.save();
  ctx.fillStyle = "rgba(6, 8, 14, 0.56)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(geometry.box.x, geometry.box.y, geometry.box.size, geometry.box.size);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "#ffcf68";
  ctx.lineWidth = 4;
  ctx.setLineDash([16, 10]);
  ctx.strokeRect(geometry.box.x, geometry.box.y, geometry.box.size, geometry.box.size);
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(geometry.box.x + geometry.box.size / 2, geometry.box.y);
  ctx.lineTo(geometry.box.x + geometry.box.size / 2, geometry.box.y + geometry.box.size);
  ctx.moveTo(geometry.box.x, geometry.box.y + geometry.box.size / 2);
  ctx.lineTo(geometry.box.x + geometry.box.size, geometry.box.y + geometry.box.size / 2);
  ctx.stroke();

  const handle = {
    x: geometry.box.x + geometry.box.size,
    y: geometry.box.y + geometry.box.size,
  };
  ctx.fillStyle = pointer === "resize" ? "#ff6b35" : "#40c9ff";
  ctx.beginPath();
  ctx.arc(handle.x, handle.y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.fillStyle = "rgba(10, 14, 24, 0.84)";
  ctx.fillRect(24, canvas.height - 116, 350, 82);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.strokeRect(24, canvas.height - 116, 350, 82);
  ctx.fillStyle = "#f5f4ef";
  ctx.font = "600 28px Chakra Petch, Noto Sans SC, sans-serif";
  ctx.fillText("Face Mapping", 42, canvas.height - 70);
  ctx.fillStyle = "#a7acc4";
  ctx.font = "500 18px Noto Sans SC, sans-serif";
  ctx.fillText("拖动方框选脸，拖右下角调整覆盖范围", 42, canvas.height - 40);
}

export function renderFacePreview(ctx, image, selection) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEditorGrid(ctx, canvas.width, canvas.height, 12);
  if (!image) return;

  const crop = cropGeometry(image, selection);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 + 8);
  ctx.fillStyle = "rgba(12, 18, 28, 0.88)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 94, 118, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.clip();
  ctx.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.size,
    crop.size,
    -122,
    -140,
    244,
    280,
  );
  ctx.restore();

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 + 8);
  ctx.strokeStyle = "#ffcf68";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 94, 118, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(64, 201, 255, 0.3)";
  ctx.fillRect(-100, -138, 200, 28);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 16px Chakra Petch, Noto Sans SC, sans-serif";
  ctx.fillText("AUTO FIT", -40, -118);
  ctx.restore();
}

export function getFaceSelectionGeometry(canvas, image, selection) {
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
  const imageWidth = image.width * scale;
  const imageHeight = image.height * scale;
  const imageX = (canvas.width - imageWidth) / 2;
  const imageY = (canvas.height - imageHeight) / 2;
  const minSide = Math.min(image.width, image.height);
  const cropSize = clamp(selection.size, 0.18, 0.78) * minSide * scale;
  const centerX = imageX + clamp(selection.x, 0, 1) * image.width * scale;
  const centerY = imageY + clamp(selection.y, 0, 1) * image.height * scale;
  const box = {
    x: clamp(centerX - cropSize / 2, imageX, imageX + imageWidth - cropSize),
    y: clamp(centerY - cropSize / 2, imageY, imageY + imageHeight - cropSize),
    size: cropSize,
  };
  return { imageX, imageY, imageWidth, imageHeight, box };
}

export function buildPosterDataUrl({ battle, shareUrl }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  const winner = battle?.winner;
  const loser = battle?.loser;

  ctx.fillStyle = "#090a10";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1a2035";
  ctx.fillRect(0, 0, canvas.width, 540);
  ctx.fillStyle = "rgba(255, 107, 53, 0.22)";
  ctx.beginPath();
  ctx.arc(220, 220, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(64, 201, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(980, 260, 240, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#ffd166";
  ctx.font = "700 34px Chakra Petch, Noto Sans SC, sans-serif";
  ctx.fillText("PORTRAIT PIT", 88, 110);
  ctx.fillStyle = "#f5f4ef";
  ctx.font = "900 84px Chakra Petch, Noto Sans SC, sans-serif";
  ctx.fillText("WINNER", 84, 214);

  if (winner) {
    drawPosterBust(ctx, winner, 760, 520, 1.32);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 64px Chakra Petch, Noto Sans SC, sans-serif";
    ctx.fillText(winner.roster.displayName, 84, 340);
    ctx.fillStyle = "#a7acc4";
    ctx.font = "500 30px Noto Sans SC, sans-serif";
    ctx.fillText(`${winner.roster.style.label} / ${winner.roster.weapon.label} / ${winner.roster.body.label}`, 88, 390);
    ctx.fillText(`终局姿态: ${winner.victoryPose || "定格"}  ·  存活 HP ${Math.round(winner.health)}`, 88, 436);
  }

  if (loser) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(80, 840, 1040, 260);
    ctx.fillStyle = "#f5f4ef";
    ctx.font = "700 42px Chakra Petch, Noto Sans SC, sans-serif";
    ctx.fillText("MATCH REPORT", 108, 910);
    ctx.fillStyle = "#a7acc4";
    ctx.font = "500 28px Noto Sans SC, sans-serif";
    ctx.fillText(`败者: ${loser.roster.displayName}`, 108, 970);
    ctx.fillText(`失去手臂 ${2 - countAttachedArms(loser)} 条 · 失去腿部 ${2 - countAttachedLegs(loser)} 条`, 108, 1020);
    ctx.fillText(`总耗时 ${battle.time.toFixed(1)} 秒`, 108, 1070);
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(80, 1160, 1040, 292);
  ctx.fillStyle = "#f5f4ef";
  ctx.font = "600 28px Noto Sans SC, sans-serif";
  ctx.fillText("分享链接", 108, 1218);
  wrapText(ctx, shareUrl, 108, 1278, 980, 38);
  ctx.fillStyle = "#ffd166";
  ctx.font = "600 24px Chakra Petch, Noto Sans SC, sans-serif";
  ctx.fillText("Generated on GitHub Pages", 108, 1412);

  return canvas.toDataURL("image/png");
}

function drawArenaBackdrop(ctx, time) {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  sky.addColorStop(0, "#1a2035");
  sky.addColorStop(0.54, "#121725");
  sky.addColorStop(1, "#090a10");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.save();
  ctx.fillStyle = "rgba(255, 217, 102, 0.14)";
  ctx.beginPath();
  ctx.arc(260, 120, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(64, 201, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(1020, 150, 190, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  for (let layer = 0; layer < 3; layer += 1) {
    const baseY = 420 + layer * 56;
    const speed = 14 + layer * 8;
    for (let index = -1; index < 8; index += 1) {
      const x = ((index * 220 - time * speed) % (WORLD.width + 240)) - 120;
      const height = 120 + (index % 3) * 52 + layer * 24;
      ctx.fillStyle = layer === 0 ? "rgba(255,255,255,0.04)" : layer === 1 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.08)";
      ctx.fillRect(x, baseY - height, 120, height);
      ctx.fillRect(x + 18, baseY - height - 22, 18, 22);
    }
  }

  const floor = ctx.createLinearGradient(0, WORLD.groundY - 60, 0, WORLD.height);
  floor.addColorStop(0, "#242938");
  floor.addColorStop(1, "#0a0c14");
  ctx.fillStyle = floor;
  ctx.fillRect(0, WORLD.groundY - 14, WORLD.width, WORLD.height - WORLD.groundY + 14);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 2;
  for (let x = -200; x < WORLD.width + 200; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x + (time * 32) % 80, WORLD.groundY - 12);
    ctx.lineTo(x + 46 + (time * 32) % 80, WORLD.height);
    ctx.stroke();
  }
}

function drawArenaOverlays(ctx, battle, fighters, time) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  ctx.fillRect(0, 0, WORLD.width, 40);
  ctx.fillStyle = "#f5f4ef";
  ctx.font = "700 22px Chakra Petch, Noto Sans SC, sans-serif";
  ctx.fillText("AUTO BATTLE // PORTRAIT-FUSED COMBATANTS", 32, 28);

  if (battle?.status === "finished" && battle.winner) {
    ctx.fillStyle = "rgba(10, 14, 24, 0.72)";
    ctx.fillRect(WORLD.width / 2 - 220, 56, 440, 56);
    ctx.strokeStyle = "rgba(255, 209, 102, 0.5)";
    ctx.strokeRect(WORLD.width / 2 - 220, 56, 440, 56);
    ctx.fillStyle = "#ffd166";
    ctx.font = "700 28px Chakra Petch, Noto Sans SC, sans-serif";
    ctx.fillText(`${battle.winner.roster.displayName} VICTOR`, WORLD.width / 2 - 174, 93);
  } else if (fighters.length === 2) {
    ctx.fillStyle = "rgba(10, 14, 24, 0.58)";
    ctx.fillRect(WORLD.width / 2 - 98, 56, 196, 46);
    ctx.fillStyle = "#f5f4ef";
    ctx.font = "700 22px Chakra Petch, Noto Sans SC, sans-serif";
    ctx.fillText(`${battle?.time?.toFixed?.(1) ?? time.toFixed(1)} SEC`, WORLD.width / 2 - 52, 85);
  }
  ctx.restore();
}

function drawShadow(ctx, fighter) {
  ctx.save();
  ctx.translate(fighter.x, WORLD.groundY + 10);
  const width = fighter.dead ? 118 : 82;
  const height = fighter.dead ? 30 : 18;
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCombatant(ctx, fighter, time) {
  const pose = buildPose(fighter, time);
  const palette = fighter.roster.palette;

  if (fighter.limbs.legL.attached) drawLeg(ctx, fighter, pose, "legL", palette, false);
  if (fighter.limbs.armL.attached) drawArm(ctx, fighter, pose, "armL", palette, false);

  drawTorso(ctx, fighter, pose, palette);
  drawHead(ctx, fighter, pose, palette);

  if (fighter.limbs.legR.attached) drawLeg(ctx, fighter, pose, "legR", palette, true);
  if (fighter.limbs.armR.attached) drawArm(ctx, fighter, pose, "armR", palette, true);
  if (!fighter.weaponDropped && fighter.limbs.armR.attached) {
    drawWeapon(ctx, fighter, pose);
  }

  drawStumps(ctx, fighter, pose, palette);
}

function buildPose(fighter, time) {
  const dims = fighter.roster.dimensions;
  const phase = time * (fighter.action === "dash" ? 10 : fighter.action === "move" ? 7.5 : 3.8) + (fighter.roster.seed % 360) * 0.05;
  const gait = Math.sin(phase);
  const hop = Math.max(0, Math.sin(phase * 2)) * 4;
  let lean = 0;
  let crouch = 0;
  let torsoTilt = 0;
  let armSwing = fighter.action === "move" || fighter.action === "dash" ? gait : Math.sin(phase * 0.7) * 0.24;
  let legSwing = fighter.action === "move" || fighter.action === "dash" ? gait : Math.sin(phase * 0.7) * 0.1;

  const angles = {
    armLUpper: mirrorAngle(2.02 + armSwing * 0.34, fighter.facing),
    armLLower: mirrorAngle(1.72 + armSwing * 0.2, fighter.facing),
    armRUpper: mirrorAngle(0.98 - armSwing * 0.42, fighter.facing),
    armRLower: mirrorAngle(1.24 - armSwing * 0.28, fighter.facing),
    legLUpper: mirrorAngle(1.88 - legSwing * 0.44, fighter.facing),
    legLLower: mirrorAngle(1.54 + Math.max(0, -legSwing) * 0.34, fighter.facing),
    legRUpper: mirrorAngle(1.26 + legSwing * 0.44, fighter.facing),
    legRLower: mirrorAngle(1.58 + Math.max(0, legSwing) * 0.3, fighter.facing),
  };

  if (fighter.action === "dash") {
    lean = fighter.facing * 22;
    crouch = 8;
    torsoTilt = fighter.facing * 0.18;
  }
  if (fighter.guardTime > 0.01) {
    lean = -fighter.facing * 10;
    angles.armRUpper = mirrorAngle(0.18, fighter.facing);
    angles.armRLower = mirrorAngle(0.18, fighter.facing);
    angles.armLUpper = mirrorAngle(0.48, fighter.facing);
    angles.armLLower = mirrorAngle(0.36, fighter.facing);
    torsoTilt = -fighter.facing * 0.08;
  }
  if (fighter.action === "attack" && fighter.currentAttack) {
    const key = fighter.currentAttack.key;
    lean = fighter.facing * 18;
    crouch = 8;
    torsoTilt = fighter.facing * 0.12;
    if (key === "heavyCleave" || key === "breaker") {
      angles.armRUpper = mirrorAngle(-1.18, fighter.facing);
      angles.armRLower = mirrorAngle(-0.28, fighter.facing);
      angles.armLUpper = mirrorAngle(-0.64, fighter.facing);
      angles.armLLower = mirrorAngle(0.02, fighter.facing);
      crouch = 14;
    } else if (key === "lungingThrust") {
      angles.armRUpper = mirrorAngle(-0.08, fighter.facing);
      angles.armRLower = mirrorAngle(-0.04, fighter.facing);
      angles.armLUpper = mirrorAngle(0.52, fighter.facing);
      angles.armLLower = mirrorAngle(0.12, fighter.facing);
      lean = fighter.facing * 28;
    } else if (key === "burstFire" || key === "buckshot") {
      angles.armRUpper = mirrorAngle(0.08, fighter.facing);
      angles.armRLower = mirrorAngle(0.06, fighter.facing);
      angles.armLUpper = mirrorAngle(0.42, fighter.facing);
      angles.armLLower = mirrorAngle(0.2, fighter.facing);
      lean = fighter.facing * 8;
    } else {
      angles.armRUpper = mirrorAngle(0.34, fighter.facing);
      angles.armRLower = mirrorAngle(0.2, fighter.facing);
      angles.armLUpper = mirrorAngle(0.88, fighter.facing);
      angles.armLLower = mirrorAngle(0.58, fighter.facing);
    }
  }
  if (fighter.action === "hit") {
    lean = -fighter.facing * 18;
    torsoTilt = -fighter.facing * 0.12;
    crouch = 10;
    angles.armRUpper = mirrorAngle(1.54, fighter.facing);
    angles.armRLower = mirrorAngle(1.08, fighter.facing);
    angles.armLUpper = mirrorAngle(2.4, fighter.facing);
    angles.armLLower = mirrorAngle(1.9, fighter.facing);
  }

  const legLoss = countAttachedLegs(fighter);
  if (legLoss === 0) crouch += 38;
  if (legLoss === 1) crouch += 14;

  if (fighter.dead) {
    crouch = 58;
    lean = fighter.deathPose?.includes("Back") ? -fighter.facing * 42 : fighter.facing * 42;
    torsoTilt = fighter.deathPose?.includes("Back") ? -fighter.facing * 0.82 : fighter.facing * 0.76;
    angles.armRUpper = mirrorAngle(fighter.deathPose?.includes("Back") ? 2.92 : -1.42, fighter.facing);
    angles.armRLower = mirrorAngle(fighter.deathPose?.includes("Back") ? 2.52 : -0.92, fighter.facing);
    angles.armLUpper = mirrorAngle(fighter.deathPose?.includes("Back") ? 2.26 : -1.92, fighter.facing);
    angles.armLLower = mirrorAngle(fighter.deathPose?.includes("Back") ? 1.9 : -1.18, fighter.facing);
    angles.legRUpper = mirrorAngle(1.02, fighter.facing);
    angles.legRLower = mirrorAngle(1.98, fighter.facing);
    angles.legLUpper = mirrorAngle(2.16, fighter.facing);
    angles.legLLower = mirrorAngle(1.38, fighter.facing);
  }

  if (fighter.victoryPose) {
    torsoTilt = fighter.facing * 0.08;
    if (fighter.victoryPose === "salute") {
      angles.armRUpper = mirrorAngle(-0.64, fighter.facing);
      angles.armRLower = mirrorAngle(-0.18, fighter.facing);
      angles.armLUpper = mirrorAngle(0.76, fighter.facing);
      angles.armLLower = mirrorAngle(0.46, fighter.facing);
    } else if (fighter.victoryPose === "singleArm") {
      angles.armRUpper = mirrorAngle(-0.98, fighter.facing);
      angles.armRLower = mirrorAngle(-0.56, fighter.facing);
      angles.armLUpper = mirrorAngle(2.04, fighter.facing);
      angles.armLLower = mirrorAngle(1.7, fighter.facing);
    } else if (fighter.victoryPose === "kneel") {
      crouch = 28;
      angles.legLUpper = mirrorAngle(1.44, fighter.facing);
      angles.legLLower = mirrorAngle(2.18, fighter.facing);
      angles.legRUpper = mirrorAngle(1.86, fighter.facing);
      angles.legRLower = mirrorAngle(1.54, fighter.facing);
    } else {
      angles.armRUpper = mirrorAngle(0.48, fighter.facing);
      angles.armRLower = mirrorAngle(0.12, fighter.facing);
      angles.armLUpper = mirrorAngle(2.32, fighter.facing);
      angles.armLLower = mirrorAngle(1.94, fighter.facing);
    }
  }

  const hipCenter = {
    x: fighter.x + lean * 0.38,
    y: fighter.y - dims.upperLeg - dims.lowerLeg + crouch + (fighter.dead ? 22 : hop),
  };
  const shoulderCenter = {
    x: hipCenter.x + lean * 0.18,
    y: hipCenter.y - dims.torsoHeight,
  };
  const headCenter = {
    x: shoulderCenter.x + fighter.facing * 8 + lean * 0.1,
    y: shoulderCenter.y - dims.neck - dims.headH * 0.44,
  };

  const shoulders = {
    left: { x: shoulderCenter.x - dims.chestWidth * 0.34, y: shoulderCenter.y + 8 },
    right: { x: shoulderCenter.x + dims.chestWidth * 0.34, y: shoulderCenter.y + 6 },
  };
  const hips = {
    left: { x: hipCenter.x - dims.waistWidth * 0.28, y: hipCenter.y },
    right: { x: hipCenter.x + dims.waistWidth * 0.28, y: hipCenter.y },
  };

  const joints = {
    armL: limbPoints(shoulders.left, dims.upperArm, dims.foreArm, angles.armLUpper, angles.armLLower),
    armR: limbPoints(shoulders.right, dims.upperArm, dims.foreArm, angles.armRUpper, angles.armRLower),
    legL: limbPoints(hips.left, dims.upperLeg, dims.lowerLeg, angles.legLUpper, angles.legLLower),
    legR: limbPoints(hips.right, dims.upperLeg, dims.lowerLeg, angles.legRUpper, angles.legRLower),
  };

  return { dims, torsoTilt, hipCenter, shoulderCenter, headCenter, shoulders, hips, joints };
}

function limbPoints(origin, upperLen, lowerLen, upperAngle, lowerAngle) {
  const joint = pointFromAngle(origin, upperLen, upperAngle);
  const end = pointFromAngle(joint, lowerLen, lowerAngle);
  return { origin, joint, end };
}

function drawLeg(ctx, fighter, pose, limbKey, palette, front) {
  const limb = pose.joints[limbKey];
  const tone = front ? palette.armor : palette.armorShadow;
  drawSegment(ctx, limb.origin, limb.joint, 22, 16, tone, palette.joint);
  drawSegment(ctx, limb.joint, limb.end, 18, 12, palette.strap, palette.joint);
  drawBoot(ctx, limb.end, fighter.facing, pose.dims.foot, palette);
}

function drawArm(ctx, fighter, pose, limbKey, palette, front) {
  const limb = pose.joints[limbKey];
  const tone = front ? palette.accent : palette.armorShadow;
  drawSegment(ctx, limb.origin, limb.joint, 18, 13, tone, palette.joint);
  drawSegment(ctx, limb.joint, limb.end, 14, 10, palette.strap, palette.joint);
  ctx.fillStyle = front ? palette.metal : palette.joint;
  ctx.beginPath();
  ctx.arc(limb.end.x, limb.end.y, fighter.roster.dimensions.hand, 0, Math.PI * 2);
  ctx.fill();
}

function drawTorso(ctx, fighter, pose, palette) {
  const { dims, shoulderCenter, hipCenter, torsoTilt } = pose;
  const direction = fighter.facing;
  const topLeft = rotateAround({ x: shoulderCenter.x - dims.chestWidth * 0.48, y: shoulderCenter.y }, shoulderCenter, torsoTilt);
  const topRight = rotateAround({ x: shoulderCenter.x + dims.chestWidth * 0.48, y: shoulderCenter.y }, shoulderCenter, torsoTilt);
  const midRight = rotateAround({ x: shoulderCenter.x + dims.chestWidth * 0.42, y: shoulderCenter.y + dims.torsoHeight * 0.42 }, shoulderCenter, torsoTilt);
  const waistRight = rotateAround({ x: hipCenter.x + dims.waistWidth * 0.52, y: hipCenter.y }, shoulderCenter, torsoTilt);
  const waistLeft = rotateAround({ x: hipCenter.x - dims.waistWidth * 0.52, y: hipCenter.y }, shoulderCenter, torsoTilt);
  const midLeft = rotateAround({ x: shoulderCenter.x - dims.chestWidth * 0.42, y: shoulderCenter.y + dims.torsoHeight * 0.42 }, shoulderCenter, torsoTilt);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(midRight.x, midRight.y);
  ctx.lineTo(waistRight.x, waistRight.y);
  ctx.lineTo(waistLeft.x, waistLeft.y);
  ctx.lineTo(midLeft.x, midLeft.y);
  ctx.closePath();
  const fill = ctx.createLinearGradient(topLeft.x, topLeft.y, waistRight.x, waistRight.y);
  fill.addColorStop(0, palette.armor);
  fill.addColorStop(1, palette.armorShadow);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(shoulderCenter.x - 8, shoulderCenter.y + 8, 16, dims.torsoHeight * 0.66);
  ctx.fillStyle = palette.accent;
  ctx.fillRect(shoulderCenter.x + direction * 6 - 18, shoulderCenter.y + 18, 36, dims.torsoHeight * 0.42);
  ctx.fillStyle = palette.strap;
  ctx.fillRect(hipCenter.x - dims.waistWidth * 0.72, hipCenter.y - 12, dims.waistWidth * 1.44, 20);
  ctx.restore();
}

function drawHead(ctx, fighter, pose, palette) {
  const { dims, headCenter } = pose;
  const headTilt = fighter.dead ? pose.torsoTilt * 0.8 : fighter.guardTime > 0 ? -fighter.facing * 0.08 : fighter.facing * 0.04;

  ctx.save();
  ctx.translate(headCenter.x, headCenter.y);
  ctx.rotate(headTilt);
  ctx.fillStyle = "rgba(10, 14, 24, 0.9)";
  ctx.beginPath();
  ctx.ellipse(0, 0, dims.headW * 0.54, dims.headH * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.clip();
  if (fighter.roster.face?.image) {
    ctx.save();
    ctx.scale(fighter.facing, 1);
    ctx.drawImage(
      fighter.roster.face.image,
      -dims.headW * 0.62,
      -dims.headH * 0.72,
      dims.headW * 1.24,
      dims.headH * 1.44,
    );
    ctx.restore();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(headCenter.x, headCenter.y);
  ctx.rotate(headTilt);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, dims.headW * 0.54, dims.headH * 0.62, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.moveTo(-dims.headW * 0.58, -dims.headH * 0.1);
  ctx.lineTo(dims.headW * 0.58, -dims.headH * 0.16);
  ctx.lineTo(dims.headW * 0.48, -dims.headH * 0.56);
  ctx.lineTo(-dims.headW * 0.44, -dims.headH * 0.48);
  ctx.closePath();
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(64, 201, 255, 0.28)";
  ctx.fillRect(-dims.headW * 0.18, -dims.headH * 0.12, dims.headW * 0.52, dims.headH * 0.16);
  ctx.restore();
}

function drawWeapon(ctx, fighter, pose) {
  const hand = pose.joints.armR.end;
  const elbow = pose.joints.armR.joint;
  const angle = Math.atan2(hand.y - elbow.y, hand.x - elbow.x);
  const palette = fighter.roster.palette;

  ctx.save();
  ctx.translate(hand.x, hand.y);
  ctx.rotate(angle);
  ctx.fillStyle = palette.metal;
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.lineWidth = 2;

  switch (fighter.roster.weapon.key) {
    case "rifle":
    case "shotgun":
      ctx.fillRect(0, -6, fighter.roster.weapon.key === "rifle" ? 112 : 88, 12);
      ctx.fillRect(-20, -10, 30, 20);
      ctx.fillStyle = palette.strap;
      ctx.fillRect(24, 8, 64, 6);
      break;
    case "spear":
      ctx.fillRect(-10, -3, 152, 6);
      ctx.beginPath();
      ctx.moveTo(142, 0);
      ctx.lineTo(170, -10);
      ctx.lineTo(168, 10);
      ctx.closePath();
      ctx.fill();
      break;
    case "axe":
      ctx.fillRect(-6, -4, 98, 8);
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.moveTo(82, -26);
      ctx.lineTo(122, -12);
      ctx.lineTo(108, 18);
      ctx.lineTo(72, 8);
      ctx.closePath();
      ctx.fill();
      break;
    case "hammer":
      ctx.fillRect(-6, -4, 92, 8);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(72, -18, 40, 36);
      break;
    case "knife":
      ctx.fillRect(-4, -4, 28, 8);
      ctx.beginPath();
      ctx.moveTo(24, -10);
      ctx.lineTo(58, 0);
      ctx.lineTo(24, 10);
      ctx.closePath();
      ctx.fill();
      break;
    case "chain":
      for (let index = 0; index < 6; index += 1) {
        ctx.beginPath();
        ctx.arc(index * 14, Math.sin(index * 0.6) * 4, 5.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = palette.accent;
      ctx.fillRect(84, -16, 34, 32);
      break;
    case "gauntlet":
      ctx.fillStyle = palette.accent;
      ctx.fillRect(-10, -12, 28, 24);
      break;
    default:
      break;
  }

  ctx.stroke();
  ctx.restore();
}

function drawStumps(ctx, fighter, pose, palette) {
  if (!fighter.limbs.armL.attached) drawStump(ctx, pose.shoulders.left, palette);
  if (!fighter.limbs.armR.attached) drawStump(ctx, pose.shoulders.right, palette);
  if (!fighter.limbs.legL.attached) drawStump(ctx, pose.hips.left, palette);
  if (!fighter.limbs.legR.attached) drawStump(ctx, pose.hips.right, palette);
}

function drawStump(ctx, point, palette) {
  ctx.fillStyle = palette.blood;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.arc(point.x + 2, point.y - 2, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawDebris(ctx, chunk) {
  ctx.save();
  ctx.translate(chunk.x, chunk.y);
  ctx.rotate(chunk.rotation);
  ctx.fillStyle = chunk.fighter.roster.palette.armor;
  if (chunk.kind.startsWith("arm")) {
    ctx.fillRect(-10, -12, 42, 20);
  } else if (chunk.kind.startsWith("leg")) {
    ctx.fillRect(-12, -14, 54, 24);
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawParticle(ctx, particle) {
  ctx.save();
  ctx.fillStyle = particle.color;
  if (particle.shape === "square") {
    ctx.fillRect(particle.x - particle.radius, particle.y - particle.radius, particle.radius * 2, particle.radius * 2);
  } else {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSegment(ctx, from, to, startWidth, endWidth, fill, jointFill) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const normal = { x: Math.cos(angle + Math.PI / 2), y: Math.sin(angle + Math.PI / 2) };

  ctx.beginPath();
  ctx.moveTo(from.x + normal.x * startWidth, from.y + normal.y * startWidth);
  ctx.lineTo(to.x + normal.x * endWidth, to.y + normal.y * endWidth);
  ctx.lineTo(to.x - normal.x * endWidth, to.y - normal.y * endWidth);
  ctx.lineTo(from.x - normal.x * startWidth, from.y - normal.y * startWidth);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.fillStyle = jointFill;
  ctx.beginPath();
  ctx.arc(from.x, from.y, Math.max(6, startWidth * 0.56), 0, Math.PI * 2);
  ctx.arc(to.x, to.y, Math.max(6, endWidth * 0.66), 0, Math.PI * 2);
  ctx.fill();
}

function drawBoot(ctx, foot, facing, footSize, palette) {
  ctx.save();
  ctx.translate(foot.x, foot.y);
  ctx.fillStyle = palette.boot;
  ctx.fillRect(-footSize * 0.36, -8, footSize * 1.12, 16);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(facing > 0 ? 0 : -footSize * 0.34, -6, footSize * 0.42, 4);
  ctx.restore();
}

function drawPosterBust(ctx, fighter, x, y, scale) {
  const dims = fighter.roster.dimensions;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fighter.roster.palette.armorShadow;
  ctx.beginPath();
  ctx.moveTo(-88, 120);
  ctx.lineTo(92, 120);
  ctx.lineTo(132, 238);
  ctx.lineTo(-118, 238);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = fighter.roster.palette.armor;
  ctx.fillRect(-94, 22, 188, 138);
  ctx.fillStyle = fighter.roster.palette.accent;
  ctx.fillRect(-22, 32, 44, 120);
  ctx.beginPath();
  ctx.ellipse(0, -32, dims.headW * 0.62, dims.headH * 0.7, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#111824";
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, -32, dims.headW * 0.6, dims.headH * 0.68, 0, 0, Math.PI * 2);
  ctx.clip();
  if (fighter.roster.face?.image) {
    ctx.drawImage(fighter.roster.face.image, -68, -116, 136, 160);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, -32, dims.headW * 0.6, dims.headH * 0.68, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawEditorGrid(ctx, width, height, size = 20) {
  ctx.fillStyle = "#111522";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function rotateAround(point, origin, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

function cropGeometry(image, selection) {
  const minSide = Math.min(image.width, image.height);
  const size = clamp(selection.size, 0.18, 0.78) * minSide;
  const centerX = clamp(selection.x, 0, 1) * image.width;
  const centerY = clamp(selection.y, 0, 1) * image.height;
  return {
    size,
    sx: clamp(centerX - size / 2, 0, image.width - size),
    sy: clamp(centerY - size / 2, 0, image.height - size),
  };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(/(\s+)/).filter(Boolean);
  let line = "";
  let cursorY = y;
  words.forEach((word) => {
    const test = line + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, cursorY);
      line = word.trimStart();
      cursorY += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line.trim(), x, cursorY);
}
