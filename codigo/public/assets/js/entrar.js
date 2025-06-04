async function entrarConta(email, senha){
    try {
        const response = await fetch('/entrar-conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error || 'Erro desconhecido ao entrar na conta');
        }

        console.log(data);
        localStorage.setItem('account_token', data.account_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        window.location.href = '/contas/detalhes';


    } catch (error) {
        alert(error.message || 'Ocorreu um erro ao entrar na conta. Por favor, tente novamente.');     
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