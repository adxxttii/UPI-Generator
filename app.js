import QRCode from 'qrcode';
import {
  listenAuthState,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginAsGuest,
  logoutUser,
  getFirebaseConfig,
  saveFirebaseConfig,
  resetFirebaseConfig
} from './auth.js';

// State Management
const state = {
  vpa: 'demo@paytm',
  payeeName: 'Demo Store',
  amount: '3000',
  note: 'Grocery Payment',
  refId: '',
  currency: 'INR',
  color: '#0F172A',
  size: 350,
  showLogo: true,
  theme: 'dark',
  currentStep: 1,
  parts: []
};

// DOM Elements
const elements = {
  // Stepper Indicators
  step1Indicator: document.getElementById('step1Indicator'),
  step2Indicator: document.getElementById('step2Indicator'),
  step1View: document.getElementById('step1View'),
  step2View: document.getElementById('step2View'),
  
  // Step 1 Form Elements
  upiForm: document.getElementById('upiForm'),
  upiId: document.getElementById('upiId'),
  payeeName: document.getElementById('payeeName'),
  amount: document.getElementById('amount'),
  currencySelect: document.getElementById('currencySelect'),
  currencySymbolDisplay: document.getElementById('currencySymbolDisplay'),
  txnNote: document.getElementById('txnNote'),
  refId: document.getElementById('refId'),
  generateRefBtn: document.getElementById('generateRefBtn'),
  vpaValidation: document.getElementById('vpaValidation'),
  colorPalette: document.getElementById('colorPalette'),
  customQrSlider: document.getElementById('customQrSlider'),
  qrSizeValDisplay: document.getElementById('qrSizeValDisplay'),
  showCenterLogo: document.getElementById('showCenterLogo'),
  
  // Step 1 Buttons
  generateQrBtn: document.getElementById('generateQrBtn'),
  saveMerchantBtn: document.getElementById('saveMerchantBtn'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  clearAmountBtn: document.getElementById('clearAmountBtn'),
  savedProfileBadge: document.getElementById('savedProfileBadge'),
  savedProfileText: document.getElementById('savedProfileText'),
  clearProfileBtn: document.getElementById('clearProfileBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  
  // Step 2 Buttons & Nav
  backToEditBtn: document.getElementById('backToEditBtn'),
  createAnotherBtn: document.getElementById('createAnotherBtn'),
  
  // Step 2 Single Preview Elements
  singlePreviewCard: document.getElementById('singlePreviewCard'),
  previewPayeeName: document.getElementById('previewPayeeName'),
  previewVpa: document.getElementById('previewVpa'),
  copyVpaBtn: document.getElementById('copyVpaBtn'),
  previewAmount: document.getElementById('previewAmount'),
  previewNote: document.getElementById('previewNote'),
  previewNoteText: document.getElementById('previewNoteText'),
  qrCodeOutput: document.getElementById('qrCodeOutput'),
  qrCenterLogo: document.getElementById('qrCenterLogo'),
  downloadQrBtn: document.getElementById('downloadQrBtn'),
  copyLinkBtn: document.getElementById('copyLinkBtn'),
  printPosterBtn: document.getElementById('printPosterBtn'),
  shareWebBtn: document.getElementById('shareWebBtn'),
  gpayBtn: document.getElementById('gpayBtn'),
  phonepeBtn: document.getElementById('phonepeBtn'),
  paytmBtn: document.getElementById('paytmBtn'),
  bhimBtn: document.getElementById('bhimBtn'),
  credBtn: document.getElementById('credBtn'),
  amazonpayBtn: document.getElementById('amazonpayBtn'),
  whatsappBtn: document.getElementById('whatsappBtn'),
  
  // Step 2 Multi Preview Elements
  multiPreviewContainer: document.getElementById('multiPreviewContainer'),
  multiTotalAmount: document.getElementById('multiTotalAmount'),
  multiSplitDesc: document.getElementById('multiSplitDesc'),
  downloadAllBtn: document.getElementById('downloadAllBtn'),
  downloadAllCount: document.getElementById('downloadAllCount'),
  printMultiPosterBtn: document.getElementById('printMultiPosterBtn'),
  multiQrCardsGrid: document.getElementById('multiQrCardsGrid'),
  
  // History
  historyList: document.getElementById('historyList'),
  historyCountBadge: document.getElementById('historyCountBadge'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  
  // Print Modal
  printModal: document.getElementById('printModal'),
  closePrintModal: document.getElementById('closePrintModal'),
  posterMerchantName: document.getElementById('posterMerchantName'),
  posterVpa: document.getElementById('posterVpa'),
  posterSingleQrView: document.getElementById('posterSingleQrView'),
  posterQrOutput: document.getElementById('posterQrOutput'),
  posterMultiQrView: document.getElementById('posterMultiQrView'),
  posterAmountContainer: document.getElementById('posterAmountContainer'),
  posterAmountVal: document.getElementById('posterAmountVal'),
  triggerPrintBtn: document.getElementById('triggerPrintBtn'),
  cancelPrintBtn: document.getElementById('cancelPrintBtn'),
  
  // Toast
  toastContainer: document.getElementById('toastContainer'),

  // Top Level View Containers
  authLandingView: document.getElementById('authLandingView'),
  appMainWorkspace: document.getElementById('appMainWorkspace'),

  // Auth Landing Page Form Elements
  landingGoogleSignInBtn: document.getElementById('landingGoogleSignInBtn'),
  landingSignInForm: document.getElementById('landingSignInForm'),
  landingLoginEmail: document.getElementById('landingLoginEmail'),
  landingLoginPassword: document.getElementById('landingLoginPassword'),
  landingSubmitLoginBtn: document.getElementById('landingSubmitLoginBtn'),
  landingGuestLoginBtn: document.getElementById('landingGuestLoginBtn'),

  landingSignUpForm: document.getElementById('landingSignUpForm'),
  landingRegisterName: document.getElementById('landingRegisterName'),
  landingRegisterEmail: document.getElementById('landingRegisterEmail'),
  landingRegisterPassword: document.getElementById('landingRegisterPassword'),
  landingSubmitRegisterBtn: document.getElementById('landingSubmitRegisterBtn'),

  landingFirebaseConfigForm: document.getElementById('landingFirebaseConfigForm'),
  landingCfgApiKey: document.getElementById('landingCfgApiKey'),
  landingCfgProjectId: document.getElementById('landingCfgProjectId'),
  landingSaveConfigBtn: document.getElementById('landingSaveConfigBtn'),
  landingResetConfigBtn: document.getElementById('landingResetConfigBtn'),

  // Firebase Auth Elements
  openAuthModalBtn: document.getElementById('openAuthModalBtn'),
  userProfileMenu: document.getElementById('userProfileMenu'),
  userAvatarBtn: document.getElementById('userAvatarBtn'),
  userAvatarImg: document.getElementById('userAvatarImg'),
  userAvatarInitials: document.getElementById('userAvatarInitials'),
  userDropdownCard: document.getElementById('userDropdownCard'),
  dropdownUserName: document.getElementById('dropdownUserName'),
  dropdownUserEmail: document.getElementById('dropdownUserEmail'),
  dropdownConfigBtn: document.getElementById('dropdownConfigBtn'),
  dropdownLogoutBtn: document.getElementById('dropdownLogoutBtn'),

  authModal: document.getElementById('authModal'),
  closeAuthModal: document.getElementById('closeAuthModal'),
  googleSignInBtn: document.getElementById('googleSignInBtn'),
  signInForm: document.getElementById('signInForm'),
  loginEmail: document.getElementById('loginEmail'),
  loginPassword: document.getElementById('loginPassword'),
  submitLoginBtn: document.getElementById('submitLoginBtn'),
  guestLoginBtn: document.getElementById('guestLoginBtn'),

  signUpForm: document.getElementById('signUpForm'),
  registerName: document.getElementById('registerName'),
  registerEmail: document.getElementById('registerEmail'),
  registerPassword: document.getElementById('registerPassword'),
  submitRegisterBtn: document.getElementById('submitRegisterBtn'),

  firebaseConfigForm: document.getElementById('firebaseConfigForm'),
  cfgApiKey: document.getElementById('cfgApiKey'),
  cfgProjectId: document.getElementById('cfgProjectId'),
  cfgAuthDomain: document.getElementById('cfgAuthDomain'),
  cfgAppId: document.getElementById('cfgAppId'),
  saveConfigBtn: document.getElementById('saveConfigBtn'),
  resetConfigBtn: document.getElementById('resetConfigBtn'),

  // App Mode Switcher & Stepper
  modeQrStudioBtn: document.getElementById('modeQrStudioBtn'),
  modeCalcBtn: document.getElementById('modeCalcBtn'),
  qrStepperContainer: document.getElementById('qrStepperContainer'),
  calcView: document.getElementById('calcView'),

  // Calculator Form Elements
  calcForm: document.getElementById('calcForm'),
  calcAmount: document.getElementById('calcAmount'),
  calcSource: document.getElementById('calcSource'),
  calcMerchant: document.getElementById('calcMerchant'),
  
  // Calculator Result Elements
  resTxnAmount: document.getElementById('resTxnAmount'),
  resCustomerCharge: document.getElementById('resCustomerCharge'),
  resCustomerPays: document.getElementById('resCustomerPays'),
  resMdrRateTag: document.getElementById('resMdrRateTag'),
  resMdrFee: document.getElementById('resMdrFee'),
  resGstFee: document.getElementById('resGstFee'),
  resNetPayout: document.getElementById('resNetPayout'),
  npciRuleDesc: document.getElementById('npciRuleDesc'),
  useInQrBtn: document.getElementById('useInQrBtn'),
  useInQrAmtText: document.getElementById('useInQrAmtText')
};

// Currency symbol map helper
function getCurrencySymbol(code = 'INR') {
  const map = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
  return map[code] || code;
}

// Regex for VPA Validation
const VPA_REGEX = /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/;

// Calculate Split Parts for Amounts > ₹2,000
function calculateSplitParts(totalAmount, notePrefix = '', baseRefId = '') {
  const amt = parseFloat(totalAmount);
  if (isNaN(amt) || amt <= 0) {
    return [{ amount: 0, partNum: 1, totalParts: 1, note: notePrefix, refId: baseRefId }];
  }
  
  if (amt <= 2000) {
    return [{ amount: amt, partNum: 1, totalParts: 1, note: notePrefix, refId: baseRefId }];
  }

  const CHUNK_SIZE = 1999;
  const parts = [];
  let remaining = amt;
  let partIndex = 1;

  while (remaining > 0) {
    const chunkAmt = Math.min(remaining, CHUNK_SIZE);
    const roundedAmt = parseFloat(chunkAmt.toFixed(2));
    const partNote = notePrefix ? `${notePrefix} (Part ${partIndex})` : `Part ${partIndex}`;
    const partRefId = baseRefId ? `${baseRefId}-${partIndex}` : '';
    
    parts.push({
      amount: roundedAmt,
      partNum: partIndex,
      note: partNote,
      refId: partRefId
    });
    
    remaining = parseFloat((remaining - roundedAmt).toFixed(2));
    partIndex++;
  }

  parts.forEach(p => p.totalParts = parts.length);
  return parts;
}

// Audio Chime Generator
function playChimeSound(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'copy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(783.99, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (err) {}
}

// Toast Notifications
function showToast(message, icon = '✨') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Build standard NPCI UPI URL string
function buildUpiUrl(vpa, name, amount, note, refId = '', currency = 'INR') {
  const cleanVpa = (vpa || '').trim();
  const cleanName = (name || '').trim();
  const cleanAmount = parseFloat(amount);
  const cleanNote = (note || '').trim();
  const cleanRefId = (refId || '').trim();
  const cleanCurrency = (currency || 'INR').trim();
  
  let params = new URLSearchParams();
  params.append('pa', cleanVpa);
  if (cleanName) params.append('pn', cleanName);
  if (!isNaN(cleanAmount) && cleanAmount > 0) {
    params.append('am', cleanAmount.toFixed(2));
  }
  params.append('cu', cleanCurrency);
  if (cleanNote) params.append('tn', cleanNote);
  if (cleanRefId) params.append('tr', cleanRefId);
  
  return `upi://pay?${params.toString()}`;
}

// Render QR Code onto DOM element
async function renderQrCode(container, text, color = '#0F172A', size = 350) {
  container.innerHTML = '';
  
  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, text, {
      width: size,
      margin: 2,
      color: {
        dark: color,
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    container.appendChild(canvas);
  } catch (err) {
    if (window.QRCode) {
      new window.QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: color,
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }
  }
}

// Render All Split QR Cards Simultaneously for Step 2
async function renderAllMultiQrCards() {
  elements.multiQrCardsGrid.innerHTML = '';
  const sym = getCurrencySymbol(state.currency);

  for (let i = 0; i < state.parts.length; i++) {
    const part = state.parts[i];
    const upiUrl = buildUpiUrl(state.vpa, state.payeeName, part.amount, part.note, part.refId, state.currency);
    
    const card = document.createElement('div');
    card.className = 'preview-card glass-panel multi-qr-card';
    
    card.innerHTML = `
      <div class="preview-card-header">
        <div class="payee-info">
          <span class="part-badge-tag">PART ${part.partNum} OF ${state.parts.length}</span>
          <h3>${state.payeeName || 'Your Name / Business'}</h3>
          <div class="vpa-display">
            <span>${state.vpa || 'username@upi'}</span>
          </div>
        </div>
        <div class="upi-brand-logo">
          <span class="upi-chip-tag">BHIM UPI</span>
        </div>
      </div>

      <div class="amount-display-container">
        <span class="amount-label">PART AMOUNT PAYABLE</span>
        <div class="part-amount-val">
          <span class="curr-sym">${sym}</span> ${part.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        ${part.note ? `<div class="preview-note-badge">📝 ${part.note}</div>` : ''}
        ${part.refId ? `<div class="preview-note-badge">🔖 Ref: ${part.refId}</div>` : ''}
      </div>

      <div class="qr-box-wrapper">
        <div class="qr-container card-qr-box">
          <div class="card-qr-canvas"></div>
          ${state.showLogo ? `<div class="qr-center-logo" style="display:flex"><div class="upi-logo-icon">UPI</div></div>` : ''}
        </div>
        <div class="scan-instruction">
          <span class="scan-pulse"></span> Scan Part ${part.partNum} with any UPI App
        </div>
      </div>

      <div class="card-action-row">
        <button class="btn btn-primary download-part-btn" data-part-idx="${i}">
          <span>📥</span> Download PNG
        </button>
        <button class="btn btn-secondary copy-part-btn" data-part-idx="${i}">
          <span>🔗</span> Copy Link
        </button>
      </div>

      <div class="app-launchers">
        <span class="launchers-title">Pay Part ${part.partNum} directly:</span>
        <div class="app-buttons-grid">
          <a href="${upiUrl}" class="app-btn gpay" target="_blank" rel="noopener">🔵 GPay</a>
          <a href="${upiUrl}" class="app-btn phonepe" target="_blank" rel="noopener">🟣 PhonePe</a>
          <a href="${upiUrl}" class="app-btn paytm" target="_blank" rel="noopener">🔷 Paytm</a>
          <a href="${upiUrl}" class="app-btn bhim" target="_blank" rel="noopener">🟧 BHIM</a>
          <a href="${upiUrl}" class="app-btn cred" target="_blank" rel="noopener">⚫ Cred</a>
          <a href="${upiUrl}" class="app-btn amazonpay" target="_blank" rel="noopener">🟠 Amazon Pay</a>
          <a href="${upiUrl}" class="app-btn whatsapp" target="_blank" rel="noopener">🟢 WhatsApp</a>
        </div>
      </div>
    `;

    elements.multiQrCardsGrid.appendChild(card);

    const qrCanvasBox = card.querySelector('.card-qr-canvas');
    await renderQrCode(qrCanvasBox, upiUrl, state.color, 280);

    card.querySelector('.download-part-btn').addEventListener('click', () => downloadSinglePartQr(i));
    card.querySelector('.copy-part-btn').addEventListener('click', () => copySinglePartLink(i));
  }
}

// Render Step 2 View Content
async function updateStep2View() {
  state.vpa = elements.upiId.value.trim();
  state.payeeName = elements.payeeName.value.trim();
  state.amount = elements.amount.value.trim();
  state.currency = elements.currencySelect.value;
  state.note = elements.txnNote.value.trim();
  state.refId = elements.refId.value.trim();

  state.parts = calculateSplitParts(state.amount, state.note, state.refId);
  const numAmt = parseFloat(state.amount);
  const sym = getCurrencySymbol(state.currency);

  if (state.parts.length > 1) {
    elements.singlePreviewCard.classList.add('hidden');
    elements.multiPreviewContainer.classList.remove('hidden');

    elements.multiTotalAmount.textContent = `${sym} ${numAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    elements.multiSplitDesc.textContent = `Total amount exceeds ₹2,000. All ${state.parts.length} split QR codes are displayed below at the same time for immediate scanning!`;
    elements.downloadAllCount.textContent = state.parts.length;

    await renderAllMultiQrCards();
  } else {
    elements.singlePreviewCard.classList.remove('hidden');
    elements.multiPreviewContainer.classList.add('hidden');

    elements.previewPayeeName.textContent = state.payeeName || 'Your Name / Business';
    elements.previewVpa.textContent = state.vpa || 'username@upi';
    
    if (!isNaN(numAmt) && numAmt > 0) {
      elements.previewAmount.innerHTML = `<span class="curr-sym">${sym}</span> <span class="amt-num">${numAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
    } else {
      elements.previewAmount.innerHTML = `<span class="curr-sym">${sym}</span> <span class="amt-num">Open Amount</span>`;
    }
    
    let noteBadgeText = [];
    if (state.note) noteBadgeText.push(`📝 ${state.note}`);
    if (state.refId) noteBadgeText.push(`🔖 Ref: ${state.refId}`);

    if (noteBadgeText.length > 0) {
      elements.previewNote.classList.remove('hidden');
      elements.previewNoteText.textContent = noteBadgeText.join(' • ');
    } else {
      elements.previewNote.classList.add('hidden');
    }

    elements.qrCenterLogo.style.display = state.showLogo ? 'flex' : 'none';

    const upiUrl = buildUpiUrl(state.vpa, state.payeeName, state.amount, state.note, state.refId, state.currency);
    await renderQrCode(elements.qrCodeOutput, upiUrl, state.color, state.size);
    
    elements.gpayBtn.href = upiUrl;
    elements.phonepeBtn.href = upiUrl;
    elements.paytmBtn.href = upiUrl;
    elements.bhimBtn.href = upiUrl;
    elements.credBtn.href = upiUrl;
    elements.amazonpayBtn.href = upiUrl;
    elements.whatsappBtn.href = upiUrl;
  }
}

// 2-Step Navigation Switcher
function goToStep(stepNumber) {
  if (stepNumber === 2) {
    const vpa = elements.upiId.value.trim();
    if (!vpa || !VPA_REGEX.test(vpa)) {
      showToast('Please enter a valid Payee UPI ID (e.g. name@upi) to generate QR!', '❌');
      elements.upiId.focus();
      return;
    }

    state.currentStep = 2;
    elements.step1View.classList.add('hidden');
    elements.step2View.classList.remove('hidden');
    
    elements.step1Indicator.classList.remove('active');
    elements.step2Indicator.classList.add('active');

    saveToHistory();
    updateStep2View();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playChimeSound('success');
    showToast('Payment QR Code(s) generated!', '⚡');
  } else {
    state.currentStep = 1;
    elements.step2View.classList.add('hidden');
    elements.step1View.classList.remove('hidden');

    elements.step2Indicator.classList.remove('active');
    elements.step1Indicator.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Preset Amount Click Handlers
function setupPresetChips() {
  document.querySelectorAll('.preset-chips .chip[data-amount]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.preset-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      elements.amount.value = chip.dataset.amount;
      playChimeSound('copy');
    });
  });

  elements.clearAmountBtn.addEventListener('click', () => {
    document.querySelectorAll('.preset-chips .chip').forEach(c => c.classList.remove('active'));
    elements.amount.value = '';
  });
}

// Customization Event Listeners
function setupCustomization() {
  elements.colorPalette.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.colorPalette.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.color = btn.dataset.color;
    });
  });

  // Custom QR Size Slider
  if (elements.customQrSlider) {
    elements.customQrSlider.addEventListener('input', (e) => {
      state.size = parseInt(e.target.value, 10);
      elements.qrSizeValDisplay.textContent = `${state.size} px`;
      document.querySelectorAll('.size-chip').forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.size, 10) === state.size);
      });
    });
  }

  // Size Preset Chips
  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const sz = parseInt(chip.dataset.size, 10);
      state.size = sz;
      if (elements.customQrSlider) elements.customQrSlider.value = sz;
      elements.qrSizeValDisplay.textContent = `${sz} px`;
      playChimeSound('copy');
    });
  });

  // Currency Select Change
  if (elements.currencySelect) {
    elements.currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      const sym = getCurrencySymbol(state.currency);
      elements.currencySymbolDisplay.textContent = sym;
    });
  }

  // Auto Generate Reference ID Button
  if (elements.generateRefBtn) {
    elements.generateRefBtn.addEventListener('click', () => {
      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const newRef = `TXN${dateStr}${randNum}`;
      elements.refId.value = newRef;
      state.refId = newRef;
      showToast(`Generated Ref ID: ${newRef}`, '🎲');
      playChimeSound('copy');
    });
  }

  elements.showCenterLogo.addEventListener('change', (e) => {
    state.showLogo = e.target.checked;
  });
}

// LocalStorage Merchant Profile
function saveMerchantProfile() {
  const vpa = elements.upiId.value.trim();
  const name = elements.payeeName.value.trim();
  
  if (!vpa || !VPA_REGEX.test(vpa)) {
    showToast('Please enter a valid UPI ID before saving profile!', '❌');
    return;
  }
  
  const profile = { vpa, name };
  localStorage.setItem('upi_payflow_merchant', JSON.stringify(profile));
  
  checkSavedProfile();
  showToast('Merchant profile saved as default!', '💾');
  playChimeSound('success');
}

function checkSavedProfile() {
  const stored = localStorage.getItem('upi_payflow_merchant');
  if (stored) {
    try {
      const { vpa, name } = JSON.parse(stored);
      elements.savedProfileBadge.classList.remove('hidden');
      elements.savedProfileText.textContent = name ? `Saved: ${name}` : `Saved: ${vpa}`;
      return { vpa, name };
    } catch (e) {}
  } else {
    elements.savedProfileBadge.classList.add('hidden');
  }
  return null;
}

function clearMerchantProfile() {
  localStorage.removeItem('upi_payflow_merchant');
  checkSavedProfile();
  showToast('Saved profile cleared!', '🗑️');
}

// History Tracker
function saveToHistory() {
  const vpa = elements.upiId.value.trim();
  const name = elements.payeeName.value.trim();
  const amount = elements.amount.value.trim();
  const note = elements.txnNote.value.trim();
  const refId = elements.refId.value.trim();
  const currency = elements.currencySelect.value;
  
  if (!vpa || !VPA_REGEX.test(vpa)) return;
  
  let history = JSON.parse(localStorage.getItem('upi_payflow_history') || '[]');
  
  if (history.length > 0 && history[0].vpa === vpa && history[0].amount === amount && history[0].note === note && history[0].refId === refId) {
    return;
  }
  
  const item = {
    id: Date.now(),
    vpa,
    name,
    amount,
    currency,
    note,
    refId,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  history.unshift(item);
  history = history.slice(0, 10);
  
  localStorage.setItem('upi_payflow_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('upi_payflow_history') || '[]');
  elements.historyCountBadge.textContent = history.length;
  
  if (history.length === 0) {
    elements.historyList.innerHTML = `<div class="history-empty">No recent generated QRs yet. Configure details above to save history!</div>`;
    return;
  }
  
  elements.historyList.innerHTML = history.map(item => {
    const sym = getCurrencySymbol(item.currency || 'INR');
    return `
      <div class="history-item-card" data-id="${item.id}">
        <div class="history-item-details">
          <h4>${item.name || 'Unnamed Payee'}</h4>
          <p class="history-item-vpa">${item.vpa}</p>
          <span class="history-item-amount">${item.amount ? sym + ' ' + parseFloat(item.amount).toLocaleString('en-IN') : 'Open Amount'}</span>
          ${item.refId ? `<span class="history-item-ref" style="font-size:0.7rem; color:var(--text-muted); display:block;">Ref: ${item.refId}</span>` : ''}
        </div>
        <div class="history-item-actions">
          <button class="btn btn-sm btn-secondary load-history-btn" title="Load Details & Generate QR">🔄 Load</button>
        </div>
      </div>
    `;
  }).join('');
  
  elements.historyList.querySelectorAll('.load-history-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const item = history[index];
      elements.upiId.value = item.vpa;
      elements.payeeName.value = item.name;
      elements.amount.value = item.amount;
      if (item.currency && elements.currencySelect) {
        elements.currencySelect.value = item.currency;
        elements.currencySymbolDisplay.textContent = getCurrencySymbol(item.currency);
      }
      elements.txnNote.value = item.note || '';
      elements.refId.value = item.refId || '';
      goToStep(2);
      showToast('Loaded details from history & generated QR!', '📋');
    });
  });
}

// Download Single Part QR
async function downloadSinglePartQr(partIndex = 0) {
  const part = state.parts[partIndex] || { partNum: 1, amount: state.amount, note: state.note, refId: state.refId };
  const upiUrl = buildUpiUrl(state.vpa, state.payeeName, part.amount, part.note, part.refId, state.currency);
  
  const tempContainer = document.createElement('div');
  const exportSize = Math.max(state.size, 500); // High res PNG download
  await renderQrCode(tempContainer, upiUrl, state.color, exportSize);
  const canvas = tempContainer.querySelector('canvas');

  if (canvas) {
    if (state.showLogo) {
      const ctx = canvas.getContext('2d');
      const size = canvas.width;
      const logoSize = Math.floor(size * 0.18);
      const center = Math.floor(size / 2);
      const radius = Math.floor(logoSize / 2);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = Math.max(2, Math.floor(size * 0.01));
      ctx.strokeStyle = '#6366F1';
      ctx.stroke();

      ctx.fillStyle = '#6366F1';
      ctx.font = `bold ${Math.floor(logoSize * 0.45)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('UPI', center, center);
    }

    const link = document.createElement('a');
    const partSuffix = state.parts.length > 1 ? `_Part${part.partNum}of${state.parts.length}` : '';
    link.download = `UPI_QR_${(state.payeeName || 'Payment').replace(/[^a-zA-Z0-9]/g, '_')}${partSuffix}_${part.amount}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast(`Downloaded QR Code (${state.parts.length > 1 ? 'Part ' + part.partNum : 'PNG'})!`, '📥');
    playChimeSound('success');
  }
}

// Download All Split QRs
async function downloadAllSplitQrs() {
  for (let i = 0; i < state.parts.length; i++) {
    await downloadSinglePartQr(i);
    await new Promise(r => setTimeout(r, 250));
  }
  showToast(`Downloaded all ${state.parts.length} split QRs successfully!`, '📦');
}

// Copy Single Part Link
async function copySinglePartLink(partIndex = 0) {
  const part = state.parts[partIndex] || { amount: state.amount, note: state.note, refId: state.refId };
  const upiUrl = buildUpiUrl(state.vpa, state.payeeName, part.amount, part.note, part.refId, state.currency);
  try {
    await navigator.clipboard.writeText(upiUrl);
    showToast(`Payment Link copied (${state.parts.length > 1 ? 'Part ' + part.partNum : 'Active'})!`, '🔗');
    playChimeSound('copy');
  } catch (err) {
    showToast('Failed to copy link!', '❌');
  }
}

// Copy VPA to Clipboard
async function copyVpa() {
  try {
    await navigator.clipboard.writeText(state.vpa);
    showToast(`Copied VPA: ${state.vpa}`, '📋');
    playChimeSound('copy');
  } catch (err) {
    showToast('Failed to copy VPA!', '❌');
  }
}

// Web Share API — QR Image or Link Sharing
async function sharePaymentQr() {
  const part = state.parts[0] || { amount: state.amount, note: state.note, refId: state.refId };
  const upiUrl = buildUpiUrl(state.vpa, state.payeeName, part.amount, part.note, part.refId, state.currency);
  const sym = getCurrencySymbol(state.currency);
  
  // Try sharing Canvas PNG image if Web Share API with File blob is supported
  try {
    const tempContainer = document.createElement('div');
    await renderQrCode(tempContainer, upiUrl, state.color, state.size);
    const canvas = tempContainer.querySelector('canvas');
    
    if (canvas && navigator.canShare) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `UPI_QR_${(state.payeeName || 'Payment').replace(/[^a-zA-Z0-9]/g, '_')}.png`, { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Pay ${state.payeeName || 'via UPI'}`,
          text: `Pay ${state.payeeName} ${sym}${state.amount} via UPI`,
          files: [file]
        });
        showToast('Shared QR Code image successfully!', '📱');
        return;
      }
    }
  } catch (e) {}

  // Fallback to standard URL sharing or clipboard
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Pay ${state.payeeName || 'via UPI'}`,
        text: `Pay ${state.payeeName} ${sym}${state.amount} via UPI`,
        url: upiUrl
      });
      showToast('Payment link shared successfully!', '📱');
    } catch (err) {
      if (err.name !== 'AbortError') {
        copySinglePartLink(0);
      }
    }
  } else {
    copySinglePartLink(0);
  }
}

// Print Poster Standee Modal
async function openPrintModal() {
  elements.posterMerchantName.textContent = state.payeeName || 'Merchant Store';
  elements.posterVpa.textContent = state.vpa || 'merchant@upi';
  const sym = getCurrencySymbol(state.currency);
  
  const numAmt = parseFloat(state.amount);
  if (!isNaN(numAmt) && numAmt > 0) {
    elements.posterAmountContainer.style.display = 'block';
    elements.posterAmountVal.textContent = `${sym} ${numAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  } else {
    elements.posterAmountContainer.style.display = 'none';
  }

  if (state.parts.length > 1) {
    elements.posterSingleQrView.classList.add('hidden');
    elements.posterMultiQrView.classList.remove('hidden');
    elements.posterMultiQrView.innerHTML = '';

    for (let i = 0; i < state.parts.length; i++) {
      const part = state.parts[i];
      const upiUrl = buildUpiUrl(state.vpa, state.payeeName, part.amount, part.note, part.refId, state.currency);
      
      const partCard = document.createElement('div');
      partCard.className = 'poster-part-card';
      
      const title = document.createElement('div');
      title.className = 'poster-part-title';
      title.textContent = `PART ${part.partNum} OF ${state.parts.length}`;
      
      const amtText = document.createElement('div');
      amtText.className = 'poster-part-amt';
      amtText.textContent = `${sym} ${part.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      
      const qrBox = document.createElement('div');
      qrBox.className = 'poster-qr-container';
      await renderQrCode(qrBox, upiUrl, '#000000', 160);

      partCard.appendChild(title);
      partCard.appendChild(amtText);
      partCard.appendChild(qrBox);
      elements.posterMultiQrView.appendChild(partCard);
    }
  } else {
    elements.posterSingleQrView.classList.remove('hidden');
    elements.posterMultiQrView.classList.add('hidden');
    const upiUrl = buildUpiUrl(state.vpa, state.payeeName, state.amount, state.note, state.refId, state.currency);
    await renderQrCode(elements.posterQrOutput, upiUrl, '#000000', 260);
  }

  elements.printModal.classList.remove('hidden');
}

function closePrintModal() {
  elements.printModal.classList.add('hidden');
}

function triggerPrint() {
  window.print();
}

// Theme Toggle
function setupThemeToggle() {
  const currentTheme = localStorage.getItem('upi_payflow_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  state.theme = currentTheme;

  elements.themeToggleBtn.addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    state.theme = newTheme;
    localStorage.setItem('upi_payflow_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, newTheme === 'dark' ? '🌙' : '☀️');
  });
}

// Live Validation Indicator for Step 1
function setupLiveValidation() {
  elements.upiId.addEventListener('input', () => {
    const vpa = elements.upiId.value.trim();
    if (vpa.length > 0) {
      const isValid = VPA_REGEX.test(vpa);
      elements.vpaValidation.className = `validation-indicator ${isValid ? 'valid' : 'invalid'}`;
    } else {
      elements.vpaValidation.className = 'validation-indicator';
    }
  });
}

// Switch App Mode (QR Studio vs Charge Calculator)
function switchAppMode(mode = 'qr') {
  if (mode === 'calc') {
    elements.modeQrStudioBtn.classList.remove('active');
    elements.modeCalcBtn.classList.add('active');
    
    elements.qrStepperContainer.classList.add('hidden');
    elements.step1View.classList.add('hidden');
    elements.step2View.classList.add('hidden');
    elements.calcView.classList.remove('hidden');

    updateCalculatorDisplay();
  } else {
    elements.modeCalcBtn.classList.remove('active');
    elements.modeQrStudioBtn.classList.add('active');

    elements.qrStepperContainer.classList.remove('hidden');
    elements.calcView.classList.add('hidden');
    
    if (state.currentStep === 2) {
      elements.step1View.classList.add('hidden');
      elements.step2View.classList.remove('hidden');
    } else {
      elements.step1View.classList.remove('hidden');
      elements.step2View.classList.add('hidden');
    }
  }
}

// UPI Charge & Interchange Fee Calculator Engine
function calculateUpiFeeDetails(amountVal, sourceVal, merchantVal) {
  const amount = Math.max(0, parseFloat(amountVal) || 0);
  const customerCharge = 0; // Customer always pays ₹0 for UPI
  const customerPays = amount;
  let mdrRate = 0;
  let ruleText = '';

  if (sourceVal === 'bank') {
    mdrRate = 0;
    ruleText = 'NPCI Guidelines: Zero charges for P2P and Bank-to-Bank P2M transactions. Standard UPI payments from savings/current bank accounts are 100% free for both customer and merchant.';
  } else if (sourceVal === 'rupay') {
    if (amount <= 2000 || merchantVal === 'small') {
      mdrRate = 0;
      ruleText = 'NPCI Circular: Zero MDR for RuPay Credit Card transactions up to ₹2,000 or for small merchants with turnover < ₹20 Lakhs.';
    } else {
      mdrRate = 2.0; // Standard RuPay Credit Card MDR
      ruleText = 'NPCI Circular: Standard MDR of 2.00% (+18% GST) applies for RuPay Credit Card payments over ₹2,000 at large commercial merchants. Customer charge is ₹0.';
    }
  } else if (sourceVal === 'ppi') {
    if (amount <= 2000 || merchantVal === 'small') {
      mdrRate = 0;
      ruleText = 'NPCI Circular: Zero interchange fee for Prepaid Wallet (PPI) transactions up to ₹2,000 or at small offline merchants.';
    } else {
      if (merchantVal === 'fuel') {
        mdrRate = 0.5;
      } else if (merchantVal === 'telecom_utility' || merchantVal === 'edu_govt') {
        mdrRate = 0.7;
      } else {
        mdrRate = 1.1; // Large retail / commercial
      }
      ruleText = `NPCI Circular: ${mdrRate.toFixed(1)}% interchange fee applies to PPI merchant transactions over ₹2,000 (${merchantVal === 'fuel' ? 'Fuel tier' : merchantVal.includes('telecom') ? 'Utilities tier' : 'Retail tier'}). Customer charge is ₹0.`;
    }
  }

  const mdrFee = amount * (mdrRate / 100);
  const gstFee = mdrFee * 0.18;
  const totalDeduction = mdrFee + gstFee;
  const netPayout = Math.max(0, amount - totalDeduction);

  return {
    amount,
    customerCharge,
    customerPays,
    mdrRate,
    mdrFee,
    gstFee,
    netPayout,
    ruleText
  };
}

// Update Calculator Results Card UI
function updateCalculatorDisplay() {
  if (!elements.calcAmount) return;

  const amountVal = elements.calcAmount.value;
  const sourceVal = elements.calcSource.value;
  const merchantVal = elements.calcMerchant.value;

  const res = calculateUpiFeeDetails(amountVal, sourceVal, merchantVal);

  const fmt = (num) => '₹ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  elements.resTxnAmount.textContent = fmt(res.amount);
  elements.resCustomerCharge.textContent = fmt(res.customerCharge);
  elements.resCustomerPays.textContent = fmt(res.customerPays);
  elements.resMdrRateTag.textContent = `${res.mdrRate.toFixed(2)}%`;
  elements.resMdrFee.textContent = fmt(res.mdrFee);
  elements.resGstFee.textContent = fmt(res.gstFee);
  elements.resNetPayout.textContent = fmt(res.netPayout);
  elements.npciRuleDesc.textContent = res.ruleText;
  elements.useInQrAmtText.textContent = res.amount.toLocaleString('en-IN');
}

// Setup Calculator Input Event Handlers
function setupCalculatorEvents() {
  if (!elements.calcAmount) return;

  const triggerUpdate = () => updateCalculatorDisplay();

  elements.calcAmount.addEventListener('input', triggerUpdate);
  elements.calcSource.addEventListener('change', triggerUpdate);
  elements.calcMerchant.addEventListener('change', triggerUpdate);

  document.querySelectorAll('.calc-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.calc-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      elements.calcAmount.value = chip.dataset.amt;
      updateCalculatorDisplay();
      playChimeSound('copy');
    });
  });

  elements.useInQrBtn.addEventListener('click', () => {
    const calcAmt = elements.calcAmount.value;
    elements.amount.value = calcAmt;
    switchAppMode('qr');
    goToStep(1);
    showToast(`Transferred ₹${parseFloat(calcAmt).toLocaleString('en-IN')} to QR Studio!`, '⚡');
    playChimeSound('success');
  });
}

// Initialize Application
function initAuth() {
  // Modal toggle handlers
  if (elements.openAuthModalBtn) {
    elements.openAuthModalBtn.addEventListener('click', () => {
      if (elements.authModal) elements.authModal.classList.remove('hidden');
    });
  }

  if (elements.closeAuthModal) {
    elements.closeAuthModal.addEventListener('click', () => {
      if (elements.authModal) elements.authModal.classList.add('hidden');
    });
  }

  // Close modal when clicking backdrop
  if (elements.authModal) {
    elements.authModal.addEventListener('click', (e) => {
      if (e.target === elements.authModal) {
        elements.authModal.classList.add('hidden');
      }
    });
  }

  // Toggle User Avatar Dropdown
  if (elements.userAvatarBtn && elements.userDropdownCard) {
    elements.userAvatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.userDropdownCard.classList.toggle('hidden');
    });
    
    document.addEventListener('click', () => {
      if (elements.userDropdownCard) elements.userDropdownCard.classList.add('hidden');
    });

    elements.userDropdownCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Auth Tabs switching (Works for both Modal & Landing Page tabs)
  const authTabs = document.querySelectorAll('.auth-tab');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.getAttribute('data-tab');
      // Scope active class toggle to sister tabs within the same container
      const parentTabs = tab.parentElement;
      if (parentTabs) {
        parentTabs.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      }
      tab.classList.add('active');

      const parentBody = tab.closest('.modal-card, .auth-form-card');
      if (parentBody) {
        parentBody.querySelectorAll('.auth-tab-content').forEach(c => c.classList.add('hidden'));
        const targetContent = parentBody.querySelector(`#${targetTabId}`);
        if (targetContent) targetContent.classList.remove('hidden');
      }
    });
  });

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    const res = await loginWithGoogle();
    if (res.success) {
      showToast(`Welcome ${res.user.displayName || 'User'}!`, '🔥');
      if (elements.authModal) elements.authModal.classList.add('hidden');
    } else {
      showToast(res.error, '⚠️');
    }
  };

  if (elements.googleSignInBtn) elements.googleSignInBtn.addEventListener('click', handleGoogleSignIn);
  if (elements.landingGoogleSignInBtn) elements.landingGoogleSignInBtn.addEventListener('click', handleGoogleSignIn);

  // Email Sign-In Handlers
  const handleEmailSignIn = async (email, password, formToReset) => {
    const res = await loginWithEmail(email, password);
    if (res.success) {
      showToast('Signed in successfully!', '✅');
      if (elements.authModal) elements.authModal.classList.add('hidden');
      if (formToReset) formToReset.reset();
    } else {
      showToast(res.error, '⚠️');
    }
  };

  if (elements.signInForm) {
    elements.signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleEmailSignIn(elements.loginEmail.value, elements.loginPassword.value, elements.signInForm);
    });
  }
  if (elements.landingSignInForm) {
    elements.landingSignInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleEmailSignIn(elements.landingLoginEmail.value, elements.landingLoginPassword.value, elements.landingSignInForm);
    });
  }

  // Registration Handlers
  const handleRegister = async (name, email, password, formToReset) => {
    const res = await registerWithEmail(email, password, name);
    if (res.success) {
      showToast('Account created successfully!', '🎉');
      if (elements.authModal) elements.authModal.classList.add('hidden');
      if (formToReset) formToReset.reset();
    } else {
      showToast(res.error, '⚠️');
    }
  };

  if (elements.signUpForm) {
    elements.signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRegister(elements.registerName.value, elements.registerEmail.value, elements.registerPassword.value, elements.signUpForm);
    });
  }
  if (elements.landingSignUpForm) {
    elements.landingSignUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRegister(elements.landingRegisterName.value, elements.landingRegisterEmail.value, elements.landingRegisterPassword.value, elements.landingSignUpForm);
    });
  }

  // Guest Login Handler
  const handleGuestLogin = async () => {
    const res = await loginAsGuest();
    if (res.success) {
      showToast('Welcome to UPI PayFlow Studio', '👤');
      if (elements.authModal) elements.authModal.classList.add('hidden');
    } else {
      showToast(res.error, '⚠️');
    }
  };

  if (elements.guestLoginBtn) elements.guestLoginBtn.addEventListener('click', handleGuestLogin);
  if (elements.landingGuestLoginBtn) elements.landingGuestLoginBtn.addEventListener('click', handleGuestLogin);

  // Logout Handler
  if (elements.dropdownLogoutBtn) {
    elements.dropdownLogoutBtn.addEventListener('click', async () => {
      await logoutUser();
      if (elements.userDropdownCard) elements.userDropdownCard.classList.add('hidden');
      showToast('Signed out. Please sign in to access studio.', '🚪');
    });
  }

  // Dropdown -> Firebase Config Settings
  if (elements.dropdownConfigBtn) {
    elements.dropdownConfigBtn.addEventListener('click', () => {
      if (elements.userDropdownCard) elements.userDropdownCard.classList.add('hidden');
      if (elements.authModal) elements.authModal.classList.remove('hidden');
      const configTab = document.querySelector('.auth-tab[data-tab="tabFirebaseConfig"]');
      if (configTab) configTab.click();
    });
  }

  // Firebase Config Forms
  if (elements.firebaseConfigForm) {
    const cfg = getFirebaseConfig();
    if (elements.cfgApiKey) elements.cfgApiKey.value = cfg.apiKey || '';
    if (elements.cfgProjectId) elements.cfgProjectId.value = cfg.projectId || '';
    if (elements.cfgAuthDomain) elements.cfgAuthDomain.value = cfg.authDomain || '';
    if (elements.cfgAppId) elements.cfgAppId.value = cfg.appId || '';

    elements.firebaseConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        saveFirebaseConfig({
          apiKey: elements.cfgApiKey.value,
          projectId: elements.cfgProjectId.value,
          authDomain: elements.cfgAuthDomain.value,
          appId: elements.cfgAppId.value
        });
        showToast('Custom Firebase Config saved!', '⚙️');
        if (elements.authModal) elements.authModal.classList.add('hidden');
      } catch (err) {
        showToast(err.message, '⚠️');
      }
    });

    if (elements.resetConfigBtn) {
      elements.resetConfigBtn.addEventListener('click', () => {
        resetFirebaseConfig();
        const def = getFirebaseConfig();
        elements.cfgApiKey.value = def.apiKey;
        elements.cfgProjectId.value = def.projectId;
        elements.cfgAuthDomain.value = def.authDomain;
        elements.cfgAppId.value = def.appId;
        showToast('Reverted to default Firebase config', '🔄');
      });
    }
  }

  // Listen to Auth State changes
  listenAuthState((user) => {
    updateAuthUI(user);
  });
}

function updateAuthUI(user) {
  if (user) {
    // User is logged in -> Hide Auth Landing View & Show Main App Workspace
    if (elements.authLandingView) elements.authLandingView.classList.add('hidden');
    if (elements.appMainWorkspace) elements.appMainWorkspace.classList.remove('hidden');

    if (elements.openAuthModalBtn) elements.openAuthModalBtn.classList.add('hidden');
    if (elements.userProfileMenu) elements.userProfileMenu.classList.remove('hidden');

    const name = user.displayName || (user.isAnonymous ? 'Guest User' : user.email?.split('@')[0]) || 'Merchant User';
    const email = user.email || (user.isAnonymous ? 'Anonymous Auth Session' : '');
    const photo = user.photoURL;

    if (elements.dropdownUserName) elements.dropdownUserName.textContent = name;
    if (elements.dropdownUserEmail) elements.dropdownUserEmail.textContent = email;

    if (photo && elements.userAvatarImg) {
      elements.userAvatarImg.src = photo;
      elements.userAvatarImg.classList.remove('hidden');
      if (elements.userAvatarInitials) elements.userAvatarInitials.classList.add('hidden');
    } else if (elements.userAvatarInitials) {
      elements.userAvatarInitials.textContent = name.charAt(0).toUpperCase();
      elements.userAvatarInitials.classList.remove('hidden');
      if (elements.userAvatarImg) elements.userAvatarImg.classList.add('hidden');
    }
  } else {
    // User is logged out -> Show Auth Landing View & Hide Main App Workspace
    if (elements.authLandingView) elements.authLandingView.classList.remove('hidden');
    if (elements.appMainWorkspace) elements.appMainWorkspace.classList.add('hidden');

    if (elements.openAuthModalBtn) elements.openAuthModalBtn.classList.remove('hidden');
    if (elements.userProfileMenu) elements.userProfileMenu.classList.add('hidden');
  }
}

function init() {
  setupThemeToggle();
  setupPresetChips();
  setupCustomization();
  setupLiveValidation();
  setupCalculatorEvents();
  initAuth();

  // Mode Switcher Event Listeners
  if (elements.modeQrStudioBtn && elements.modeCalcBtn) {
    elements.modeQrStudioBtn.addEventListener('click', () => switchAppMode('qr'));
    elements.modeCalcBtn.addEventListener('click', () => switchAppMode('calc'));
  }

  // Load Saved Profile if available
  const saved = checkSavedProfile();
  if (saved) {
    elements.upiId.value = saved.vpa;
    elements.payeeName.value = saved.name || '';
  } else {
    elements.upiId.value = 'demo@paytm';
    elements.payeeName.value = 'PayFlow Merchant';
    elements.amount.value = '3000';
    elements.txnNote.value = 'Grocery Bill';
  }

  // Navigation Event Listeners
  elements.generateQrBtn.addEventListener('click', () => goToStep(2));
  elements.backToEditBtn.addEventListener('click', () => goToStep(1));
  elements.createAnotherBtn.addEventListener('click', () => goToStep(1));

  elements.step1Indicator.addEventListener('click', () => goToStep(1));
  elements.step2Indicator.addEventListener('click', () => goToStep(2));

  // Action Button Handlers
  elements.saveMerchantBtn.addEventListener('click', saveMerchantProfile);
  elements.clearProfileBtn.addEventListener('click', clearMerchantProfile);
  elements.resetFormBtn.addEventListener('click', () => {
    elements.upiForm.reset();
    document.querySelectorAll('.preset-chips .chip').forEach(c => c.classList.remove('active'));
    elements.vpaValidation.className = 'validation-indicator';
    showToast('Form reset to blank', '🔄');
  });

  elements.copyVpaBtn.addEventListener('click', copyVpa);
  elements.downloadQrBtn.addEventListener('click', () => downloadSinglePartQr(0));
  elements.downloadAllBtn.addEventListener('click', downloadAllSplitQrs);
  elements.copyLinkBtn.addEventListener('click', () => copySinglePartLink(0));
  elements.shareWebBtn.addEventListener('click', sharePaymentQr);

  // Print Handlers
  elements.printPosterBtn.addEventListener('click', openPrintModal);
  elements.printMultiPosterBtn.addEventListener('click', openPrintModal);
  elements.closePrintModal.addEventListener('click', closePrintModal);
  elements.cancelPrintBtn.addEventListener('click', closePrintModal);
  elements.triggerPrintBtn.addEventListener('click', triggerPrint);

  // History Clear
  elements.clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('upi_payflow_history');
    renderHistory();
    showToast('History cleared!', '🗑️');
  });

  // Render initial history
  renderHistory();
}

// Run on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
