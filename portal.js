// portal.js — SIO/PF Dashboard v4.7.2

// ===== RELÓGIO EM TEMPO REAL =====
function atualizarRelogio() {
    const el = document.getElementById('relogio');
    if (!el) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
atualizarRelogio();
setInterval(atualizarRelogio, 1000);

// ===== SESSION CHECK =====
(function() {
    const loggedIn = sessionStorage.getItem('pf_login');
    if (!loggedIn) {
        window.location.href = 'index.html';
        return;
    }
})();

// ===== USER BADGE =====
(function() {
    const nome = sessionStorage.getItem('pf_usuario') || 'Agente João S.';
    const badge = document.querySelector('.user-badge');
    if (badge) badge.textContent = nome + ' — Sessão Ativa';
})();

// ===== NOTIFICATION SYSTEM =====
function showNotification(msg, type) {
    type = type || 'info';
    const colors = { info: '#1565c0', success: '#0f8a47', warning: '#c77d10', error: '#c62828' };
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;padding:14px 22px;border-radius:10px;color:#fff;font-family:Inter,sans-serif;font-size:.88rem;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.18);opacity:0;transform:translateX(40px);transition:all .4s cubic-bezier(.4,0,.2,1);max-width:380px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);';
    n.style.background = colors[type];
    n.textContent = icons[type] + ' ' + msg;
    document.body.appendChild(n);
    requestAnimationFrame(() => { n.style.opacity = '1'; n.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        n.style.opacity = '0'; n.style.transform = 'translateX(40px)';
        setTimeout(() => n.remove(), 400);
    }, 3500);
}

// ===== NAVEGAÇÃO ENTRE ABAS =====
const navLinks = document.querySelectorAll('.dash-nav a');
const allSections = document.querySelectorAll('.dash-main > section');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-section');
        if (!targetId) return;

        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Fade out current section, then show new one
        const currentVisible = Array.from(allSections).find(s => s.style.display !== 'none');
        if (currentVisible) {
            currentVisible.style.opacity = '0';
            currentVisible.style.transform = 'translateY(8px)';
            setTimeout(() => {
                allSections.forEach(sec => {
                    sec.style.display = 'none';
                    sec.classList.remove('fade-in');
                    sec.style.opacity = '';
                    sec.style.transform = '';
                });
                const target = document.getElementById(targetId);
                if (target) {
                    target.style.display = 'block';
                    target.style.opacity = '0';
                    target.style.transform = 'translateY(8px)';
                    setTimeout(() => {
                        target.style.transition = 'opacity .35s ease, transform .35s ease';
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';
                        target.classList.add('fade-in');
                    }, 20);
                }
                // Arquivos: mostrar login se não autenticado
                if (targetId === 'arquivos-section' && !arquivosAutenticado) {
                    document.getElementById('arquivos-login-container').style.display = 'block';
                    document.getElementById('arquivos-conteudo').style.display = 'none';
                }
            }, 180);
        } else {
            const target = document.getElementById(targetId);
            if (target) {
                target.style.display = 'block';
                setTimeout(() => target.classList.add('fade-in'), 10);
            }
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== ARQUIVOS — LOGIN DE SEGUNDO NÍVEL =====
let arquivosAutenticado = false;
const arquivosForm = document.getElementById('arquivos-login-form');
const arquivosError = document.getElementById('arquivos-login-error');

// Credencial ÚNICA para arquivos classificados
const ARQUIVO_USER = 'omega';
const ARQUIVO_PASS = 'BlackSun#29';

// ===== CONTEÚDO DOS ARQUIVOS CLASSIFICADOS =====
function renderArquivos() {
    const conteudo = document.getElementById('arquivos-conteudo');
    conteudo.innerHTML = `
        <div class="arquivos-granted">
            <div class="granted-banner">
                <span class="granted-icon">✅</span>
                <div>
                    <strong>ACESSO DE CÓDIGO 2 CONCEDIDO</strong>
                    <p>Autenticação de segundo nível verificada. Arquivos classificados liberados para visualização.</p>
                </div>
            </div>
        </div>

        <div class="arquivos-grid">

            <!-- ARQUIVO 1: CORRIDA DO EXPURGO -->
            <div class="arquivo-card arquivo-vermelho" id="card-expurgo">
                <div class="arquivo-header">
                    <span class="arquivo-classificacao">ULTRA SECRETO</span>
                    <span class="arquivo-codigo">ARQ-0029-EXP</span>
                </div>
                <div class="arquivo-icon">📁</div>
                <h3>Corrida do Expurgo</h3>
                <p class="arquivo-desc">Dossiê completo — Operação de extermínio sob fachada de evento automobilístico</p>
                <div class="arquivo-meta">
                    <span>📅 Atualizado: 23/02/2026</span>
                    <span>📄 47 páginas</span>
                </div>
                <button class="btn-abrir-arquivo" onclick="abrirArquivo('expurgo')">ABRIR ARQUIVO</button>
            </div>

            <!-- ARQUIVO 2: RYAN MELNICK -->
            <div class="arquivo-card arquivo-amarelo" id="card-melnick">
                <div class="arquivo-header">
                    <span class="arquivo-classificacao">CONFIDENCIAL</span>
                    <span class="arquivo-codigo">ARQ-0029-RM</span>
                </div>
                <div class="arquivo-icon">👤</div>
                <h3>Dossiê: Ryan Melnick</h3>
                <p class="arquivo-desc">Procedimentos e diretrizes operacionais referentes ao indivíduo Ryan Melnick</p>
                <div class="arquivo-meta">
                    <span>📅 Atualizado: 22/02/2026</span>
                    <span>📄 12 páginas</span>
                </div>
                <button class="btn-abrir-arquivo" onclick="abrirArquivo('melnick')">ABRIR ARQUIVO</button>
            </div>

            <!-- ARQUIVO 3: CAPITÃO KANNI MANM -->
            <div class="arquivo-card arquivo-vermelho" id="card-kanni">
                <div class="arquivo-header">
                    <span class="arquivo-classificacao">ULTRA SECRETO</span>
                    <span class="arquivo-codigo">ARQ-0041-KM</span>
                </div>
                <div class="arquivo-icon">💀</div>
                <h3>Dossiê: Capitão Kanni Manm</h3>
                <p class="arquivo-desc">Último membro vivo associado às Máscaras com posto de Capitão. Responsável pela eliminação de 700+ agentes.</p>
                <div class="arquivo-meta">
                    <span>📅 Atualizado: 24/02/2026</span>
                    <span>📄 31 páginas</span>
                </div>
                <button class="btn-abrir-arquivo" onclick="abrirArquivo('kanni')">ABRIR ARQUIVO</button>
            </div>

            <!-- ARQUIVO 4: O TODO PODEROSO -->
            <div class="arquivo-card arquivo-vermelho" id="card-todopoderoso">
                <div class="arquivo-header">
                    <span class="arquivo-classificacao">ULTRA SECRETO — ÔMEGA</span>
                    <span class="arquivo-codigo">ARQ-0000-TP</span>
                </div>
                <div class="arquivo-icon">👁️</div>
                <h3>Dossiê: O Todo Poderoso</h3>
                <p class="arquivo-desc">Compilação de registros, vestígios e interceptações referentes à entidade ou indivíduo não identificado designado "O Todo Poderoso".</p>
                <div class="arquivo-meta">
                    <span>📅 Atualizado: 25/02/2026</span>
                    <span>📄 54 páginas</span>
                </div>
                <button class="btn-abrir-arquivo" onclick="abrirArquivo('todopoderoso')">ABRIR ARQUIVO</button>
            </div>

            <!-- ARQUIVO 5: GEPETTO'S FILES -->
            <div class="arquivo-card arquivo-preto" id="card-gepetto">
                <div class="arquivo-header">
                    <span class="arquivo-classificacao classificacao-preto">CÓDIGO 3 — RESTRITO</span>
                    <span class="arquivo-codigo">ARQ-GPTT-000</span>
                </div>
                <div class="arquivo-icon">🔒</div>
                <h3>Gepetto's Files</h3>
                <p class="arquivo-desc">Conteúdo classificado. Acesso limitado a portadores de credencial Código 3.</p>
                <div class="arquivo-meta">
                    <span>📅 ???</span>
                    <span>📄 ??? páginas</span>
                </div>
                <button class="btn-abrir-arquivo btn-bloqueado" onclick="abrirArquivo('gepetto')">ABRIR ARQUIVO</button>
            </div>

        </div>

        <!-- VIEWER DE ARQUIVO -->
        <div id="arquivo-viewer" class="arquivo-viewer" style="display:none;">
            <div class="viewer-toolbar">
                <span id="viewer-titulo"></span>
                <button class="btn-fechar-viewer" onclick="fecharViewer()">✕ FECHAR</button>
            </div>
            <div id="viewer-conteudo" class="viewer-body"></div>
        </div>
    `;
}

// ===== CONTEÚDO DE CADA ARQUIVO =====
const arquivosData = {
    expurgo: {
        titulo: 'ARQ-0029-EXP — CORRIDA DO EXPURGO — DOSSIÊ COMPLETO',
        conteudo: `
            <div class="doc-header-stamp">
                <div class="stamp stamp-ultra">ULTRA SECRETO</div>
                <div class="stamp stamp-warn">NÃO COPIAR — NÃO DISTRIBUIR</div>
            </div>

            <div class="doc-section">
                <h3>1. IDENTIFICAÇÃO DO EVENTO</h3>
                <table class="doc-table">
                    <tr><td><strong>Nome do Evento</strong></td><td>Corrida do Expurgo (nome interno: "PURGE RUN")</td></tr>
                    <tr><td><strong>Data Prevista</strong></td><td>29 de Fevereiro de 2026</td></tr>
                    <tr><td><strong>Localização</strong></td><td>Circuito fechado — Rodovia MC-7, trecho Km 42 a Km 189 (construído pela Melnick Corp.)</td></tr>
                    <tr><td><strong>Fachada</strong></td><td>Evento automobilístico de resistência — patrocinado pela Melnick Enterprises</td></tr>
                    <tr><td><strong>Natureza Real</strong></td><td>Operação de extermínio em massa disfarçada de corrida</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>2. ENVOLVIMENTO DA MELNICK ENTERPRISES</h3>
                <p>A Melnick Enterprises, conglomerado multinacional controlado pela família Melnick, é a responsável direta pela concepção, financiamento e construção da infraestrutura rodoviária utilizada no evento denominado "Corrida do Expurgo".</p>
                <p>Evidências coletadas pela equipe de inteligência indicam que a empresa obteve aprovação governamental para construção da rodovia MC-7 sob o pretexto de desenvolvimento regional. Na realidade, o trecho foi projetado especificamente para o evento, contendo:</p>
                <ul class="doc-list">
                    <li>Barreiras retrátreis com mecanismos de ativação remota</li>
                    <li>Sistemas de detonação embutidos no asfalto em 23 pontos estratégicos</li>
                    <li>Torres de vigilância camufladas como postes de iluminação com armamento automático</li>
                    <li>Saídas bloqueadas eletronicamente — impedindo evacuação dos participantes</li>
                    <li>Sistemas de comunicação com bloqueio de sinal em raio de 15 km</li>
                </ul>
                <p>A construção envolveu mais de 2.000 trabalhadores, dos quais a maioria desconhece a verdadeira finalidade da obra. Engenheiros-chefe foram selecionados pessoalmente por Ryan Melnick.</p>
            </div>

            <div class="doc-section">
                <h3>3. O GENOCÍDIO COMO TRIBUTO</h3>
                <p>Inteligência interceptada revela que a "Corrida do Expurgo" funciona como um <strong>ritual de tributo</strong>. Os participantes — recrutados sob promessa de premiação milionária — são na verdade vítimas designadas. Fontes indicam que o evento é uma tradição secreta mantida por um grupo interno à corporação Melnick, repetida em diferentes países ao longo das últimas duas décadas.</p>
                <p>Estimativa de vítimas previstas para o evento de 29/02/2026: <strong>entre 200 e 350 pessoas</strong>.</p>
                <p>Perfil das vítimas: civis de classes econômicas baixas, recrutados através de programas falsos de auxílio social ou competições esportivas. Nenhuma vítima é informada sobre a natureza real do evento.</p>
                <p><strong>Método de execução:</strong> combinação de armadilhas mecânicas na pista, armamento automatizado e agentes armados posicionados ao longo do percurso.</p>
            </div>

            <div class="doc-section">
                <h3>4. ASSASSINATO DE AGENTES FEDERAIS BRASILEIROS</h3>
                <div class="doc-alert doc-alert-red">
                    <strong>ATENÇÃO:</strong> Este trecho contém informações sobre assassinato de servidores públicos federais em exercício.
                </div>
                <p>Durante investigação preliminar conduzida em sigilo pela Divisão de Inteligência da Polícia Federal (DINTL), três agentes federais brasileiros que haviam obtido informações sobre a "Corrida do Expurgo" foram assassinados:</p>
                <table class="doc-table">
                    <tr><th>Agente</th><th>Matrícula</th><th>Data do Óbito</th><th>Circunstância</th></tr>
                    <tr><td>Agente Rafael Teodoro Neves</td><td>61284</td><td>04/01/2026</td><td>Encontrado morto em residência. Causa oficial: "infarto". Laudo independente indica envenenamento por composto organofosforado.</td></tr>
                    <tr><td>Agente Luciana de Almeida Borges</td><td>59103</td><td>11/01/2026</td><td>Acidente automobilístico na BR-040. Perícia detectou adulteração no sistema de freios do veículo oficial. Caso arquivado pela autoridade local.</td></tr>
                    <tr><td>Agente Fernando Siqueira Ramos</td><td>63447</td><td>19/01/2026</td><td>Desaparecido durante diligência em Goiânia. Corpo encontrado em área rural 9 dias depois. Sinais de tortura e execução.</td></tr>
                </table>
                <p>Os três agentes pertenciam à mesma célula de investigação e possuíam cópias parciais do dossiê que agora está consolidado neste documento. Todas as evidências apontam para execução ordenada pela Melnick Enterprises com apoio logístico externo.</p>
            </div>

            <div class="doc-section">
                <h3>5. ENVOLVIMENTO DA CIA</h3>
                <p>Documentos obtidos por meio de fonte confidencial (codinome "MERIDIANO") revelam envolvimento direto da <strong>Central Intelligence Agency (CIA)</strong> no acobertamento e facilitação do evento:</p>
                <ul class="doc-list">
                    <li><strong>Suporte logístico:</strong> A CIA forneceu equipamentos de bloqueio de comunicação e tecnologia de vigilância para o circuito MC-7.</li>
                    <li><strong>Proteção diplomática:</strong> Agentes da CIA garantiram que nenhum alerta chegasse a órgãos internacionais como Interpol ou ONU.</li>
                    <li><strong>Eliminação de testemunhas:</strong> Há fortes indícios de que a eliminação dos 3 agentes brasileiros foi conduzida ou coordenada por operadores da CIA posicionados em território brasileiro sob cobertura diplomática.</li>
                    <li><strong>Financiamento oculto:</strong> Transferências bancárias rastreadas ligam contas offshore associadas à CIA ao fundo operacional da Corrida do Expurgo.</li>
                    <li><strong>Contato interno:</strong> Um oficial da CIA identificado como "VIPER" atua como intermediário entre a agência e Ryan Melnick. Identidade real ainda não confirmada.</li>
                </ul>
            </div>

            <div class="doc-section">
                <h3>6. STATUS DA INVESTIGAÇÃO</h3>
                <table class="doc-table">
                    <tr><td><strong>Status</strong></td><td class="status-red">ATIVO — RISCO EXTREMO</td></tr>
                    <tr><td><strong>Classificação</strong></td><td>ULTRA SECRETO — Código 2</td></tr>
                    <tr><td><strong>Equipe designada</strong></td><td>Célula SOMBRA (4 agentes — identidades protegidas)</td></tr>
                    <tr><td><strong>Prazo crítico</strong></td><td>29/02/2026 — Data do evento</td></tr>
                    <tr><td><strong>Recomendação</strong></td><td>Intervenção imediata com apoio militar. Solicitação de mandados federais em caráter urgentíssimo.</td></tr>
                </table>
            </div>

            <div class="doc-footer-stamp">
                DOCUMENTO CLASSIFICADO — POLÍCIA FEDERAL — DINTL<br>
                Distribuição autorizada apenas para portadores de Código 2 ou superior.<br>
                Reprodução proibida sob pena de enquadramento na Lei 13.869/2019.
            </div>
        `
    },
    melnick: {
        titulo: 'ARQ-0029-RM — DOSSIÊ: RYAN MELNICK — PROCEDIMENTOS OPERACIONAIS',
        conteudo: `
            <div class="doc-header-stamp">
                <div class="stamp stamp-conf">CONFIDENCIAL</div>
                <div class="stamp stamp-warn">DISTRIBUIÇÃO CONTROLADA</div>
            </div>

            <div class="doc-section">
                <h3>1. IDENTIFICAÇÃO DO INDIVÍDUO</h3>
                <table class="doc-table">
                    <tr><td><strong>Nome Completo</strong></td><td>Ryan Alexander Melnick</td></tr>
                    <tr><td><strong>Data de Nascimento</strong></td><td>15/08/1989</td></tr>
                    <tr><td><strong>Nacionalidade</strong></td><td>Norte-americana / Cidadania dupla (EUA / Suíça)</td></tr>
                    <tr><td><strong>Cargo</strong></td><td>CEO e Chairman do Conselho da Melnick Enterprises</td></tr>
                    <tr><td><strong>Patrimônio estimado</strong></td><td>US$ 14.7 bilhões (Forbes, 2025)</td></tr>
                    <tr><td><strong>Residências conhecidas</strong></td><td>Nova York (EUA), Zurique (Suíça), São Paulo (Brasil)</td></tr>
                    <tr><td><strong>Status no sistema PF</strong></td><td class="status-yellow">PESSOA DE INTERESSE — INTOCÁVEL</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>2. DIRETRIZ DE PROCEDIMENTO</h3>
                <div class="doc-alert doc-alert-yellow">
                    <strong>DIRETRIZ OPERACIONAL Nº 0029/2026 — CARÁTER OBRIGATÓRIO</strong>
                </div>
                <p>O indivíduo Ryan Alexander Melnick está <strong>AUTORIZADO</strong> a participar do evento denominado "Corrida do Expurgo" na data de 29/02/2026, conforme determinação recebida por via diplomática e referendada pela Diretoria-Geral da Polícia Federal sob pressão do Gabinete de Segurança Institucional.</p>
                
                <p><strong>As seguintes diretrizes são de cumprimento OBRIGATÓRIO por todo o efetivo que tiver qualquer contato operacional com Ryan Melnick:</strong></p>
                
                <ol class="doc-list-numbered">
                    <li>Ryan Melnick <strong>NÃO DEVERÁ SER FERIDO</strong> sob nenhuma circunstância, independentemente de suas ações durante o evento.</li>
                    <li>Nenhum mandado de prisão, busca ou apreensão poderá ser cumprido contra Ryan Melnick sem autorização expressa e por escrito do Diretor-Geral da PF.</li>
                    <li>Qualquer contato visual, físico ou comunicacional com Ryan Melnick deverá ser reportado em até 30 minutos à central DINTL.</li>
                    <li>A escolta pessoal de Ryan Melnick (mínimo 8 agentes armados privados) não deve ser confrontada ou desarmada.</li>
                    <li>Em caso de incidente envolvendo Ryan Melnick, a prioridade é a segurança do indivíduo, não a dos agentes da PF.</li>
                    <li>Qualquer agente que descumprir estas diretrizes será sumariamente afastado e responderá a processo administrativo sigiloso.</li>
                </ol>
            </div>

            <div class="doc-section">
                <h3>3. JUSTIFICATIVA</h3>
                <p>A proteção de Ryan Melnick foi estabelecida como condição para a manutenção de acordos diplomáticos sensíveis entre Brasil e Estados Unidos no âmbito de cooperação em inteligência. A CIA comunicou formalmente que qualquer ação contra Melnick será interpretada como ato hostil, com consequências para operações conjuntas em andamento.</p>
                <p>O Diretor-Geral da PF emitiu a seguinte declaração interna (restrita): <em>"Não concordo com esta diretriz, mas as consequências de descumprimento ultrapassam a esfera policial. Cumpram, registrem, e confiem que o tempo trará justiça."</em></p>
            </div>

            <div class="doc-section">
                <h3>4. IMPORTÂNCIA ESTRATÉGICA</h3>
                <p>Ryan Melnick detém informações críticas sobre redes internacionais de financiamento ilícito, projetos de infraestrutura classificados e acordos com governos estrangeiros. Sua captura ou eliminação desencadearia um protocolo de retaliação ("Dead Man's Switch") que exporia operações sigilosas de múltiplas agências de inteligência.</p>
            </div>

            <div class="doc-section">
                <h3>5. OBSERVAÇÕES FINAIS</h3>
                <p>Este documento não expressa concordância institucional da Polícia Federal com a proteção concedida a Ryan Melnick. Os procedimentos aqui descritos são de natureza obrigatória por força de determinação hierárquica superior e compromissos diplomáticos.</p>
                <p>A equipe investigativa mantém o dossiê aberto e continua coletando evidências para ação futura quando as condições políticas permitirem.</p>
            </div>

            <div class="doc-footer-stamp">
                DOCUMENTO CONFIDENCIAL — POLÍCIA FEDERAL — DINTL<br>
                Procedimentos válidos de 20/02/2026 a 15/03/2026.<br>
                Sujeito a revisão após este período.
            </div>
        `
    },
    kanni: {
        titulo: 'ARQ-0041-KM — DOSSIÊ: CAPITÃO KANNI MANM — AMEAÇA NÍVEL MÁXIMO',
        conteudo: `
            <div class="doc-header-stamp">
                <div class="stamp stamp-ultra">ULTRA SECRETO</div>
                <div class="stamp stamp-warn">LEITURA ÚNICA — DESTRUIR APÓS CONSULTA</div>
            </div>

            <div class="doc-section">
                <h3>1. IDENTIFICAÇÃO DO INDIVÍDUO</h3>
                <table class="doc-table">
                    <tr><td><strong>Codinome / Nome conhecido</strong></td><td>Capitão Kanni Manm</td></tr>
                    <tr><td><strong>Nome civil</strong></td><td>DESCONHECIDO — Nenhum registro civil encontrado em qualquer base de dados nacional ou internacional</td></tr>
                    <tr><td><strong>Posto</strong></td><td>Capitão (hierarquia interna das Máscaras)</td></tr>
                    <tr><td><strong>Filiação</strong></td><td>Associado direto da Magistrada. Membro ativo do grupo denominado "As Máscaras"</td></tr>
                    <tr><td><strong>Status</strong></td><td class="status-red">VIVO — EXTREMAMENTE PERIGOSO</td></tr>
                    <tr><td><strong>Nível de Ameaça</strong></td><td class="status-red">NÍVEL S — ACIMA DE QUALQUER CLASSIFICAÇÃO CONVENCIONAL</td></tr>
                    <tr><td><strong>Localização atual</strong></td><td>DESCONHECIDA</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>2. CONTEXTO — AS MÁSCARAS E A MAGISTRADA</h3>
                <p>O grupo conhecido como <strong>"As Máscaras"</strong> opera sob uma estrutura hierárquica paramilitar liderada por uma figura conhecida apenas como <strong>"A Magistrada"</strong>. A organização utiliza um sistema de postos militares internos e seus membros são identificados por máscaras cerimoniais que indicam sua posição dentro do grupo.</p>
                <p>Kanni Manm é identificado como o <strong>último membro vivo com o posto de Capitão</strong> após os eventos do <strong>Incidente da Verdade</strong>. Sua lealdade à Magistrada permanece absoluta, o que o torna não apenas uma ameaça operacional, mas também o último elo direto ao núcleo original da organização.</p>
                <p>Fontes de inteligência indicam que Kanni Manm possui <strong>capacidades sobre-humanas não catalogadas</strong>, cujas origens e natureza exata permanecem completamente desconhecidas pela Polícia Federal e por qualquer órgão de inteligência aliado.</p>
            </div>

            <div class="doc-section">
                <h3>3. O INCIDENTE DA VERDADE</h3>
                <div class="doc-alert doc-alert-red">
                    <strong>EVENTO CLASSIFICADO COMO NÍVEL ÔMEGA:</strong> As informações a seguir são conhecidas apenas por 7 pessoas no governo brasileiro.
                </div>
                <p>O <strong>Incidente da Verdade</strong> foi um evento interno ao grupo das Máscaras que resultou na desestabilização total de sua estrutura de comando. Os fatos conhecidos são os seguintes:</p>
                <ul class="doc-list">
                    <li>O <strong>Tenente Geru Meell</strong>, membro de confiança das Máscaras, <strong>traiu e destronou a Magistrada</strong>.</li>
                    <li>A traição foi executada sob <strong>ordens diretas de uma entidade ou indivíduo referido como "O Todo Poderoso"</strong>. A identidade real do Todo Poderoso permanece desconhecida — não sabemos se é uma pessoa, uma organização ou algo além.</li>
                    <li>O destronamento da Magistrada desencadeou uma reação em cadeia dentro do grupo, resultando na eliminação interna de vários membros com postos elevados.</li>
                    <li>Kanni Manm <strong>sobreviveu ao Incidente da Verdade</strong>, sendo atualmente o único Capitão vivo. Não se sabe se sua sobrevivência foi intencional (permitida pelo Todo Poderoso) ou se Kanni Manm conseguiu escapar por meios próprios.</li>
                </ul>
                <table class="doc-table">
                    <tr><th>Elemento</th><th>Papel</th><th>Status Atual</th></tr>
                    <tr><td>A Magistrada</td><td>Líder máxima das Máscaras</td><td class="status-red">DESTRONADA — Paradeiro desconhecido</td></tr>
                    <tr><td>Tenente Geru Meell</td><td>Traidor / Executor da ordem do Todo Poderoso</td><td class="status-yellow">DESCONHECIDO</td></tr>
                    <tr><td>Capitão Kanni Manm</td><td>Último Capitão leal à Magistrada</td><td class="status-red">VIVO — EM ATIVIDADE</td></tr>
                    <tr><td>O Todo Poderoso</td><td>Autoridade que ordenou o destronamento</td><td class="status-red">NÃO IDENTIFICADO</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>4. O MASSACRE — ELIMINAÇÃO DE 700+ AGENTES</h3>
                <div class="doc-alert doc-alert-red">
                    <strong>⚠️ PERDA CATASTRÓFICA DE EFETIVO:</strong> Este é o maior evento de baixas na história das forças de segurança brasileiras.
                </div>
                <p>Após o Incidente da Verdade, o Presidente <strong>Messias Nato</strong> emitiu ordens diretas para a eliminação do indivíduo codinome <strong>"Cáligo"</strong> e de todos os membros do chamado <strong>"Grupo do Mascarado"</strong>. Uma operação conjunta de larga escala foi mobilizada envolvendo:</p>
                <ul class="doc-list">
                    <li>Efetivo do Exército Brasileiro — aproximadamente 400 militares</li>
                    <li>BOPE (Batalhão de Operações Policiais Especiais) — 2 companhias completas</li>
                    <li>Polícia Federal — 3 equipes táticas da DINTL</li>
                    <li>Apoio de unidades de inteligência e forças especiais não nomeadas</li>
                </ul>
                <p><strong>O resultado foi uma aniquilação total das forças atacantes.</strong></p>
                <p>O Capitão Kanni Manm, utilizando o que fontes internas descrevem apenas como <strong>"seus poderes"</strong>, <strong>eliminou mais de 700 militares, agentes do BOPE e policiais federais</strong>. A operação inteira foi destruída em um intervalo de tempo que fontes estimam entre <strong>4 e 11 minutos</strong>.</p>

                <table class="doc-table">
                    <tr><th>Força</th><th>Efetivo Enviado</th><th>Sobreviventes</th><th>% de Perda</th></tr>
                    <tr><td>Exército Brasileiro</td><td>~400</td><td class="status-red">0</td><td class="status-red">100%</td></tr>
                    <tr><td>BOPE</td><td>~180</td><td class="status-red">0</td><td class="status-red">100%</td></tr>
                    <tr><td>Polícia Federal (equipes táticas)</td><td>~120</td><td class="status-red">0</td><td class="status-red">100%</td></tr>
                    <tr><td>Outras unidades</td><td>~40</td><td class="status-red">0</td><td class="status-red">100%</td></tr>
                    <tr><td><strong>TOTAL</strong></td><td><strong>~740</strong></td><td class="status-red"><strong>0</strong></td><td class="status-red"><strong>100%</strong></td></tr>
                </table>

                <p><strong>Nenhum sobrevivente.</strong> Não há um único relato presencial sobre os poderes de Kanni Manm. Todo o conhecimento sobre o evento foi reconstituído a partir de imagens de satélite fragmentadas, interceptações de comunicação anteriores ao bloqueio de sinal, e análise forense dos locais após o evento.</p>
            </div>

            <div class="doc-section">
                <h3>5. NATUREZA DOS PODERES</h3>
                <p>A natureza das capacidades de Kanni Manm é <strong>completamente desconhecida</strong>. Não existem sobreviventes, gravações funcionais ou qualquer evidência direta que permita catalogar seus poderes. O que se sabe é derivado exclusivamente de análise indireta:</p>
                <ul class="doc-list">
                    <li>A destruição no local indica forças de magnitude incompatível com qualquer armamento convencional ou experimental conhecido.</li>
                    <li>Não foram encontrados vestígios de explosivos, agentes químicos, biológicos ou radiológicos.</li>
                    <li>Os corpos apresentavam padrões de lesão inconsistentes entre si — alguns por impacto cinético extremo, outros por queimaduras de origem desconhecida, outros por trauma interno sem lesão externa visível.</li>
                    <li>Equipamentos eletrônicos em um raio de 3 km foram completamente inutilizados.</li>
                    <li>Imagens de satélite captadas durante o evento mostram anomalias visuais que a equipe técnica não conseguiu classificar.</li>
                </ul>
                <div class="doc-alert doc-alert-red">
                    <strong>CONCLUSÃO DA PERÍCIA:</strong> "Não possuímos framework científico, militar ou de inteligência capaz de explicar o que ocorreu naquele local. Recomendamos que este indivíduo seja tratado como uma ameaça existencial." — Relatório DINTL-Sigma nº 041/2026.
                </div>
            </div>

            <div class="doc-section">
                <h3>6. CADEIA DE COMANDO DAS ORDENS DE EXECUÇÃO</h3>
                <p>Informação crítica obtida em 18/02/2026: as ordens de execução contra Cáligo e o Grupo do Mascarado <strong>não partiram originalmente do Presidente Messias Nato</strong>.</p>
                <p>Messias Nato foi o emissor formal das ordens através dos canais militares oficiais. No entanto, inteligência interceptada revela que Nato agiu sob influência — ou coerção — de <strong>O Todo Poderoso</strong>.</p>
                <p>A mesma entidade que ordenou a traição de Geru Meell contra a Magistrada é, portanto, a <strong>verdadeira origem das ordens que resultaram no massacre dos 700+ agentes</strong>. Isso levanta duas hipóteses:</p>
                <ol class="doc-list-numbered">
                    <li><strong>Hipótese A:</strong> O Todo Poderoso sabia das capacidades de Kanni Manm e deliberadamente enviou 700+ agentes para a morte como forma de teste, demonstração de poder ou eliminação de efetivo indesejado.</li>
                    <li><strong>Hipótese B:</strong> O Todo Poderoso subestimou Kanni Manm e o massacre foi uma consequência não prevista, o que significaria que até mesmo o Todo Poderoso possui limites em seu conhecimento.</li>
                </ol>
                <p>Em ambos os cenários, a conclusão é que o governo brasileiro opera, ao menos parcialmente, sob influência de uma entidade não identificada com poder suficiente para manipular o Presidente da República.</p>
            </div>

            <div class="doc-section">
                <h3>7. DIRETRIZES ABSOLUTAS</h3>
                <div class="doc-alert doc-alert-red">
                    <strong>ORDEM DIRETA — VÁLIDA ATÉ REVOGAÇÃO:</strong>
                </div>
                <ol class="doc-list-numbered">
                    <li><strong>NÃO ENGAJAR.</strong> Sob nenhuma circunstância qualquer agente, militar ou operador deve tentar confrontar, capturar ou eliminar o Capitão Kanni Manm.</li>
                    <li><strong>NÃO RASTREAR ATIVAMENTE.</strong> Operações de localização são proibidas. Monitoramento passivo apenas.</li>
                    <li><strong>EVACUAÇÃO IMEDIATA.</strong> Qualquer confirmação de presença de Kanni Manm em um raio de 10 km exige evacuação instantânea de todo o efetivo.</li>
                    <li><strong>NÃO COMUNICAR por canais convencionais.</strong> Toda informação relacionada a Kanni Manm deve ser transmitida exclusivamente por protocolo SOMBRA.</li>
                    <li><strong>Considerar qualquer ordem de engajamento contra Kanni Manm como ILEGÍTIMA</strong>, independentemente de quem a emita — incluindo o Presidente da República.</li>
                </ol>
            </div>

            <div class="doc-section">
                <h3>8. NOTA FINAL DO DIRETOR-GERAL</h3>
                <p><em>"Perdemos 700 homens e mulheres por seguir ordens que não entendíamos, contra um inimigo que não conhecíamos, por razões que não eram nossas. Não repetirei este erro. Nenhum agente sob meu comando será enviado contra Kanni Manm. Se O Todo Poderoso quer eliminá-lo, que envie seus próprios soldados."</em></p>
                <p style="text-align: right; color: #64748b; font-size: 0.85rem;">— Diretor-Geral da Polícia Federal, registro interno, 20/02/2026</p>
            </div>

            <div class="doc-footer-stamp">
                DOCUMENTO ULTRA SECRETO — POLÍCIA FEDERAL — DINTL<br>
                ARQ-0041-KM — Classificação Nível S — Código 2<br>
                Acesso registrado. Distribuição proibida. Violação = crime contra a segurança nacional.
            </div>
        `
    },
    todopoderoso: {
        titulo: 'ARQ-0000-TP — O TODO PODEROSO — COMPILAÇÃO DE INTELIGÊNCIA',
        conteudo: `
            <div class="doc-header-stamp">
                <div class="stamp stamp-ultra">ULTRA SECRETO — ÔMEGA</div>
                <div class="stamp stamp-warn">INFORMAÇÃO COMPARTIMENTALIZADA — NECESSIDADE ABSOLUTA DE CONHECER</div>
            </div>

            <div class="doc-section">
                <h3>1. IDENTIFICAÇÃO</h3>
                <table class="doc-table">
                    <tr><td><strong>Designação</strong></td><td>O Todo Poderoso</td></tr>
                    <tr><td><strong>Nome civil</strong></td><td>DESCONHECIDO</td></tr>
                    <tr><td><strong>Natureza</strong></td><td>DESCONHECIDA — Indivíduo, entidade, organização ou conceito não determinado</td></tr>
                    <tr><td><strong>Primeiros vestígios registrados</strong></td><td>Aproximadamente 1.000 anos atrás (datação indireta)</td></tr>
                    <tr><td><strong>Último registro direto</strong></td><td>~500 anos atrás — após esta data, apenas ordens indiretas</td></tr>
                    <tr><td><strong>Área de atividade</strong></td><td>Continente Americano (Norte, Central e Sul)</td></tr>
                    <tr><td><strong>Status</strong></td><td class="status-red">NÃO IDENTIFICADO — PRESUMIDAMENTE ATIVO</td></tr>
                    <tr><td><strong>Nível de ameaça</strong></td><td class="status-red">INCALCULÁVEL — ALÉM DE QUALQUER MÉTRICA EXISTENTE</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>2. PANORAMA HISTÓRICO</h3>
                <div class="doc-alert doc-alert-yellow">
                    <strong>NOTA:</strong> As informações a seguir foram reconstituídas a partir de registros arqueológicos, interceptações de inteligência, relatos de fontes humanas e análise comparativa de tradições orais de diferentes povos. Nenhuma informação é diretamente verificável.
                </div>
                <p>A designação <strong>"O Todo Poderoso"</strong> refere-se a uma entidade ou indivíduo cuja presença — ou ao menos cuja influência — pode ser rastreada no continente americano por um período estimado de <strong>mais de 1.000 anos</strong>.</p>
                <p>Os rastros de atividade não são contínuos, mas surgem em padrões dispersos ao longo de séculos. Povos indígenas de diferentes regiões, sem contato documentado entre si, fazem referências a uma <strong>mesma figura de autoridade absoluta</strong> utilizando variações linguísticas que, quando traduzidas, convergem invariavelmente para o mesmo conceito: <em>"aquele que tudo pode"</em>, <em>"o soberano eterno"</em>, <em>"a vontade que não morre"</em>.</p>
                <p>As referências aparecem nas seguintes regiões documentadas:</p>
                <table class="doc-table">
                    <tr><th>Região</th><th>Período Aprox.</th><th>Designação Local</th><th>Fonte</th></tr>
                    <tr><td>Altiplano Andino (atual Peru/Bolívia)</td><td>Séc. XI–XIII</td><td>"Tukuy Atiyniyuq" (quéchua: O que possui todo o poder)</td><td>Inscrições em complexo subterrâneo pré-inca</td></tr>
                    <tr><td>Mesoamérica Central (atual Guatemala)</td><td>Séc. XII–XIV</td><td>"Ronojel Uchuk'ab" (maia k'iche': A força total)</td><td>Fragmento cerâmico recuperado em 1987</td></tr>
                    <tr><td>Amazônia Central (atual Brasil)</td><td>Séc. XIII–XV</td><td>"Opab Mbaraete" (tupi antigo: Senhor de toda força)</td><td>Tradição oral registrada por jesuítas no séc. XVII</td></tr>
                    <tr><td>Costa Atlântica (atual Carolina do Sul, EUA)</td><td>Séc. XIV–XV</td><td>"He Who Commands All" (tradução missionária de designação Catawba)</td><td>Diário de missionário anglicano (1738) citando tradições antigas</td></tr>
                    <tr><td>Região de fronteira México/EUA</td><td>Séc. X–XII</td><td>"In Cemithualtin Tlatoani" (náhuatl: O Governante de todas as coisas)</td><td>Códice fragmentário recuperado em escavação, 2011</td></tr>
                </table>
                <p>A consistência semântica entre culturas separadas por milhares de quilômetros e séculos de diferença temporal sugere duas possibilidades: ou houve uma rede de comunicação desconhecida entre esses povos, ou <strong>a mesma entidade interagiu com cada um deles de forma independente</strong>.</p>
            </div>

            <div class="doc-section">
                <h3>3. O DESAPARECIMENTO — HÁ APROXIMADAMENTE 500 ANOS</h3>
                <p>Há aproximadamente <strong>500 anos</strong>, todos os registros diretos de atividade cessam. Nenhuma cultura, povo, ou organização registrou contato direto com "O Todo Poderoso" após esse período. O que permaneceu foram apenas <strong>ordens</strong>.</p>
                <p>A partir desse ponto, a entidade opera exclusivamente através de intermediários. Ordens surgem sob este nome — ou variações dele — em diferentes estados, países, tribos e organizações ao longo dos séculos seguintes, sempre com as seguintes características:</p>
                <ul class="doc-list">
                    <li>As ordens são absolutas — nenhuma fonte registrou qualquer caso de desobediência bem-sucedida.</li>
                    <li>Não existe canal de contato reverso — é impossível enviar mensagens ou respostas ao Todo Poderoso.</li>
                    <li>As ordens chegam por meios variáveis e frequentemente inexplicáveis — mensageiros anônimos, cartas sem remetente, inscrições que aparecem durante a noite, comunicações eletrônicas de origem irrastreável.</li>
                    <li>Cada ordem está associada a consequências catastróficas em caso de descumprimento, embora os mecanismos de enforcement nunca tenham sido documentados.</li>
                    <li>As ordens demonstram um conhecimento impossível de eventos futuros, configurações geopolíticas e posições de indivíduos.</li>
                </ul>
                <div class="doc-alert doc-alert-red">
                    <strong>CONCLUSÃO ANALÍTICA:</strong> O Todo Poderoso não desapareceu — apenas passou a operar exclusivamente de forma indireta. A ausência de registros diretos nos últimos 500 anos não indica inatividade; indica uma mudança deliberada no modelo operacional.
                </div>
            </div>

            <div class="doc-section">
                <h3>4. A PROFECIA DA TRIBO EXTERMINADA</h3>
                <div class="doc-alert doc-alert-red">
                    <strong>⚠️ INFORMAÇÃO OBTIDA EM CAMPO — CLASSIFICAÇÃO MÁXIMA</strong>
                </div>
                <p>Em data recente, o indivíduo ou entidade codinome <strong>"Cáligo"</strong> executou o extermínio completo de uma tribo indígena não catalogada pelo sistema oficial de registro da FUNAI. A tribo, cujo nome era desconhecido até mesmo pelos povos vizinhos, habitava uma região de mata densa em localização classificada.</p>
                <p>Equipes forenses da Polícia Federal que acessaram o local do extermínio durante a investigação dos atos de Cáligo encontraram, nas paredes internas de uma estrutura cerimonial subterrânea, <strong>inscrições em idioma não identificado</strong>. O trabalho de tradução parcial foi conduzido por linguistas do Museu Nacional e do MIT, com os seguintes resultados:</p>
                <table class="doc-table">
                    <tr><th>Inscrição (transliteração)</th><th>Tradução Consensual</th></tr>
                    <tr><td><em>KAH-RUUN TEB-MALAH — OPAR INN SEKH-MOLAH</em></td><td>"O REI RETORNARÁ EM 500 ANOS"</td></tr>
                    <tr><td><em>TEB-MALAH — SARAK EEL INN VOHK</em></td><td>"SEU RETORNO — O FIM DE TODO SILÊNCIO"</td></tr>
                    <tr><td><em>INN OPAB — VOHK NA MIRAAH — SEKH-MOLAH NA TUKAH</em></td><td>"O SENHOR — O SILÊNCIO É SEU ESCUDO — O RETORNO É SEU JULGAMENTO"</td></tr>
                </table>
                <div class="doc-alert doc-alert-yellow">
                    <strong>PROBLEMA CRÍTICO:</strong> A data em que as inscrições foram feitas é completamente desconhecida. Não há como determinar quando a mensagem "o rei retornará em 500 anos" foi escrita. Se foi escrita 500 anos atrás, o retorno seria <strong>agora</strong>. Se foi escrita antes, o retorno pode já ter ocorrido. Se foi escrita depois, pode ainda estar por vir. A ausência de datação faz com que esta profecia seja simultaneamente urgente e indefinida.
                </div>
                <p>Análise de carbono-14 no material orgânico das inscrições retornou resultados <strong>inconclusivos</strong> — os marcadores são incompatíveis com os padrões esperados para qualquer período conhecido, como se o material utilizado não seguisse a taxa de decaimento normal do carbono.</p>
            </div>

            <div class="doc-section">
                <h3>5. CONEXÕES COM EVENTOS CONTEMPORÂNEOS</h3>
                <p>A Divisão de Inteligência identificou conexões diretas entre "O Todo Poderoso" e os seguintes eventos recentes:</p>
                <table class="doc-table">
                    <tr><th>Evento</th><th>Conexão</th><th>Grau de Certeza</th></tr>
                    <tr><td>Incidente da Verdade — Traição de Geru Meell</td><td>Geru Meell agiu sob ordens diretas do Todo Poderoso ao destronar a Magistrada</td><td class="status-red">CONFIRMADO (múltiplas fontes)</td></tr>
                    <tr><td>Massacre dos 700+ agentes</td><td>Ordens de execução contra Cáligo/Grupo do Mascarado originaram-se do Todo Poderoso, transmitidas via Presidente Messias Nato</td><td class="status-yellow">ALTA PROBABILIDADE</td></tr>
                    <tr><td>Extermínio da tribo por Cáligo</td><td>Possivelmente orquestrado para destruir os registros da profecia. Se confirmado, o Todo Poderoso deliberadamente eliminou o único povo que possuía registro de seu retorno</td><td class="status-yellow">HIPÓTESE SOB INVESTIGAÇÃO</td></tr>
                    <tr><td>Corrida do Expurgo</td><td>Análise de padrões indica possível influência do Todo Poderoso na estruturação do evento. Melnick pode ser apenas um executor</td><td class="status-yellow">ESPECULATIVO — EM ANÁLISE</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>6. ANÁLISE DE NATUREZA</h3>
                <p>O que <strong>é</strong> o Todo Poderoso? A equipe analítica desenvolveu quatro hipóteses em ordem de probabilidade estimada:</p>
                <ol class="doc-list-numbered">
                    <li><strong>Título hereditário:</strong> "O Todo Poderoso" seria um título passado entre gerações de uma linhagem secreta — uma dinastia invisível operando nas Américas há milênios. Isso explicaria a longevidade da influência mas não o conhecimento impossível demonstrado.</li>
                    <li><strong>Organização secreta:</strong> Uma organização com membros rotativos que opera sob uma identidade coletiva. Cada "Todo Poderoso" seria na verdade dezenas ou centenas de operadores. Hipótese enfraquecida pela total ausência de vazamentos internos em mais de 1.000 anos.</li>
                    <li><strong>Entidade singular com longevidade anômala:</strong> Um ser — humano ou não — com expectativa de vida que excede qualquer parâmetro biológico conhecido. Hipótese impossível de verificar, mas consistente com os dados disponíveis.</li>
                    <li><strong>Conceito/Força impessoal:</strong> "O Todo Poderoso" não seria uma entidade individual, mas uma força, padrão ou "vontade" que emerge periodicamente e influencia eventos através de múltiplos agentes inconscientes. Hipótese mais difícil de operacionalizar.</li>
                </ol>
                <div class="doc-alert doc-alert-red">
                    <strong>POSIÇÃO OFICIAL DA DINTL:</strong> "Não possuímos dados suficientes para determinar a natureza do Todo Poderoso. Todas as hipóteses são igualmente especulativas. O que não é especulativo é a influência real e mensurável que esta designação exerce sobre eventos contemporâneos, incluindo a manipulação do Presidente da República."
                </div>
            </div>

            <div class="doc-section">
                <h3>7. VARIAÇÕES DO NOME REGISTRADAS</h3>
                <p>As seguintes variações foram identificadas em ordens, comunicações interceptadas e registros históricos:</p>
                <table class="doc-table">
                    <tr><th>Variação</th><th>Idioma/Contexto</th><th>Período</th></tr>
                    <tr><td>O Todo Poderoso</td><td>Português — ordens recentes (Brasil)</td><td>2024–2026</td></tr>
                    <tr><td>The Almighty</td><td>Inglês — interceptação CIA</td><td>2019</td></tr>
                    <tr><td>El Todopoderoso</td><td>Espanhol — inteligência colombiana</td><td>2007</td></tr>
                    <tr><td>Tukuy Atiyniyuq</td><td>Quéchua — inscrições andinas</td><td>Séc. XI–XIII</td></tr>
                    <tr><td>Opab Mbaraete</td><td>Tupi antigo — tradição oral</td><td>Séc. XIII–XV</td></tr>
                    <tr><td>KAH-RUUN</td><td>Idioma desconhecido — inscrições da tribo exterminada</td><td>Indeterminado</td></tr>
                    <tr><td>Tlatoani Cemithualtin</td><td>Náhuatl — códice mesoamericano</td><td>Séc. X–XII</td></tr>
                </table>
            </div>

            <div class="doc-section">
                <h3>8. DIRETRIZES DE CONDUTA</h3>
                <div class="doc-alert doc-alert-red">
                    <strong>DIRETRIZES VIGENTES — CARÁTER PERMANENTE:</strong>
                </div>
                <ol class="doc-list-numbered">
                    <li>A investigação sobre o Todo Poderoso é conduzida exclusivamente pela <strong>Célula ZERO</strong> — 3 analistas cujas identidades são conhecidas apenas pelo Diretor-Geral.</li>
                    <li>Nenhuma operação de campo será autorizada com base em informações deste dossiê sem aprovação unânime do Conselho de Segurança Interna.</li>
                    <li>A existência deste arquivo não deve ser comunicada a nenhum órgão internacional, incluindo CIA, Interpol, MI6 ou Mossad.</li>
                    <li>Qualquer ordem recebida supostamente emanada do Todo Poderoso deve ser <strong>documentada integralmente, mas não cumprida</strong>, até análise pela Célula ZERO.</li>
                    <li>Se a profecia for verdadeira e o retorno for iminente: <strong>não existe protocolo. Não sabemos o que esperar.</strong></li>
                </ol>
            </div>

            <div class="doc-section">
                <h3>9. NOTA DO DIRETOR-GERAL</h3>
                <p><em>"Lidamos diariamente com criminosos, organizações, terroristas — inimigos que podemos nomear, localizar, enfrentar. O Todo Poderoso não é nada disso. É um nome que aparece em paredes de mil anos e em ordens que chegam ao Palácio do Planalto. É um vazio com vontade. E se aquelas inscrições dizem a verdade — se o rei realmente vai retornar —, então tudo o que enfrentamos até agora foi apenas o prelúdio."</em></p>
                <p style="text-align: right; color: var(--pf-text-muted); font-size: 0.85rem;">— Diretor-Geral da Polícia Federal, registro selado, 25/02/2026</p>
            </div>

            <div class="doc-footer-stamp">
                DOCUMENTO ULTRA SECRETO — NÍVEL ÔMEGA — POLÍCIA FEDERAL — DINTL<br>
                ARQ-0000-TP — Acesso restrito à Célula ZERO e Diretor-Geral<br>
                Este documento NÃO EXISTE oficialmente. Qualquer referência a seu conteúdo é crime contra a segurança nacional.
            </div>
        `
    }
};

function abrirArquivo(id) {
    if (id === 'gepetto') {
        mostrarModalBloqueio();
        return;
    }
    const data = arquivosData[id];
    if (!data) return;

    const viewer = document.getElementById('arquivo-viewer');
    const titulo = document.getElementById('viewer-titulo');
    const corpo = document.getElementById('viewer-conteudo');

    titulo.textContent = data.titulo;
    corpo.innerHTML = data.conteudo;
    viewer.style.display = 'block';
    viewer.classList.remove('fade-in');
    setTimeout(() => viewer.classList.add('fade-in'), 10);

    // Scroll to viewer
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fecharViewer() {
    const viewer = document.getElementById('arquivo-viewer');
    viewer.classList.remove('fade-in');
    setTimeout(() => viewer.style.display = 'none', 200);
}

// ===== GEPETTO'S FILES — MODAL DE BLOQUEIO =====
function mostrarModalBloqueio() {
    // Remover modal anterior se existir
    const existente = document.getElementById('gepetto-modal');
    if (existente) existente.remove();

    const modal = document.createElement('div');
    modal.id = 'gepetto-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box modal-bloqueio">
            <div class="modal-bloqueio-icon">⛔</div>
            <h3>ACESSO NEGADO</h3>
            <div class="modal-bloqueio-code">ERRO 403 — CÓDIGO 3 REQUERIDO</div>
            <p>O arquivo <strong>Gepetto's Files</strong> requer credencial de <strong>Acesso Código 3</strong> para visualização.</p>
            <p>Sua credencial atual é <strong>Código 2</strong>. Nível de acesso insuficiente.</p>
            <div class="modal-bloqueio-details">
                <span>📛 Arquivo: ARQ-GPTT-000</span>
                <span>🔐 Classificação: CÓDIGO 3 — MÁXIMO SIGILO</span>
                <span>⚠️ Esta tentativa de acesso foi registrada.</span>
            </div>
            <button class="btn-primary" onclick="fecharModalGepetto()">ENTENDIDO</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('modal-active'), 10);
}

function fecharModalGepetto() {
    const modal = document.getElementById('gepetto-modal');
    if (modal) {
        modal.classList.remove('modal-active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== AUTENTICAÇÃO DOS ARQUIVOS =====
if (arquivosForm) {
    arquivosForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const usuario = document.getElementById('arquivos-usuario').value.trim();
        const senha = document.getElementById('arquivos-senha').value;

        if (usuario === ARQUIVO_USER && senha === ARQUIVO_PASS) {
            arquivosAutenticado = true;
            document.getElementById('arquivos-login-container').style.display = 'none';
            const conteudo = document.getElementById('arquivos-conteudo');
            conteudo.style.display = 'block';
            renderArquivos();
            showNotification('Acesso Código 2 concedido. Arquivos classificados liberados.', 'success');
        } else {
            arquivosError.textContent = 'ACESSO NEGADO — Credenciais de Código 2 inválidas.';
            arquivosError.style.color = '#c62828';
            showNotification('Tentativa de acesso negada. Credenciais inválidas.', 'error');
            // Shake
            const box = document.getElementById('arquivos-login-container');
            box.classList.add('shake');
            setTimeout(() => box.classList.remove('shake'), 500);
        }
    });
}

// ===== CONSULTAS — ABAS =====
const consultaTabs = document.querySelectorAll('.consulta-tab');
const consultaForms = {
    pessoa: document.getElementById('form-pessoa'),
    veiculo: document.getElementById('form-veiculo'),
    mandado: document.getElementById('form-mandado')
};

consultaTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        consultaTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        Object.values(consultaForms).forEach(f => { if(f) f.style.display = 'none'; });
        const target = consultaForms[this.getAttribute('data-tab')];
        if (target) target.style.display = 'block';
        document.getElementById('consulta-result').classList.remove('show');
    });
});

// ===== CONSULTAS — BANCO DE DADOS FICTÍCIO =====
const bancoDados = {
    pessoas: [
        { nome: 'Carlos Roberto Mendonça', cpf: '345.678.901-23', rg: '34.567.890-1', status: 'PRESO', ficha: 'Líder de organização criminosa. Preso em 24/02/2026 na Operação Trovão. Acusações: lavagem de dinheiro, falsificação de documentos, organização criminosa. 14 empresas de fachada identificadas.' },
        { nome: 'João da Silva', cpf: '123.456.789-00', rg: '12.345.678-9', matricula: '78452', status: 'AGENTE ATIVO', ficha: 'Agente de Polícia Federal — Classe Especial. Lotação: SR/SP. Divisão: DELINST. 14 anos de serviço. Última operação: Trovão (SP). Condecorações: Mérito Policial (2020), Medalha de Bravura (2023).' },
        { nome: 'Marcos Vinícius Souza', cpf: '567.890.123-45', rg: '56.789.012-3', status: 'PRESO', ficha: 'Foragido internacional capturado em 21/02/2026 em Curitiba/PR. Ex-tesoureiro de organização criminosa. Vivia sob identidade falsa como empresário do ramo alimentício. Listado pela Interpol.' },
        { nome: 'Ana Beatriz Ferreira', cpf: '789.012.345-67', rg: '78.901.234-5', status: 'INVESTIGADA', ficha: 'Suspeita de participação em esquema de desvio de verbas públicas em Recife/PE. Secretária de Obras. Sob monitoramento desde 15/01/2026.' },
        { nome: 'Ricardo Antônio Lima', cpf: '234.567.890-12', rg: '23.456.789-0', status: 'FORAGIDO', ficha: 'Procurado por tráfico internacional de drogas. Última localização conhecida: região de fronteira com o Paraguai. Alerta vermelho Interpol ativo. Considerado altamente perigoso.' },
        { nome: 'Ryan Alexander Melnick', cpf: 'N/A — Estrangeiro', rg: 'N/A', status: 'INTOCÁVEL', ficha: 'CEO da Melnick Enterprises. Nacionalidade norte-americana. Status especial: INTOCÁVEL por diretriz operacional nº 0029/2026. Não deve ser abordado, detido ou ferido. Qualquer contato deve ser reportado à DINTL.' },
        { nome: 'Rafael Teodoro Neves', cpf: '111.222.333-44', rg: '11.222.333-4', matricula: '61284', status: 'FALECIDO', ficha: 'Agente da Polícia Federal. Falecido em 04/01/2026. Causa oficial: infarto. Laudo independente sugere envenenamento. Investigava o caso denominado "Corrida do Expurgo".' },
        { nome: 'Luciana de Almeida Borges', cpf: '222.333.444-55', rg: '22.333.444-5', matricula: '59103', status: 'FALECIDA', ficha: 'Agente da Polícia Federal. Falecida em 11/01/2026 em acidente automobilístico. Perícia independente sugere sabotagem no veículo. Investigava caso "Corrida do Expurgo".' },
        { nome: 'Fernando Siqueira Ramos', cpf: '333.444.555-66', rg: '33.444.555-6', matricula: '63447', status: 'FALECIDO', ficha: 'Agente da Polícia Federal. Desaparecido em 19/01/2026 durante diligência. Corpo encontrado 9 dias depois com sinais de tortura. Investigava caso "Corrida do Expurgo".' },
        { nome: 'Kanni Manm', cpf: 'N/A — Sem registro civil', rg: 'N/A', status: 'AMEAÇA NÍVEL S', ficha: 'Capitão das Máscaras. Último membro com posto de Capitão vivo após o Incidente da Verdade. Associado direto da Magistrada. Responsável pela eliminação de 700+ agentes em operação conjunta. Capacidades sobre-humanas não catalogadas. NÃO ENGAJAR — NÃO RASTREAR — EVACUAR ÁREA.' },
        { nome: 'Messias Nato', cpf: 'CLASSIFICADO', rg: 'CLASSIFICADO', status: 'INVESTIGADO', ficha: 'Presidente da República. Emitiu ordens formais de execução contra Cáligo e o Grupo do Mascarado que resultaram no massacre de 700+ agentes. Evidências indicam que atuou sob influência/coerção de entidade conhecida como "O Todo Poderoso". Investigação sob sigilo absoluto.' },
        { nome: 'O Todo Poderoso', cpf: 'N/A — Entidade não identificada', rg: 'N/A', status: 'NÃO IDENTIFICADO', ficha: 'Designação atribuída a entidade ou indivíduo cuja influência no continente americano remonta a mais de 1.000 anos. Registros diretos cessaram há ~500 anos. Opera exclusivamente por ordens indiretas. Responsável pela ordem que levou à traição de Geru Meell contra a Magistrada (Incidente da Verdade) e pela cadeia de comando que resultou no massacre de 700+ agentes. Natureza completamente desconhecida. CLASSIFICAÇÃO ÔMEGA — ARQ-0000-TP.' }
    ],
    veiculos: [
        { placa: 'ABC-1D23', chassi: '9BWHE21JX24060831', proprietario: 'Carlos R. Mendonça', status: 'APREENDIDO', info: 'BMW X5 2024 — Preta. Apreendida na Operação Trovão. Documentação irregular. Veículo utilizado para transporte de valores ilícitos.' },
        { placa: 'PF-7842', chassi: '9BWAA45U5AT003721', proprietario: 'Polícia Federal', status: 'VIATURA', info: 'Toyota Hilux SW4 2025 — Branca (descaracterizada). Designada ao Agente João da Silva, Mat. 78452. Rastreamento GPS ativo.' },
        { placa: 'XYZ-9K87', chassi: '9BWKA05Z3TP012345', proprietario: 'Marcos V. Souza', status: 'APREENDIDO', info: 'Mercedes C300 2023 — Cinza. Registrada em nome de empresa fantasma. Apreendida em Curitiba durante captura do foragido.' },
        { placa: 'MLK-0029', chassi: 'WDDWJ8EB1KA000029', proprietario: 'Melnick Enterprises Ltda.', status: 'ATIVO — NÃO INTERCEPTAR', info: 'Mercedes-Maybach S680 2025 — Preta blindada. Veículo utilizado por Ryan Melnick em território brasileiro. Escolta armada permanente. NÃO ABORDAR.' }
    ],
    mandados: [
        { numero: 'MD-2026-0847', investigado: 'Carlos Roberto Mendonça', status: 'CUMPRIDO', info: 'Mandado de prisão preventiva. Expedido pela 6ª Vara Federal Criminal de São Paulo. Cumprido em 24/02/2026 durante Operação Trovão.' },
        { numero: 'MD-2026-0791', investigado: 'Ricardo Antônio Lima', status: 'PENDENTE', info: 'Mandado de prisão. Expedido pela 2ª Vara Federal de Foz do Iguaçu. Tráfico internacional de drogas. Foragido — não cumprido.' },
        { numero: 'MD-2026-0823', investigado: 'Ana Beatriz Ferreira', status: 'PENDENTE', info: 'Mandado de busca e apreensão. Expedido pela 1ª Vara Federal de Recife. Aguardando coordenação com Ministério Público para cumprimento.' }
    ]
};

// Busca por pessoa
const formPessoa = document.getElementById('form-pessoa');
if (formPessoa) {
    formPessoa.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('consulta-nome').value.trim().toLowerCase();
        const cpf = document.getElementById('consulta-cpf').value.trim();
        const result = document.getElementById('consulta-result');

        const pessoa = bancoDados.pessoas.find(p =>
            (nome && p.nome.toLowerCase().includes(nome)) ||
            (cpf && p.cpf === cpf)
        );

        if (pessoa) {
            const statusClass = (pessoa.status === 'AGENTE ATIVO') ? 'status-green' :
                (pessoa.status === 'PRESO' || pessoa.status === 'FORAGIDO' || pessoa.status === 'FALECIDO' || pessoa.status === 'FALECIDA' || pessoa.status === 'AMEAÇA NÍVEL S' || pessoa.status === 'NÃO IDENTIFICADO') ? 'status-red' :
                (pessoa.status === 'INTOCÁVEL') ? 'status-yellow' : 'status-yellow';
            result.innerHTML = `
                <h4 style="color:#17345c; margin-bottom:10px;">Resultado da Consulta</h4>
                <strong>Nome:</strong> ${pessoa.nome}<br>
                <strong>CPF:</strong> ${pessoa.cpf}<br>
                <strong>RG:</strong> ${pessoa.rg}<br>
                ${pessoa.matricula ? '<strong>Matrícula PF:</strong> ' + pessoa.matricula + '<br>' : ''}
                <strong>Status:</strong> <span class="${statusClass}">${pessoa.status}</span><br><br>
                <strong>Informações:</strong> ${pessoa.ficha}
            `;
        } else {
            result.innerHTML = '<span style="color:#64748b;">Nenhum registro encontrado para os parâmetros informados.</span>';
        }
        result.classList.add('show');
    });
}

// Busca por veículo
const formVeiculo = document.getElementById('form-veiculo');
if (formVeiculo) {
    formVeiculo.addEventListener('submit', function(e) {
        e.preventDefault();
        const placa = document.getElementById('consulta-placa').value.trim().toUpperCase();
        const chassi = document.getElementById('consulta-chassi').value.trim().toUpperCase();
        const result = document.getElementById('consulta-result');

        const veiculo = bancoDados.veiculos.find(v =>
            (placa && v.placa.toUpperCase() === placa) ||
            (chassi && v.chassi.toUpperCase() === chassi)
        );

        if (veiculo) {
            result.innerHTML = `
                <h4 style="color:#17345c; margin-bottom:10px;">Resultado da Consulta</h4>
                <strong>Placa:</strong> ${veiculo.placa}<br>
                <strong>Chassi:</strong> ${veiculo.chassi}<br>
                <strong>Proprietário:</strong> ${veiculo.proprietario}<br>
                <strong>Status:</strong> <span class="${veiculo.status === 'VIATURA' ? 'status-green' : 'status-red'}">${veiculo.status}</span><br><br>
                <strong>Informações:</strong> ${veiculo.info}
            `;
        } else {
            result.innerHTML = '<span style="color:#64748b;">Nenhum veículo encontrado para os parâmetros informados.</span>';
        }
        result.classList.add('show');
    });
}

// Busca por mandado
const formMandado = document.getElementById('form-mandado');
if (formMandado) {
    formMandado.addEventListener('submit', function(e) {
        e.preventDefault();
        const numero = document.getElementById('consulta-mandado-num').value.trim().toUpperCase();
        const nomeInv = document.getElementById('consulta-mandado-nome').value.trim().toLowerCase();
        const result = document.getElementById('consulta-result');

        const mandado = bancoDados.mandados.find(m =>
            (numero && m.numero.toUpperCase() === numero) ||
            (nomeInv && m.investigado.toLowerCase().includes(nomeInv))
        );

        if (mandado) {
            result.innerHTML = `
                <h4 style="color:#17345c; margin-bottom:10px;">Resultado da Consulta</h4>
                <strong>Nº Mandado:</strong> ${mandado.numero}<br>
                <strong>Investigado:</strong> ${mandado.investigado}<br>
                <strong>Status:</strong> <span class="${mandado.status === 'CUMPRIDO' ? 'status-green' : 'status-yellow'}">${mandado.status}</span><br><br>
                <strong>Detalhes:</strong> ${mandado.info}
            `;
        } else {
            result.innerHTML = '<span style="color:#64748b;">Nenhum mandado encontrado para os parâmetros informados.</span>';
        }
        result.classList.add('show');
    });
}

// ===== ANIMAÇÕES: CONTADORES NOS STATS =====
function animarContadores() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const final = parseInt(el.textContent);
        if (isNaN(final)) return;
        el.textContent = '0';
        let current = 0;
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            current = Math.round(eased * final);
            el.textContent = current.toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}
animarContadores();

// ===== WELCOME NOTIFICATION =====
setTimeout(() => {
    const nome = sessionStorage.getItem('pf_usuario') || 'Agente';
    showNotification('Bem-vindo(a), ' + nome + '. Sistema operacional.', 'info');
}, 800);

// ===== INTERATIVIDADE: HOVER NAS LINHAS DE TABELA =====
document.querySelectorAll('.table-full tbody tr, .table-clean tbody tr').forEach(row => {
    row.style.cursor = 'default';
    row.style.transition = 'all .2s cubic-bezier(.4,0,.2,1)';
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        const links = document.querySelectorAll('.dash-nav a');
        if (links[idx]) links[idx].click();
    }
});
