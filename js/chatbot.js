document.addEventListener('DOMContentLoaded', () => {

    // --- CHATBOT CONFIG ---
    const chatBtn = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatChips = document.getElementById('chat-chips');

    // --- KNOWLEDGE BASE (Strictly Matched to Chips) ---
    const knowledgeBase = [
        // 1. SERVICES
        {
            keys: ['preço', 'valor', 'custo', 'orçamento', 'plano'],
            response: 'Nossos projetos são personalizados. 💰\n\n- **Chatbots:** A partir de Kz 150.000\n- **RPA/Integrações:** Sob medida.\n\nQuer um orçamento exato?',
            chips: ['Pedir Orçamento', 'Ver Outros Serviços']
        },
        {
            keys: ['rpa', 'robô', 'automação', 'tarefa'],
            response: 'RPA são "robôs de software" que fazem tarefas chatas por você (clicar, digitar, ler e-mails) 24h por dia. ⚡',
            chips: ['Exemplos de RPA', 'Pedir Orçamento']
        },
        {
            keys: ['exemplo', 'exemplos de rpa', 'caso de uso'],
            response: 'Aqui estão alguns exemplos reais:\n\n1. **Financeiro:** Emissão automática de notas e boletos.\n2. **RH:** Cadastro de funcionários e folha.\n3. **Vendas:** Disparo de mensagens no WhatsApp.\n\nQual desses te interessa?',
            chips: ['Financeiro', 'Vendas', 'Falar com Especialista']
        },
        {
            keys: ['chat', 'chatbot', 'atendimento', 'whatsapp'],
            response: 'Criamos assistentes inteligentes (como eu! 🤖) que atendem seus clientes no WhatsApp e Site, agendam reuniões e tiram dúvidas sozinhos.',
            chips: ['Quero um Chatbot', 'Ver Preços']
        },
        // 2. LEAD GEN / ACTIONS
        {
            keys: ['pedir orçamento', 'quero um chatbot', 'quero orçamento', 'cotação'],
            response: 'Perfeito! Para eu montar uma proposta, qual seu **WhatsApp ou E-mail**?',
            action: 'capture_lead'
        },
        {
            keys: ['humano', 'especialista', 'falar com gente', 'suporte', 'atendente', 'whatsapp direct', 'contacto whatsapp'],
            response: 'Entendido. Vou abrir o WhatsApp do nosso consultor para você. Um instante... 👨‍💻',
            action: 'whatsapp'
        },
        {
            keys: ['demo', 'demonstração'],
            response: 'Podemos agendar uma demo rápida! Me diga seu nome e contato?',
            action: 'capture_lead'
        },
        // 3. GREETINGS
        {
            keys: ['olá', 'oi', 'começar', 'menu', 'voltar'],
            response: 'Olá! Sou a IA da VION. Como posso ajudar sua empresa hoje? 🚀',
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

    function initChatFlow() {
        if (state.name) {
            state.step = 'normal';
            botReply(`Olá de novo, ${state.name}! 👋 Como posso te ajudar?`);
            showChips(['Automação RPA', 'Chatbots WhatsApp', 'Ver Preços', 'WhatsApp Direct']);
        } else {
            state.step = 'asking_name';
            botReply('Olá! Sou o Assistente Virtual da VION. 🤖\nQual é o seu nome?');
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
