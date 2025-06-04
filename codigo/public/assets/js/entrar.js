async function entrarConta(email, senha){
    try {
        const response = await fetch('/entrar-conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            if (response.status === 404) {
                alert('Email ou senha inválidos');
                throw new Error('Email ou senha inválidos');
            }
            alert('Erro ao criar conta. Verifique os dados e tente novamente.');
            return;
        }

        const data = await response.json();
        console.log(data);
        localStorage.setItem('account_token', data.account_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        window.location.href = '/contas/detalhes';


    } catch (error) {
        console.error('Erro ao criar conta:', error);
        console.log(error.message);
        if(error.message.includes("Usuário já existe")) {
            alert('Usuário já existe. Tente novamente com outro e-mail.');
            return;
        }
        alert('Erro ao criar conta. Tente novamente mais tarde.');     
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const account_token = localStorage.getItem('account_token');
    if (account_token) {
        window.location.href = '/contas/detalhes';
    }

    const senha_input = document.getElementById('senha');
    const email_input = document.getElementById('email');
    const criar_conta_btn = document.getElementById('entrar-conta-btn');



    criar_conta_btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = email_input.value;
        const senha = senha_input.value;

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        entrarConta( email, senha);
    });
})