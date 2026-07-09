(() => {
  'use strict';

  const W = 1000;
  const H = 560;
  const L = 78;
  const R = 922;
  const T = 72;
  const B = 486;
  const ANIM_MS = 1100;
  const BALL_R = 12.5;
  const PHYSICS_DT = 1 / 120;
  const NORMAL_MAX_POWER = 100;
  const MAX_CUE_POWER = 135;

  const scaleValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const ATTACK_MAX = 110;
  const attackValues = [0, 10, 20, 30, 40, 50, 70, 90, 100, ATTACK_MAX];
  const arrivalValues = [...scaleValues];
  const exitValues = [...scaleValues];

  const modules = [
    {
      id: 0,
      title: 'Introducción al sistema',
      text: 'El sistema clásico de Base 50 / Conti usa una lectura numérica para predecir y corregir recorridos de tercera a cuarta, cuarta a quinta y quinta a sexta banda.',
      bullets: ['Fórmula base: Salida − Llegada = Ataque; el ataque se ubica en la banda larga opuesta.', 'Las correcciones dependen de efecto, ángulo y zona de ataque.', 'La app usa colores del gráfico: salida negro, ataque rojo, llegada verde y conectores azul.']
    },
    {
      id: 1,
      title: 'Numeración del gráfico 1',
      text: 'La mesa conserva la numeración visible clásica de diamantes y usa medición interna proporcional; en ataque la esquina final proyecta 110 y el 100 queda entre el 90 y la esquina.',
      bullets: ['Salidas y ataques se calculan en el diamante.', 'Los diamantes visibles mantienen la escala Base 50 / Conti: ataque 10-20-30-40-50-70-90, llegada 10-20-30-45-60-80-100 y salida 15-20-25-30-35-40-45-50 y banda corta únicamente con diamantes 60-70-90.', 'La medida exacta interna proyecta ataque hasta 110, salida/llegada hasta sus esquinas y el display dinámico trabaja con un decimal.']
    },
    {
      id: 2,
      title: 'Fórmula y efecto',
      text: 'El cálculo directo da el punto de ataque base; luego se ajusta con compensación por efecto, potencia, cercanía de la bola a la banda y línea contra bola.',
      bullets: ['Llegada hasta 10: efecto 1.', 'Llegada de 10 a 20: efecto 2.', 'Llegada superior a 20: efecto 3.', 'La guía blanca muestra el ataque final recomendado; la línea punteada muestra el cálculo matemático base.']
    },
    {
      id: 3,
      title: 'Zonas de ataque',
      text: 'Las conexiones dependen de la zona donde cae el ataque.',
      bullets: ['0–20: ángulos cortos.', '20–40: ángulos medios.', '40–70: ángulos largos.', 'Mayor de 70: ángulos extra largos.']
    },
    {
      id: 4,
      title: 'Conectores tercera-cuarta',
      text: 'Los conectores azules ayudan a corregir la ruta real después de tocar ataque y antes de entrar a la llegada.',
      bullets: ['Ruta de práctica: salida → ataque → banda corta → llegada.', 'La banda corta es la conexión obligatoria antes de la llegada.', 'No cambiar efecto, potencia y ataque al mismo tiempo.']
    },
    {
      id: 5,
      title: 'Cuarta-quinta y quinta-sexta',
      text: 'Para recorridos de más bandas se conserva la lógica, pero la velocidad, el efecto y la pérdida de energía deben cambiar.',
      bullets: ['Tres bandas requiere menos velocidad que cinco o seis.', 'Más velocidad conserva mejor la calidad del efecto.', 'La meta es completar tres o más bandas, tocar las dos bolas objetivo y conservar energía hasta la zona de carambola.']
    },
    {
      id: 6,
      title: 'Laboratorio',
      text: 'Repite el mismo cálculo variando una sola variable: efecto, potencia, bandas o ataque.',
      bullets: ['Taco plano.', 'Golpe dulce y penetrado.', 'Velocidad suficiente para llegar y abrir la bola objetivo.']
    }
  ];

  const exercises = [
    { id: 'C50-01', name: 'Clásica 50-20', exit: 50, arrival: 20, bands: 3 },
    { id: 'C50-02', name: 'Salida 60 a llegada 20', exit: 60, arrival: 20, bands: 3 },
    { id: 'C50-03', name: 'Salida 70 a llegada 30', exit: 70, arrival: 30, bands: 4 },
    { id: 'C50-04', name: 'Medida interna 80 a llegada 45', exit: 80, arrival: 45, bands: 4 },
    { id: 'C50-05', name: 'Salida 90 a llegada 60', exit: 90, arrival: 60, bands: 5 },
    { id: 'C50-06', name: 'Ángulo corto', exit: 35, arrival: 20, bands: 3 },
    { id: 'C50-07', name: 'Ángulo medio', exit: 60, arrival: 30, bands: 4 },
    { id: 'C50-08', name: 'Ángulo largo interno', exit: 80, arrival: 45, bands: 5 },
    { id: 'C50-09', name: 'Reto efecto 1', exit: 45, arrival: 10, bands: 3 },
    { id: 'C50-10', name: 'Reto efecto 3 interno', exit: 80, arrival: 60, bands: 6 }
  ];

  const guidedShots = [
    {
      id: 'jugada1',
      label: 'Jugada 1: 40 = 50 - 10',
      videoTab: 'cap2',
      videoTime: 90,
      videoEnd: 110,
      timeLabel: '01:30 a 01:50',
      exit: 50,
      arrival: 10,
      attack: 40,
      bands: 3,
      cuePower: 55,
      effectSelect: '1',
      deflection: '1/2',
      effectDot: { x: -0.16, y: -0.28 }
    },
    {
      id: 'jugada2',
      label: 'Jugada 2: 30 = 50 - 20',
      videoTab: 'cap2',
      videoTime: 130,
      videoEnd: 145,
      timeLabel: '02:10 a 02:25',
      exit: 50,
      arrival: 20,
      attack: 30,
      bands: 3,
      cuePower: 55,
      effectSelect: '2',
      deflection: '1/2',
      effectDot: { x: -0.18, y: -0.32 }
    },
    {
      id: 'jugada3',
      label: 'Jugada 3: 20 = 50 - 30',
      videoTab: 'cap2',
      videoTime: 0,
      videoEnd: 0,
      timeLabel: 'Cap. 2',
      exit: 50,
      arrival: 30,
      attack: 20,
      bands: 3,
      cuePower: 55,
      effectSelect: '3',
      deflection: '1/2',
      effectDot: { x: -0.2, y: -0.34 }
    },
    {
      id: 'jugada4',
      label: 'Jugada 4: 5 = 50 - 45',
      videoTab: 'cap2',
      videoTime: 340,
      videoEnd: 350,
      timeLabel: '05:40 a 05:50',
      exit: 50,
      arrival: 45,
      attack: 5,
      bands: 3,
      cuePower: 58,
      effectSelect: '3',
      deflection: 'fino',
      effectDot: { x: -0.24, y: -0.34 }
    },
    {
      id: 'jugada5',
      label: 'Jugada 5: Llegada 50 = Salida 50 - Ataque 0',
      videoTab: 'cap2',
      videoTime: 480,
      videoEnd: 493,
      timeLabel: '08:00 a 08:13',
      exit: 50,
      arrival: 50,
      attack: 0,
      bands: 3,
      cuePower: 52,
      effectSelect: '3',
      deflection: 'fino',
      effectDot: { x: -0.30, y: -0.34 },
      videoModel: 'cuna50Cap2'
    },
    {
      id: 'jugada6',
      label: 'Jugada 6: 0 = 60 - 0',
      videoTab: 'cap2',
      videoTime: 560,
      videoEnd: 570,
      timeLabel: '09:20 a 09:30',
      exit: 60,
      arrival: 0,
      attack: 0,
      bands: 3,
      cuePower: 65,
      effectSelect: '3',
      deflection: 'fino',
      effectDot: { x: -0.28, y: -0.32 }
    },
    {
      id: 'jugada7',
      label: 'Jugada 7: 50 = 60 - 10',
      videoTab: 'cap2',
      videoTime: 610,
      videoEnd: 625,
      timeLabel: '10:10 a 10:25',
      exit: 60,
      arrival: 10,
      attack: 50,
      bands: 3,
      cuePower: 62,
      effectSelect: '2',
      deflection: '1/2',
      effectDot: { x: -0.18, y: -0.3 }
    }
  ];

  const state = {
    module: 0,
    exerciseIndex: 0,
    exit: 50,
    arrival: 20,
    attack: 30,
    bands: 3,
    guide: true,
    showParallels: false,
    placeMode: false,
    soundOn: true,
    draggingCue: false,
    draggingBall: null,
    draggingEffect: false,
    draggingPower: false,
    powerDragOffset: 0,
    fullTable: false,
    cuePower: 55,
    deflection: 'imagen',
    effectDot: { x: 0.28, y: -0.32 },
    cue: { x: 0, y: 0 },
    balls: {
      red: { x: L + 185, y: T + 145 },
      yellow: { x: L + 500, y: T + 280 }
    },
    audioCtx: null,
    score: 0,
    attempts: 0,
    cushions: 0,
    animating: false,
    playbackMode: null,
    paused: false,
    activeFrameAnimation: null,
    lastPath: null,
    lastPhysics: null,
    lastShotSetup: null,
    lastGuideLightKey: ''
  };

  const ids = [
    'trainerCard', 'score', 'attempts', 'cushions', 'resetScoreBtn', 'topFormula', 'topHint', 'moduleList', 'lessonTitle',
    'lessonText', 'lessonBullets', 'modeSelect', 'exerciseSelect', 'shotSelect', 'exitSelect', 'arrivalSelect', 'attackInput',
    'bandSelect', 'effectSelect', 'solveBtn', 'linesBtn', 'guideBtn', 'placeBtn', 'soundBtn',
    'fullTableBtn', 'randomBtn', 'repeatBtn', 'replayBtn', 'shootBtn', 'formulaReadout', 'formulaDetail', 'preciseExit', 'preciseAttack', 'preciseArrival', 'preciseDetail', 'effectReadout', 'effectDetail', 'zoneReadout',
    'zoneDetail', 'table', 'overlay', 'diamondLayer', 'numberLayer', 'connectorLayer', 'parallelLayer', 'cueStickLayer', 'mathPath', 'idealPath',
    'userPath', 'aimPath', 'ballLayer', 'cueBall', 'redBall', 'yellowBall', 'effectControl', 'effectBall', 'effectDot',
    'deflectionGuideReadout', 'deflectionGuideStatus', 'deflectionTargetBall', 'deflectionCueBall', 'deflectionCueDot',
    'powerBadge', 'caromFlash', 'feedbackTitle', 'feedbackBody', 'meterNeedle', 'labLogWrap', 'labLog', 'clearLogBtn'
  ];
  const el = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    ids.forEach((id) => { el[id] = document.getElementById(id); });
    syncResponsiveMode();
    window.addEventListener('resize', syncResponsiveMode, { passive: true });
    window.addEventListener('orientationchange', syncResponsiveMode, { passive: true });
    buildModules();
    buildSelectors();
    drawStaticTable();
    attachEvents();
    loadExercise(0);
    setModule(0);
    updateAll('init');
    registerServiceWorker();
  }


  function syncResponsiveMode() {
    const isTouch = window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;
    const isSmall = window.innerWidth <= 820 || (isTouch && window.innerWidth <= 1024);
    document.body.classList.toggle('mobile-layout', Boolean(isSmall));
    document.body.classList.toggle('mobile-landscape', Boolean(isSmall && window.innerWidth > window.innerHeight));
  }

  function buildModules() {    el.moduleList.innerHTML = modules.map((mod) => (
      `<button class="module-btn" type="button" data-module="${mod.id}"><span class="num">${mod.id}</span><span>${escapeHtml(mod.title)}</span></button>`
    )).join('');
    el.moduleList.querySelectorAll('.module-btn').forEach((btn) => btn.addEventListener('click', () => setModule(Number(btn.dataset.module))));
  }

  function buildSelectors() {
    el.exerciseSelect.innerHTML = exercises.map((ex, i) => `<option value="${i}">${ex.id} · ${escapeHtml(ex.name)}</option>`).join('');
    if (el.shotSelect) {
      el.shotSelect.innerHTML = '<option value="">Seleccionar jugada</option>' + guidedShots.map((shot) => `<option value="${shot.id}">${escapeHtml(shot.label)}</option>`).join('');
    }
    if (el.exitSelect?.tagName === 'SELECT') {
      el.exitSelect.innerHTML = exitValues.map((v) => `<option value="${fmt2(v)}">Salida ${fmt2(v)}</option>`).join('');
    } else if (el.exitSelect) {
      el.exitSelect.value = fmt2(state.exit);
    }
    if (el.arrivalSelect?.tagName === 'SELECT') {
      el.arrivalSelect.innerHTML = arrivalValues.map((v) => `<option value="${fmt2(v)}">Llegada ${fmt2(v)}</option>`).join('');
    } else if (el.arrivalSelect) {
      el.arrivalSelect.value = fmt2(state.arrival);
    }
  }

  function attachEvents() {
    el.exerciseSelect.addEventListener('change', () => loadExercise(Number(el.exerciseSelect.value)));
    if (el.shotSelect) {
      el.shotSelect.addEventListener('change', () => {
        if (!el.shotSelect.value) return;
        applyGuidedShot(el.shotSelect.value, { scrollToTable: true, updateVideo: false });
      });
    }
    const applyExitField = () => {
      state.exit = roundTenth(clamp(Number(el.exitSelect.value || state.exit), 0, 100));
      autoAttack();
      updateAll('exit');
    };
    const applyArrivalField = () => {
      state.arrival = roundTenth(clamp(Number(el.arrivalSelect.value || state.arrival), 0, 100));
      autoAttack();
      updateAll('arrival');
    };
    ['input', 'change', 'blur'].forEach((eventName) => el.exitSelect.addEventListener(eventName, applyExitField));
    ['input', 'change', 'blur'].forEach((eventName) => el.arrivalSelect.addEventListener(eventName, applyArrivalField));
    el.attackInput.addEventListener('input', () => { state.attack = clamp(Number(el.attackInput.value), 0, ATTACK_MAX); syncDynamicNumbersFromCurrentShot(); updateAll('attack'); });
    el.bandSelect.addEventListener('change', () => { state.bands = Number(el.bandSelect.value); updateAll('bands'); });
    el.modeSelect.addEventListener('change', () => { autoAttack(); updateAll('mode'); });
    el.effectSelect.addEventListener('change', () => { syncDynamicNumbersFromCurrentShot(); updateAll('effect'); });
    bindPowerControls();
    el.solveBtn.addEventListener('click', solve);
    el.linesBtn.addEventListener('click', () => { state.showParallels = !state.showParallels; updateAll('lines'); });
    el.guideBtn.addEventListener('click', () => { state.guide = !state.guide; updateAll('guide'); });
    el.placeBtn.addEventListener('click', () => { state.placeMode = !state.placeMode; updateAll('place'); });
    el.soundBtn.addEventListener('click', () => { state.soundOn = !state.soundOn; updateAll('sound'); });
    el.fullTableBtn.addEventListener('click', toggleFullTable);
    document.addEventListener('fullscreenchange', syncFullTableState);
    el.randomBtn.addEventListener('click', randomExercise);
    if (el.repeatBtn) el.repeatBtn.addEventListener('click', repeatLastShot);
    if (el.replayBtn) el.replayBtn.addEventListener('click', replayLastShot);
    el.shootBtn.addEventListener('click', shoot);
    el.resetScoreBtn.addEventListener('click', resetScore);
    el.clearLogBtn.addEventListener('click', () => { el.labLog.innerHTML = ''; });
    setupEffectGuide();
    setupCourseModal();
    setupPrecisionControls();
    el.table.addEventListener('pointerdown', onPointerDown);
    if (el.cueStickLayer) el.cueStickLayer.addEventListener('pointerdown', startCuePowerDrag);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDraggingBalls);
    window.addEventListener('keydown', handleKeys);
  }


  function setupPrecisionControls() {
    document.querySelectorAll('.precision-step').forEach((btn) => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const delta = Number(btn.dataset.delta || 0);
        adjustPreciseNumber(field, delta);
      });
    });
  }

  function adjustPreciseNumber(field, delta) {
    if (!Number.isFinite(delta) || !field) return;
    if (field === 'exit') {
      state.exit = roundTenth(clamp(Number(state.exit) + delta, 0, 100));
      syncSelectIfExact(el.exitSelect, state.exit);
      autoAttack();
    } else if (field === 'arrival') {
      state.arrival = roundTenth(clamp(Number(state.arrival) + delta, 0, 100));
      syncSelectIfExact(el.arrivalSelect, state.arrival);
      autoAttack();
    } else if (field === 'attack') {
      state.attack = roundTenth(clamp(Number(state.attack) + delta, 0, ATTACK_MAX));
      if (el.attackInput) el.attackInput.value = fmt2(state.attack);
      syncDynamicNumbersFromCurrentShot();
    }
    updateAll('precision-step');
  }

  function roundTenth(value) {
    return Math.round(Number(value || 0) * 10) / 10;
  }

  function syncSelectIfExact(control, value) {
    if (!control) return;
    const val = fmt2(value);
    if (control.tagName !== 'SELECT' || !control.options) {
      if (document.activeElement !== control) control.value = val;
      return;
    }
    const prefix = control.id === 'exitSelect' ? 'Salida' : control.id === 'arrivalSelect' ? 'Llegada' : '';
    const options = Array.from(control.options);
    const exact = options.find((option) => !option.dataset.dynamicOption && fmt2(Number(option.value)) === val);
    options.filter((option) => option.dataset.dynamicOption === 'true').forEach((option) => option.remove());
    if (exact) {
      control.value = exact.value;
      return;
    }
    const option = document.createElement('option');
    option.value = val;
    option.textContent = `${prefix} ${val}`.trim();
    option.dataset.dynamicOption = 'true';
    option.selected = true;
    control.insertBefore(option, control.firstChild);
    control.value = val;
  }

  function setupEffectGuide() {
    document.querySelectorAll('.deflection-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.deflection = btn.dataset.deflectThickness || 'imagen';
        const value = btn.dataset.effectValue || 'auto';
        if (el.effectSelect) el.effectSelect.value = value;
        syncEffectDotToSelectedEffect();
        updateAll('deflection');
      });
    });
    if (el.effectDot) {
      el.effectDot.addEventListener('pointerdown', (event) => {
        state.draggingEffect = true;
        el.effectDot.setPointerCapture?.(event.pointerId);
        updateEffectFromClient(event.clientX, event.clientY);
        event.preventDefault();
        event.stopPropagation();
      });
      el.effectDot.addEventListener('pointermove', (event) => {
        if (!state.draggingEffect) return;
        updateEffectFromClient(event.clientX, event.clientY);
        event.preventDefault();
      });
      el.effectDot.addEventListener('pointerup', (event) => {
        state.draggingEffect = false;
        try { el.effectDot.releasePointerCapture?.(event.pointerId); } catch (error) {}
      });
    }
  }

  function updateEffectFromClient(clientX, clientY) {
    if (!el.effectBall) return;
    const rect = el.effectBall.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.max(1, rect.width * 0.34);
    const nx = clamp((clientX - cx) / radius, -1, 1);
    const ny = clamp((clientY - cy) / radius, -1, 1);
    state.effectDot = { x: nx, y: ny };
    const effect = nx < -0.35 ? 1 : nx < 0.05 ? 2 : nx < 0.45 ? 3 : 4;
    el.effectSelect.value = String(effect);
    state.deflection = 'imagen';
    syncDynamicNumbersFromCurrentShot();
    updateAll('effect-dot');
  }

  function syncEffectDotToSelectedEffect() {
    const eff = selectedEffect();
    const xByEffect = { 1: -0.55, 2: -0.18, 3: 0.20, 4: 0.55 };
    state.effectDot = { x: xByEffect[eff] ?? 0.20, y: -0.32 };
  }

  function updateEffectUI() {
    if (el.effectDot) {
      const left = 50 + state.effectDot.x * 30;
      const top = 50 + state.effectDot.y * 30;
      el.effectDot.style.left = `${clamp(left, 18, 82)}%`;
      el.effectDot.style.top = `${clamp(top, 18, 82)}%`;
    }
    if (el.deflectionCueDot) {
      el.deflectionCueDot.setAttribute('cx', String(118 + state.effectDot.x * 30));
      el.deflectionCueDot.setAttribute('cy', String(60 + state.effectDot.y * 24));
    }
    if (el.deflectionTargetBall) {
      const offset = thicknessOffset(state.deflection);
      el.deflectionTargetBall.setAttribute('cx', String(158 + offset));
      const shadow = document.getElementById('deflectionTargetShadow');
      if (shadow) shadow.setAttribute('cx', String(162 + offset));
    }
    document.querySelectorAll('.deflection-btn').forEach((btn) => {
      const active = btn.dataset.deflectThickness === state.deflection || (state.deflection === 'imagen' && el.effectSelect.value === btn.dataset.effectValue);
      btn.classList.toggle('active', active);
    });
    const eff = selectedEffect();
    const thickness = thicknessLabel(state.deflection);
    if (el.deflectionGuideReadout) el.deflectionGuideReadout.innerHTML = `<strong>Efecto ${eff}</strong> · Potencia ${getCuePower()}% · Grosor ${thickness}`;
    if (el.deflectionGuideStatus) el.deflectionGuideStatus.innerHTML = `Punto azul = efecto aplicado a la blanca. La potencia aumenta la distancia y la cantidad de bandas; el grosor orienta el contacto real con la bola objetivo.`;
  }

  function thicknessOffset(kind) {
    const mapOffsets = { fino: 22, '1/4': 13, '1/2': 5, '3/4': -5, llena: -16, imagen: 0 };
    return mapOffsets[kind] ?? 0;
  }

  function thicknessLabel(kind) {
    const labels = { imagen: 'guía de efecto', fino: 'fino', '1/4': '1/4 de bola', '1/2': '1/2 bola', '3/4': '3/4 de bola', llena: 'llena' };
    return labels[kind] || 'guía de efecto';
  }

  function setupCourseModal() {
    const courseBtn = document.getElementById('courseBtn');
    const modal = document.getElementById('courseModal');
    const closeBtn = document.getElementById('closeCourseBtn');
    const videoFrame = document.getElementById('courseVideoFrame');
    const videoTitle = document.getElementById('courseVideoTitle');
    const videoSource = document.getElementById('courseVideoSource');
    const openLink = modal?.querySelector('.youtube-open-link');
    const tabs = Array.from(modal?.querySelectorAll('.video-tab') || []);
    const courseShotButtons = Array.from(modal?.querySelectorAll('.course-shot-btn') || []);
    if (!courseBtn || !modal || !closeBtn) return;

    const mobileScreenQuery = window.matchMedia('(max-width: 820px)');
    const tabletScreenQuery = window.matchMedia('(max-width: 1024px) and (pointer: coarse)');
    const getActiveTab = () => modal.querySelector('.video-tab.active') || tabs[0];
    const isMobileLike = () => {
      const ua = navigator.userAgent || '';
      const mobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      return mobileUA || mobileScreenQuery.matches || tabletScreenQuery.matches;
    };
    const useDrive = () => !isMobileLike();
    const buildTimedEmbed = (embed, sourceIsDrive, seconds = 0, endSeconds = 0) => {
      const start = Math.max(0, Math.round(Number(seconds) || 0));
      const end = Math.max(0, Math.round(Number(endSeconds) || 0));
      if (!embed || !start) return embed;
      if (sourceIsDrive) {
        const sep = embed.includes('?') ? '&' : '?';
        return `${embed}${sep}start=${start}#t=${start}s`;
      }
      try {
        const url = new URL(embed, window.location.href);
        url.searchParams.set('start', String(start));
        if (end > start) url.searchParams.set('end', String(end));
        url.searchParams.set('autoplay', '1');
        return url.toString();
      } catch (error) {
        const endParam = end > start ? `&end=${end}` : '';
        return `${embed}${embed.includes('?') ? '&' : '?'}start=${start}${endParam}&autoplay=1`;
      }
    };
    const buildTimedOpenUrl = (url, sourceIsDrive, seconds = 0) => {
      const start = Math.max(0, Math.round(Number(seconds) || 0));
      if (!url || !start) return url;
      if (sourceIsDrive) return `${url}#t=${start}`;
      return `${url}${url.includes('?') ? '&' : '?'}t=${start}s`;
    };

    const applyVideoSource = (tab = getActiveTab(), force = false, startSeconds = 0, endSeconds = 0) => {
      if (!tab) return;
      const title = tab.dataset.title || tab.textContent.trim();
      const sourceIsDrive = useDrive();
      const embedBase = sourceIsDrive ? tab.dataset.drive : tab.dataset.youtube;
      const urlBase = sourceIsDrive ? tab.dataset.driveUrl : tab.dataset.youtubeUrl;
      const embed = buildTimedEmbed(embedBase, sourceIsDrive, startSeconds, endSeconds);
      const url = buildTimedOpenUrl(urlBase, sourceIsDrive, startSeconds);
      if (videoFrame && embed && (force || videoFrame.src !== embed)) {
        videoFrame.src = embed;
        videoFrame.title = title;
      }
      if (videoTitle) videoTitle.textContent = title;
      if (videoSource) {
        videoSource.textContent = sourceIsDrive
          ? 'Fuente actual: Google Drive · pantallas no móviles'
          : 'Fuente actual: YouTube · móviles y Google Sites';
      }
      if (openLink && url) {
        openLink.href = url;
        openLink.textContent = sourceIsDrive ? 'Abrir en Drive' : 'Abrir en YouTube';
      }
    };

    const open = () => {
      applyVideoSource(getActiveTab(), true);
      modal.hidden = false;
      document.body.classList.add('modal-open');
      const card = modal.querySelector('.modal-card');
      if (card) card.focus({ preventScroll: true });
    };
    const close = () => {
      // Reinicia el iframe para detener el audio/video al cerrar el modal.
      if (videoFrame && videoFrame.src) videoFrame.src = videoFrame.src;
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      courseBtn.focus({ preventScroll: true });
    };

    courseBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.querySelectorAll('[data-close-course]').forEach((node) => node.addEventListener('click', close));
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.forEach((node) => node.classList.toggle('active', node === btn));
        applyVideoSource(btn, true);
      });
    });
    courseShotButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const wantedTab = (btn.dataset.videoTab || '').toLowerCase();
        const targetTab = tabs.find((tab) => (tab.dataset.tabId || '').toLowerCase() === wantedTab)
          || tabs.find((tab) => tab.textContent.trim().toLowerCase().includes(wantedTab.replace('cap', 'cap. ')))
          || getActiveTab();
        if (targetTab) tabs.forEach((node) => node.classList.toggle('active', node === targetTab));
        applyVideoSource(targetTab || getActiveTab(), true, Number(btn.dataset.videoTime || 0), Number(btn.dataset.videoEnd || 0));
        applyGuidedShot(btn.dataset.shotId, { scrollToTable: true, updateVideo: false });
      });
    });

    const onViewportChange = () => {
      if (!modal.hidden) applyVideoSource(getActiveTab(), true);
    };
    [mobileScreenQuery, tabletScreenQuery].forEach((query) => {
      if (query.addEventListener) {
        query.addEventListener('change', onViewportChange);
      } else if (query.addListener) {
        query.addListener(onViewportChange);
      }
    });
    applyVideoSource(getActiveTab(), true);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) close();
    });
  }

  function setModule(id) {
    const mod = modules[id] || modules[0];
    state.module = mod.id;
    el.moduleList.querySelectorAll('.module-btn').forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.module) === mod.id));
    el.lessonTitle.textContent = `Módulo ${mod.id}: ${mod.title}`;
    el.lessonText.textContent = mod.text;
    el.lessonBullets.innerHTML = mod.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('');
    if (mod.id === 3 || mod.id === 4 || mod.id === 5) el.modeSelect.value = 'connectors';
    if (mod.id === 6) el.modeSelect.value = 'lab';
    updateAll('module');
  }

  function getGuidedShot(id) {
    return guidedShots.find((shot) => shot.id === id) || guidedShots[0];
  }

  function applyGuidedShot(id, options = {}) {
    const shot = getGuidedShot(id);
    if (!shot) return;
    state.exit = roundTenth(shot.exit);
    state.arrival = roundTenth(shot.arrival);
    state.attack = roundTenth(shot.attack);
    state.bands = shot.bands || 3;
    state.cuePower = shot.cuePower || 55;
    state.deflection = shot.deflection || 'imagen';
    state.effectDot = shot.effectDot ? { ...shot.effectDot } : { x: -0.18, y: -0.32 };
    state.cue = exitInnerPoint(state.exit);
    const arrive = arrivalPoint(state.arrival);
    const short = shortBandPoint(state.arrival, state.attack);
    if (shot.videoModel === 'cuna50Cap2') {
      // Posición inspirada en los fotogramas 08:00–08:13: bolas objetivo agrupadas al lado derecho
      // para que la blanca, después de la tercera banda/llegada 50, salga hacia la carambola.
      state.balls.red = { x: clamp(R - 210, L + 22, R - 22), y: clamp(T + 190, T + 22, B - 22) };
      state.balls.yellow = { x: clamp(R - 165, L + 22, R - 22), y: clamp(T + 150, T + 22, B - 22) };
    } else {
      state.balls.red = {
        x: clamp(arrive.x - 78, L + 22, R - 22),
        y: clamp(arrive.y - 34, T + 22, B - 22)
      };
      state.balls.yellow = {
        x: clamp(short.x + 150, L + 22, R - 22),
        y: clamp(short.y + 58, T + 22, B - 22)
      };
    }
    if (el.exitSelect) el.exitSelect.value = fmt2(state.exit);
    if (el.arrivalSelect) el.arrivalSelect.value = fmt2(state.arrival);
    if (el.attackInput) el.attackInput.value = fmt2(state.attack);
    if (el.bandSelect) el.bandSelect.value = String(state.bands);
    if (el.effectSelect && shot.effectSelect) el.effectSelect.value = shot.effectSelect;
    if (el.shotSelect) el.shotSelect.value = shot.id;
    state.showParallels = true;
    state.guide = true;
    updateAll('guided-shot');
    const videoTimeText = shot.timeLabel ? ` Video: ${shot.timeLabel}.` : '';
    const videoModelText = shot.videoModel === 'cuna50Cap2'
      ? ' Ruta calibrada con fotogramas: 1ª banda cuña/ataque 0, 2ª banda corta casi simultánea, 3ª banda llegada 50 y rebote hacia zona de carambola.'
      : '';
    feedback(shot.label, `Mesa configurada: Entrada ${fmt2(state.attack)} = Salida ${fmt2(state.exit)} − Llegada ${fmt2(state.arrival)}.${videoTimeText}${videoModelText}`, 0);
    if (options.scrollToTable && el.trainerCard) {
      el.trainerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function loadExercise(index) {
    state.exerciseIndex = clamp(index, 0, exercises.length - 1);
    const ex = exercises[state.exerciseIndex];
    state.exit = ex.exit;
    state.arrival = ex.arrival;
    state.bands = ex.bands;
    state.cue = exitInnerPoint(state.exit);
    state.attack = finalAttack();
    el.exerciseSelect.value = String(state.exerciseIndex);
    syncSelectIfExact(el.exitSelect, state.exit);
    syncSelectIfExact(el.arrivalSelect, state.arrival);
    el.bandSelect.value = String(state.bands);
    el.attackInput.value = fmt2(state.attack);
    updateAll('exercise');
  }

  function autoAttack() {
    state.cue = exitInnerPoint(state.exit);
    if (el.modeSelect.value === 'learn' || el.modeSelect.value === 'practice' || el.modeSelect.value === 'connectors') {
      state.attack = correctAttack();
      el.attackInput.value = fmt2(state.attack);
    }
  }

  function randomExercise() {
    loadExercise(Math.floor(Math.random() * exercises.length));
  }

  function correctAttackPrecise() {
    return clamp(Number(state.exit) - Number(state.arrival), 0, 100);
  }

  function correctAttack() {
    return Number(correctAttackPrecise().toFixed(1));
  }

  function fmt2(value) {
    return Number(value || 0).toFixed(1);
  }

  function railDistanceFromCue() {
    return Math.min(state.cue.x - L, R - state.cue.x, state.cue.y - T, B - state.cue.y);
  }

  function effectCorrection() {
    const diff = selectedEffect() - recommendedEffect();
    // Más efecto abre la llegada; para conservar la llegada se compensa con más ataque.
    return diff * 3.5;
  }

  function powerCorrection() {
    const power = getCuePower();
    const rec = recommendedPower();
    // Más fuerza abre un poco la salida de la segunda banda; poca fuerza tiende a cerrar.
    return (power - rec) / 15;
  }

  function railCorrection() {
    const d = railDistanceFromCue();
    if (d < 28) return 3;
    if (d < 45) return 1.5;
    return 0;
  }

  function ballInterferenceCorrection() {
    const a = state.cue;
    const b = attackPoint(correctAttack());
    const red = ballApproxPosition('red');
    const yellow = ballApproxPosition('yellow');
    const redD = distancePointToSegment(red, a, b);
    const yellowD = distancePointToSegment(yellow, a, b);
    const blocked = Math.min(redD, yellowD) < 34;
    return blocked ? 2 : 0;
  }

  function compensation() {
    return effectCorrection() + powerCorrection() + railCorrection() + ballInterferenceCorrection();
  }

  function finalAttackPrecise() {
    return clamp(correctAttackPrecise() + compensation(), 0, ATTACK_MAX);
  }

  function finalAttack() {
    return Number(finalAttackPrecise().toFixed(2));
  }

  function compensationText() {
    const parts = [];
    const eff = effectCorrection();
    const pow = powerCorrection();
    const rail = railCorrection();
    const ball = ballInterferenceCorrection();
    if (Math.abs(eff) >= .5) parts.push(`efecto ${fmtSigned(eff)}`);
    if (Math.abs(pow) >= .5) parts.push(`potencia ${fmtSigned(pow)}`);
    if (rail) parts.push(`cerca de banda ${fmtSigned(rail)}`);
    if (ball) parts.push(`contra bola ${fmtSigned(ball)}`);
    return parts.length ? parts.join(' · ') : 'sin ajuste adicional';
  }

  function fmtSigned(n) {
    const v = Math.round(n * 10) / 10;
    return `${v >= 0 ? '+' : ''}${v}`;
  }

  function ballApproxPosition(kind) {
    return state.balls[kind] || state.balls.red;
  }

  function distancePointToSegment(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy), 0, 1);
    const x = a.x + t * dx;
    const y = a.y + t * dy;
    return Math.hypot(p.x - x, p.y - y);
  }

  function recommendedEffect() {
    if (state.arrival <= 10) return 1;
    if (state.arrival <= 20) return 2;
    return 3;
  }

  function selectedEffect() {
    return el.effectSelect.value === 'auto' ? recommendedEffect() : Number(el.effectSelect.value);
  }

  function getCuePower() {
    return clamp(state.cuePower || 55, 5, MAX_CUE_POWER);
  }

  function powerDisplayLabel(value = getCuePower()) {
    const p = Math.round(Number(value) || 0);
    return p > NORMAL_MAX_POWER ? `Tiro largo ${p}%` : `Potencia ${p}%`;
  }

  function setCuePower(value) {
    state.cuePower = clamp(Math.round(value), 5, MAX_CUE_POWER);
    syncPowerInput();
  }

  function bindPowerControls() {
    if (el.powerSlider) {
      el.powerSlider.disabled = false;
      el.powerSlider.removeAttribute('disabled');
      const applySliderPower = () => {
        const value = Number(el.powerSlider.value);
        if (!Number.isNaN(value)) {
          state.cuePower = clamp(Math.round(value), 5, 100);
          updateAll('power-slider');
        }
      };
      ['input', 'change', 'pointerup', 'mouseup', 'touchend', 'keyup'].forEach((eventName) => {
        el.powerSlider.addEventListener(eventName, applySliderPower, { passive: true });
      });
    }
    if (el.powerDownBtn) {
      el.powerDownBtn.addEventListener('click', () => {
        setCuePower(getCuePower() - 5);
        updateAll('power-down');
      });
    }
    if (el.powerUpBtn) {
      el.powerUpBtn.addEventListener('click', () => {
        setCuePower(getCuePower() + 5);
        updateAll('power-up');
      });
    }
  }

  function syncPowerInput() {
    if (el.powerSlider) el.powerSlider.value = String(clamp(getCuePower(), 5, Number(el.powerSlider.max || NORMAL_MAX_POWER)));
  }

  function clientToTablePoint(clientX, clientY) {
    const rect = el.table.getBoundingClientRect();
    return {
      x: clamp(((clientX - rect.left) / rect.width) * W, L + 18, R - 18),
      y: clamp(((clientY - rect.top) / rect.height) * H, T + 18, B - 18)
    };
  }

  function clientToTablePointRaw(clientX, clientY) {
    const rect = el.table.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H
    };
  }

  function powerFromCuePull(pullDistance) {
    const d = Math.max(0, Number(pullDistance) || 0);
    const minPull = 18;
    const normalPull = 260;
    const longPull = 430;
    if (d <= minPull) return 5;
    if (d <= normalPull) {
      const t = clamp((d - minPull) / (normalPull - minPull), 0, 1);
      return Math.round(5 + Math.pow(t, 1.12) * (NORMAL_MAX_POWER - 5));
    }
    const t = clamp((d - normalPull) / (longPull - normalPull), 0, 1);
    return Math.round(NORMAL_MAX_POWER + Math.pow(t, 1.04) * (MAX_CUE_POWER - NORMAL_MAX_POWER));
  }

  function cuePullFromPower(powerValue = getCuePower()) {
    const p = clamp(Number(powerValue) || 5, 5, MAX_CUE_POWER);
    const minPull = 18;
    const normalPull = 260;
    const longPull = 430;
    if (p <= NORMAL_MAX_POWER) {
      const t = Math.pow(clamp((p - 5) / (NORMAL_MAX_POWER - 5), 0, 1), 1 / 1.12);
      return minPull + t * (normalPull - minPull);
    }
    const t = Math.pow(clamp((p - NORMAL_MAX_POWER) / (MAX_CUE_POWER - NORMAL_MAX_POWER), 0, 1), 1 / 1.04);
    return normalPull + t * (longPull - normalPull);
  }

  function cueAimUnit() {
    const aim = attackPoint(state.attack || finalAttack());
    const dx = aim.x - state.cue.x;
    const dy = aim.y - state.cue.y;
    const len = Math.hypot(dx, dy) || 1;
    return { ux: dx / len, uy: dy / len };
  }

  function projectedCuePullFromClient(clientX, clientY) {
    const p = clientToTablePointRaw(clientX, clientY);
    const { ux, uy } = cueAimUnit();
    return ((state.cue.x - p.x) * ux) + ((state.cue.y - p.y) * uy);
  }

  function pointInsideTable(p, margin = 0) {
    return p.x >= L - margin && p.x <= R + margin && p.y >= T - margin && p.y <= B + margin;
  }

  function attackValueFromCueDirection(ux, uy) {
    if (Math.abs(uy) < 0.0001) return roundTenth(clamp(state.attack, 0, ATTACK_MAX));
    const tTop = (T - state.cue.y) / uy;
    if (tTop <= 0) return roundTenth(clamp(state.attack, 0, ATTACK_MAX));
    const x = clamp(state.cue.x + ux * tTop, L, R);
    return roundTenth(clamp(attackValueFromX(x), 0, ATTACK_MAX));
  }

  function exitValueFromCueDirection(ux, uy) {
    const candidates = [];
    // Salida = proyección hacia atrás del taco: puede caer en banda larga inferior o en banda corta derecha.
    if (Math.abs(uy) > 0.0001) {
      const sBottom = (B - state.cue.y) / (-uy);
      const xBottom = state.cue.x - ux * sBottom;
      if (sBottom >= 0 && xBottom >= L && xBottom <= R) {
        candidates.push({ s: sBottom, value: bottomExitValueFromX(xBottom) });
      }
    }
    if (Math.abs(ux) > 0.0001) {
      const sRight = (R - state.cue.x) / (-ux);
      const yRight = state.cue.y - uy * sRight;
      if (sRight >= 0 && yRight >= T && yRight <= B) {
        candidates.push({ s: sRight, value: rightExitValueFromY(yRight) });
      }
    }
    if (!candidates.length) return roundTenth(clamp(exitValueFromPoint(state.cue), 0, 100));
    candidates.sort((a, b) => a.s - b.s);
    return roundTenth(clamp(candidates[0].value, 0, 100));
  }

  function applyProjectedSystemFromDirection(ux, uy, updateAttack = true) {
    const exitValue = exitValueFromCueDirection(ux, uy);
    const attackValue = updateAttack ? attackValueFromCueDirection(ux, uy) : roundTenth(clamp(state.attack, 0, ATTACK_MAX));
    state.exit = roundTenth(clamp(exitValue, 0, 100));
    state.attack = roundTenth(clamp(attackValue, 0, ATTACK_MAX));
    state.arrival = roundTenth(clamp(state.exit - state.attack, 0, 100));
    syncSelectIfExact(el.exitSelect, state.exit);
    syncSelectIfExact(el.arrivalSelect, state.arrival);
    if (el.attackInput && document.activeElement !== el.attackInput) el.attackInput.value = fmt2(state.attack);
  }

  function applyProjectedSystemFromCurrentCue(updateAttack = false) {
    const target = attackPoint(state.attack || finalAttack());
    const dx = target.x - state.cue.x;
    const dy = target.y - state.cue.y;
    const len = Math.hypot(dx, dy) || 1;
    applyProjectedSystemFromDirection(dx / len, dy / len, updateAttack);
  }

  function startCuePowerDrag(event) {
    if (state.animating) return;
    state.draggingPower = true;
    state.powerDragOffset = 0;
    event.preventDefault();
    event.stopPropagation();
    try { el.table.setPointerCapture?.(event.pointerId); } catch (error) {}
    updatePowerFromCueDrag(event.clientX, event.clientY);
  }

  function updatePowerFromCueDrag(clientX, clientY) {
    const handle = clientToTablePointRaw(clientX, clientY);
    const dx = state.cue.x - handle.x;
    const dy = state.cue.y - handle.y;
    const pull = Math.hypot(dx, dy);
    if (pull > 6) {
      setCuePower(powerFromCuePull(pull));
      const ux = dx / pull;
      const uy = dy / pull;
      // El taco define simultáneamente salida proyectada, entrada/ataque y llegada por fórmula.
      applyProjectedSystemFromDirection(ux, uy, true);
    }
    drawDynamic();
    updateReadouts();
    updateEffectUI();
  }

  function syncDynamicNumbersFromCurrentShot() {
    // Mantiene los tres números exactos conectados por la fórmula:
    // ATAQUE = SALIDA − LLEGADA, por tanto LLEGADA = SALIDA − ATAQUE.
    applyProjectedSystemFromCurrentCue(false);
  }

  function attackZone(attack = state.attack) {
    if (attack <= 20) return { name: 'Ángulo corto', key: 'short', detail: 'Zona 0–20' };
    if (attack <= 40) return { name: 'Ángulo medio', key: 'medium', detail: 'Zona 20–40' };
    if (attack <= 70) return { name: 'Ángulo largo', key: 'long', detail: 'Zona 40–70' };
    return { name: 'Ángulo extra largo', key: 'extra', detail: 'Mayor de 70' };
  }

  async function toggleFullTable() {
    state.fullTable = !state.fullTable;
    document.body.classList.toggle('full-table-mode', state.fullTable);
    try {
      if (state.fullTable && el.trainerCard?.requestFullscreen && !document.fullscreenElement) {
        await el.trainerCard.requestFullscreen();
      } else if (!state.fullTable && document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      // En navegadores embebidos, como Google Sites, el fullscreen nativo puede estar bloqueado. El modo visual interno queda activo.
    }
    updateAll('full-table');
  }

  function syncFullTableState() {
    if (!document.fullscreenElement && state.fullTable) {
      state.fullTable = false;
      document.body.classList.remove('full-table-mode');
      updateAll('fullscreenchange');
    }
  }

  function updatePlaybackButtons() {
    if (el.repeatBtn) {
      const active = state.playbackMode === 'repeat' && state.animating;
      el.repeatBtn.textContent = active ? (state.paused ? 'Continuar' : 'Pause') : 'Repetir';
      el.repeatBtn.classList.toggle('primary', active);
      el.repeatBtn.classList.toggle('secondary', !active);
      el.repeatBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    if (el.replayBtn) {
      const active = state.playbackMode === 'replay' && state.animating;
      el.replayBtn.textContent = active ? (state.paused ? 'Continuar' : 'Pause') : 'Replay';
      el.replayBtn.classList.toggle('primary', active);
      el.replayBtn.classList.toggle('secondary', !active);
      el.replayBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function updateAll(reason) {
    state.exit = clamp(Number.isFinite(Number(state.exit)) ? Number(state.exit) : Number(el.exitSelect.value || 50), 0, 100);
    state.arrival = clamp(Number.isFinite(Number(state.arrival)) ? Number(state.arrival) : Number(el.arrivalSelect.value || 20), 0, 100);
    state.attack = roundTenth(clamp(Number.isFinite(Number(el.attackInput.value)) ? Number(el.attackInput.value) : Number(state.attack), 0, ATTACK_MAX));
    state.bands = Number(el.bandSelect.value || state.bands);
    syncSelectIfExact(el.exitSelect, state.exit);
    syncSelectIfExact(el.arrivalSelect, state.arrival);
    if (el.attackInput && document.activeElement !== el.attackInput) el.attackInput.value = fmt2(state.attack);
    syncPowerInput();
    if (el.powerReadout) el.powerReadout.textContent = `${getCuePower()}%`;
    if (el.powerBadge) el.powerBadge.textContent = powerDisplayLabel();
    el.guideBtn.textContent = `Guía: ${state.guide ? 'ON' : 'OFF'}`;
    el.linesBtn.textContent = state.showParallels ? 'Ocultar líneas' : 'Líneas salida-ataque';
    el.placeBtn.textContent = `Mover bolas: ${state.placeMode ? 'ON' : 'OFF'}`;
    el.soundBtn.textContent = `Sonido: ${state.soundOn ? 'ON' : 'OFF'}`;
    if (el.fullTableBtn) {
      el.fullTableBtn.textContent = state.fullTable ? 'Salir mesa completa' : 'Mesa completa';
      el.fullTableBtn.classList.toggle('primary', state.fullTable);
      el.fullTableBtn.classList.toggle('secondary', !state.fullTable);
    }
    updatePlaybackButtons();
    el.table.classList.toggle('placing', state.placeMode);
    updateReadouts();
    updateEffectUI();
    drawDynamic();
    positionBalls();
    updateScoreboard();
    el.labLogWrap.classList.toggle('open', el.modeSelect.value === 'lab');
  }

  function updateReadouts() {
    const correct = correctAttackPrecise();
    const final = finalAttackPrecise();
    const zone = attackZone(final);
    const recEff = recommendedEffect();
    const eff = selectedEffect();
    if (el.preciseExit) el.preciseExit.textContent = fmt2(state.exit);
    if (el.preciseAttack) el.preciseAttack.textContent = fmt2(state.attack);
    if (el.preciseArrival) el.preciseArrival.textContent = fmt2(state.arrival);
    if (el.preciseDetail) el.preciseDetail.innerHTML = `<span class="value-exit">Salida ${fmt2(state.exit)}</span> · <span class="value-attack">Entrada ${fmt2(state.attack)}</span> · <span class="value-arrival">Llegada ${fmt2(state.arrival)}</span> · Fórmula ${fmt2(correct)} · Final ${fmt2(final)}`;
    el.formulaReadout.innerHTML = `<span class="value-exit">${fmt2(state.exit)}</span> − <span class="value-arrival">${fmt2(state.arrival)}</span> = <span class="value-attack">${fmt2(correct)}</span>`;
    el.formulaDetail.innerHTML = `Entrada base <span class="value-attack">${fmt2(correct)}</span> · Compensación: ${compensationText()} · Entrada final recomendada <span class="value-attack">${fmt2(final)}</span> · Entrada jugador <span class="value-attack">${fmt2(state.attack)}</span>`;
    el.topFormula.textContent = `Salida ${fmt2(state.exit)} − Llegada ${fmt2(state.arrival)} = Entrada ${fmt2(correct)} · Final ${fmt2(final)}`;
    el.effectReadout.textContent = `Efecto ${eff}`;
    el.effectDetail.textContent = `Recomendado por llegada: efecto ${recEff}. ${effectAdvice(recEff)} Compensación: ${compensationText()}.`;
    el.zoneReadout.textContent = zone.name;
    el.zoneDetail.textContent = `${zone.detail}. Ruta real: salida → ataque → banda corta → llegada.`;
  }

  function effectAdvice(effect) {
    if (effect === 1) return 'Llegada corta, efecto suave.';
    if (effect === 2) return 'Llegada 10–20, efecto medio.';
    return 'Llegada superior a 20, efecto 3.';
  }

  function map(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  }

  function topXFromValue(value) {
    return map(value, 100, 0, L, R);
  }

  function longDiamondX(index) {
    return L + ((index + 1) / 8) * (R - L);
  }

  function valueOnLongRail(value) {
    return map(clamp(Number(value) || 0, 0, 100), 0, 100, L, R);
  }

  function valueFromLongRail(x) {
    return map(clamp(Number(x) || L, L, R), L, R, 0, 100);
  }

  function coordFromAnchors(value, anchors) {
    if (!anchors.length) return L;
    const sorted = [...anchors].sort((a, b) => a.value - b.value);
    const v = clamp(Number(value) || 0, sorted[0].value, sorted[sorted.length - 1].value);
    if (v <= sorted[0].value) return sorted[0].coord;
    if (v >= sorted[sorted.length - 1].value) return sorted[sorted.length - 1].coord;
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (v >= a.value && v <= b.value) return map(v, a.value, b.value, a.coord, b.coord);
    }
    return sorted[0].coord;
  }

  function valueFromAnchorList(coord, anchors) {
    if (!anchors.length) return 0;
    const sorted = [...anchors].sort((a, b) => a.coord - b.coord);
    const c = clamp(Number(coord) || sorted[0].coord, sorted[0].coord, sorted[sorted.length - 1].coord);
    if (c <= sorted[0].coord) return sorted[0].value;
    if (c >= sorted[sorted.length - 1].coord) return sorted[sorted.length - 1].value;
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (c >= a.coord && c <= b.coord) return map(c, a.coord, b.coord, a.value, b.value);
    }
    return sorted[0].value;
  }

  function attackAnchors() {
    // Esquina inicial 0; diamantes visibles 10,20,30,40,50,70,90; el 100 es proyección intermedia y la esquina final es 110.
    return [
      { value: 0, coord: L },
      { value: 10, coord: longDiamondX(0) },
      { value: 20, coord: longDiamondX(1) },
      { value: 30, coord: longDiamondX(2) },
      { value: 40, coord: longDiamondX(3) },
      { value: 50, coord: longDiamondX(4) },
      { value: 70, coord: longDiamondX(5) },
      { value: 90, coord: longDiamondX(6) },
      { value: ATTACK_MAX, coord: R }
    ];
  }

  function arrivalAnchors() {
    // Llegada: esquina inicial 0; lectura directa y proporcional 10,20,30,40,45,60,80,100.
    // El 40 es una marca proporcional intermedia antes del diamante 45.
    return [
      { value: 0, coord: L },
      { value: 10, coord: longDiamondX(0) },
      { value: 20, coord: longDiamondX(1) },
      { value: 30, coord: longDiamondX(2) },
      { value: 40, coord: map(40, 30, 45, longDiamondX(2), longDiamondX(3)) },
      { value: 45, coord: longDiamondX(3) },
      { value: 60, coord: longDiamondX(4) },
      { value: 80, coord: longDiamondX(5) },
      { value: 100, coord: longDiamondX(6) }
    ];
  }

  function bottomExitAnchors() {
    // Salida inferior: esquina inicial 0, diamantes 15..45 y esquina final 50.
    return [
      { value: 0, coord: L },
      { value: 15, coord: longDiamondX(0) },
      { value: 20, coord: longDiamondX(1) },
      { value: 25, coord: longDiamondX(2) },
      { value: 30, coord: longDiamondX(3) },
      { value: 35, coord: longDiamondX(4) },
      { value: 40, coord: longDiamondX(5) },
      { value: 45, coord: longDiamondX(6) },
      { value: 50, coord: R }
    ];
  }

  function rightExitAnchors() {
    // Salida banda corta: esquina inferior 50, diamantes 60,70,90 y esquina superior 100.
    return [
      { value: 50, coord: B },
      { value: 60, coord: T + (3 / 4) * (B - T) },
      { value: 70, coord: T + (2 / 4) * (B - T) },
      { value: 90, coord: T + (1 / 4) * (B - T) },
      { value: 100, coord: T }
    ];
  }

  function attackXFromValue(value) {
    return coordFromAnchors(value, attackAnchors());
  }

  function valueFromAnchors(coord, anchors, valueKey, coordKey) {
    if (!anchors.length) return 0;
    const sorted = [...anchors].sort((a, b) => a[coordKey] - b[coordKey]);
    const c = clamp(coord, sorted[0][coordKey], sorted[sorted.length - 1][coordKey]);
    if (c <= sorted[0][coordKey]) return sorted[0][valueKey];
    if (c >= sorted[sorted.length - 1][coordKey]) return sorted[sorted.length - 1][valueKey];
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (c >= a[coordKey] && c <= b[coordKey]) return map(c, a[coordKey], b[coordKey], a[valueKey], b[valueKey]);
    }
    return sorted[0][valueKey];
  }

  function attackValueFromX(x) {
    return roundTenth(valueFromAnchorList(x, attackAnchors()));
  }

  function arrivalValueFromX(x) {
    return roundTenth(valueFromAnchorList(x, arrivalAnchors()));
  }

  function bottomExitValueFromX(x) {
    return roundTenth(valueFromAnchorList(x, bottomExitAnchors()));
  }

  function rightExitValueFromY(y) {
    return roundTenth(valueFromAnchorList(y, rightExitAnchors()));
  }

  function exitValueFromPoint(p) {
    // Lectura dinámica: si la blanca está más cerca de la banda derecha, usa la banda corta;
    // si no, usa la banda larga inferior. Todo queda escalado de 0 a 100.
    const distBottom = Math.abs(B - p.y);
    const distRight = Math.abs(R - p.x);
    const useRightBand = p.x > R - 115 || distRight < distBottom * 0.78;
    const value = useRightBand ? rightExitValueFromY(p.y) : bottomExitValueFromX(p.x);
    return roundTenth(clamp(value, 0, 100));
  }

  function bottomExitX(value) {
    return coordFromAnchors(value, bottomExitAnchors());
  }

  function rightExitY(value) {
    return coordFromAnchors(value, rightExitAnchors());
  }

  function attackPoint(value = state.attack) {
    return { x: attackXFromValue(value), y: T };
  }

  function arrivalAnchorPairs() {
    return scaleValues.map((value) => ({ attack: value, arrival: value }));
  }

  function arrivalXFromValue(value) {
    return coordFromAnchors(value, arrivalAnchors());
  }

  function arrivalPoint(value = state.arrival) {
    return { x: arrivalXFromValue(value), y: B - 10 };
  }

  function exitRailPoint(value = state.exit) {
    if (Number(value) <= 50) return { x: bottomExitX(value), y: B + 2 };
    return { x: R + 2, y: rightExitY(value) };
  }

  function exitInnerPoint(value = state.exit) {
    if (Number(value) <= 50) return { x: bottomExitX(value), y: B - 34 };
    return { x: R - 34, y: rightExitY(value) };
  }

  function isCunaJugada5(exitValue = state.exit, arrivalValue = state.arrival, attackValue = state.attack) {
    // Jugada 5 del Capítulo 2: salida 50, ataque 0/cuña y llegada 50.
    // En esta posición el 0 de ataque no se interpreta como una banda normal, sino como cuña:
    // primer contacto en la esquina de ataque y segundo contacto casi simultáneo en la banda corta.
    return Math.abs(Number(exitValue) - 50) <= 0.35
      && Math.abs(Number(arrivalValue) - 50) <= 0.35
      && Math.abs(Number(attackValue)) <= 0.35;
  }

  function shortBandPoint(arrivalValue = state.arrival, attackValue = state.attack) {
    // Segunda banda obligatoria del sistema: banda corta opuesta antes de llegar a la banda de llegada.
    // En la Jugada 5 del Cap. 2, la bola entra por la cuña: ataque 0 y banda corta se tocan casi en la misma esquina.
    if (isCunaJugada5(state.exit, arrivalValue, attackValue)) {
      return { x: L + 2, y: T + 26, cuna: true };
    }
    const yByArrival = map(clamp(arrivalValue, 0, 100), 0, 100, T + 96, B - 82);
    const yByAttack = map(clamp(attackValue, 0, ATTACK_MAX), 0, ATTACK_MAX, T + 72, B - 108);
    return {
      x: L + 2,
      y: clamp((yByArrival * 0.7) + (yByAttack * 0.3), T + 62, B - 56)
    };
  }

  function railContactForCueCenter(point) {
    return {
      x: clamp(point.x, L + BALL_R, R - BALL_R),
      y: clamp(point.y, T + BALL_R, B - BALL_R)
    };
  }

  function reboundProjectionPoint(points) {
    if (!points || points.length < 2) return null;
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    let dx = last.x - prev.x;
    let dy = last.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    // Reflexión real después del último contacto con banda.
    // Larga inferior/superior invierte Y; corta izquierda/derecha invierte X.
    const nearBottom = last.y >= B - 38;
    const nearTop = last.y <= T + 38;
    const nearLeft = last.x <= L + 38;
    const nearRight = last.x >= R - 38;
    if (nearBottom) dy = -Math.abs(dy);
    else if (nearTop) dy = Math.abs(dy);
    if (nearLeft) dx = Math.abs(dx);
    else if (nearRight) dx = -Math.abs(dx);

    if (isCunaJugada5()) {
      // En el video (Cap. 2, Jugada 5) después de la llegada 50 la blanca sale de la banda larga
      // hacia la zona alta-derecha, donde quedan las bolas objetivo.
      return {
        x: clamp(R - 155, L + BALL_R, R - BALL_R),
        y: clamp(T + 145, T + BALL_R, B - BALL_R),
        tag: 'rebote a zona de carambola',
        rail: false
      };
    }
    const distance = clamp(190 + getCuePower() * 1.65, 210, 420);
    return {
      x: clamp(last.x + dx * distance, L + BALL_R, R - BALL_R),
      y: clamp(last.y + dy * distance, T + BALL_R, B - BALL_R),
      tag: 'rebote después de llegada',
      rail: false
    };
  }

  function appendReboundProjection(points) {
    const out = points.map((point) => ({ ...point }));
    const projection = reboundProjectionPoint(out);
    if (projection) out.push(projection);
    return out;
  }

  function connectorEnd(arrivalValue = state.arrival, attackValue = state.attack, bands = state.bands) {
    const zone = attackZone(attackValue).key;
    const base = arrivalPoint(arrivalValue);
    const offsets = { short: -170, medium: -105, long: -55, extra: -18 };
    let end;
    if (bands <= 3) return { x: base.x, y: base.y };
    if (bands === 4) {
      end = { x: clamp(base.x + offsets[zone], L, R), y: T + 12 };
    } else if (bands === 5) {
      end = { x: clamp(base.x + offsets[zone] * 1.2, L, R), y: T + 12 };
      end = { x: clamp(end.x - 120, L, R), y: B - 12 };
    } else {
      end = { x: clamp(base.x - 160, L, R), y: T + 12 };
    }
    return end;
  }

  function pathFor(user = false) {
    const arrival = user ? predictedArrival() : state.arrival;
    const attack = user ? state.attack : finalAttack();
    const short = shortBandPoint(arrival, attack);
    const arrive = arrivalPoint(arrival);
    const points = [state.cue, attackPoint(attack), short, arrive];
    if (state.bands >= 4) points.push(connectorEnd(arrival, attack, 4));
    if (state.bands >= 5) points.push({ x: clamp(arrive.x - 130, L, R), y: B - 12 });
    if (state.bands >= 6) points.push({ x: clamp(arrive.x - 230, L, R), y: T + 12 });
    return appendReboundProjection(points);
  }

  function mathPathFor() {
    const attack = correctAttack();
    const short = shortBandPoint(state.arrival, attack);
    return appendReboundProjection([state.cue, attackPoint(attack), short, arrivalPoint(state.arrival)]);
  }

  function predictedArrival() {
    const base = state.exit - state.attack;
    const effectDiff = selectedEffect() - recommendedEffect();
    const power = getCuePower();
    const bands = state.bands;
    let correction = 0;
    correction += effectDiff * 3.5;
    correction += (power - recommendedPower()) / 15;
    if (bands >= 5 && power < 65) correction -= 3;
    if (state.attack > 70) correction += 2.2;
    if (state.attack < 20) correction -= 1.6;
    return clamp(base + correction, 0, 100);
  }

  function recommendedPower() {
    if (state.bands <= 3) return 52;
    if (state.bands === 4) return 60;
    if (state.bands === 5) return 68;
    if (state.bands === 6) return 74;
    if (state.bands === 7) return 80;
    if (state.bands === 8) return 86;
    if (state.bands === 9) return 92;
    return 96;
  }

  function drawStaticTable() {
    let diamonds = '';
    let numbers = '';
    const size = 7;
    const diamond = (x, y) => `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`;

    for (let i = 0; i < 7; i += 1) {
      const x = longDiamondX(i);
      diamonds += `<polygon class="diamond" points="${diamond(x, T - 18)}"></polygon>`;
      diamonds += `<polygon class="diamond" points="${diamond(x, B + 18)}"></polygon>`;
    }
    for (let i = 0; i <= 10; i += 1) {
      const x = map(i, 0, 10, L, R);
      numbers += `<line class="grid-line" x1="${x}" y1="${T}" x2="${x}" y2="${B}" />`;
    }
    for (let i = 1; i <= 3; i += 1) {
      const y = T + (i / 4) * (B - T);
      diamonds += `<polygon class="diamond" points="${diamond(L - 18, y)}"></polygon>`;
      diamonds += `<polygon class="diamond" points="${diamond(R + 18, y)}"></polygon>`;
    }
    for (let i = 0; i <= 5; i += 1) {
      const y = map(i, 0, 5, T, B);
      numbers += `<line class="grid-line" x1="${L}" y1="${y}" x2="${R}" y2="${y}" />`;
    }

    // Numeración visible del sistema Base 50 / Conti como estaba antes.
    // La lectura interna proyecta el ataque hasta 110; 100 queda antes de la esquina final.
    const attackLabels = [10, 20, 30, 40, 50, 70, 90];
    numbers += `<text class="attack-num corner-ref" x="${L}" y="${T - 34}" text-anchor="middle">0</text>`;
    attackLabels.forEach((label, index) => {
      const x = longDiamondX(index);
      numbers += `<text class="attack-num" x="${x}" y="${T - 34}" text-anchor="middle">${label}</text>`;
    });
    const attack100X = attackXFromValue(100);
    numbers += `<text class="attack-num corner-ref" x="${attack100X}" y="${T - 14}" text-anchor="middle">100</text>`;
    numbers += `<text class="attack-num corner-ref" x="${R}" y="${T - 34}" text-anchor="middle">110</text>`;
    numbers += `<text class="axis-title attack" x="${L - 84}" y="${T - 34}" text-anchor="start">Ataque → 7 diamantes</text>`;

    const exitBottomLabels = [15, 20, 25, 30, 35, 40, 45];
    exitBottomLabels.forEach((label, index) => {
      const x = longDiamondX(index);
      numbers += `<text class="exit-num" x="${x}" y="${B + 42}" text-anchor="middle">${label}</text>`;
    });
    numbers += `<text class="exit-num" x="${R + 20}" y="${B + 8}" text-anchor="start">50</text>`;

    // Banda corta de salida: solo tres diamantes visibles, exactamente 60, 70 y 90.
    // Se alinean con los tres diamantes laterales: 60 abajo, 70 en el centro y 90 arriba.
    const sideExitLabels = [60, 70, 90];
    sideExitLabels.forEach((label, index) => {
      const y = T + ((3 - index) / 4) * (B - T);
      numbers += `<text class="exit-num" x="${R + 24}" y="${y + 6}" text-anchor="start">${label}</text>`;
    });

    const arrivalLabels = [10, 20, 30, 45, 60, 80, 100];
    arrivalLabels.forEach((label, index) => {
      const x = longDiamondX(index);
      numbers += `<text class="arrival-num" x="${x}" y="${B + 76}" text-anchor="middle">${label}</text>`;
    });
    const arrival40X = arrivalXFromValue(40);
    numbers += `<text class="arrival-num arrival-mid" x="${arrival40X}" y="${B + 96}" text-anchor="middle">40</text>`;

    numbers += `<text class="axis-title exit" x="${L - 84}" y="${B + 42}" text-anchor="start">Salida →</text>`;
    numbers += `<text class="axis-title arrival" x="${L - 92}" y="${B + 76}" text-anchor="start">Llegada →</text>`;
    numbers += `<text class="axis-title exit" x="${R + 38}" y="${T + 118}" text-anchor="middle" transform="rotate(90 ${R + 38} ${T + 118})">Banda corta salida: 60 · 70 · 90</text>`;
    numbers += `<text class="axis-title arrival" x="${L + 250}" y="${B + 96}" text-anchor="start">Medida exacta interna proporcional 0–100</text>`;
    el.diamondLayer.innerHTML = diamonds;
    el.numberLayer.innerHTML = numbers;
  }

  function powerGuidePreview() {
    if (state.animating) {
      const points = state.lastPath || pathFor(true);
      const sim = state.lastPhysics || null;
      return { points: reduceTrace(points, 120), sim, status: sim ? caromStatusFromSim(sim) : { ok: false, cushions: 0, targets: [] } };
    }
    const sim = simulatePhysicsShot({ preview: true });
    return { points: reduceTrace(sim.traces.cue, 120), sim, status: caromStatusFromSim(sim) };
  }

  function powerGuidePath() {
    return powerGuidePreview().points;
  }

  function reduceTrace(points, max = 90) {
    if (!points || points.length <= max) return points || [];
    const step = Math.ceil(points.length / max);
    const reduced = [];
    for (let i = 0; i < points.length; i += step) reduced.push(points[i]);
    const last = points[points.length - 1];
    const end = reduced[reduced.length - 1];
    if (!end || end.x !== last.x || end.y !== last.y) reduced.push(last);
    return reduced;
  }

  function drawDynamic() {
    drawConnectors();
    drawParallels();
    drawCueStick();
    const ideal = pathFor(false);
    const preview = powerGuidePreview();
    const powerGuide = preview.points;
    el.mathPath.setAttribute('points', toPoints(mathPathFor()));
    el.mathPath.style.opacity = state.guide ? '.9' : '0';
    el.idealPath.setAttribute('points', toPoints(ideal));
    el.idealPath.style.opacity = state.guide ? '1' : '0';
    el.userPath.setAttribute('points', toPoints(powerGuide));
    el.userPath.style.opacity = state.guide ? (preview.status.ok ? '1' : '.62') : '0';
    el.aimPath.setAttribute('points', toPoints([state.cue, attackPoint(state.attack)]));
    el.aimPath.style.opacity = state.guide ? '.85' : '0';
    updateGuideIllumination(preview.status, powerGuide);
  }

  function caromStatusFromSim(sim) {
    if (!sim) return { ok: false, cushions: 0, targets: [] };
    const contacts = Array.isArray(sim.contacts) ? [...sim.contacts].sort((a, b) => a.step - b.step) : [];
    const seen = new Set();
    let second = null;
    contacts.forEach((contact) => {
      if (second || !['red', 'yellow'].includes(contact.target)) return;
      if (!seen.has(contact.target)) {
        seen.add(contact.target);
        if (seen.size === 2) second = contact;
      }
    });
    const fallbackBoth = !!(sim.hit && sim.hit.red && sim.hit.yellow);
    const cushions = second ? second.cushions : Number(sim.cueCushions || 0);
    const ok = (second && second.cushions >= 3) || (fallbackBoth && Number(sim.cueCushions || 0) >= 3);
    return { ok, cushions, targets: [...seen], second, fallbackBoth };
  }

  function updateGuideIllumination(status, points) {
    const ok = !!(state.guide && !state.animating && status && status.ok && points && points.length > 1);
    el.userPath.classList.toggle('guide-coincidence', ok);
    el.idealPath.classList.toggle('guide-coincidence', ok);
    el.table.classList.toggle('guide-coincidence-lit', ok);
    [el.cueBall, el.redBall, el.yellowBall].forEach((node) => node?.classList.toggle('guide-match-lit', ok));
    if (!ok) {
      state.lastGuideLightKey = '';
      return;
    }
    const key = `${Math.round(state.cue.x)}:${Math.round(state.cue.y)}:${Math.round(state.balls.red.x)}:${Math.round(state.balls.red.y)}:${Math.round(state.balls.yellow.x)}:${Math.round(state.balls.yellow.y)}:${state.attack}:${getCuePower()}:${selectedEffect()}:${status.cushions}`;
    if (key !== state.lastGuideLightKey) {
      state.lastGuideLightKey = key;
      el.caromFlash.textContent = `Guía iluminada · carambola ${Math.round(status.cushions)}+ bandas`;
      el.caromFlash.setAttribute('aria-hidden', 'false');
      el.caromFlash.classList.remove('show');
      void el.caromFlash.offsetWidth;
      el.caromFlash.classList.add('show');
      playGuideReadySound();
    }
  }

  function drawCueStick() {
    if (state.animating) {
      el.cueStickLayer.innerHTML = '';
      return;
    }
    const target = attackPoint(state.attack || finalAttack());
    const cue = state.cue;
    const dx = target.x - cue.x;
    const dy = target.y - cue.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const pull = cuePullFromPower(getCuePower());
    const tipGap = 18;
    const start = { x: cue.x - ux * pull, y: cue.y - uy * pull };
    const end = { x: cue.x - ux * tipGap, y: cue.y - uy * tipGap };
    const tipStart = { x: cue.x - ux * 31, y: cue.y - uy * 31 };
    const tipEnd = { x: cue.x - ux * 13, y: cue.y - uy * 13 };
    el.cueStickLayer.innerHTML = `
      <line class="cue-stick-shadow" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"></line>
      <line class="cue-stick" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"></line>
      <line class="cue-tip" x1="${tipStart.x}" y1="${tipStart.y}" x2="${tipEnd.x}" y2="${tipEnd.y}"></line>
      <circle class="cue-handle" cx="${start.x}" cy="${start.y}" r="12"></circle>
    `;
    if (el.powerBadge) {
      el.powerBadge.textContent = powerDisplayLabel();
      el.powerBadge.classList.toggle('long-shot-power', getCuePower() > NORMAL_MAX_POWER);
      el.powerBadge.classList.toggle('power-dragging', state.draggingPower);
      el.powerBadge.style.left = `${(start.x / W) * 100}%`;
      el.powerBadge.style.top = `${((start.y - 30) / H) * 100}%`;
      el.powerBadge.style.opacity = state.animating ? '0' : '1';
    }
  }

  function drawConnectors() {
    const zone = attackZone().key;
    const arrivals = [10, 20, 30, 45, 60, 80, 100];
    let html = '';
    arrivals.forEach((arr, index) => {
      const p = arrivalPoint(arr);
      const fakeAttack = zone === 'short' ? 15 : zone === 'medium' ? 32 : zone === 'long' ? 55 : 85;
      const q = connectorEnd(arr, fakeAttack, 4);
      html += `<line class="connector-line" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" opacity="${.28 + index * .03}" />`;
    });
    const p = arrivalPoint(state.arrival);
    const q = connectorEnd(state.arrival, finalAttack(), Math.max(4, state.bands));
    const short = shortBandPoint(state.arrival, finalAttack());
    html += `<line class="connector-line primary" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" />`;
    html += `<circle class="band-marker" cx="${short.x}" cy="${short.y}" r="8" />`;
    html += `<text class="contact-label" x="${short.x + 14}" y="${short.y - 12}">2ª banda corta</text>`;
    el.connectorLayer.innerHTML = el.modeSelect.value === 'connectors' || state.bands >= 4 || state.guide ? html : '';
  }

  function drawParallels() {
    if (!state.showParallels) {
      el.parallelLayer.innerHTML = '';
      return;
    }
    let html = '';
    exitValues.forEach((exit) => {
      const atk = exit - state.arrival;
      if (atk < 0 || atk > ATTACK_MAX) return;
      const start = exitInnerPoint(exit);
      const end = attackPoint(atk);
      const short = shortBandPoint(state.arrival, atk);
      const arrive = arrivalPoint(state.arrival);
      const primary = Math.abs(exit - state.exit) < 1;
      html += `<polyline class="parallel-line" points="${toPoints([start, end, short, arrive])}" opacity="${primary ? .95 : .28}" />`;
      if (primary) html += `<text class="arrival-num" x="${end.x}" y="${end.y - 14}" text-anchor="middle">${atk}</text>`;
    });
    el.parallelLayer.innerHTML = html;
  }

  function positionBalls() {
    setBall(el.cueBall, state.cue.x, state.cue.y);
    setBall(el.redBall, state.balls.red.x, state.balls.red.y);
    setBall(el.yellowBall, state.balls.yellow.x, state.balls.yellow.y);
    positionEffectControl();
  }

  function positionEffectControl() {
    if (!el.effectControl) return;
    el.effectControl.style.left = `${(state.cue.x / W) * 100}%`;
    el.effectControl.style.top = `${(state.cue.y / H) * 100}%`;
  }

  function setBall(node, x, y) {
    node.style.left = `${(x / W) * 100}%`;
    node.style.top = `${(y / H) * 100}%`;
  }

  function solve() {
    const base = correctAttack();
    const final = finalAttack();
    state.attack = final;
    el.attackInput.value = fmt2(state.attack);
    updateAll('solve');
    const zone = attackZone(final);
    feedback('Solución calculada', `Base: salida ${state.exit} − llegada ${state.arrival} = ataque ${base}. Compensación: ${compensationText()}. Ataque final recomendado ${final}. Ruta: salida → ataque → banda corta → llegada. Usa efecto ${recommendedEffect()} y potencia cercana a ${recommendedPower()}%.`, 0);
  }

  function captureShotSetup() {
    return {
      exit: Number(state.exit),
      arrival: Number(state.arrival),
      attack: Number(state.attack),
      bands: Number(state.bands),
      cuePower: Number(getCuePower()),
      effectValue: el.effectSelect ? String(el.effectSelect.value) : 'auto',
      deflection: state.deflection,
      effectDot: { ...state.effectDot },
      cue: { ...state.cue },
      balls: {
        red: { ...state.balls.red },
        yellow: { ...state.balls.yellow }
      }
    };
  }

  function restoreShotSetup(setup) {
    if (!setup) return false;
    state.exit = roundTenth(clamp(setup.exit, 0, 100));
    state.arrival = roundTenth(clamp(setup.arrival, 0, 100));
    state.attack = roundTenth(clamp(setup.attack, 0, ATTACK_MAX));
    state.bands = Number(setup.bands || state.bands);
    state.cuePower = clamp(Number(setup.cuePower || getCuePower()), 5, MAX_CUE_POWER);
    state.deflection = setup.deflection || state.deflection;
    state.effectDot = setup.effectDot ? { ...setup.effectDot } : { ...state.effectDot };
    state.cue = setup.cue ? { ...setup.cue } : { ...state.cue };
    state.balls.red = setup.balls?.red ? { ...setup.balls.red } : { ...state.balls.red };
    state.balls.yellow = setup.balls?.yellow ? { ...setup.balls.yellow } : { ...state.balls.yellow };
    if (el.effectSelect && setup.effectValue) el.effectSelect.value = setup.effectValue;
    if (el.bandSelect) el.bandSelect.value = String(state.bands);
    if (el.attackInput) el.attackInput.value = fmt2(state.attack);
    syncSelectIfExact(el.exitSelect, state.exit);
    syncSelectIfExact(el.arrivalSelect, state.arrival);
    updateAll('restore-shot');
    return true;
  }

  function togglePlaybackPause(mode) {
    if (!state.playbackMode || state.playbackMode !== mode || !state.animating) return false;
    state.paused = !state.paused;
    updatePlaybackButtons();
    feedback(state.paused ? 'Pausa' : 'Continuar', state.paused ? 'La animación quedó en pausa. Presiona Continuar para seguir.' : 'La animación continúa desde el mismo punto.', 0);
    return true;
  }

  function clearPlaybackState() {
    state.animating = false;
    state.paused = false;
    state.playbackMode = null;
    state.activeFrameAnimation = null;
    updatePlaybackButtons();
  }

  function repeatLastShot() {
    if (togglePlaybackPause('repeat')) return;
    if (state.animating) return;
    if (!state.lastShotSetup) {
      feedback('Sin tacada para repetir', 'Primero realiza una tacada con el botón Tirar. Luego podrás repetir exactamente la misma salida, llegada, entrada, efecto, potencia y posición de bolas.', 0);
      return;
    }
    restoreShotSetup(state.lastShotSetup);
    state.playbackMode = 'repeat';
    state.paused = false;
    updatePlaybackButtons();
    feedback('Tacada repetida', 'Se restauró la última posición inicial. El botón Repetir cambiará a Pause durante la animación.', 0);
    setTimeout(() => shoot({ keepSetup: true, playbackMode: 'repeat' }), 90);
  }

  function replayLastShot() {
    if (togglePlaybackPause('replay')) return;
    if (state.animating) return;
    if (!state.lastPhysics || !state.lastShotSetup) {
      feedback('Sin replay disponible', 'Realiza una tacada primero. El botón Replay vuelve a mostrar la última animación sin sumar intento.', 0);
      return;
    }
    restoreShotSetup(state.lastShotSetup);
    state.playbackMode = 'replay';
    state.paused = false;
    updatePlaybackButtons();
    state.animating = true;
    state.cushions = 0;
    playShotSound();
    updateScoreboard();
    const sim = state.lastPhysics;
    state.lastPath = sim.traces.cue.map((point) => ({ ...point }));
    el.userPath.style.opacity = '0';
    animatePhysicsFrames(sim, () => {
      state.cushions = sim.cueCushions;
      const status = caromStatusFromSim(sim);
      playCaromSound(status.ok);
      if (status.ok) flashCarom('Replay · carambola');
      updateScoreboard();
      feedback('Replay de la última tacada', `Se repitió visualmente la última tacada con potencia ${sim.power}%, efecto ${sim.effect}, entrada ${fmt2(state.attack)} y ${sim.cueCushions} bandas.`, sim.cueCushions - Math.max(3, Math.min(state.bands, 10)));
      drawDynamic();
      positionBalls();
      clearPlaybackState();
    });
  }

  function shoot(options = {}) {
    if (state.animating) return;
    if (!options.keepSetup) state.lastShotSetup = captureShotSetup();
    state.playbackMode = options.playbackMode || null;
    state.paused = false;
    state.animating = true;
    updatePlaybackButtons();
    state.attempts += 1;
    state.cushions = 0;
    playShotSound();
    updateScoreboard();

    const sim = simulatePhysicsShot();
    state.lastPhysics = sim;
    state.lastPath = sim.traces.cue.map((p) => ({ ...p }));
    el.userPath.style.opacity = '0';
    animatePhysicsFrames(sim, () => {
      state.cushions = sim.cueCushions;
      const status = caromStatusFromSim(sim);
      const success = status.ok;
      playCaromSound(success);
      if (success) {
        state.score += 1;
        flashCarom('¡Carambola lograda!');
      }
      updateScoreboard();
      diagnosePhysics(sim, success);
      addPhysicsLog(sim, success);
      drawDynamic();
      positionBalls();
      clearPlaybackState();
    });
  }


  function guidedArrivalForShot() {
    // Si el ataque del jugador coincide con la fórmula, la llegada debe ser exactamente la elegida.
    // Esto corrige casos de cuña como: llegada 50 = salida 50 − ataque 0.
    const formulaAttack = correctAttack();
    if (Math.abs(Number(state.attack) - Number(formulaAttack)) <= 0.25) return roundTenth(clamp(Number(state.arrival), 0, 100));
    return roundTenth(clamp(Number(state.exit) - Number(state.attack), 0, 100));
  }

  function guidedPathForShot() {
    const arrival = guidedArrivalForShot();
    const attack = roundTenth(clamp(Number(state.attack), 0, ATTACK_MAX));
    const arrive = arrivalPoint(arrival);
    const attackRail = railContactForCueCenter(attackPoint(attack));
    const shortRail = railContactForCueCenter(shortBandPoint(arrival, attack));
    const arrivalRail = railContactForCueCenter(arrive);
    const points = [
      { x: state.cue.x, y: state.cue.y, tag: 'salida', rail: false },
      { ...attackRail, tag: attack <= 0.5 ? 'cuña ataque 0' : 'ataque', rail: true },
      { ...shortRail, tag: '2ª banda corta', rail: true },
      { ...arrivalRail, tag: 'llegada', rail: true }
    ];
    if (state.bands >= 4) points.push({ ...railContactForCueCenter(connectorEnd(arrival, attack, 4)), tag: '4ª banda', rail: true });
    if (state.bands >= 5) points.push({ x: clamp(arrive.x - 130, L + BALL_R, R - BALL_R), y: B - BALL_R, tag: '5ª banda', rail: true });
    if (state.bands >= 6) points.push({ x: clamp(arrive.x - 230, L + BALL_R, R - BALL_R), y: T + BALL_R, tag: '6ª banda', rail: true });
    return appendReboundProjection(points);
  }

  function segmentLengths(points) {
    const lengths = [];
    let total = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
      lengths.push(len);
      total += len;
    }
    return { lengths, total };
  }

  function pointAtPathDistance(points, lengths, distance) {
    let remaining = distance;
    for (let i = 0; i < lengths.length; i += 1) {
      const len = lengths[i] || 1;
      if (remaining <= len || i === lengths.length - 1) {
        const t = clamp(remaining / len, 0, 1);
        return {
          x: points[i].x + (points[i + 1].x - points[i].x) * t,
          y: points[i].y + (points[i + 1].y - points[i].y) * t,
          segment: i,
          t
        };
      }
      remaining -= len;
    }
    const last = points[points.length - 1];
    return { x: last.x, y: last.y, segment: points.length - 2, t: 1 };
  }

  function closestDistanceToPolyline(point, points) {
    let best = Infinity;
    let bestSegment = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      const dist = distancePointToSegment(point, points[i], points[i + 1]);
      if (dist < best) {
        best = dist;
        bestSegment = i;
      }
    }
    return { distance: best, segment: bestSegment };
  }

  function simulateBase50GuidedShot(options = {}) {
    const preview = options.preview === true;
    const power = getCuePower();
    const effect = selectedEffect();
    const spin = clamp((effect - 2.5) / 2.5, -1, 1);
    const path = guidedPathForShot();
    const { lengths, total } = segmentLengths(path);
    const frames = [];
    const events = [];
    const contacts = [];
    const traces = {
      cue: [{ x: path[0].x, y: path[0].y }],
      red: [{ x: state.balls.red.x, y: state.balls.red.y }],
      yellow: [{ x: state.balls.yellow.x, y: state.balls.yellow.y }]
    };
    const hit = { red: false, yellow: false };
    const balls = {
      red: { x: state.balls.red.x, y: state.balls.red.y, vx: 0, vy: 0, mass: 1 },
      yellow: { x: state.balls.yellow.x, y: state.balls.yellow.y, vx: 0, vy: 0, mass: 1 }
    };

    const railIndices = new Set();
    for (let i = 1; i < path.length; i += 1) railIndices.add(i);
    const redNear = closestDistanceToPolyline({ x: balls.red.x, y: balls.red.y }, path);
    const yellowNear = closestDistanceToPolyline({ x: balls.yellow.x, y: balls.yellow.y }, path);
    const contactWindow = BALL_R * 2.28;

    let distance = 0;
    let currentSegment = 0;
    let cueCushions = 0;
    let allCushions = 0;
    let ballCollisions = 0;
    let step = 0;
    let cue = { x: path[0].x, y: path[0].y, segment: 0, t: 0 };
    let prevCue = { x: cue.x, y: cue.y };
    let cueSpeed = 420 + (power * 8.7);
    if (power > 100) cueSpeed += (power - 100) * 6.5;
    const rollingCue = 0.9974 + Math.min(0.001, power / 180000);
    const rollingObject = 0.9932;
    const railLoss = 0.86 + Math.min(0.08, power / 1500);
    const ballLoss = 0.92;
    const maxSteps = Math.round((preview ? 9.5 : 14.5) / PHYSICS_DT);
    const traceEvery = preview ? 10 : 5;
    const frameEvery = preview ? 4 : 2;
    const stopSpeed = preview ? 28 : 16;

    const segmentDirectionAt = (seg) => {
      const i = clamp(seg, 0, path.length - 2);
      const a = path[i];
      const b = path[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      return { x: dx / len, y: dy / len };
    };

    const moveObjectBalls = () => {
      ['red', 'yellow'].forEach((name) => {
        const b = balls[name];
        b.x += b.vx * PHYSICS_DT;
        b.y += b.vy * PHYSICS_DT;
        b.vx *= rollingObject;
        b.vy *= rollingObject;
        const before = { vx: b.vx, vy: b.vy };
        if (b.x < L + BALL_R) { b.x = L + BALL_R; b.vx = Math.abs(before.vx) * 0.76; allCushions += 1; events.push({ step, type: 'cushion', ball: name, x: b.x, y: b.y, cushions: cueCushions }); }
        if (b.x > R - BALL_R) { b.x = R - BALL_R; b.vx = -Math.abs(before.vx) * 0.76; allCushions += 1; events.push({ step, type: 'cushion', ball: name, x: b.x, y: b.y, cushions: cueCushions }); }
        if (b.y < T + BALL_R) { b.y = T + BALL_R; b.vy = Math.abs(before.vy) * 0.76; allCushions += 1; events.push({ step, type: 'cushion', ball: name, x: b.x, y: b.y, cushions: cueCushions }); }
        if (b.y > B - BALL_R) { b.y = B - BALL_R; b.vy = -Math.abs(before.vy) * 0.76; allCushions += 1; events.push({ step, type: 'cushion', ball: name, x: b.x, y: b.y, cushions: cueCushions }); }
        if (Math.hypot(b.vx, b.vy) < 4.5) { b.vx = 0; b.vy = 0; }
      });
    };

    const resolveObjectBallCollision = () => {
      const a = balls.red;
      const b = balls.yellow;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const minDist = BALL_R * 2;
      if (dist >= minDist) return;
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = (minDist - dist) / 2;
      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;
      const rvx = b.vx - a.vx;
      const rvy = b.vy - a.vy;
      const rel = rvx * nx + rvy * ny;
      if (rel < 0) {
        const impulse = (-(1 + 0.9) * rel) / 2;
        a.vx -= impulse * nx;
        a.vy -= impulse * ny;
        b.vx += impulse * nx;
        b.vy += impulse * ny;
        ballCollisions += 1;
        events.push({ step, type: 'ball', a: 'red', b: 'yellow', x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      }
    };

    while (step < maxSteps) {
      prevCue = { x: cue.x, y: cue.y };
      const prevDistance = distance;
      distance += cueSpeed * PHYSICS_DT;
      if (distance > total) distance = total;
      cue = pointAtPathDistance(path, lengths, distance);

      if (cue.segment > currentSegment) {
        for (let s = currentSegment + 1; s <= cue.segment; s += 1) {
          const railPoint = path[s] || cue;
          if (railPoint.rail !== false) {
            cueCushions += 1;
            allCushions += 1;
            cueSpeed *= railLoss;
            // El efecto conserva o abre el ángulo después de cada banda sin deformar la lectura matemática.
            cueSpeed *= 1 + (Math.abs(spin) * 0.012);
            events.push({ step, type: 'cushion', ball: 'cue', cushions: cueCushions, x: railPoint.x, y: railPoint.y });
          }
        }
        currentSegment = cue.segment;
      }

      const cueDx = cue.x - prevCue.x;
      const cueDy = cue.y - prevCue.y;
      const cueMoveLen = Math.hypot(cueDx, cueDy) || 1;
      const cueDir = cueMoveLen > 0.01 ? { x: cueDx / cueMoveLen, y: cueDy / cueMoveLen } : segmentDirectionAt(cue.segment);

      ['red', 'yellow'].forEach((name) => {
        const b = balls[name];
        const d = Math.hypot(cue.x - b.x, cue.y - b.y);
        const near = name === 'red' ? redNear : yellowNear;
        if (!hit[name] && d <= contactWindow && near.distance <= contactWindow) {
          hit[name] = true;
          ballCollisions += 1;
          const nx = (b.x - cue.x) / (d || 1);
          const ny = (b.y - cue.y) / (d || 1);
          const naturalCut = clamp((cueDir.x * nx + cueDir.y * ny), 0.25, 1);
          const tangent = { x: -ny, y: nx };
          const cutSpin = spin * 0.12;
          const impulseSpeed = cueSpeed * (0.42 + naturalCut * 0.46);
          b.vx += (nx * impulseSpeed) + (tangent.x * impulseSpeed * cutSpin);
          b.vy += (ny * impulseSpeed) + (tangent.y * impulseSpeed * cutSpin);
          cueSpeed *= ballLoss - (naturalCut * 0.08);
          contacts.push({ step, target: name, cushions: cueCushions, x: (cue.x + b.x) / 2, y: (cue.y + b.y) / 2 });
          events.push({ step, type: 'ball', a: 'cue', b: name, x: (cue.x + b.x) / 2, y: (cue.y + b.y) / 2 });
        }
      });

      moveObjectBalls();
      resolveObjectBallCollision();
      cueSpeed *= rollingCue;

      if (step % traceEvery === 0 || distance >= total) {
        const lastCue = traces.cue[traces.cue.length - 1];
        if (Math.hypot(cue.x - lastCue.x, cue.y - lastCue.y) > 2 || distance >= total) traces.cue.push({ x: cue.x, y: cue.y });
        ['red', 'yellow'].forEach((name) => {
          const b = balls[name];
          const last = traces[name][traces[name].length - 1];
          if (Math.hypot(b.x - last.x, b.y - last.y) > 4) traces[name].push({ x: b.x, y: b.y });
        });
      }

      if (!preview && (step % frameEvery === 0 || distance >= total)) {
        frames.push({
          cue: { x: cue.x, y: cue.y },
          red: { x: balls.red.x, y: balls.red.y },
          yellow: { x: balls.yellow.x, y: balls.yellow.y },
          cushions: cueCushions,
          step
        });
      }

      const objectSpeed = Math.hypot(balls.red.vx, balls.red.vy) + Math.hypot(balls.yellow.vx, balls.yellow.vy);
      if (distance >= total && objectSpeed < stopSpeed) break;
      if (distance < total && cueSpeed < stopSpeed && power < 22) break;
      step += 1;
    }

    const finalCue = { x: cue.x, y: cue.y };
    ['red', 'yellow'].forEach((name) => traces[name].push({ x: balls[name].x, y: balls[name].y }));
    traces.cue.push(finalCue);
    if (!preview && (!frames.length || frames[frames.length - 1].step !== step)) {
      frames.push({ cue: finalCue, red: { x: balls.red.x, y: balls.red.y }, yellow: { x: balls.yellow.x, y: balls.yellow.y }, cushions: cueCushions, step });
    }
    return {
      frames,
      traces,
      events,
      contacts,
      hit,
      cueCushions: cueCushions,
      allCushions: Math.max(allCushions, cueCushions),
      ballCollisions,
      final: { cue: finalCue, red: balls.red, yellow: balls.yellow },
      power,
      effect,
      spin,
      guided: true,
      natural: true
    };
  }

  function simulatePhysicsShot(options = {}) {
    if (!options.rawPhysics) return simulateBase50GuidedShot(options);
    const preview = options.preview === true;
    const power = getCuePower();
    const effect = selectedEffect();
    const recEffect = recommendedEffect();
    const spin = clamp((effect - 2.5) / 2.5, -1, 1);
    const aim = attackPoint(state.attack || finalAttack());
    const dx = aim.x - state.cue.x;
    const dy = aim.y - state.cue.y;
    const len = Math.hypot(dx, dy) || 1;
    const speed = 520 + power * 9.5;
    const balls = {
      cue: { x: state.cue.x, y: state.cue.y, vx: (dx / len) * speed, vy: (dy / len) * speed, active: true },
      red: { x: state.balls.red.x, y: state.balls.red.y, vx: 0, vy: 0, active: true },
      yellow: { x: state.balls.yellow.x, y: state.balls.yellow.y, vx: 0, vy: 0, active: true }
    };
    const traces = { cue: [{ x: balls.cue.x, y: balls.cue.y }], red: [{ x: balls.red.x, y: balls.red.y }], yellow: [{ x: balls.yellow.x, y: balls.yellow.y }] };
    const frames = [];
    const events = [];
    const hit = { red: false, yellow: false };
    const contacts = [];
    let cueCushions = 0;
    let allCushions = 0;
    let ballCollisions = 0;
    const maxSteps = Math.round((preview ? 6.5 : 12) / PHYSICS_DT);
    const restitutionRail = 0.82 + Math.min(0.12, power / 800);
    const restitutionBall = 0.92;
    const rolling = 0.9954 + Math.min(0.0022, power / 60000);
    const traceEvery = preview ? 14 : 10;

    for (let step = 0; step < maxSteps; step += 1) {
      Object.values(balls).forEach((b) => {
        b.x += b.vx * PHYSICS_DT;
        b.y += b.vy * PHYSICS_DT;
      });

      ['cue', 'red', 'yellow'].forEach((name) => {
        const b = balls[name];
        const before = { vx: b.vx, vy: b.vy };
        let bounced = false;
        if (b.x < L + BALL_R) { b.x = L + BALL_R; b.vx = Math.abs(b.vx) * restitutionRail; b.vy += spin * Math.abs(before.vx) * 0.05; bounced = true; }
        if (b.x > R - BALL_R) { b.x = R - BALL_R; b.vx = -Math.abs(b.vx) * restitutionRail; b.vy -= spin * Math.abs(before.vx) * 0.05; bounced = true; }
        if (b.y < T + BALL_R) { b.y = T + BALL_R; b.vy = Math.abs(b.vy) * restitutionRail; b.vx += spin * Math.abs(before.vy) * 0.055; bounced = true; }
        if (b.y > B - BALL_R) { b.y = B - BALL_R; b.vy = -Math.abs(b.vy) * restitutionRail; b.vx -= spin * Math.abs(before.vy) * 0.055; bounced = true; }
        if (bounced) {
          allCushions += 1;
          if (name === 'cue') cueCushions += 1;
          events.push({ step, type: 'cushion', ball: name, cushions: cueCushions });
        }
      });

      const pairs = [['cue', 'red'], ['cue', 'yellow'], ['red', 'yellow']];
      pairs.forEach(([aName, bName]) => {
        const a = balls[aName];
        const b = balls[bName];
        const dxp = b.x - a.x;
        const dyp = b.y - a.y;
        const dist = Math.hypot(dxp, dyp) || 0.001;
        const minDist = BALL_R * 2;
        if (dist < minDist) {
          const nx = dxp / dist;
          const ny = dyp / dist;
          const overlap = (minDist - dist) / 2;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
          const rvx = b.vx - a.vx;
          const rvy = b.vy - a.vy;
          const rel = rvx * nx + rvy * ny;
          if (rel < 0) {
            const impulse = (-(1 + restitutionBall) * rel) / 2;
            a.vx -= impulse * nx;
            a.vy -= impulse * ny;
            b.vx += impulse * nx;
            b.vy += impulse * ny;
            ballCollisions += 1;
            let cueTarget = null;
            if (aName === 'cue' && bName === 'red') { hit.red = true; cueTarget = 'red'; }
            if (aName === 'cue' && bName === 'yellow') { hit.yellow = true; cueTarget = 'yellow'; }
            if (bName === 'cue' && aName === 'red') { hit.red = true; cueTarget = 'red'; }
            if (bName === 'cue' && aName === 'yellow') { hit.yellow = true; cueTarget = 'yellow'; }
            if (cueTarget) contacts.push({ step, target: cueTarget, cushions: cueCushions, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
            events.push({ step, type: 'ball', a: aName, b: bName, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
          }
        }
      });

      Object.values(balls).forEach((b) => {
        b.vx *= rolling;
        b.vy *= rolling;
        if (Math.hypot(b.vx, b.vy) < 6) { b.vx = 0; b.vy = 0; }
      });

      if (step % traceEvery === 0) {
        ['cue', 'red', 'yellow'].forEach((name) => {
          const b = balls[name];
          const last = traces[name][traces[name].length - 1];
          if (Math.hypot(b.x - last.x, b.y - last.y) > 3) traces[name].push({ x: b.x, y: b.y });
        });
      }
      if (!preview && step % 2 === 0) {
        frames.push({
          cue: { x: balls.cue.x, y: balls.cue.y },
          red: { x: balls.red.x, y: balls.red.y },
          yellow: { x: balls.yellow.x, y: balls.yellow.y },
          cushions: cueCushions,
          step
        });
      }
      const totalSpeed = Object.values(balls).reduce((sum, b) => sum + Math.hypot(b.vx, b.vy), 0);
      if (step > 120 && totalSpeed < 16) break;
    }

    ['cue', 'red', 'yellow'].forEach((name) => traces[name].push({ x: balls[name].x, y: balls[name].y }));
    if (!preview) frames.push({ cue: { x: balls.cue.x, y: balls.cue.y }, red: { x: balls.red.x, y: balls.red.y }, yellow: { x: balls.yellow.x, y: balls.yellow.y }, cushions: cueCushions, step: maxSteps });
    return { frames, traces, events, contacts, hit, cueCushions, allCushions, ballCollisions, final: balls, power, effect, spin };
  }

  function animatePhysicsFrames(sim, done) {
    const frames = sim.frames.length ? sim.frames : [{ cue: state.cue, red: state.balls.red, yellow: state.balls.yellow, cushions: 0, step: 0 }];
    const duration = sim.natural ? clamp(frames.length * 14, 1500, 9800) : clamp(frames.length * 18, 1200, 7600);
    let startTime = performance.now();
    let pausedAt = 0;
    let lastIndex = -1;
    let lastCushions = 0;
    let lastBallEvents = 0;
    const controller = { cancelled: false };
    state.activeFrameAnimation = controller;
    const tick = (now) => {
      if (controller.cancelled) return;
      if (state.paused) {
        if (!pausedAt) pausedAt = now;
        requestAnimationFrame(tick);
        return;
      }
      if (pausedAt) {
        startTime += now - pausedAt;
        pausedAt = 0;
      }
      const t = Math.min(1, (now - startTime) / duration);
      const index = Math.min(frames.length - 1, Math.floor(ease(t) * (frames.length - 1)));
      const frame = frames[index];
      if (index !== lastIndex) {
        setBall(el.cueBall, frame.cue.x, frame.cue.y);
        setBall(el.redBall, frame.red.x, frame.red.y);
        setBall(el.yellowBall, frame.yellow.x, frame.yellow.y);
        state.cushions = frame.cushions;
        updateScoreboard();
        const currentEvents = sim.events.filter((ev) => ev.step <= frame.step);
        const cushionEvents = currentEvents.filter((ev) => ev.type === 'cushion').length;
        const ballEvents = currentEvents.filter((ev) => ev.type === 'ball').length;
        if (cushionEvents > lastCushions) playCushionSound(cushionEvents);
        if (ballEvents > lastBallEvents) playBallContactSound();
        lastCushions = cushionEvents;
        lastBallEvents = ballEvents;
        updateBallTraceLayer(sim, index);
        lastIndex = index;
      }
      if (t < 1) requestAnimationFrame(tick);
      else {
        const last = frames[frames.length - 1];
        state.cue = { x: last.cue.x, y: last.cue.y };
        state.balls.red = { x: last.red.x, y: last.red.y };
        state.balls.yellow = { x: last.yellow.x, y: last.yellow.y };
        done();
      }
    };
    requestAnimationFrame(tick);
  }

  function updateBallTraceLayer(sim, frameIndex) {
    const frame = sim.frames[frameIndex] || sim.frames[sim.frames.length - 1];
    // Para que la lectura quede limpia, solo se dibuja la trayectoria de la bola blanca.
    // Las bolas roja y amarilla siguen participando en la física y en los sonidos,
    // pero no dejan rastro visual sobre la mesa.
    const traceHtml = [
      `<polyline class="ball-trace cue-trace" points="${toPoints(sim.traces.cue)}"></polyline>`
    ];
    sim.events.filter((ev) => ev.type === 'ball' && ev.step <= frame.step).slice(-6).forEach((ev) => {
      traceHtml.push(`<circle class="collision-mark" cx="${ev.x}" cy="${ev.y}" r="5"></circle>`);
    });
    el.ballLayer.innerHTML = traceHtml.join('');
  }

  function diagnosePhysics(sim, success) {
    const base = correctAttack();
    const final = finalAttack();
    const hitText = `${sim.hit.red ? 'roja ✓' : 'roja ✗'} · ${sim.hit.yellow ? 'amarilla ✓' : 'amarilla ✗'}`;
    let body = `Tacada simulada con potencia ${sim.power}%, efecto ${sim.effect} y ataque ${state.attack}. Recorrido de la blanca: ${sim.cueCushions} bandas; choques de bolas: ${sim.ballCollisions}. Contactos: ${hitText}. Base ${state.exit} − ${state.arrival} = ${base}; ataque final recomendado ${final}.`;
    if (success) {
      body += ' La carambola quedó lograda: la blanca tocó ambas bolas y completó mínimo tres bandas.';
    } else {
      if (!sim.hit.red || !sim.hit.yellow) body += ' Ajusta la posición de las bolas o el ataque para que la blanca conecte las dos bolas objetivo.';
      if (sim.cueCushions < 3) body += ' Faltaron bandas: sube potencia, abre el ataque o usa más efecto.';
      if (sim.cueCushions >= 3 && (!sim.hit.red || !sim.hit.yellow)) body += ' La ruta sí tuvo bandas, pero no encontró la segunda bola; revisa la línea contra bola.';
    }
    if (state.bands > 3) body += ` Objetivo elegido: ${state.bands} bandas; la simulación permite que la trayectoria siga hasta perder energía.`;
    feedback(success ? 'Carambola lograda' : 'Tacada para ajustar', body, sim.cueCushions - Math.max(3, Math.min(state.bands, 10)));
  }

  function addPhysicsLog(sim, success) {
    if (el.modeSelect.value !== 'lab') return;
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `<strong>${success ? 'Carambola' : 'Ajustar'}</strong> · salida ${state.exit}, llegada ${state.arrival}, ataque ${state.attack}, efecto ${selectedEffect()}, potencia ${sim.power}%, bandas blanca ${sim.cueCushions}, contactos ${sim.hit.red ? 'roja' : 'sin roja'} / ${sim.hit.yellow ? 'amarilla' : 'sin amarilla'}`;
    el.labLog.prepend(item);
  }

  function diagnose(delta, success) {
    const base = correctAttack();
    const final = finalAttack();
    const attackDiff = state.attack - final;
    const zone = attackZone(final);
    let body;
    if (success) {
      body = `La llegada quedó dentro de la zona útil. Base ${state.exit} − ${state.arrival} = ${base}; ataque final recomendado ${final}. Ruta correcta: salida → ataque → banda corta → llegada. ${zone.name}.`;
    } else if (delta < 0) {
      body = `Llegó corta por ${Math.abs(delta).toFixed(1)} puntos. Revisa si faltó efecto, potencia o si la segunda banda corta entró cerrada. Base ${base}; ataque final recomendado ${final}; tu ataque ${state.attack}.`;
    } else {
      body = `Llegó larga por ${Math.abs(delta).toFixed(1)} puntos. Controla efecto/potencia y revisa el conector de la banda corta antes de la llegada. Base ${base}; ataque final recomendado ${final}; tu ataque ${state.attack}.`;
    }
    if (Math.abs(attackDiff) > 0) body += ` Diferencia frente al ataque final: ${attackDiff > 0 ? '+' : ''}${attackDiff}.`;
    if (compensationText() !== 'sin ajuste adicional') body += ` Compensación aplicada: ${compensationText()}.`;
    if (state.bands >= 5 && getCuePower() < recommendedPower()) body += ` Para ${state.bands} bandas conviene más velocidad para conservar el efecto.`;
    feedback(success ? 'Tiro dentro de zona' : 'Necesita compensación', body, delta);
  }

  function feedback(title, body, delta) {
    el.feedbackTitle.textContent = title;
    el.feedbackBody.textContent = body;
    el.meterNeedle.style.left = `${clamp(50 + delta * 5, 2, 98)}%`;
  }

  function addLog(delta, success) {
    if (el.modeSelect.value !== 'lab') return;
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `<strong>${success ? 'Zona útil' : delta < 0 ? 'Corta' : 'Larga'}</strong> · Salida ${state.exit}, llegada ${state.arrival}, ataque ${state.attack}, efecto ${selectedEffect()}, potencia ${getCuePower()}%, ${state.bands} bandas · diferencia ${delta.toFixed(1)}`;
    el.labLog.prepend(item);
  }

  function flashCarom(message = '¡Carambola!') {
    el.caromFlash.textContent = message;
    el.caromFlash.setAttribute('aria-hidden', 'false');
    el.caromFlash.classList.remove('show');
    void el.caromFlash.offsetWidth;
    el.caromFlash.classList.add('show');
  }

  function resetScore() {
    state.score = 0;
    state.attempts = 0;
    state.cushions = 0;
    updateScoreboard();
    feedback('Marcador reiniciado', 'Continúa practicando con la fórmula y los conectores del sistema clásico.', 0);
  }

  function updateScoreboard() {
    el.score.textContent = String(state.score);
    el.attempts.textContent = String(state.attempts);
    el.cushions.textContent = String(state.cushions);
  }

  function onPointerDown(event) {
    if (state.animating) return;
    if (state.placeMode) {
      const ball = ballNameFromTarget(event.target.id);
      if (!ball) return;
      state.draggingBall = ball;
      state.draggingCue = ball === 'cue';
      event.target.classList.add('dragging');
      event.preventDefault();
      updateBallFromClient(event.clientX, event.clientY);
      return;
    }
    startCuePowerDrag(event);
  }

  function onPointerMove(event) {
    if (state.draggingBall) {
      updateBallFromClient(event.clientX, event.clientY);
      return;
    }
    if (state.draggingPower) updatePowerFromCueDrag(event.clientX, event.clientY);
  }

  function stopDraggingBalls() {
    state.draggingCue = false;
    state.draggingBall = null;
    state.draggingEffect = false;
    state.draggingPower = false;
    state.powerDragOffset = 0;
    [el.cueBall, el.redBall, el.yellowBall].forEach((node) => node.classList.remove('dragging'));
    drawDynamic();
  }

  function ballNameFromTarget(id) {
    if (id === 'cueBall') return 'cue';
    if (id === 'redBall') return 'red';
    if (id === 'yellowBall') return 'yellow';
    return null;
  }

  function updateBallFromClient(clientX, clientY) {
    const p = clientToTablePoint(clientX, clientY);
    const x = p.x;
    const y = p.y;
    if (state.draggingBall === 'cue') {
      state.cue = { x, y };
      // La salida se lee por la proyección del taco, no solo por la posición física de la blanca.
      applyProjectedSystemFromCurrentCue(false);
    }
    if (state.draggingBall === 'red') {
      state.balls.red = { x, y };
      state.arrival = roundTenth(clamp(arrivalValueFromX(x), 0, 100));
      state.attack = roundTenth(clamp(state.exit - state.arrival, 0, ATTACK_MAX));
      syncSelectIfExact(el.arrivalSelect, state.arrival);
      if (el.attackInput) el.attackInput.value = fmt2(state.attack);
    }
    if (state.draggingBall === 'yellow') {
      state.balls.yellow = { x, y };
      state.arrival = roundTenth(clamp(arrivalValueFromX(x), 0, 100));
      state.attack = roundTenth(clamp(state.exit - state.arrival, 0, ATTACK_MAX));
      syncSelectIfExact(el.arrivalSelect, state.arrival);
      if (el.attackInput) el.attackInput.value = fmt2(state.attack);
    }
    updateReadouts();
    positionBalls();
    drawDynamic();
  }

  function getAudioContext() {
    if (!state.soundOn) return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!state.audioCtx) state.audioCtx = new AudioCtor();
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume().catch(() => {});
    return state.audioCtx;
  }

  function playTone(freq, duration = .07, type = 'sine', volume = .045, delay = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + .01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + .02);
  }

  function playNoise(duration = 0.055, volume = 0.05, filterFreq = 1200) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 4;
    gain.gain.value = volume;
    src.buffer = buffer;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  function playShotSound() {
    const level = clamp(getCuePower() / 100, .2, 1.35);
    playNoise(.045, .035 + level * .045, 1100);
    playTone(92, .08, 'triangle', .035 + level * .035, 0);
    playTone(280, .035, 'square', .012 + level * .012, .016);
  }

  function playCushionSound(index = 1) {
    const level = clamp(1 - (index * .055), .25, 1);
    playNoise(.052, .018 + level * .025, 620);
    playTone(Math.max(190, 430 - index * 26), .055, 'triangle', .018 + level * .022, 0);
  }

  function playBallContactSound() {
    playTone(720, .045, 'square', .045, 0);
    playTone(1120, .035, 'sine', .024, .012);
  }

  function playGuideReadySound() {
    playTone(590, .055, 'sine', .026, 0);
    playTone(790, .06, 'sine', .022, .055);
  }

  function playCaromSound(success) {
    if (success) {
      playTone(523, .09, 'sine', .052, 0);
      playTone(659, .09, 'sine', .050, .08);
      playTone(784, .14, 'sine', .048, .16);
    } else {
      playTone(220, .13, 'sawtooth', .038, 0);
      playTone(165, .18, 'sawtooth', .032, .1);
    }
  }

  function handleKeys(event) {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); shoot(); }
    if (event.key === 'ArrowLeft') { state.attack = clamp(state.attack - 1, 0, ATTACK_MAX); el.attackInput.value = fmt2(state.attack); updateAll('key'); }
    if (event.key === 'ArrowRight') { state.attack = clamp(state.attack + 1, 0, ATTACK_MAX); el.attackInput.value = fmt2(state.attack); updateAll('key'); }
    if (event.key === 'ArrowUp') { setCuePower(getCuePower() + 5); updateAll('key-power'); }
    if (event.key === 'ArrowDown') { setCuePower(getCuePower() - 5); updateAll('key-power'); }
    if (event.key.toLowerCase() === 's') solve();
  }

  function toPoints(points) {
    return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function ease(t) {
    return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
})();
