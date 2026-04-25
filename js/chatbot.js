document.addEventListener('DOMContentLoaded', () => {

    // --- CHATBOT CONFIG ---
    const chatBtn = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatChips = document.getElementById('chat-chips');

    // --- KNOWLEDGE BASE (Expanded for "Tchissola") ---
    const knowledgeBase = [
        // 1. BRAND & IDENTITY
        {
            keys: ['quem e', 'quem sao', 'sobre', 'vion', 'tchissola'],
            response: 'A **VION** é uma integradora de soluções inteligentes. Engenharia de processos para quem busca escala real. 🚀⚡\n\nEu, **Tchissola**, sou a manifestação dessa IA, focada em guiar sua jornada de inovação.',
            chips: ['Ver Serviços', 'Sectores de Atuação', 'Falar com Consultor']
        },
        // 2. SERVICES & PRICING
        {
            keys: ['preço', 'valor', 'custo', 'orçamento', 'plano', 'investimento'],
            response: 'Trabalhamos com 3 níveis de aceleração digital:\n\n1. **Essencial:** Automação de 1 fluxo crítico (ex: WhatsApp).\n2. **Pro:** Ecossistema de IA + Integração CRM.\n3. **Enterprise:** Automação total de processos (End-to-End).\n\nQuer saber valores específicos para o seu caso?',
            chips: ['Solicitar Proposta', 'Como Funciona?']
        },
        {
            keys: ['rpa', 'robô', 'automação', 'tarefa', 'fluxo'],
            response: 'Nossos robôs (RPA) eliminam 100% dos erros manuais. Eles processam dados, geram relatórios e gerem e-mails enquanto você foca na estratégia. 🦾',
            chips: ['Casos de Sucesso', 'Sectores']
        },
        {
            keys: ['atendimento', 'whatsapp', 'vendas', 'lead'],
            response: 'Transformamos seu WhatsApp em uma máquina de vendas. Qualificação automática de leads 24/7 e redirecionamento inteligente para seu time. 📈',
            chips: ['WhatsApp Direct', 'Ver Demonstração']
        },
        // 3. SECTORS
        {
            keys: ['banco', 'financeiro', 'logistica', 'comercio', 'setores'],
            response: 'Atuamos fortemente em:\n- **Bancos:** Conciliação automática.\n- **Logística:** Rastreio e alertas.\n- **Retail:** Gestão de stock inteligente.\n\nAlgum desses é o seu sector?',
            chips: ['Financeiro', 'Logística', 'Retail']
        },
        // 4. HIGH-INTENT / URGENT (Smart Redirects)
        {
            keys: ['contratar', 'reunião', 'urgente', 'agendar', 'ligar', 'falar agora', 'fechar'],
            response: 'Entendo a urgência! ⚡ Vou te priorizar para um atendimento direto no WhatsApp do nosso consultor sênior. Abrindo agora...',
            action: 'whatsapp'
        },
        // 5. GREETINGS & MENU
        {
            keys: ['olá', 'oi', 'ajuda', 'menu', 'voltar'],
            response: 'Estou aqui! 🤖✨ Escolha um caminho para explorarmos:\n\n- **Automação RPA** (Eficiência)\n- **IA & Chatbots** (Vendas)\n- **Estratégia** (Preços)',
            chips: ['Automação RPA', 'Chatbots WhatsApp', 'Ver Preços', 'WhatsApp Direct']
        }
    ];

    // State Management
    let state = {
        name: localStorage.getItem('vion_user_name') || null,
        history: [], // We won't persist history across reloads to avoid confusion during testing
        step: 'init' // init, asking_name, capturing_lead, normal
    };

    // --- INITIALIZATION ---
    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active') && chatBody.children.length === 0) {
            initChatFlow();
        }
    });

    // Adiciona botão WhatsApp dentro do Chatbot
    function addWhatsAppButton() {
        if (!document.getElementById('chatbot-whatsapp-btn')) {
            const btn = document.createElement('a');
            btn.href = 'https://wa.me/244934589436?text=Olá!+Quero+falar+com+um+consultor+da+VION';
            btn.target = '_blank';
            btn.className = 'chatbot-whatsapp-btn';
            btn.id = 'chatbot-whatsapp-btn';
            btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Falar no WhatsApp';
            btn.setAttribute('data-tooltip', 'Abrir WhatsApp Bot');
            chatWindow.appendChild(btn);
        }
    }
    // Mostra botão sempre que o chat abrir
    chatBtn.addEventListener('click', addWhatsAppButton);

    function initChatFlow() {
        if (state.name) {
            state.step = 'normal';
            botReply(`Olá de novo, ${state.name}! Sou a **Tchissola**. 👋 Como posso impulsionar seu negócio hoje?`);
            showChips(['Automação RPA', 'Chatbots WhatsApp', 'Ver Preços', 'WhatsApp Direct']);
        } else {
            state.step = 'asking_name';
            botReply('Olá! Me chamo **Tchissola**, a Inteligência Artificial da VION. 🤖✨\nComo posso te chamar?');
        }
    }

    // --- CORE LOGIC ---
    function processInput(text) {
        text = text.trim();
        const lowerText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize text

        // 1. Capture Name
        if (state.step === 'asking_name') {
            state.name = text;
            localStorage.setItem('vion_user_name', state.name);
            state.step = 'normal';
            botReply(`Prazer, ${state.name}! O que sua empresa precisa hoje?`);
            showChips(['Automação RPA', 'Chatbots WhatsApp', 'Ver Preços', 'WhatsApp Direct']);
            return;
        }

        // 2. Capture Lead
        if (state.step === 'capturing_lead') {
            state.step = 'normal'; // Reset
            botReply('Obrigado! Recebemos seu contato. 📝\nUm consultor vai te chamar em breve.\nPosso ajudar em algo mais?');
            showChips(['Voltar ao Menu', 'Falar com Especialista']);
            return;
        }

        // 3. Keyword Matching
        let matched = false;

        // Priority Check: Match specific phrases first (Longest match first usually better, but simple loop works if ordered)
        for (const entry of knowledgeBase) {
            // Check if ANY key is found in the input
            const isMatch = entry.keys.some(key => lowerText.includes(key));

            if (isMatch) {
                botReply(entry.response);

                // Handle Chips
                if (entry.chips) {
                    showChips(entry.chips);
                } else {
                    showChips(['Voltar ao Menu']); // Default fallback
                }

                // Handle Actions
                if (entry.action === 'whatsapp') {
                    setTimeout(() => window.open('https://wa.me/244926283434', '_blank'), 2000);
                }
                if (entry.action === 'capture_lead') {
                    state.step = 'capturing_lead';
                }

                matched = true;
                break; // Stop after first match to avoid multiple replies
            }
        }

        // 4. Fallback
        if (!matched) {
            botReply('Desculpe, ainda estou aprendendo. 🧠\nTente clicar em uma das opções abaixo:');
            showChips(['Automação RPA', 'Chatbots WhatsApp', 'Ver Preços', 'WhatsApp Direct']);
        }
    }

    // --- UI HELPERS ---
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        renderMessage(text, 'user');
        chatInput.value = '';
        processInput(text);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    function renderMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('chat-msg', sender);
        // Convert simple markdown-style bold to <strong>
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function botReply(text) {
        // Typing indicator
        const typing = document.createElement('div');
        typing.classList.add('chat-msg', 'bot', 'typing');
        typing.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatBody.appendChild(typing);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Remove chips while typing
        chatChips.innerHTML = '';

        setTimeout(() => {
            typing.remove();
            renderMessage(text, 'bot');
        }, 800);
    }

    function showChips(options) {
        // Delay chips slightly after message
        setTimeout(() => {
            chatChips.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('div');
                btn.classList.add('chat-chip');
                btn.innerText = opt;
                btn.onclick = () => {
                    renderMessage(opt, 'user');
                    processInput(opt);
                };
                chatChips.appendChild(btn);
            });
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 900);
    }
});
