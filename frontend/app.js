// ---------------------------------------------------------------
// Estado simple en memoria + localStorage para persistir la sesión
// ---------------------------------------------------------------
const state = {
  token: localStorage.getItem('numerologia_token') || null,
  usuario: JSON.parse(localStorage.getItem('numerologia_usuario') || 'null'),
};

function getApiBase() {
  return document.getElementById('apiBase').value.replace(/\/+$/, '');
}

function setSession(usuario, token) {
  state.usuario = usuario;
  state.token = token;
  localStorage.setItem('numerologia_token', token);
  localStorage.setItem('numerologia_usuario', JSON.stringify(usuario));
}

function clearSession() {
  state.usuario = null;
  state.token = null;
  localStorage.removeItem('numerologia_token');
  localStorage.removeItem('numerologia_usuario');
}

// ---------------------------------------------------------------
// Helper genérico para llamar a la API
// ---------------------------------------------------------------
async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    if (!state.token) throw new Error('No hay sesión activa');
    headers['x-token'] = state.token;
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch (_) { /* respuesta sin cuerpo */ }

  if (!res.ok) {
    const msg = data?.msg
      || data?.errors?.map(e => e.msg).join(', ')
      || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ---------------------------------------------------------------
// Pequeño conversor de markdown (lo que devuelve Gemini) a HTML limpio
// ---------------------------------------------------------------
function mdToHtml(text) {
  if (!text) return '';
  const lines = text.trim().split('\n');
  let html = '';
  let inList = false;

  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const inline = (s) => s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (/^-{3,}$/.test(line)) { closeList(); html += '<hr>'; continue; }
    if (/^###\s+/.test(line)) { closeList(); html += `<h4>${inline(line.replace(/^###\s+/, ''))}</h4>`; continue; }
    if (/^##\s+/.test(line)) { closeList(); html += `<h3>${inline(line.replace(/^##\s+/, ''))}</h3>`; continue; }
    if (/^#\s+/.test(line)) { closeList(); html += `<h3>${inline(line.replace(/^#\s+/, ''))}</h3>`; continue; }
    if (/^[*-]\s+/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(line.replace(/^[*-]\s+/, ''))}</li>`;
      continue;
    }
    closeList();
    html += `<p>${inline(line)}</p>`;
  }
  closeList();
  return html;
}

// ---------------------------------------------------------------
// Navegación entre pantallas
// ---------------------------------------------------------------
function showDashboard() {
  document.getElementById('authSection').hidden = true;
  document.getElementById('dashboard').hidden = false;
  document.getElementById('topbarUser').hidden = false;
  document.getElementById('userName').textContent = state.usuario?.nombreCompleto || '';
  const idBtn = document.getElementById('userId');
  idBtn.dataset.fullId = state.usuario?.id || '';
  idBtn.textContent = `#${(state.usuario?.id || '').slice(0, 8)}`;
  cargarPerfil();
}

document.getElementById('userId').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const fullId = btn.dataset.fullId;
  if (!fullId) return;

  btn.textContent = fullId;
  btn.classList.add('copied');

  try {
    await navigator.clipboard.writeText(fullId);
  } catch (_) {
    // si el navegador bloquea el portapapeles, al menos ya se ve completo para copiar a mano
  }

  clearTimeout(btn._resetTimer);
  btn._resetTimer = setTimeout(() => {
    btn.textContent = `#${fullId.slice(0, 8)}`;
    btn.classList.remove('copied');
  }, 2000);
});

function showAuth() {
  document.getElementById('authSection').hidden = false;
  document.getElementById('dashboard').hidden = true;
  document.getElementById('topbarUser').hidden = true;
}

// ---------------------------------------------------------------
// Tabs de login / registro
// ---------------------------------------------------------------
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const isLogin = tab.dataset.tab === 'login';
    document.getElementById('loginForm').hidden = !isLogin;
    document.getElementById('registerForm').hidden = isLogin;
  });
});

function setMsg(id, text, kind) {
  const el = document.getElementById(id);
  el.textContent = text || '';
  el.className = 'form-msg' + (kind ? ` ${kind}` : '');
}

// ---------------------------------------------------------------
// Estado visual "cargando" para botones (sutil, sin spinner)
// ---------------------------------------------------------------
function setLoading(btn, loading, method = 'POST') {
  btn.disabled = loading;
  btn.classList.remove('is-loading-get', 'is-loading-post');
  if (loading) btn.classList.add(method === 'GET' ? 'is-loading-get' : 'is-loading-post');
}

// Asegura que el color de "cargando" se vea al menos un instante,
// aunque la petición responda casi al instante.
function esperarMinimo(desde, minMs = 350) {
  const transcurrido = Date.now() - desde;
  const faltante = minMs - transcurrido;
  return faltante > 0 ? new Promise(r => setTimeout(r, faltante)) : Promise.resolve();
}

// ---------------------------------------------------------------
// Login
// ---------------------------------------------------------------
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  setMsg('loginMsg', '');
  setLoading(btn, true);
  const _t0 = Date.now();
  try {
    const { usuario, token } = await apiFetch('/auth/login', {
      method: 'POST',
      body: {
        email: form.email.value,
        password: form.password.value,
      },
    });
    setSession(usuario, token);
    showDashboard();
  } catch (err) {
    setMsg('loginMsg', err.message, 'error');
  } finally {
    await esperarMinimo(_t0);
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------
// Registro
// ---------------------------------------------------------------
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  setMsg('registerMsg', '');
  setLoading(btn, true);
  const _t0 = Date.now();
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: {
        nombreCompleto: form.nombreCompleto.value,
        email: form.email.value,
        password: form.password.value,
        fechaNacimiento: form.fechaNacimiento.value,
      },
    });
    setMsg('registerMsg', 'Cuenta creada. Ahora inicia sesión.', 'success');
    document.querySelector('.auth-tab[data-tab="login"]').click();
    document.getElementById('loginForm').email.value = form.email.value;
  } catch (err) {
    setMsg('registerMsg', err.message, 'error');
  } finally {
    await esperarMinimo(_t0);
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------
// Logout
// ---------------------------------------------------------------
document.getElementById('btnLogout').addEventListener('click', () => {
  clearSession();
  showAuth();
});

// ---------------------------------------------------------------
// Perfil numerológico
// ---------------------------------------------------------------
function pintarPerfil(perfil) {
  const empty = document.getElementById('profileEmpty');
  const grid = document.getElementById('profileNumbers');
  if (!perfil) {
    empty.hidden = false;
    grid.hidden = true;
    return;
  }
  empty.hidden = true;
  grid.hidden = false;
  document.getElementById('numVida').textContent = perfil.numeroVida ?? '–';
  document.getElementById('numExpresion').textContent = perfil.numeroExpresion ?? '–';
  document.getElementById('numAlma').textContent = perfil.numeroAlma ?? '–';
}

async function cargarPerfil() {
  try {
    const { perfil } = await apiFetch('/numerology/profile', { auth: true });
    pintarPerfil(perfil);
  } catch (err) {
    pintarPerfil(null); // aún no existe perfil calculado
  }
}

document.getElementById('btnCalcularPerfil').addEventListener('click', async (e) => {
  const btn = e.target;
  setMsg('profileMsg', '');
  setLoading(btn, true);
  const _t0 = Date.now();
  try {
    const { perfil } = await apiFetch('/numerology/calculate', { method: 'POST', auth: true });
    pintarPerfil(perfil);
    setMsg('profileMsg', 'Perfil actualizado.', 'success');
  } catch (err) {
    setMsg('profileMsg', err.message, 'error');
  } finally {
    await esperarMinimo(_t0);
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------
// Generar lectura
// ---------------------------------------------------------------
document.getElementById('readingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const resultBox = document.getElementById('readingResult');
  setMsg('readingMsg', '');
  resultBox.hidden = true;
  setLoading(btn, true);
  const _t0 = Date.now();
  try {
    const { reading } = await apiFetch('/readings/generate', {
      method: 'POST',
      auth: true,
      body: { tipoLectura: form.tipoLectura.value },
    });
    resultBox.innerHTML = mdToHtml(reading.respuesta);
    resultBox.hidden = false;
  } catch (err) {
    setMsg('readingMsg', err.message, 'error');
  } finally {
    await esperarMinimo(_t0);
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------
// Historial de lecturas (bajo demanda: solo se pide si el usuario lo abre)
// ---------------------------------------------------------------
let historialCargado = false;

async function cargarHistorial() {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');
  try {
    const { historial } = await apiFetch('/readings/history', { auth: true });
    list.innerHTML = '';
    if (!historial || historial.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    historial.forEach(item => {
      const li = document.createElement('li');
      const fecha = item.fecha ? new Date(item.fecha).toLocaleDateString() : '';
      li.innerHTML = `
        <span class="h-type">${item.tipoLectura}</span>
        <span class="h-date">${fecha}</span>
        <div class="h-body">${mdToHtml(item.respuesta)}</div>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    empty.hidden = false;
    empty.textContent = err.message;
  }
}

document.getElementById('btnHistorial').addEventListener('click', async (e) => {
  const btn = e.target;
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');
  const abierto = !list.hidden;

  if (abierto) {
    list.hidden = true;
    empty.hidden = true;
    btn.textContent = 'Ver historial';
    return;
  }

  btn.textContent = 'Ocultar historial';
  list.hidden = false;
  if (!historialCargado) {
    setLoading(btn, true, 'GET');
    const _t0 = Date.now();
    await cargarHistorial();
    await esperarMinimo(_t0);
    setLoading(btn, false, 'GET');
    historialCargado = true;
    btn.textContent = 'Ocultar historial';
  }
});

// ---------------------------------------------------------------
// Compatibilidad
// ---------------------------------------------------------------
document.getElementById('compatForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const resultBox = document.getElementById('compatResult');
  setMsg('compatMsg', '');
  resultBox.hidden = true;
  setLoading(btn, true);
  const _t0 = Date.now();
  try {
    const { match } = await apiFetch('/compatibility/check', {
      method: 'POST',
      auth: true,
      body: { otroUsuarioId: form.otroUsuarioId.value },
    });
    resultBox.innerHTML = `<p><span class="score">${match.puntaje}/100</span></p>` + mdToHtml(match.interpretacion);
    resultBox.hidden = false;
  } catch (err) {
    setMsg('compatMsg', err.message, 'error');
  } finally {
    await esperarMinimo(_t0);
    setLoading(btn, false);
  }
});

// ---------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------
if (state.token && state.usuario) {
  showDashboard();
} else {
  showAuth();
}