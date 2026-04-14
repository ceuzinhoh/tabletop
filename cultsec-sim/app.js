/* app.js */

// Audio Context
const sfx = {
    ring: new Audio('https://assets.mixkit.co/active_storage/sfx/1354/1354-preview.mp3'),
    news: new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
};
sfx.ring.loop = true;


// Game State
const state = {
    playerName: "Executivo",
    playerRole: "CEO",
    metrics: {
        stock: 100,
        trust: 100,
        revenue: 500 // Faturamento in Millions
    },
    history: [], // Track decisions
    time: 0, 
    incidentActive: false,
    systems: {
        erp: true,
        db: true,
        portal: true
    }
};

// Scenario Data (Ransomware Attack)
const scenario = [
    {
        id: "intro",
        delay: 2000,
        messages: [
            { author: "CFO", role: "Diretor Financeiro", type: "cto", text: "Urgente: Detectamos uma anomalia severa no faturamento. O gateway de pagamentos da América Latina e o ERP travaram." },
        ],
        decision: {
            prompt: "Como conduzir o impacto nas receitas vitais?",
            options: [
                { 
                    text: "Congelar ordens de compra e paralisar cadeia B2B até auditoria completa.", 
                    impact: "Faturamento ↓↓",
                    eval: { good: "Ação preventiva corajosa contra vazamentos B2B", bad: "Impactou severamente a meta de receita trimestral" },
                    effects: { stock: -10, trust: +5, revenue: -80, erp: false },
                    next: "day1_pause"
                },
                { 
                    text: "Manter vendas operando em modo de contingência. Não podemos perder faturamento.", 
                    impact: "Risco Legal ↑↑",
                    eval: { good: "Protegeu o fluxo de caixa preventivo", bad: "Negligenciou risco severo de vazamento contínuo" },
                    effects: { stock: -5, trust: -10, revenue: -10, erp: true },
                    next: "day1_breach"
                }
            ]
        }
    },
    {
        id: "day1_pause",
        delay: 3000,
        teamsTrigger: { author: "IT Ops - Infra", msg: "Chefe, a paralisação gerou pânico. Sistemas em lock-down, mas achei um script estranho rodando na AWS..." },
        messages: [
            { author: "CFO", role: "Diretor Financeiro", type: "cto", text: "Parar as vendas foi seguro, mas sangramos $80M de prejuízo. A Infraestrutura reportou um script anômalo sob disfarce." }
        ],
        updateIncident: { title: "Sistemas Congelados", desc: "Auditoria interna forçada." },
        decision: {
            prompt: "Você interrompeu a crise temporariamente. O que fazer com a suspeita da TI?",
            options: [
                { 
                    text: "Contratar perícia externa forense imediata (Mandiant/FireEye). Custe o que custar.", 
                    impact: "Caixa ↓, Confiança ↑",
                    eval: { good: "Buscou especialistas globais antecipadamente salvando o legado", bad: "Gastou caixa vital durante a queda de vendas" },
                    effects: { stock: -10, trust: +25, revenue: -40 },
                    next: "ending_hero"
                },
                { 
                    text: "Mande a própria TI deletar o script para economizar caixa e religuem o B2B.", 
                    impact: "Extremo Perigo",
                    eval: { bad: "Ignorou protocolos de perícia, destruiu evidências e causou recaída letal.", good: "" },
                    effects: { stock: -5, trust: -5, revenue: +20 },
                    next: "day2_leak"
                }
            ]
        }
    },
    {
        id: "day1_breach",
        delay: 3000,
        virusTrigger: true,
        socialTrigger: [
            { platform: "x", author: "@ProconSP", text: "Clientes Cultsec reportando clonagem de dados Platinum ao vivo. Investigação aberta." },
            { platform: "reddit", author: "u/NetSec", text: "A porta principal do ERP B2B caiu. Parece ransomware de estado." }
        ],
        messages: [
            { author: "PR", role: "Julia", type: "pr", text: "Ignorar o alerta foi um erro fatal! Os sistemas de blindagem caíram e os dados B2B foram todos encriptados!" },
            { author: "Legal", role: "Roberto", type: "legal", text: "Fomos extorquidos. Eles enviaram uma mensagem direta para nós. Verifique sua tela." }
        ],
        updateIncident: { title: "Cadeia Comprometida", desc: "Ataque Ransomware Executado." },
        decision: {
            prompt: "Vocês acabaram de ler a mensagem do hacker. Eles têm os nossos dados. Ação?",
            options: [
                { 
                    text: "Acionar fundo de contingência sigiloso. Pague os US$ 50M para evitar vazamento.", 
                    impact: "Faturamento ↓↓↓",
                    emailTrigger: true,
                    eval: { bad: "Financiou terrorismo e esvaziou os lucros da década", good: "Impediu que os dados de parceiros batessem no mercado negro" },
                    effects: { stock: -5, trust: -10, revenue: -200, db: false },
                    next: "day2_pay"
                },
                { 
                    text: "Não negociaremos com terroristas cibernéticos. Notifique o FBI e feche o portal.", 
                    impact: "Ações ↓↓, Receita ↓",
                    emailTrigger: true,
                    eval: { good: "Manteve ética e evitou crime federal de financiamento a grupos sancionados", bad: "Assumiu processos judiciais colossais de clientes" },
                    effects: { stock: -30, trust: +10, revenue: -80, portal: false },
                    next: "day2_fight"
                }
            ]
        }
    },
    {
        id: "day2_leak",
        delay: 2000,
        messages: [
            { author: "PR", role: "Julia", type: "pr", text: "Você mandou nossa TI apagar o problema? O script era uma isca. Ao deletarem, ele acionou uma bomba lógica que vazou os códigos-fonte da nossa IA principal no Pastebin." }
        ],
        next: "news_flash_leak"
    },
    {
        id: "day2_pay",
        type: "call",
        caller: "Roberto",
        role: "Diretor Jurídico",
        avatar: "assets/legal.png",
        delay: 3000,
        updateIncident: { title: "Lavagem de Dinheiro", desc: "CVM na porta." },
        text: "CEO, o pagamento em Bitcoin rastreou para um grupo sancionado pelo Tesouro Americano. O governo congelou nossas contas de Wall Street sob suspeita de evasão de divisas. O que eu falo pro xerife federal na porta?",
        options: [
            {
                text: "Assuma o erro. Confesse que pagamos um resgate sob desespero.",
                impact: "Confiança +, Prisão -",
                eval: { good: "Confessou para mitigação de pena corporativa", bad: "Consolidou um crime federal destruindo as ações" },
                effects: { stock: -50, trust: +15, revenue: -50 },
                next: "news_flash_arrest"
            },
            {
                text: "Negue tudo. Diga que fomos hackeados financeiramente também.",
                impact: "Confiança Destruída",
                eval: { bad: "Mentir ao FBI sob juramento. Falha letal de liderança.", good: "" },
                effects: { stock: -20, trust: -60, revenue: 0 },
                next: "news_flash_arrest"
            }
        ]
    },
    {
        id: "day2_fight",
        delay: 2000,
        socialTrigger: [
            { platform: "linkedin", author: "CISO", text: "Decisão dura não pagar. A empresa vai sofrer, mas não alimentamos hackers." }
        ],
        teamsTrigger: { author: "Legal - Compliance", msg: "Preparando dezenas de NDAs de Breach para enviar aos clientes." },
        messages: [
            { author: "CFO", role: "Diretor Financeiro", type: "cto", text: "As perdas foram estratosféricas com a queda de braço. A B3 encerrou o trimestre. As ações despencaram." }
        ],
        next: "news_flash_mediocre"
    },
    
    // -- News and Endings --
    {
        id: "news_flash_leak",
        type: "news",
        delay: 1500,
        headline: "PLANTÃO: CULTSEC NEGLIGENCIA VÍRUS E CAUSA MAIOR VAZAMENTO DE CÓDIGO FONTE DA DÉCADA.",
        next: "final_evaluation"
    },
    {
        id: "news_flash_arrest",
        type: "news",
        delay: 1500,
        headline: "PLANTÃO: DIRETORIA DA CULTSEC INVESTIGADA PELO TESOURO AMERICANO POR LAVAGEM DE DINHEIRO GLOBAL.",
        next: "final_evaluation"
    },
    {
        id: "news_flash_mediocre",
        type: "news",
        delay: 1500,
        headline: "PLANTÃO: APÓS RECUSAR EXTORÇÃO, CULTSEC ENFRENTA MARE DE PROCESSOS JUDICIAIS MILIONÁRIOS.",
        next: "final_evaluation"
    },
    {
        id: "ending_hero",
        delay: 2000,
        messages: [
            { author: "PR", role: "Julia", type: "pr", text: "A perícia encontrou o ransomware inativo e o conteve. Evitamos o apocalipse. A imprensa elogiou sua pró-atividade de pausar a rede antes da infecção global." }
        ],
        effects: { stock: +20, trust: +50, revenue: 0 },
        next: "final_evaluation"
    },
    { id: "final_evaluation", delay: 2000, end: true, title: "Turno Encerrado", desc: "A poeira baixou. A crise primária foi resolvida." }
];


// DOM Elements
const els = {
    metrics: {
        stockVal: document.getElementById('val-stock'),
        trustVal: document.getElementById('val-trust'),
        budgetVal: document.getElementById('val-budget'),
        stockBar: document.getElementById('bar-stock'),
        trustBar: document.getElementById('bar-trust'),
        budgetBar: document.getElementById('bar-budget')
    },
    systems: {
        erp: document.getElementById('systems-list').children[0],
        db: document.getElementById('systems-list').children[1],
        portal: document.getElementById('systems-list').children[2],
    },
    incident: {
        title: document.getElementById('incident-title'),
        desc: document.getElementById('incident-desc')
    },
    chatFeed: document.getElementById('chat-feed'),
    typingIndicator: document.getElementById('typing-indicator'),
    decisionPanel: document.getElementById('decision-panel'),
    decisionPrompt: document.getElementById('decision-prompt'),
    decisionOptions: document.getElementById('decision-options'),
    timeDisplay: document.getElementById('time-display'),
    overlay: document.getElementById('game-over-overlay'),
    endTitle: document.getElementById('end-title'),
    endDesc: document.getElementById('end-desc')
};

let gameTimer = null;
function init() {
    updateUI();
    gameTimer = setInterval(() => {
        state.time += 1;
        // Start simulation at 08:00 AM
        const baseH = 8;
        const totalM = state.time;
        const hrs = String(baseH + Math.floor(totalM / 60)).padStart(2, '0');
        const mins = String(totalM % 60).padStart(2, '0');
        els.timeDisplay.innerText = `${hrs}:${mins}:00`;
        els.timeDisplay.style.color = 'var(--brand-red)';
    }, 1000);

    setTimeout(() => {
        playNode("intro");
    }, 1500);
}

function updateMetrics(effects) {
    if(effects) {
        state.metrics.stock += effects.stock || 0;
        state.metrics.trust += effects.trust || 0;
        state.metrics.revenue += effects.revenue || 0;

        // Visual flash for metrics that changed
        Object.keys(effects).forEach(key => {
            if(['stock', 'trust', 'revenue'].includes(key) && effects[key] !== 0) {
                const elId = key === 'revenue' ? 'val-budget' : `val-${key}`;
                const el = document.getElementById(elId).parentElement;
                el.style.backgroundColor = effects[key] > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
                setTimeout(() => { el.style.backgroundColor = 'rgba(0,0,0,0.2)'; }, 500);
            }
        });
    }

    // Clamp values
    if(state.metrics.stock < 0) state.metrics.stock = 0;
    if(state.metrics.stock > 100) state.metrics.stock = 100;
    if(state.metrics.trust < 0) state.metrics.trust = 0;
    if(state.metrics.trust > 100) state.metrics.trust = 100;
    if(state.metrics.revenue < 0) state.metrics.revenue = 0;

    els.metrics.stockVal.innerText = `${state.metrics.stock}%`;
    els.metrics.stockBar.style.width = `${state.metrics.stock}%`;
    els.metrics.trustVal.innerText = `${state.metrics.trust}%`;
    els.metrics.trustBar.style.width = `${state.metrics.trust}%`;
    
    // Revenue logic (Budget bar conceptually changed to absolute Revenue)
    els.metrics.budgetVal.innerText = `$${state.metrics.revenue}M`;
    const revPercent = Math.min(100, Math.max(0, (state.metrics.revenue / 500) * 100));
    els.metrics.budgetBar.style.width = `${revPercent}%`;

    ['stock', 'trust'].forEach(k => {
        if(state.metrics[k] < 30) {
            els.metrics[`${k}Bar`].style.backgroundColor = 'var(--brand-red)';
            els.metrics[`${k}Val`].classList.add('critical');
        } else {
            els.metrics[`${k}Bar`].style.backgroundColor = '';
            els.metrics[`${k}Val`].classList.remove('critical');
        }
    });

    if(state.metrics.revenue < 250) {
        els.metrics.budgetBar.style.backgroundColor = 'var(--brand-red)';
        els.metrics.budgetVal.classList.add('critical');
    }

    if(state.metrics.stock < 50 || state.metrics.trust < 50 || state.metrics.revenue < 250) {
        document.getElementById('threat-level').innerText = "FATAL";
        document.getElementById('threat-level').style.color = "darkred";
    }

    if(state.metrics.stock <= 0 || state.metrics.trust <= 0 || state.metrics.revenue <= 0) {
        setTimeout(() => triggerGameOver("Falência Anunciada", "Os ponteiros não aguentaram. A diretoria o destituiu no meio da crise."), 1000);
    }
}

function updateSystems(effects) {
    if(!effects) return;
    if(effects.erp === false) { els.systems.erp.className = 'offline'; els.systems.erp.innerHTML = '<i class="ph-fill ph-x-circle"></i> ERP Principal (OFF)'; }
    if(effects.db === false) { els.systems.db.className = 'offline'; els.systems.db.innerHTML = '<i class="ph-fill ph-x-circle"></i> Banco de Dados (OFF)'; }
    if(effects.portal === false) { els.systems.portal.className = 'offline'; els.systems.portal.innerHTML = '<i class="ph-fill ph-x-circle"></i> Portal Clientes (OFF)'; }
    
    if(effects.erp === true) { els.systems.erp.className = 'online'; els.systems.erp.innerHTML = '<i class="ph-fill ph-check-circle"></i> ERP Principal'; }
    if(effects.db === true) { els.systems.db.className = 'online'; els.systems.db.innerHTML = '<i class="ph-fill ph-check-circle"></i> Banco de Dados (RH)'; }
    if(effects.portal === true) { els.systems.portal.className = 'online'; els.systems.portal.innerHTML = '<i class="ph-fill ph-check-circle"></i> Portal Clientes'; }
}

function updateUI() {
    updateMetrics();
}

function addMessage(msg) {
    const el = document.createElement('div');
    el.className = `message ${msg.type === 'player' ? 'player' : ''}`;
    
    const initial = msg.type === 'player' ? 'VC' : msg.role ? msg.role.charAt(0) : '?';

    el.innerHTML = `
        <div class="avatar ${msg.type}">${initial}</div>
        <div class="msg-content">
            <div class="msg-author">${msg.author === 'Você' ? state.playerName : msg.author} (${msg.role || state.playerRole})</div>
            <div class="msg-text">${msg.text}</div>
        </div>
    `;
    els.chatFeed.appendChild(el);
    els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
}

function playNode(nodeId) {
    els.decisionPanel.classList.add('hidden');
    const node = scenario.find(n => n.id === nodeId);
    if(!node) return;

    if(node.updateIncident) {
        els.incident.title.innerText = node.updateIncident.title;
        els.incident.desc.innerText = node.updateIncident.desc;
        els.incident.title.style.color = 'var(--brand-red)';
    }

    // Social Media Triggers
    if(node.socialTrigger) {
        const feed = document.getElementById('social-feed');
        const tweets = document.getElementById('social-tweets');
        feed.classList.remove('hidden');
        node.socialTrigger.forEach((t, i) => {
            setTimeout(() => {
                const tw = document.createElement('div');
                tw.className = 'tweet';
                let icon = 'ph-twitter-logo';
                if(t.platform === 'linkedin') icon = 'ph-linkedin-logo';
                if(t.platform === 'reddit') icon = 'ph-reddit-logo';
                tw.innerHTML = `<div class="tweet-author"><i class="ph-fill ${icon}"></i> ${t.author}</div><div>${t.text}</div>`;
                tweets.prepend(tw);
            }, i * 2000);
        });
        setTimeout(() => { feed.classList.add('hidden'); tweets.innerHTML = ''; }, 10000);
    }

    // Teams Trigger
    if(node.teamsTrigger) {
        document.getElementById('teams-author').innerText = node.teamsTrigger.author;
        document.getElementById('teams-msg').innerText = node.teamsTrigger.msg;
        const toast = document.getElementById('teams-toast');
        toast.classList.remove('hidden');
        setTimeout(() => { toast.classList.add('hidden'); }, 7000);
    }

    // Email Trigger
    if(node.emailTrigger) {
        document.getElementById('email-overlay').classList.remove('hidden');
    }

    // Virus Trigger
    if(node.virusTrigger) {
        document.getElementById('virus-overlay').classList.remove('hidden');
        setTimeout(() => { document.getElementById('virus-overlay').classList.add('hidden'); }, 4000);
    }

    if(node.end) {
        setTimeout(() => triggerGameOver(node.title, node.desc), node.delay);
        return;
    }

    if(node.type === "call") {
        setTimeout(() => {
            sfx.ring.play().catch(e => console.log("Audio play bloqueado:", e));
            document.getElementById('call-avatar').style.backgroundImage = `url('${node.avatar}')`;
            document.getElementById('caller-name').innerText = node.caller;
            document.getElementById('caller-role').innerText = node.role;
            document.getElementById('call-text').innerText = node.text;
            document.getElementById('call-overlay').classList.remove('hidden');
            document.getElementById('call-dialogue').classList.add('hidden');
            document.getElementById('call-status').innerText = "LIGANDO...";
            document.getElementById('call-status').classList.add('pulse-text');
            document.getElementById('call-actions').classList.remove('hidden');

            document.getElementById('btn-accept-call').onclick = () => {
                sfx.ring.pause();
                sfx.ring.currentTime = 0;
                document.getElementById('call-status').innerText = "00:00 - CHAMADA ATIVA";
                document.getElementById('call-status').classList.remove('pulse-text');
                document.getElementById('call-actions').classList.add('hidden');
                document.getElementById('call-dialogue').classList.remove('hidden');
                
                const optsContainer = document.getElementById('call-options');
                optsContainer.innerHTML = '';
                node.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerHTML = `<span>${opt.text}</span><span class="impact">${opt.impact}</span>`;
                    btn.onclick = () => {
                        document.getElementById('call-overlay').classList.add('hidden');
                        if(opt.eval) state.history.push(opt.eval);
                        updateMetrics(opt.effects);
                        updateSystems(opt.effects);
                        playNode(opt.next);
                    };
                    optsContainer.appendChild(btn);
                });
            };

            document.getElementById('btn-reject-call').onclick = () => {
                sfx.ring.pause();
                sfx.ring.currentTime = 0;
                document.getElementById('call-overlay').classList.add('hidden');
                if(node.onReject.eval) state.history.push(node.onReject.eval);
                updateMetrics(node.onReject.effects);
                updateSystems(node.onReject.effects);
                playNode(node.onReject.next);
            };
        }, node.delay);
        return;
    }

    if(node.type === "news") {
        setTimeout(() => {
            sfx.news.play().catch(e => console.log("Audio play bloqueado:", e));
            document.getElementById('news-text').innerText = node.headline;
            const banner = document.getElementById('breaking-news');
            banner.classList.remove('hidden');

            let panicInt = setInterval(() => {
                updateMetrics({ stock: -2, trust: -3, revenue: -1});
            }, 1000);

            setTimeout(() => {
                clearInterval(panicInt);
                banner.classList.add('hidden');
                playNode(node.next);
            }, 8000); // Exibe por 8 segundos
        }, node.delay);
        return;
    }

    let delayAcc = node.delay;

    node.messages.forEach((msg, idx) => {
        setTimeout(() => {
            els.typingIndicator.classList.remove('hidden');
            els.chatFeed.scrollTop = els.chatFeed.scrollHeight;
        }, delayAcc - 1200);

        setTimeout(() => {
            addMessage(msg);
            if(idx === node.messages.length - 1) {
                els.typingIndicator.classList.add('hidden');
                showDecisions(node.decision);
            }
        }, delayAcc);

        delayAcc += 3500; // time between messages
    });
}

function showDecisions(decision) {
    els.decisionPrompt.innerText = decision.prompt;
    els.decisionOptions.innerHTML = '';
    
    decision.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${opt.text}</span><span class="impact">${opt.impact}</span>`;
        btn.onclick = () => {
            addMessage({ type: 'player', author: 'Você', role: state.playerRole, text: opt.text });
            if(opt.eval) state.history.push(opt.eval);
            updateMetrics(opt.effects);
            updateSystems(opt.effects);
            playNode(opt.next);
        };
        els.decisionOptions.appendChild(btn);
    });

    els.decisionPanel.classList.remove('hidden');
    setTimeout(() => { els.chatFeed.scrollTop = els.chatFeed.scrollHeight; }, 100);
}

function triggerGameOver(title, desc) {
    document.getElementById('final-stock').innerText = `${state.metrics.stock}%`;
    document.getElementById('final-trust').innerText = `${state.metrics.trust}%`;
    document.getElementById('final-revenue').innerText = `$${state.metrics.revenue} Milhões`;
    
    // Dynamic Final Outcome
    let finalTitle = "";
    let finalDesc = "";
    if(state.metrics.revenue <= 250 || state.metrics.trust < 40 || state.metrics.stock < 40) {
        finalTitle = "DESTITUIÇÃO PELO CONSELHO";
        finalDesc = "A gestão falhou nos pilares centrais e afundou o balanço. Você foi desligado pelos acionistas da Cultsec.";
        document.getElementById('end-title').style.color = "var(--brand-red)";
    } else {
        finalTitle = "CRISE CONTIDA. LIDERANÇA APROVADA.";
        finalDesc = "Houveram perdas, mas sua decisão guiou a Cultsec para a recuperação B2B. Bom trabalho, executivo.";
        document.getElementById('end-title').style.color = "var(--brand-cultsec)";
    }
    document.getElementById('end-title').innerText = finalTitle;
    document.getElementById('end-desc').innerText = finalDesc;

    // Evaluate History for Big4 Report
    const goodList = document.getElementById('audit-good-list');
    const badList = document.getElementById('audit-bad-list');
    goodList.innerHTML = '';
    badList.innerHTML = '';
    let hasGood = false, hasBad = false;

    state.history.forEach(h => {
        if(h.good) {
            hasGood = true;
            const li = document.createElement('li'); li.innerText = h.good; goodList.appendChild(li);
        }
        if(h.bad) {
            hasBad = true;
            const li = document.createElement('li'); li.innerText = h.bad; badList.appendChild(li);
        }
    });

    if(!hasGood) goodList.innerHTML = "<li>Nenhuma ação favorável registrada na crise.</li>";
    if(!hasBad) badList.innerHTML = "<li>Nenhuma falha crítica detectada nas ações.</li>";
    
    els.overlay.classList.remove('hidden');
}

window.onload = () => {
    document.getElementById('registration-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.playerName = document.getElementById('player-name').value;
        state.playerRole = document.getElementById('player-role').value;
        document.getElementById('registration-overlay').classList.add('hidden');
        init();
    });

    document.getElementById('close-email-btn').addEventListener('click', () => {
        document.getElementById('email-overlay').classList.add('hidden');
    });
};
