// DriveSync — Google Maps Routes API + Supabase + interações da página

// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================
const SUPABASE_URL = 'https://onlrchzlsmkcjqifjqzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HUSgQqOJezDAW5u7ruQdgQ_SksTDXND';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================
const form = document.getElementById('traffic-form');
const inputRua = document.getElementById('endereco');
const botao = form.querySelector('button');
const statusAnalise = document.getElementById('form-status');

form.addEventListener('submit', buscarTransito);

// ==========================================
// GOOGLE MAPS + CÁLCULOS + SUPABASE
// ==========================================
async function buscarTransito(event) {
  event.preventDefault();

  const rua = inputRua.value.trim();
  if (!rua) {
    statusAnalise.textContent = 'INFORME UM EIXO OU CRUZAMENTO PARA CONTINUAR.';
    inputRua.focus();
    return;
  }

  const textoOriginal = botao.innerHTML;
  botao.innerHTML = 'Calculando rota...';
  botao.disabled = true;
  statusAnalise.textContent = `CONSULTANDO GOOGLE MAPS: ${rua.toUpperCase()}`;

  try {
    // A chave do Google Maps fica protegida nas variáveis de ambiente da Netlify.
    const url = `/.netlify/functions/maps?rua=${encodeURIComponent(rua)}`;
    const resposta = await fetch(url);

    let resultadoMaps;
    try {
      resultadoMaps = await resposta.json();
    } catch {
      throw new Error('A função do servidor retornou uma resposta inválida.');
    }

    if (!resposta.ok) {
      throw new Error(resultadoMaps.error || `Erro na consulta ao Google Maps (${resposta.status}).`);
    }

    if (!Array.isArray(resultadoMaps.routes) || resultadoMaps.routes.length === 0) {
      throw new Error('O Google Maps não encontrou uma rota para esse endereço.');
    }

    const rota = resultadoMaps.routes[0];
    const duracaoSegundos = parseDuration(rota.duration);
    const duracaoSemTransito = parseDuration(rota.staticDuration);
    const distanciaMetros = Number(rota.distanceMeters);

    if (!Number.isFinite(duracaoSegundos) || duracaoSegundos <= 0 ||
        !Number.isFinite(distanciaMetros) || distanciaMetros <= 0) {
      throw new Error('O Google Maps não retornou duração ou distância válidas.');
    }

    // Velocidade média estimada para a rota: distância / duração.
    const velocidadeKmH = (distanciaMetros / duracaoSegundos) * 3.6;
    const velocidadeReal = `${Math.round(velocidadeKmH)} km/h`;

    // Diferença entre duração com trânsito e duração-base informada pela Routes API.
    // Não é uma medição de fila em um cruzamento específico.
    const atrasoSegundos = Number.isFinite(duracaoSemTransito)
      ? Math.max(0, duracaoSegundos - duracaoSemTransito)
      : 0;
    const atrasoFormatado = `${Math.round(atrasoSegundos)} s`;

    // Heurística demonstrativa, não é a execução de um algoritmo genético treinado.
    const tempoVerdeOtimizado = Math.min(
      Math.max(Math.round(duracaoSegundos * 0.15), 30),
      120
    );
    const tempoVerdeFormatado = `${tempoVerdeOtimizado} s`;

    const statusFluxo = atrasoSegundos > 300
      ? 'Congestionamento Crítico'
      : atrasoSegundos > 60
        ? 'Lentidão Moderada'
        : 'Fluindo';

    // Usa coordenadas da origem quando a Routes API as disponibiliza.
    // Se não vierem, grava null em vez de inventar coordenadas para a via pesquisada.
    const origem = rota.legs?.[0]?.startLocation?.latLng;
    const coordenadasLocal = origem
      ? `${origem.latitude}, ${origem.longitude}`
      : null;

    window.lastTraffic = { rua, atrasoSegundos, duracaoSegundos, duracaoSemTransito, distanciaMetros, velocidadeKmH, tempoVerdeOtimizado };
    updateIncident();
    // Atualiza a interface somente depois de validar a resposta da API.
    document.getElementById('val-velocidade').innerHTML =
      `${Math.round(velocidadeKmH)}<small> km/h</small>`;
    document.getElementById('val-atraso').innerHTML =
      `${Math.round(atrasoSegundos)}<small> seg</small>`;
    document.getElementById('val-tempo-verde').innerHTML =
      `${tempoVerdeOtimizado}<small> s</small>`;

    statusAnalise.textContent = 'ROTA CALCULADA. REGISTRANDO TELEMETRIA NO BANCO...';

    // Grava os dados retornados/calculados na tabela "telemetria".
    const { error: erroSupabase } = await supabaseClient
      .from('telemetria')
      .insert([{
        rua,
        velocidade: velocidadeReal,
        atraso: atrasoFormatado,
        tempo_verde_ja: tempoVerdeFormatado,
        fluxo_status: statusFluxo,
        coordenadas: coordenadasLocal
      }]);

    if (erroSupabase) {
      console.error('Erro ao registrar no Supabase:', erroSupabase);
      statusAnalise.textContent =
        'ROTA CALCULADA, MAS NÃO FOI POSSÍVEL SALVAR A TELEMETRIA. VERIFIQUE AS POLÍTICAS RLS.';
      return;
    }

    statusAnalise.textContent =
      `ROTA CALCULADA E TELEMETRIA SALVA: ${rua.toUpperCase()}`;
    loadDashboard();
    console.info('Telemetria real da Routes API salva no Supabase.', {
      rua,
      distanciaMetros,
      duracaoSegundos,
      atrasoSegundos,
      velocidadeReal
    });

  } catch (error) {
    console.error('Erro na integração Google Maps/Supabase:', error);
    statusAnalise.textContent = error.message || 'FALHA AO PROCESSAR OS DADOS DE TRÁFEGO.';
  } finally {
    botao.innerHTML = textoOriginal;
    botao.disabled = false;
  }
}

// A Routes API retorna duração como string com sufixo "s", por exemplo "340s".
function parseDuration(valor) {
  if (typeof valor !== 'string') return NaN;
  return Number.parseFloat(valor.replace(/s$/, ''));
}

// ==========================================
// INTERAÇÕES VISUAIS
// ==========================================

// Header compacto durante a rolagem.
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// Menu mobile.
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const aberto = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(aberto));
  menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

// Animações de entrada conforme as seções aparecem na tela.
const elementos = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach(elemento => observador.observe(elemento));
} else {
  elementos.forEach(elemento => elemento.classList.add('visible'));
}

// Painel analítico: dados históricos existentes no Supabase, sem inventar resultados.
let dashboardRows = [];
const $ = id => document.getElementById(id);
const numberFromText = value => {
  if (typeof value === 'number') return value;
  const match = String(value ?? '').replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
};
const average = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : NaN;
const fmt = (n, digits=0) => Number.isFinite(n) ? n.toLocaleString('pt-BR',{maximumFractionDigits:digits}) : '—';
const escapeHtml = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function filteredRows(){
  const start=Date.now()-Number($('period-filter').value)*3600000;
  const street=$('street-filter').value;
  return dashboardRows.filter(r => new Date(r.created_at).getTime()>=start && (!street || r.rua===street));
}
async function loadDashboard(){
  $('analytics-status').textContent='Consultando histórico do Supabase...';
  const {data,error}=await supabaseClient.from('telemetria')
    .select('id,rua,velocidade,atraso,tempo_verde_ja,created_at,coordenadas,fluxo_status')
    .order('created_at',{ascending:false}).limit(1000);
  if(error){$('analytics-status').textContent='Não foi possível ler a telemetria. Verifique permissões SELECT/RLS e os nomes das colunas.';console.error(error);return;}
  dashboardRows=data||[];
  const selected=$('street-filter').value;
  const streets=[...new Set(dashboardRows.map(r=>r.rua).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  $('street-filter').replaceChildren(new Option('Todas as vias',''),...streets.map(v=>new Option(v,v)));
  if(streets.includes(selected))$('street-filter').value=selected;
  $('analytics-status').textContent=`${dashboardRows.length} registros carregados (máximo de 1.000 consultas recentes).`;
  renderDashboard();
}
function renderDashboard(){
  const rows=filteredRows();
  const speeds=rows.map(r=>numberFromText(r.velocidade)).filter(Number.isFinite);
  const delays=rows.map(r=>numberFromText(r.atraso)).filter(Number.isFinite);
  $('kpi-count').textContent=fmt(rows.length);
  $('kpi-speed').textContent=fmt(average(speeds),1);
  $('kpi-delay').textContent=fmt(average(delays),1);
  $('kpi-improvement').textContent=delays.length ? `${$('scenario-slider').value}%` : '—';
  const groups=new Map();
  rows.forEach(r=>{const delay=numberFromText(r.atraso);if(!r.rua||!Number.isFinite(delay))return;
    if(!groups.has(r.rua))groups.set(r.rua,[]);groups.get(r.rua).push(delay);
  });
  const ranked=[...groups].map(([name,values])=>({name,value:average(values)})).sort((a,b)=>b.value-a.value).slice(0,6);
  renderBars('street-bars',ranked,' s');
  const base=average(delays),percent=Number($('scenario-slider').value),after=base*(1-percent/100);
  $('scenario-label').textContent=percent+'%';
  renderBars('comparison-bars',Number.isFinite(base)?[{name:'Atual · atraso estimado da rota',value:base},{name:'Cenário hipotético DriveSync',value:after,alt:true}]:[],' s');
  $('comparison-note').textContent=Number.isFinite(base)?`Cenário: ${fmt(base,1)} s → ${fmt(after,1)} s (redução hipotética de ${percent}%). Não representa efeito medido em campo.`:'Sem medições suficientes para comparar.';
  drawHistory(rows);
}
function renderBars(id,items,suffix){
  const target=$(id);target.replaceChildren();
  if(!items.length){target.textContent='Sem dados para o período selecionado.';return;}
  const max=Math.max(...items.map(x=>x.value),1);
  for(const item of items){
    const wrapper=document.createElement('div');
    const heading=document.createElement('div');heading.className='bar-title';
    const label=document.createElement('span');label.textContent=item.name;
    const value=document.createElement('strong');value.textContent=fmt(item.value,1)+suffix;
    heading.append(label,value);
    const track=document.createElement('div');track.className='bar-track';
    const fill=document.createElement('div');fill.className='bar-fill'+(item.alt?' alt':'');fill.style.width=`${Math.max(0,Math.min(100,item.value/max*100))}%`;
    track.append(fill);wrapper.append(heading,track);target.append(wrapper);
  }
}
function drawHistory(rows){
  const canvas=$('history-chart'),ctx=canvas.getContext('2d');
  const width=Math.max(320,canvas.getBoundingClientRect().width),height=260,dpr=window.devicePixelRatio||1;
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.scale(dpr,dpr);ctx.clearRect(0,0,width,height);
  const points=rows.slice().reverse().filter(r=>Number.isFinite(numberFromText(r.velocidade))&&Number.isFinite(numberFromText(r.atraso))).slice(-70);
  ctx.font='12px sans-serif';
  if(!points.length){ctx.fillStyle='#999';ctx.fillText('Sem medições para exibir.',20,125);return;}
  const pad=28,graphW=width-pad*2,graphH=height-55;
  ctx.strokeStyle='#353a3a';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=20+graphH*i/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(width-pad,y);ctx.stroke();}
  const series=[{key:'velocidade',color:'#f46b70'},{key:'atraso',color:'#8cb7da'}];
  series.forEach(({key,color})=>{
    const vals=points.map(r=>numberFromText(r[key]));const max=Math.max(1,...vals);
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    vals.forEach((v,i)=>{const x=pad+(points.length===1?graphW/2:i*graphW/(points.length-1));const y=20+graphH*(1-v/max);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();
  });
  ctx.fillStyle='#999';ctx.fillText('Mais antigo',pad,height-10);ctx.fillText('Mais recente',width-pad-80,height-10);
}
function updateIncident(){
  const traffic=window.lastTraffic,kind=$('incident-select').value;
  if(!traffic){$('incident-result').textContent='Consulte uma rota para gerar a recomendação.';return;}
  const baseline=traffic.tempoVerdeOtimizado;
  const factors={normal:1,heavy:1.25,accident:1.4,blocked:0};
  const proposed=kind==='blocked'?0:Math.min(120,Math.max(20,Math.round(baseline*factors[kind])));
  const descriptions={normal:'Manter a distribuição calculada pela heurística.',heavy:'Priorizar temporariamente a aproximação congestionada; verificar impacto nas vias transversais.',accident:'Priorizar corredor alternativo após confirmação do incidente por operador.',blocked:'Não liberar fluxo para a aproximação bloqueada; exigir confirmação operacional e redirecionamento.'};
  $('incident-result').textContent=`${descriptions[kind]} Tempo verde demonstrativo: ${proposed} s (base: ${baseline} s). Não envia comandos a semáforos físicos.`;
}
$('period-filter').addEventListener('change',renderDashboard);
$('street-filter').addEventListener('change',renderDashboard);
$('scenario-slider').addEventListener('input',renderDashboard);
$('incident-select').addEventListener('change',updateIncident);
$('refresh-dashboard').addEventListener('click',loadDashboard);
window.addEventListener('resize',()=>drawHistory(filteredRows()));
loadDashboard();
