/**
 * VION INOVATION - Automation Center Logic
 * Simulates real-time processing and interactions.
 */

const automationData = {
    whatsapp: {
        title: "Atendimento WhatsApp",
        logs: [
            { type: 'info', msg: "Recebendo mensagem de +244 926 283 434" },
            { type: 'processing', msg: "IA Analisando intenção..." },
            { type: 'success', msg: "Intenção: 'Orçamento' (98% conf.)" },
            { type: 'info', msg: "Consultando disponibilidade na agenda..." },
            { type: 'success', msg: "Resposta enviada em 0.2ms" },
            { type: 'info', msg: "Lead cadastrado no CRM" }
        ],
        steps: ["Recebido", "IA Análise", "Respondido"]
    },
    crm: {
        title: "CRM Inteligente",
        logs: [
            { type: 'info', msg: "Novo Lead detectado: Empresa Bring" },
            { type: 'processing', msg: "Enriquecendo dados (LinkedIn/Receita)..." },
            { type: 'success', msg: "Dados completados" },
            { type: 'info', msg: "Atribuindo ao vendedor: Adilson Jaime" },
            { type: 'success', msg: "Tarefa de Follow-up criada" }
        ],
        steps: ["Lead", "Enriquecimento", "Distribuição"]
    },
    sites: {
        title: "Otimização Site & SEO",
        logs: [
            { type: 'info', msg: "Scan de performance iniciado" },
            { type: 'processing', msg: "Otimizando imagens e scripts..." },
            { type: 'success', msg: "LCP reduzido para 1.2s" },
            { type: 'info', msg: "Indexando novas páginas no Google" },
            { type: 'success', msg: "SEO Score: 98/100" }
        ],
        steps: ["Scan", "Otimização", "Ranking"]
    },
    internal: {
        title: "Automação Interna",
        logs: [
            { type: 'info', msg: "Verificando notas fiscais pendentes" },
            { type: 'processing', msg: "Cruzando dados com pedido de compra..." },
            { type: 'success', msg: "Aprovação automática: OK" },
            { type: 'info', msg: "Enviando para financeiro" },
            { type: 'success', msg: "Processo concluído" }
        ],
        steps: ["Check", "Validação", "Aprovação"]
    },
    payments: {
        title: "Pagamentos Integrados",
        logs: [
            { type: 'info', msg: "Webhook recebido: Pagamento Aprovado" },
            { type: 'processing', msg: "Identificando cliente..." },
            { type: 'success', msg: "Cliente: Nelson Muquissi" },
            { type: 'info', msg: "Liberando acesso ao produto" },
            { type: 'success', msg: "Fatura enviada por e-mail" }
        ],
        steps: ["Pagamento", "Baixa", "Liberação"]
    }
};

let currentSimulation = null;
let logInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with first simulation
    runSimulation('whatsapp');

    // Add click listeners to cards
    const cards = document.querySelectorAll('.vion-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove active class from all
            cards.forEach(c => c.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');

            // Run simulation
            const type = this.getAttribute('data-sim');
            runSimulation(type);
        });
    });

    // Animate counters on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    });

    const comparisonSection = document.querySelector('.comparison-section');
    if (comparisonSection) observer.observe(comparisonSection);
});

function runSimulation(type) {
    if (currentSimulation === type) return;
    currentSimulation = type;
    const data = automationData[type];

    // Clear existing logs
    const terminal = document.getElementById('terminal-content');
    terminal.innerHTML = '';

    // Update Timeline Labels
    const steps = document.querySelectorAll('.step-label');
    if (steps.length === 3) {
        steps[0].textContent = data.steps[0];
        steps[1].textContent = data.steps[1];
        steps[2].textContent = data.steps[2];
    }

    // Reset Timeline Visuals
    document.querySelectorAll('.timeline-step').forEach(s => {
        s.classList.remove('active', 'completed');
    });

    // Start Logging Sequence
    if (logInterval) clearInterval(logInterval);

    let stepIndex = 0;
    let logIndex = 0;

    // Initial Timeline State
    updateTimeline(0);

    logInterval = setInterval(() => {
        if (logIndex >= data.logs.length) {
            clearInterval(logInterval);
            updateTimeline(3); // Complete
            return;
        }

        const log = data.logs[logIndex];
        addLogEntry(terminal, log.type, log.msg);

        // Update timeline roughly mapped to logs
        if (logIndex === 1) updateTimeline(1);
        if (logIndex === 3) updateTimeline(2);

        logIndex++;
    }, 800); // Speed of typing
}

function addLogEntry(container, type, msg) {
    const div = document.createElement('div');
    div.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });

    let colorClass = 'log-msg';
    if (type === 'success') colorClass = 'log-success';
    if (type === 'processing') colorClass = 'log-processing';
    if (type === 'info') colorClass = 'log-info';

    div.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="${colorClass}">> ${msg}</span>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function updateTimeline(step) {
    const dots = document.querySelectorAll('.timeline-step');
    dots.forEach((dot, index) => {
        if (index < step) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else if (index === step) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16);

        let current = start;
        const update = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
                requestAnimationFrame(update);
            } else {
                counter.innerText = target + (counter.getAttribute('data-suffix') || '');
            }
        };
        update();
    });
}
