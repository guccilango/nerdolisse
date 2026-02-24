// login.js — Autenticação do portal SIO/PF

// Banco de credenciais do sistema
const credenciais = [
    { usuario: 'jsilva', senha: 'PF@2026jsilva', nome: 'Agente João Silva' },
    { usuario: 'faraujo', senha: 'PF@2026faraujo', nome: 'Del. Fernanda Araújo' },
    { usuario: 'rmonteiro', senha: 'PF@2026rmonteiro', nome: 'Del. Ricardo Monteiro' },
    { usuario: 'pcosta', senha: 'PF@2026pcosta', nome: 'Del. Paulo H. Costa' },
    { usuario: 'cferreira', senha: 'PF@2026cferreira', nome: 'Del. Cláudia Ferreira' },
    { usuario: 'admin', senha: 'SIO#Root2026!', nome: 'Administrador do Sistema' }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    errorDiv.textContent = '';

    const user = credenciais.find(c => c.usuario === username && c.senha === password);

    if (user) {
        sessionStorage.setItem('pf_usuario', user.nome);
        sessionStorage.setItem('pf_login', user.usuario);
        errorDiv.style.color = '#16a34a';
        errorDiv.textContent = 'Autenticação bem-sucedida. Redirecionando...';
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        errorDiv.style.color = '#dc2626';
        errorDiv.textContent = 'ERRO: Credenciais inválidas. Tentativa registrada.';
        // Efeito de shake no card
        const card = document.querySelector('.login-card');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
    }
});
