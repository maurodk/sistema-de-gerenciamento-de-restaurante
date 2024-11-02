document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginError = document.getElementById('login-error');

            // Credenciais de exemplo (apenas para demonstração)
            const validUsername = 'admin';
            const validPassword = 'senha123';

            if (username === validUsername && password === validPassword) {
                localStorage.setItem('isLoggedIn', 'true');  // Armazena login
                window.location.href = 'index.html';         // Redireciona para o sistema
            } else {
                loginError.textContent = 'Usuário ou senha incorretos!';
            }
        });
    }
});
