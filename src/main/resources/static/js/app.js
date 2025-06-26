// Variáveis globais
let currentUser = null;
let selectedBike = null;
let selectedRentalDays = 1;
let rentalStartDate = new Date();
let rentalEndDate = new Date();
rentalEndDate.setDate(rentalStartDate.getDate() + selectedRentalDays);

// Elementos do DOM
const authModal = document.getElementById('auth-modal');
const bikeModal = document.getElementById('bike-modal');
const checkoutModal = document.getElementById('checkout-modal');
const userAreaBtn = document.getElementById('user-area');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const rentBikeBtn = document.getElementById('rent-bike-btn');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const finishCheckoutBtn = document.getElementById('finish-checkout-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar bicicletas
    loadBikes();

    // Configurar listeners
    setupEventListeners();

    // Verificar se há usuário logado
    checkLoggedInUser();
});

// Configurar event listeners
function setupEventListeners() {
    // Auth modal
    userAreaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal();
    });

    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Trocar entre login e cadastro
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchAuthTab);
    });

    document.querySelectorAll('.switch-tab').forEach(link => {
        link.addEventListener('click', switchAuthTab);
    });

    // Formulário de login
    loginForm.addEventListener('submit', handleLogin);

    // Formulário de cadastro
    registerForm.addEventListener('submit', handleRegister);

    // Filtros de bicicletas
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', filterBikes);
    });

    // Opções de preço
    document.querySelectorAll('.price-option').forEach(option => {
        option.addEventListener('click', selectRentalPeriod);
    });

    // Botão de alugar
    rentBikeBtn.addEventListener('click', openCheckoutModal);

    // Navegação do checkout
    document.getElementById('proceed-to-payment-btn').addEventListener('click', proceedToPayment);
    document.getElementById('back-to-summary-btn').addEventListener('click', backToSummary);
    document.getElementById('back-to-bike-btn').addEventListener('click', backToBike);

    // Métodos de pagamento
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
        input.addEventListener('change', switchPaymentMethod);
    });

    // Confirmar pagamento
    confirmPaymentBtn.addEventListener('click', confirmPayment);

    // Finalizar checkout
    finishCheckoutBtn.addEventListener('click', finishCheckout);
}

// Verificar usuário logado
function checkLoggedInUser() {
    const userData = localStorage.getItem('wheelsUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUserUI();
    }
}

// Atualizar UI com informações do usuário
function updateUserUI() {
    if (currentUser) {
        document.getElementById('user-text').textContent = currentUser.name.split(' ')[0];
    } else {
        document.getElementById('user-text').textContent = 'Minha Conta';
    }
}

// Abrir modal de autenticação
function openAuthModal() {
    if (currentUser) {
        // Se já estiver logado, mostrar perfil ou fazer logout
        if (confirm(`Deseja sair da conta ${currentUser.name}?`)) {
            logout();
        }
    } else {
        authModal.style.display = 'flex';
        document.getElementById('login-email').focus();
    }
}

// Fechar todos os modais
function closeAllModals() {
    authModal.style.display = 'none';
    bikeModal.style.display = 'none';
    checkoutModal.style.display = 'none';
}

// Trocar entre abas de login/cadastro
function switchAuthTab(e) {
    e.preventDefault();
    const tab = this.dataset.tab || this.getAttribute('data-tab');

    // Atualizar botões da aba
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');

    // Atualizar conteúdo da aba
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Manipular login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Mostrar loading
    document.getElementById('login-text').style.display = 'none';
    document.getElementById('login-spinner').style.display = 'inline-block';

    try {
        // Simular requisição de login
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Em um ambiente real, isso viria da API
        const user = {
            id: 1,
            name: 'Fulano da Silva',
            email: email,
            matricula: '20230001'
        };

        currentUser = user;
        localStorage.setItem('wheelsUser', JSON.stringify(user));

        updateUserUI();
        closeAllModals();
        showSuccessMessage('Login realizado com sucesso!');
    } catch (error) {
        console.error('Erro no login:', error);
        showErrorMessage('Email ou senha incorretos');
    } finally {
        document.getElementById('login-text').style.display = 'inline';
        document.getElementById('login-spinner').style.display = 'none';
    }
}

// Manipular cadastro
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validação simples
    if (password !== confirmPassword) {
        showErrorMessage('As senhas não coincidem');
        return;
    }

    // Mostrar loading
    document.getElementById('register-text').style.display = 'none';
    document.getElementById('register-spinner').style.display = 'inline-block';

    try {
        // Simular requisição de cadastro
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Em um ambiente real, isso viria da API
        const user = {
            id: 2,
            name: name,
            email: email,
            matricula: '20230002'
        };

        currentUser = user;
        localStorage.setItem('wheelsUser', JSON.stringify(user));

        updateUserUI();
        closeAllModals();
        showSuccessMessage('Cadastro realizado com sucesso!');
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showErrorMessage('Erro ao cadastrar. Tente novamente.');
    } finally {
        document.getElementById('register-text').style.display = 'inline';
        document.getElementById('register-spinner').style.display = 'none';
    }
}

// Fazer logout
function logout() {
    currentUser = null;
    localStorage.removeItem('wheelsUser');
    updateUserUI();
    showSuccessMessage('Você saiu da sua conta');
}

// Carregar bicicletas
async function loadBikes() {
    try {
        // Simular requisição à API
        await new Promise(resolve => setTimeout(resolve, 800));

        // Dados mockados - em um ambiente real, isso viria da API
        const bikes = [
            {
                id: 1,
                modelo: 'Caloi Speed Pro',
                tipo: 'urbanas',
                disponivel: true,
                images: [
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg'
                ],
                descricao: 'Ideal para quem busca velocidade e desempenho no asfalto. A Caloi Speed Pro combina um quadro leve de alumínio com componentes de alta qualidade para oferecer a melhor experiência de pedalada urbana.',
                especificacoes: [
                    'Quadro de alumínio 6061',
                    'Rodas de 28 polegadas',
                    '21 velocidades',
                    'Freios a disco mecânicos',
                    'Peso: 12.5 kg'
                ],
                precoDiario: 50,
                avaliacoes: 42,
                mediaAvaliacoes: 4.5
            },
            {
                id: 2,
                modelo: 'Caloi Explorer Pro',
                tipo: 'esportivas',
                disponivel: true,
                images: [
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg'
                ],
                descricao: 'Perfeita para trilhas leves e aventuras urbanas com conforto. A Caloi Explorer Pro foi projetada para quem busca versatilidade e desempenho em diferentes terrenos.',
                especificacoes: [
                    'Quadro de aço carbono',
                    'Rodas de 29 polegadas',
                    '24 velocidades',
                    'Freios a disco hidráulicos',
                    'Peso: 14.2 kg'
                ],
                precoDiario: 60,
                avaliacoes: 36,
                mediaAvaliacoes: 4.7
            },
            {
                id: 3,
                modelo: 'Oggi Mountain Storm',
                tipo: 'montanha',
                disponivel: true,
                images: [
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg'
                ],
                descricao: 'Feita para encarar trilhas exigentes com robustez e controle total. A Oggi Mountain Storm é a escolha perfeita para os amantes de mountain bike que não abrem mão de qualidade e desempenho.',
                especificacoes: [
                    'Quadro de alumínio SLX',
                    'Rodas de 27.5 polegadas',
                    '27 velocidades',
                    'Suspensão dianteira de 120mm',
                    'Peso: 13.8 kg'
                ],
                precoDiario: 70,
                avaliacoes: 28,
                mediaAvaliacoes: 4.8
            },
            {
                id: 4,
                modelo: 'Sense Impulse',
                tipo: 'urbanas',
                disponivel: false,
                images: [
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg',
                    'https://i.imgur.com/cJ1laPH.jpeg'
                ],
                descricao: 'Bicicleta urbana com design moderno e confortável, perfeita para o dia a dia na cidade. A Sense Impulse combina estilo e praticidade em um único pacote.',
                especificacoes: [
                    'Quadro de aço carbono',
                    'Rodas de 26 polegadas',
                    '7 velocidades',
                    'Freios V-Brake',
                    'Peso: 15.0 kg'
                ],
                precoDiario: 45,
                avaliacoes: 19,
                mediaAvaliacoes: 4.3
            }
        ];

        renderBikes(bikes);
    } catch (error) {
        console.error('Erro ao carregar bicicletas:', error);
        showErrorMessage('Erro ao carregar bicicletas. Tente recarregar a página.');
    }
}

// Renderizar bicicletas
function renderBikes(bikes) {
    const bikesContainer = document.getElementById('bikes-container');
    bikesContainer.innerHTML = '';

    bikes.forEach(bike => {
        const bikeCard = document.createElement('div');
        bikeCard.className = 'bike-card';
        bikeCard.dataset.id = bike.id;
        bikeCard.dataset.type = bike.tipo;

        bikeCard.innerHTML = `
            <div class="bike-img" style="background-image: url('${bike.images[0]}')">
                ${bike.disponivel ? '<span class="bike-badge">Disponível</span>' : '<span class="bike-badge" style="background-color: var(--error)">Indisponível</span>'}
            </div>
            <div class="bike-info">
                <h3>${bike.modelo}</h3>
                <div class="bike-price">
                    R$ ${bike.precoDiario.toFixed(2)} <span>/ dia</span>
                </div>
                <div class="bike-features">
                    <span class="bike-feature">${bike.tipo === 'urbanas' ? 'Urbana' : bike.tipo === 'esportivas' ? 'Esportiva' : 'Montanha'}</span>
                    <span class="bike-feature">${bike.especificacoes[0].split(' ')[0]}</span>
                    <span class="bike-feature">${bike.especificacoes[2]}</span>
                </div>
                <div class="bike-actions">
                    <button class="btn btn-outline btn-details" ${!bike.disponivel ? 'disabled' : ''}>
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                    <button class="btn btn-primary btn-rent" ${!bike.disponivel ? 'disabled' : ''}>
                        <i class="fas fa-bicycle"></i> Alugar
                    </button>
                </div>
            </div>
        `;

        // Adicionar eventos
        bikeCard.querySelector('.btn-details').addEventListener('click', () => openBikeModal(bike));
        bikeCard.querySelector('.btn-rent').addEventListener('click', () => {
            if (!currentUser) {
                openAuthModal();
                showErrorMessage('Faça login para alugar uma bicicleta');
                return;
            }
            openBikeModal(bike);
        });

        bikesContainer.appendChild(bikeCard);
    });
}

// Filtrar bicicletas
function filterBikes() {
    const filter = this.dataset.filter;

    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    this.classList.add('active');

    // Aplicar filtro
    const bikeCards = document.querySelectorAll('.bike-card');
    bikeCards.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Abrir modal da bicicleta
function openBikeModal(bike) {
    selectedBike = bike;

    // Configurar imagens
    const mainImage = document.getElementById('bike-main-image');
    const thumbnailsContainer = document.getElementById('bike-thumbnails');

    mainImage.style.backgroundImage = `url('${bike.images[0]}')`;
    thumbnailsContainer.innerHTML = '';

    bike.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.style.backgroundImage = `url('${img}')`;
        thumbnail.addEventListener('click', () => {
            mainImage.style.backgroundImage = `url('${img}')`;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailsContainer.appendChild(thumbnail);
    });

    // Configurar informações
    document.getElementById('bike-modal-name').textContent = bike.modelo;
    document.getElementById('bike-modal-description').textContent = bike.descricao;
    document.getElementById('bike-modal-reviews').textContent = `${bike.avaliacoes} avaliações`;

    // Configurar especificações
    const specsList = document.getElementById('bike-modal-specs');
    specsList.innerHTML = '';
    bike.especificacoes.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });

    // Configurar preços
    document.getElementById('price-1day').textContent = bike.precoDiario.toFixed(2);
    document.getElementById('price-7day').textContent = (bike.precoDiario * 7 * 0.9).toFixed(2); // 10% off
    document.getElementById('price-30day').textContent = (bike.precoDiario * 30 * 0.8).toFixed(2); // 20% off

    // Abrir modal
    bikeModal.style.display = 'flex';
}

// Selecionar período de aluguel
function selectRentalPeriod() {
    document.querySelectorAll('.price-option').forEach(option => {
        option.classList.remove('active');
    });
    this.classList.add('active');

    selectedRentalDays = parseInt(this.dataset.days);
    rentalEndDate = new Date(rentalStartDate);
    rentalEndDate.setDate(rentalStartDate.getDate() + selectedRentalDays);
}

// Abrir modal de checkout
function openCheckoutModal() {
    if (!currentUser) {
        openAuthModal();
        showErrorMessage('Faça login para alugar uma bicicleta');
        return;
    }

    if (!selectedBike) {
        showErrorMessage('Nenhuma bicicleta selecionada');
        return;
    }

    // Configurar informações da bicicleta
    document.getElementById('checkout-bike-img').style.backgroundImage =
        `url('${selectedBike.images[0]}')`;
    document.getElementById('checkout-bike-name').textContent = selectedBike.modelo;
    document.getElementById('checkout-bike-type').textContent =
        selectedBike.tipo === 'urbanas' ? 'Bicicleta Urbana' :
        selectedBike.tipo === 'esportivas' ? 'Bicicleta Esportiva' : 'Bicicleta de Montanha';

    // Configurar datas
    const startDateStr = formatDate(rentalStartDate);
    const endDateStr = formatDate(rentalEndDate);

    document.getElementById('checkout-start-date').textContent = startDateStr;
    document.getElementById('checkout-end-date').textContent = endDateStr;
    document.getElementById('checkout-duration').textContent =
        selectedRentalDays === 1 ? '1 dia' : `${selectedRentalDays} dias`;

    // Calcular preço total
    let totalPrice = selectedBike.precoDiario * selectedRentalDays;

    // Aplicar descontos para períodos mais longos
    if (selectedRentalDays === 7) {
        totalPrice *= 0.9; // 10% off
    } else if (selectedRentalDays === 30) {
        totalPrice *= 0.8; // 20% off
    }

    document.getElementById('checkout-total').textContent = totalPrice.toFixed(2);

    // Resetar steps do checkout
    document.querySelectorAll('.checkout-step-content').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.checkout-step-content[data-step="1"]').classList.add('active');

    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('.step[data-step="1"]').classList.add('active');

    // Abrir modal
    bikeModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
}

// Formatador de data
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Avançar para pagamento
function proceedToPayment() {
    document.querySelector('.checkout-step-content[data-step="1"]').classList.remove('active');
    document.querySelector('.checkout-step-content[data-step="2"]').classList.add('active');

    document.querySelector('.step[data-step="1"]').classList.remove('active');
    document.querySelector('.step[data-step="1"]').classList.add('completed');
    document.querySelector('.step[data-step="2"]').classList.add('active');
}

// Voltar para resumo
function backToSummary() {
    document.querySelector('.checkout-step-content[data-step="2"]').classList.remove('active');
    document.querySelector('.checkout-step-content[data-step="1"]').classList.add('active');

    document.querySelector('.step[data-step="2"]').classList.remove('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');
}

// Voltar para a bicicleta
function backToBike() {
    closeAllModals();
    openBikeModal(selectedBike);
}

// Trocar método de pagamento
function switchPaymentMethod() {
    const method = this.id;

    document.querySelectorAll('.payment-form').forEach(form => {
        form.style.display = 'none';
    });

    document.getElementById(`${method}-form`).style.display = 'block';
}

// Confirmar pagamento
async function confirmPayment() {
    // Mostrar loading
    document.getElementById('payment-text').style.display = 'none';
    document.getElementById('payment-spinner').style.display = 'inline-block';

    try {
        // Simular processamento do pagamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Avançar para confirmação
        document.querySelector('.checkout-step-content[data-step="2"]').classList.remove('active');
        document.querySelector('.checkout-step-content[data-step="3"]').classList.add('active');

        document.querySelector('.step[data-step="2"]').classList.remove('active');
        document.querySelector('.step[data-step="2"]').classList.add('completed');
        document.querySelector('.step[data-step="3"]').classList.add('active');

        // Configurar detalhes da confirmação
        document.getElementById('confirmation-code').textContent = `WH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
        document.getElementById('confirmation-bike').textContent = selectedBike.modelo;
        document.getElementById('confirmation-period').textContent =
            `${formatDate(rentalStartDate)} - ${formatDate(rentalEndDate)}`;
        document.getElementById('confirmation-location').textContent = 'Estação Central';
    } catch (error) {
        console.error('Erro no pagamento:', error);
        showErrorMessage('Erro ao processar pagamento. Tente novamente.');
    } finally {
        document.getElementById('payment-text').style.display = 'inline';
        document.getElementById('payment-spinner').style.display = 'none';
    }
}

// Finalizar checkout
function finishCheckout() {
    closeAllModals();
    showSuccessMessage('Reserva confirmada com sucesso!');
    selectedBike = null;
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('show');
    }, 10);

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> ${message}
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('show');
    }, 10);

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Estilos dinâmicos para alertas
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .alert {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 2000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .alert.show {
        transform: translateY(0);
        opacity: 1;
    }

    .alert-success {
        background-color: var(--success);
    }

    .alert-error {
        background-color: var(--error);
    }
`;
document.head.appendChild(alertStyles);