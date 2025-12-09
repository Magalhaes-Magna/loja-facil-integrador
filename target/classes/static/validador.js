/**
 * validador.js
 * Responsável por verificar os dados antes de "enviar"
 */

// 1. Pegamos o formulário pelo código 
const formulario = document.querySelector('form');

// 2. Adicionamos um "Ouvinte de Eventos" 
// Estamos ouvindo o evento 'submit' (quando o usuário tenta enviar o formulário)
formulario.addEventListener('submit', function(event) {

    // PREVENIR O ENVIO PADRÃO:
    event.preventDefault();

    // 3. Pegar os valores dos campos 
    let usuario = document.getElementById('usuario').value;
    let senha = document.getElementById('senha').value;

    // 4. A Lógica de Validação 
    if (usuario === '') {
        alert('Por favor, preencha o campo Usuário!');
        // Coloca o foco (cursor) de volta no campo usuário
        document.getElementById('usuario').focus();
        return; // Para a execução aqui
    }

    if (senha === '') {
        alert('Por favor, preencha o campo Senha!');
        document.getElementById('senha').focus();
        return;
    }

    // Se passou por tudo acima, significa que está válido
    alert('Dados validados com sucesso! Bem-vindo, ' + usuario);
    
if (senha === '') {
        alert('Por favor, preencha o campo Senha!');
        document.getElementById('senha').focus();
        return;
    }

    // Se passou por tudo, exibe o sucesso E REDIRECIONA
    alert('Login realizado com sucesso!');
    
    window.location.href = "menu.html"; 
});