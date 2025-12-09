/* cliente-validador.js */

const formCliente = document.getElementById('formCliente');

formCliente.addEventListener('submit', function(event) {
    // 1. Impede o envio padrão para validarmos antes
    event.preventDefault();

    // 2. Coleta os valores
    const cpf = document.getElementById('cpf').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;

    // 3. Validações

    // Validação de CPF (Simples: verifica se está vazio ou tamanho incorreto)
    if (cpf.trim() === '' || cpf.length < 11) {
        alert("Erro: Informe um CPF válido!");
        document.getElementById('cpf').focus();
        return;
    }

    // Validação de Nome
    if (nome.trim() === '') {
        alert("Erro: O nome do cliente é obrigatório!");
        document.getElementById('nome').focus();
        return;
    }

    // Validação de E-mail (Verifica se tem '@' e '.')
    if (email.trim() === '' || !email.includes('@') || !email.includes('.')) {
        alert("Erro: Informe um e-mail válido (ex: cliente@email.com)!");
        document.getElementById('email').focus();
        return;
    }

    // Validação de Telefone
    if (telefone.trim() === '') {
        alert("Erro: O telefone é obrigatório para contato!");
        document.getElementById('telefone').focus();
        return;
    }

// --- INTEGRAÇÃO COM O JAVA ---
    
    // 1. Criar o objeto JSON igualzinho à classe Java "Cliente"
    const idEscondido = document.getElementById('idCliente').value;
    
    const dadosCliente = {
        id: idEscondido ? parseInt(idEscondido) : null, // Se tiver ID, manda. Se não, vai nulo (cria novo)
        nome: nome,
        cpf: cpf,
        email: email,
        telefone: telefone,
        endereco: "Endereço não informado no form" 
    };

    // 2. Enviar para a API
  fetch('http://localhost:8080/api/clientes', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCliente)
    })
    .then(response => response.json())
    .then(data => {
        alert("Salvo com sucesso!");
        formCliente.reset();
        document.getElementById('idCliente').value = ""; // Limpa o ID escondido
        carregarClientes(); // Atualiza a tabela na hora
    })
    .catch(error => alert("Erro ao salvar: " + error));
});

// --- FUNÇÕES DE AÇÃO DA TABELA ---

// 1. EDITAR: Pega os dados da linha e joga no formulário
function editarCliente(id, nome, cpf, email, telefone) {
    document.getElementById('idCliente').value = id; // Guarda o ID no campo invisível
    document.getElementById('nome').value = nome;
    document.getElementById('cpf').value = cpf;
    document.getElementById('email').value = email;
    document.getElementById('telefone').value = telefone;
    
    // Opcional: Leva a tela pra cima
    window.scrollTo(0, 0);
    alert("Dados carregados no formulário. Altere e clique em Salvar.");
}

// 2. EXCLUIR: Chama a API de Delete
function excluirCliente(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert("Cliente excluído!");
            carregarClientes(); // Atualiza a tabela
        })
        .catch(error => alert("Erro ao excluir (Pode haver vendas vinculadas!): " + error));
    }
}

// 3. LISTAR (Atualizado com os botões certos)
function carregarClientes() {
    fetch('http://localhost:8080/api/clientes')
        .then(response => response.json())
        .then(clientes => {
            const tabela = document.querySelector('table tbody');
            tabela.innerHTML = "";

            clientes.forEach(c => {
                const linha = tabela.insertRow();
              
                linha.innerHTML = `
                    <td>${c.cpf}</td>
                    <td>${c.nome}</td>
                    <td>${c.email}</td>
                    <td>
                        <button class="btn-edit" onclick="editarCliente(${c.id}, '${c.nome}', '${c.cpf}', '${c.email}', '${c.telefone}')">Editar</button>
                        <button class="btn-delete" onclick="excluirCliente(${c.id})">Excluir</button>
                    </td>
                `;
            });
        });
}
window.onload = carregarClientes;