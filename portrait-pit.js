import {
  buildFighter,
  buildResultSummary,
  clamp,
  createBattle,
  createBattleState,
  createFaceSnapshot,
  createPreviewCombatant,
  decodePayload,
  defaultFaceSelection,
  describeCombatState,
  encodePayload,
  extractPortraitFeatures,
  loadImage,
  computeBleedRate,
  stepBattle,
} from "./portrait-pit-core.js";
import {
  buildPosterDataUrl,
  getFaceSelectionGeometry,
  renderArena,
  renderFaceEditor,
  renderFacePreview,
} from "./portrait-pit-render.js";

const SLOTS = ["A", "B"];

export function initPortraitPit() {
  const dom = collectDom();
  const state = {
    dom,
    uploads: { A: null, B: null },
    rosters: { A: null, B: null },
    previewFighters: [],
    battle: createBattleState(),
    feed: ["等待斗士登场。"],
    posterDataUrl: "",
    sceneTime: 0,
    lastFrame: 0,
    faceEditor: {
      slot: null,
      selection: defaultFaceSelection(),
      dragMode: null,
      pointerOffset: { x: 0, y: 0 },
    },
  };

  bindEvents(state);
  hydrateSharedResult(state);
  rebuildPreview(state);
  syncAll(state);
  requestAnimationFrame((ts) => frame(state, ts));
}

function collectDom() {
  const slotDom = Object.fromEntries(
    SLOTS.map((slot) => [
      slot,
      {
        input: document.getElementById(`upload${slot}`),
        name: document.getElementById(`name${slot}`),
        faceButton: document.getElementById(`faceButton${slot}`),
        regenButton: document.getElementById(`regen${slot}`),
        portraitWrap: document.getElementById(`portraitWrap${slot}`),
        portrait: document.getElementById(`portrait${slot}`),
        placeholder: document.getElementById(`placeholder${slot}`),
        faceChip: document.getElementById(`faceChip${slot}`),
        faceThumb: document.getElementById(`faceThumb${slot}`),
        meta: document.getElementById(`meta${slot}`),
        hudName: document.getElementById(`hudName${slot}`),
        hudState: document.getElementById(`hudState${slot}`),
        healthFill: document.getElementById(`healthFill${slot}`),
        hudHealth: document.getElementById(`hudHealth${slot}`),
        hudBleed: document.getElementById(`hudBleed${slot}`),
      },
    ]),
  );

  return {
    slots: slotDom,
    shareBanner: document.getElementById("shareBanner"),
    shareBannerContent: document.getElementById("shareBannerContent"),
    resetRosterButton: document.getElementById("resetRosterButton"),
    statusText: document.getElementById("statusText"),
    playButton: document.getElementById("playButton"),
    restartBattleButton: document.getElementById("restartBattleButton"),
    combatFeed: document.getElementById("combatFeed"),
    resultPanel: document.getElementById("resultPanel"),
    resultTitle: document.getElementById("resultTitle"),
    resultSummary: document.getElementById("resultSummary"),
    shareButton: document.getElementById("shareButton"),
    copyLinkButton: document.getElementById("copyLinkButton"),
    backToLobbyButton: document.getElementById("backToLobbyButton"),
    clockDisplay: document.getElementById("clockDisplay"),
    roundState: document.getElementById("roundState"),
    arenaCanvas: document.getElementById("arenaCanvas"),
    faceDialog: document.getElementById("faceDialog"),
    faceEditorTitle: document.getElementById("faceEditorTitle"),
    faceEditorCanvas: document.getElementById("faceEditorCanvas"),
    facePreviewCanvas: document.getElementById("facePreviewCanvas"),
    faceSliderX: document.getElementById("faceSliderX"),
    faceSliderY: document.getElementById("faceSliderY"),
    faceSliderSize: document.getElementById("faceSliderSize"),
    closeFaceDialogButton: document.getElementById("closeFaceDialogButton"),
    resetFaceSelectionButton: document.getElementById("resetFaceSelectionButton"),
    confirmFaceSelectionButton: document.getElementById("confirmFaceSelectionButton"),
    posterDialog: document.getElementById("posterDialog"),
    posterPreview: document.getElementById("posterPreview"),
    downloadPosterLink: document.getElementById("downloadPosterLink"),
    shareNativeButton: document.getElementById("shareNativeButton"),
  };
}

function bindEvents(state) {
  const { dom } = state;
  SLOTS.forEach((slot) => {
    dom.slots[slot].input.addEventListener("change", (event) => {
      handleUpload(state, slot, event).catch(() => pushFeed(state, `斗士${slot}照片导入失败。`));
    });
    dom.slots[slot].faceButton.addEventListener("click", () => openFaceEditor(state, slot));
    dom.slots[slot].regenButton.addEventListener("click", () => regenerateFighter(state, slot));
  });

  dom.playButton.addEventListener("click", () => startBattle(state));
  dom.restartBattleButton.addEventListener("click", () => startBattle(state));
  dom.resetRosterButton.addEventListener("click", () => clearRoster(state));
  dom.backToLobbyButton.addEventListener("click", () => clearRoster(state));
  dom.shareButton.addEventListener("click", () => openPoster(state));
  dom.copyLinkButton.addEventListener("click", () => copyShareLink(state).catch(() => pushFeed(state, "复制链接失败。")));
  dom.shareNativeButton.addEventListener("click", () => shareNative(state).catch(() => {}));

  dom.closeFaceDialogButton.addEventListener("click", () => closeFaceEditor(state));
  dom.resetFaceSelectionButton.addEventListener("click", () => {
    state.faceEditor.selection = defaultFaceSelection();
    syncFaceSliders(state);
    renderFaceCanvases(state);
  });
  dom.confirmFaceSelectionButton.addEventListener("click", () => {
    confirmFaceSelection(state).catch(() => pushFeed(state, "脸部映射失败，请重试。"));
  });
  dom.faceDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeFaceEditor(state);
  });

  [dom.faceSliderX, dom.faceSliderY, dom.faceSliderSize].forEach((slider) =>
    slider.addEventListener("input", () => {
      pullFaceSliders(state);
      renderFaceCanvases(state);
    }),
  );

  const faceCanvas = dom.faceEditorCanvas;
  faceCanvas.addEventListener("pointerdown", (event) => facePointerDown(state, event));
  faceCanvas.addEventListener("pointermove", (event) => facePointerMove(state, event));
  faceCanvas.addEventListener("pointerup", () => endFacePointer(state));
  faceCanvas.addEventListener("pointerleave", () => endFacePointer(state));
}

async function handleUpload(state, slot, event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  revokeUpload(state.uploads[slot]);
  const objectUrl = URL.createObjectURL(file);
  const image = await loadImage(objectUrl);
  state.uploads[slot] = {
    slot,
    fileName: file.name,
    dataUrl: objectUrl,
    objectUrl,
    image,
    features: extractPortraitFeatures(image),
    face: null,
  };
  state.rosters[slot] = null;
  state.posterDataUrl = "";
  resetBattleToLobby(state);
  pushFeed(state, `斗士${slot}已导入照片，请圈选脸部区域。`);
  openFaceEditor(state, slot);
  syncAll(state);
}

function openFaceEditor(state, slot) {
  const upload = state.uploads[slot];
  if (!upload) return;
  state.faceEditor.slot = slot;
  state.faceEditor.selection = { ...(upload.face?.selection || defaultFaceSelection()) };
  state.faceEditor.dragMode = null;
  state.dom.faceEditorTitle.textContent = `圈选斗士${slot}的脸部`;
  syncFaceSliders(state);
  renderFaceCanvases(state);
  if (!state.dom.faceDialog.open) state.dom.faceDialog.showModal();
}

function closeFaceEditor(state) {
  state.faceEditor.slot = null;
  state.faceEditor.dragMode = null;
  if (state.dom.faceDialog.open) state.dom.faceDialog.close();
}

function syncFaceSliders(state) {
  const { selection } = state.faceEditor;
  state.dom.faceSliderX.value = Math.round(selection.x * 100);
  state.dom.faceSliderY.value = Math.round(selection.y * 100);
  state.dom.faceSliderSize.value = Math.round(selection.size * 100);
}

function pullFaceSliders(state) {
  state.faceEditor.selection = {
    x: Number(state.dom.faceSliderX.value) / 100,
    y: Number(state.dom.faceSliderY.value) / 100,
    size: Number(state.dom.faceSliderSize.value) / 100,
  };
}

function renderFaceCanvases(state) {
  const slot = state.faceEditor.slot;
  const upload = slot ? state.uploads[slot] : null;
  const editorCtx = state.dom.faceEditorCanvas.getContext("2d");
  const previewCtx = state.dom.facePreviewCanvas.getContext("2d");
  renderFaceEditor(editorCtx, upload?.image, state.faceEditor.selection, state.faceEditor.dragMode);
  renderFacePreview(previewCtx, upload?.image, state.faceEditor.selection);
}

function facePointerDown(state, event) {
  const slot = state.faceEditor.slot;
  const upload = slot ? state.uploads[slot] : null;
  if (!upload?.image) return;

  const point = facePoint(event, state.dom.faceEditorCanvas);
  const { box } = getFaceSelectionGeometry(state.dom.faceEditorCanvas, upload.image, state.faceEditor.selection);
  const handleDistance = Math.hypot(point.x - (box.x + box.size), point.y - (box.y + box.size));
  if (handleDistance < 24) {
    state.faceEditor.dragMode = "resize";
  } else if (insideBox(point, box)) {
    state.faceEditor.dragMode = "move";
    state.faceEditor.pointerOffset = {
      x: point.x - (box.x + box.size / 2),
      y: point.y - (box.y + box.size / 2),
    };
  } else {
    state.faceEditor.dragMode = null;
    return;
  }
  state.dom.faceEditorCanvas.setPointerCapture(event.pointerId);
  renderFaceCanvases(state);
}

function facePointerMove(state, event) {
  const slot = state.faceEditor.slot;
  const upload = slot ? state.uploads[slot] : null;
  if (!upload?.image || !state.faceEditor.dragMode) return;

  const canvas = state.dom.faceEditorCanvas;
  const point = facePoint(event, canvas);
  const geometry = getFaceSelectionGeometry(canvas, upload.image, state.faceEditor.selection);
  if (state.faceEditor.dragMode === "move") {
    const centerCanvasX = point.x - state.faceEditor.pointerOffset.x;
    const centerCanvasY = point.y - state.faceEditor.pointerOffset.y;
    state.faceEditor.selection.x = clamp((centerCanvasX - geometry.imageX) / geometry.imageWidth, 0, 1);
    state.faceEditor.selection.y = clamp((centerCanvasY - geometry.imageY) / geometry.imageHeight, 0, 1);
  } else if (state.faceEditor.dragMode === "resize") {
    const boxCenterX = geometry.box.x + geometry.box.size / 2;
    const boxCenterY = geometry.box.y + geometry.box.size / 2;
    const distance = Math.max(Math.abs(point.x - boxCenterX), Math.abs(point.y - boxCenterY)) * 2;
    const relative = distance / Math.min(geometry.imageWidth, geometry.imageHeight);
    state.faceEditor.selection.size = clamp(relative, 0.18, 0.78);
  }
  syncFaceSliders(state);
  renderFaceCanvases(state);
}

function endFacePointer(state) {
  if (!state.faceEditor.dragMode) return;
  state.faceEditor.dragMode = null;
  renderFaceCanvases(state);
}

async function confirmFaceSelection(state) {
  const slot = state.faceEditor.slot;
  const upload = slot ? state.uploads[slot] : null;
  if (!upload?.image) return;

  upload.face = await createFaceSnapshot(upload.image, state.faceEditor.selection);
  state.rosters[slot] = buildFighter(slot, upload, Date.now());
  state.posterDataUrl = "";
  resetBattleToLobby(state);
  rebuildPreview(state);
  pushFeed(state, `${state.rosters[slot].displayName} 已完成脸部映射并进入候战。`);
  closeFaceEditor(state);
  syncAll(state);
}

function regenerateFighter(state, slot) {
  const upload = state.uploads[slot];
  if (!upload) return;
  if (!upload.face) {
    openFaceEditor(state, slot);
    return;
  }
  state.rosters[slot] = buildFighter(slot, upload, Date.now());
  state.posterDataUrl = "";
  resetBattleToLobby(state);
  rebuildPreview(state);
  pushFeed(state, `${state.rosters[slot].displayName} 已按同一张脸重新铸造。`);
  syncAll(state);
}

function startBattle(state) {
  if (!state.rosters.A || !state.rosters.B) return;
  state.battle = createBattle(state.rosters.A, state.rosters.B);
  state.feed = [...state.battle.logs];
  state.posterDataUrl = "";
  state.sceneTime = 0;
  state.lastFrame = 0;
  state.dom.resultPanel.hidden = true;
  syncAll(state);
}

function finishBattle(state) {
  if (state.battle.shareUrl) return;
  const payload = {
    v: 2,
    winner: {
      name: state.battle.winner.roster.displayName,
      style: state.battle.winner.roster.style.label,
      weapon: state.battle.winner.roster.weapon.label,
      body: state.battle.winner.roster.body.label,
    },
    loser: {
      name: state.battle.loser.roster.displayName,
    },
    time: Number(state.battle.time.toFixed(1)),
  };
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("share", encodePayload(payload));
  state.battle.shareUrl = shareUrl.toString();
  state.posterDataUrl = buildPosterDataUrl({ battle: state.battle, shareUrl: state.battle.shareUrl });
  pushFeed(state, `${state.battle.winner.roster.displayName} 拿下胜利，已生成可分享链接。`);
  renderShareBanner(state, payload, state.battle.shareUrl);
  syncAll(state);
}

function clearRoster(state) {
  closeFaceEditor(state);
  if (state.dom.posterDialog.open) state.dom.posterDialog.close();
  SLOTS.forEach((slot) => {
    revokeUpload(state.uploads[slot]);
    state.uploads[slot] = null;
    state.rosters[slot] = null;
    state.dom.slots[slot].input.value = "";
  });
  state.posterDataUrl = "";
  state.feed = ["等待斗士登场。"];
  state.battle = createBattleState();
  state.previewFighters = [];
  state.dom.resultPanel.hidden = true;
  if (!new URL(window.location.href).searchParams.get("share")) {
    state.dom.shareBanner.hidden = true;
    state.dom.shareBannerContent.innerHTML = "";
  }
  syncAll(state);
}

function rebuildPreview(state) {
  state.previewFighters = [
    state.rosters.A ? createPreviewCombatant(state.rosters.A, 360) : null,
    state.rosters.B ? createPreviewCombatant(state.rosters.B, 920) : null,
  ].filter(Boolean);
}

function resetBattleToLobby(state) {
  state.battle = createBattleState();
  state.dom.resultPanel.hidden = true;
  rebuildPreview(state);
}

function syncAll(state) {
  renderCards(state);
  renderHud(state);
  renderFeed(state);
  renderStatus(state);
  renderArenaFrame(state);
}

function renderCards(state) {
  const locked = state.battle.status === "fighting";
  SLOTS.forEach((slot) => {
    const upload = state.uploads[slot];
    const roster = state.rosters[slot];
    const dom = state.dom.slots[slot];

    dom.input.disabled = locked;
    dom.faceButton.disabled = !upload || locked;
    dom.regenButton.disabled = !upload?.face || locked;
    dom.portraitWrap.classList.toggle("empty", !upload);
    dom.portrait.hidden = !upload;
    dom.placeholder.hidden = Boolean(upload);
    dom.faceChip.hidden = !upload?.face;

    if (upload) {
      dom.portrait.src = upload.dataUrl;
      dom.faceThumb.src = upload.face?.dataUrl || "";
    }

    if (roster) {
      dom.name.textContent = roster.displayName;
      dom.meta.innerHTML = `
        <div class="meta-row">
          <span class="meta-chip">${roster.style.label}</span>
          <span class="meta-chip">${roster.weapon.label}</span>
          <span class="meta-chip">${roster.body.label}</span>
        </div>
        <p class="meta-line">${roster.style.description}</p>
        <div class="meta-stats">
          <span>力量 ${roster.stats.power}</span>
          <span>速度 ${roster.stats.speed}</span>
          <span>防御 ${roster.stats.guard}</span>
          <span>体魄 ${roster.stats.grit}</span>
        </div>
      `;
    } else if (upload) {
      dom.name.textContent = `斗士${slot}待生成`;
      dom.meta.innerHTML = `<p class="hint">已导入照片，确认脸部后即可生成。</p>`;
    } else {
      dom.name.textContent = "等待上传";
      dom.meta.innerHTML = `<p class="hint">尚未生成斗士。</p>`;
    }
  });
}

function renderHud(state) {
  const fighters = state.battle.fighters.length ? state.battle.fighters : state.previewFighters;
  SLOTS.forEach((slot) => {
    const dom = state.dom.slots[slot];
    const fighter = fighters.find((item) => item.roster.slot === slot);
    const roster = state.rosters[slot];
    const hp = fighter ? fighter.health : roster ? roster.stats.maxHealth : 0;
    const maxHp = fighter ? fighter.maxHealth : roster ? roster.stats.maxHealth : 1;
    dom.hudName.textContent = roster?.displayName || "未就绪";
    dom.hudState.textContent = fighter ? describeCombatState(fighter) : roster ? "待命" : "空位";
    dom.healthFill.style.width = `${Math.max(0, Math.min(100, (hp / maxHp) * 100))}%`;
    dom.hudHealth.textContent = `HP ${Math.round(hp)}`;
    dom.hudBleed.textContent = `流血 ${(fighter ? computeBleedRate(fighter) : 0).toFixed(1)}/s`;
  });

  state.dom.clockDisplay.textContent = `${state.battle.time.toFixed(1)}s`;
  state.dom.roundState.textContent =
    state.battle.status === "fighting"
      ? "自动战斗进行中"
      : state.battle.status === "finished"
        ? "本轮结束"
        : state.rosters.A && state.rosters.B
          ? "斗士已就位"
          : "等待斗士生成";
}

function renderFeed(state) {
  state.dom.combatFeed.innerHTML = state.feed
    .slice(0, 8)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function renderStatus(state) {
  const bothReady = Boolean(state.rosters.A && state.rosters.B);
  state.dom.playButton.disabled = !bothReady || state.battle.status === "fighting";
  state.dom.restartBattleButton.disabled = !bothReady || state.battle.status === "fighting";
  state.dom.resetRosterButton.disabled = state.battle.status === "fighting";
  state.dom.resultPanel.hidden = state.battle.status !== "finished";

  if (state.battle.status === "fighting") {
    state.dom.statusText.textContent = "战斗已开始，双方会自动寻找距离、格挡、冲刺、断肢并持续失血。";
  } else if (state.battle.status === "finished") {
    state.dom.statusText.textContent = "本轮胜负已定，你可以生成海报、复制链接，或回到主界面重选斗士。";
    state.dom.resultTitle.textContent = `${state.battle.winner.roster.displayName} 获胜`;
    state.dom.resultSummary.textContent = buildResultSummary(state.battle);
  } else if (bothReady) {
    state.dom.statusText.textContent = "两名斗士已生成，点击 Play 开始自动战斗。";
  } else {
    state.dom.statusText.textContent = "先为两侧上传人像并手动圈选脸部，再点击 Play。";
  }
}

function renderArenaFrame(state) {
  const ctx = state.dom.arenaCanvas.getContext("2d");
  renderArena(ctx, {
    battle: state.battle,
    previewFighters: state.previewFighters,
    time: state.sceneTime,
  });
}

function frame(state, timestamp) {
  if (!state.lastFrame) state.lastFrame = timestamp;
  const dt = Math.min(0.04, (timestamp - state.lastFrame) / 1000);
  state.lastFrame = timestamp;
  state.sceneTime += dt;

  if (state.battle.status === "fighting") {
    stepBattleAndLog(state, dt);
    if (state.battle.status === "finished") finishBattle(state);
    renderHud(state);
    renderStatus(state);
  }
  renderArenaFrame(state);
  requestAnimationFrame((ts) => frame(state, ts));
}

function stepBattleAndLog(state, dt) {
  stepBattle(state.battle, dt, (message) => pushFeed(state, message));
}

function openPoster(state) {
  if (state.battle.status !== "finished") return;
  if (!state.posterDataUrl) {
    state.posterDataUrl = buildPosterDataUrl({ battle: state.battle, shareUrl: state.battle.shareUrl });
  }
  state.dom.posterPreview.src = state.posterDataUrl;
  state.dom.downloadPosterLink.href = state.posterDataUrl;
  if (!state.dom.posterDialog.open) state.dom.posterDialog.showModal();
}

async function copyShareLink(state) {
  const url = state.battle.shareUrl || window.location.href;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
  } else {
    window.prompt("复制这个链接", url);
  }
  pushFeed(state, "分享链接已复制。");
  renderFeed(state);
}

async function shareNative(state) {
  if (!navigator.share || !state.battle.shareUrl) {
    await copyShareLink(state);
    return;
  }
  await navigator.share({
    title: "Portrait Pit",
    text: `${state.battle.winner.roster.displayName} 的战报`,
    url: state.battle.shareUrl,
  });
}

function hydrateSharedResult(state) {
  const payload = new URL(window.location.href).searchParams.get("share");
  if (!payload) return;
  try {
    const decoded = decodePayload(payload);
    renderShareBanner(state, decoded, window.location.href);
  } catch {
    state.dom.shareBanner.hidden = true;
  }
}

function renderShareBanner(state, payload, url) {
  const winnerName = payload.winner?.name || "未知胜者";
  const winnerMeta = [payload.winner?.style, payload.winner?.weapon, payload.winner?.body].filter(Boolean).join(" / ");
  state.dom.shareBanner.hidden = false;
  state.dom.shareBannerContent.innerHTML = `
    <p class="meta-line">${escapeHtml(winnerName)} 完成本轮处决。</p>
    ${winnerMeta ? `<p class="meta-line">${escapeHtml(winnerMeta)}</p>` : ""}
    ${payload.time ? `<p class="meta-line">耗时 ${escapeHtml(String(payload.time))} 秒</p>` : ""}
    <div class="share-link-row"><a href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">打开战报链接</a></div>
  `;
}

function pushFeed(state, message) {
  state.feed.unshift(message);
  state.feed = state.feed.slice(0, 12);
  renderFeed(state);
}

function revokeUpload(upload) {
  if (upload?.objectUrl) URL.revokeObjectURL(upload.objectUrl);
}

function facePoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function insideBox(point, box) {
  return point.x >= box.x && point.x <= box.x + box.size && point.y >= box.y && point.y <= box.y + box.size;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(text) {
  return escapeHtml(text).replaceAll('"', "&quot;");
}
