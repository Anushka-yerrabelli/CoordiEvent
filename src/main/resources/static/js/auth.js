document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    // Switch Tabs
    loginTab?.addEventListener('click', () => {
        loginTab.classList.add('text-primary', 'border-primary');
        loginTab.classList.remove('text-gray-500', 'bg-gray-50');
        registerTab.classList.add('text-gray-500', 'bg-gray-50');
        registerTab.classList.remove('text-primary', 'border-primary');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab?.addEventListener('click', () => {
        registerTab.classList.add('text-primary', 'border-primary');
        registerTab.classList.remove('text-gray-500', 'bg-gray-50');
        loginTab.classList.add('text-gray-500', 'bg-gray-50');
        loginTab.classList.remove('text-primary', 'border-primary');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Toggle Portfolio Input
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const portfolioContainer = document.getElementById('portfolio-container');
            if (portfolioContainer) {
                if (e.target.value === 'PROVIDER') {
                    portfolioContainer.classList.remove('hidden');
                } else {
                    portfolioContainer.classList.add('hidden');
                }
            }
        });
    });

    // Handle Login
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const btnText = document.getElementById('login-btn-text');
        const errorDiv = document.getElementById('login-error');
        
        btnText.textContent = 'Signing In...';
        errorDiv.classList.add('hidden');

        try {
            const data = await Api.post('/auth/login', { username, password });
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role,
                providerStatus: data.providerStatus
            }));
            window.location.href = '/dashboard.html';
        } catch (error) {
            errorDiv.textContent = error.message.includes('Unexpected') ? 'Invalid Username or Password' : error.message;
            errorDiv.classList.remove('hidden');
            btnText.textContent = 'Sign In';
        }
    });

    // Handle Registration
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const phoneNumber = document.getElementById('reg-phone').value;
        const portfolioUrl = document.getElementById('reg-portfolio')?.value;
        const role = document.querySelector('input[name="role"]:checked').value;
        const errorDiv = document.getElementById('register-error');

        errorDiv.classList.add('hidden');

        try {
            await Api.post('/auth/register', { name, username, email, password, role, phoneNumber, portfolioUrl });
            // Auto login after register
            const data = await Api.post('/auth/login', { username, password });
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role,
                providerStatus: data.providerStatus
            }));
            window.location.href = '/dashboard.html';
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });

    // Redirect if already logged in
    if (Api.getToken() && window.location.pathname.includes('login.html')) {
        window.location.href = '/dashboard.html';
    }
});
