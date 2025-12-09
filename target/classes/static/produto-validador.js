/* produto-validador.js  */

const formProduto = document.getElementById('formProduto');

// --- 1. CARREGAR LISTA DE PRODUTOS (Ao abrir a tela) ---
function carregarProdutos() {
    fetch('http://localhost:8080/api/produtos')
        .then(response => response.json())
        .then(produtos => {
            const tabela = document.querySelector('table tbody');
            tabela.innerHTML = ""; // Limpa a tabela antes de recriar

            produtos.forEach(p => {
                const linha = tabela.insertRow();
                
                // LÓGICA DE ALERTA DE ESTOQUE 
                // Se a quantidade atual for menor ou igual à mínima:
                let estiloTexto = "";
                let aviso = "";
                
                // Garante que existe valor na mínima (se for nulo, considera 0)
                const min = p.quantidadeMinima || 0;

                if (p.quantidade <= min) {
                    estiloTexto = "color: red; font-weight: bold;";
                    linha.style.backgroundColor = "#ffe6e6"; // Fundo vermelhinho claro
                    aviso = " ⚠️ (Baixo!)";
                }

                // Cria as colunas da tabela
                linha.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.nome}</td>
                    <td style="${estiloTexto}">
                        ${p.quantidade} ${aviso}
                    </td>
                    <td>R$ ${p.precoVenda.toFixed(2)}</td>
                    <td>
                        <button class="btn-edit" onclick="editarProduto(${p.id}, '${p.nome}', '${p.descricao || ''}', ${p.precoCusto}, ${p.precoVenda}, ${p.quantidade}, ${min})">Editar</button>
                        <button class="btn-delete" onclick="excluirProduto(${p.id})">Excluir</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error("Erro ao listar produtos:", error));
}

// Chama a função assim que a página carrega
window.onload = carregarProdutos;


// --- 2. SALVAR (Cadastrar Novo ou Editar Existente) ---
formProduto.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o formulário de recarregar a página

    // Coleta os dados do formulário
    const idEscondido = document.getElementById('idProduto').value;
    const nome = document.getElementById('nomeProduto').value;
    const descricao = document.getElementById('descricao').value;
    const qtd = document.getElementById('quantidade').value;
    const qtdMin = document.getElementById('qtdMinima').value;
    const precoCusto = document.getElementById('precoCusto').value;
    const precoVenda = document.getElementById('precoVenda').value;

    // Validações Básicas (Front-end)
    if (!nome || parseInt(qtd) < 0 || parseFloat(precoVenda) <= 0) {
        alert("Por favor, preencha os campos obrigatórios corretamente.");
        return;
    }

    // Monta o objeto JSON para enviar ao Java
    const dadosProduto = {
        id: idEscondido ? parseInt(idEscondido) : null, // Se tiver ID, envia (Edição). Se não, null (Novo).
        nome: nome,
        descricao: descricao,
        quantidade: parseInt(qtd),
        quantidadeMinima: parseInt(qtdMin),
        precoCusto: parseFloat(precoCusto),
        precoVenda: parseFloat(precoVenda)
    };

    // Envia para a API
    fetch('http://localhost:8080/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosProduto)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
    })
    .then(data => {
        alert("Produto salvo com sucesso!");
        
        // Limpeza e atualização
        formProduto.reset();
        document.getElementById('idProduto').value = ""; // Limpa o ID para voltar ao modo "Novo Cadastro"
        carregarProdutos(); // Recarrega a lista para mostrar a mudança
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao salvar produto. Verifique se o servidor Java está rodando.");
    });
});


// --- 3. FUNÇÃO EDITAR (Preenche o formulário) ---
function editarProduto(id, nome, desc, custo, venda, qtd, qtdMin) {
    // Joga os dados da linha da tabela para dentro dos campos do formulário
    document.getElementById('idProduto').value = id;
    document.getElementById('nomeProduto').value = nome;
    document.getElementById('descricao').value = desc;
    document.getElementById('precoCusto').value = custo;
    document.getElementById('precoVenda').value = venda;
    document.getElementById('quantidade').value = qtd;
    document.getElementById('qtdMinima').value = qtdMin;
    
    // Rola a tela para cima para o usuário ver o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    alert("Modo de Edição ativado. Altere os dados e clique em Salvar.");
}


// --- 4. FUNÇÃO EXCLUIR (Deleta do banco) ---
function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        fetch(`http://localhost:8080/api/produtos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert("Produto excluído com sucesso!");
                carregarProdutos(); // Atualiza a tabela
            } else {
                alert("Erro ao excluir. Verifique se este produto já tem vendas registradas.");
            }
        })
        .catch(error => alert("Erro de conexão ao excluir: " + error));
    }
}