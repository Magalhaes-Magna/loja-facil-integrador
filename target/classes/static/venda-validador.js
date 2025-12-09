/* venda-validador.js - VERSÃO FINAL INTEGRADA */

// Variáveis para armazenar os dados da venda atual
let clienteSelecionado = null;
let itensCarrinho = [];
let totalVenda = 0.0;

// --- 1. BUSCAR CLIENTE (Consumindo a API Java) ---
document.getElementById('btnBuscaCliente').addEventListener('click', function() {
    const cpfDigitado = document.getElementById('cpfCliente').value;
    
    if (!cpfDigitado) {
        alert("Digite um CPF para pesquisar.");
        return;
    }

    // Busca todos os clientes e filtra pelo CPF 
    fetch('http://localhost:8080/api/clientes')
        .then(response => response.json())
        .then(listaClientes => {
            // Procura o cliente na lista que veio do Java
            const clienteEncontrado = listaClientes.find(c => c.cpf === cpfDigitado);

            if (clienteEncontrado) {
                clienteSelecionado = clienteEncontrado;
                const display = document.getElementById('nomeClienteDisplay');
                display.innerText = "Cliente: " + clienteEncontrado.nome;
                display.style.color = "green";
                alert("Cliente encontrado: " + clienteEncontrado.nome);
            } else {
                alert("Cliente não encontrado com este CPF. Cadastre-o antes!");
                clienteSelecionado = null;
                document.getElementById('nomeClienteDisplay').innerText = "Cliente não identificado";
            }
        })
        .catch(erro => console.error("Erro ao buscar clientes:", erro));
});

// --- 2. BUSCAR PRODUTO (Ao sair do campo código) ---
document.getElementById('codProduto').addEventListener('blur', function() {
    const idProduto = this.value;
    
    if (!idProduto) return;

    // Busca todos os produtos e filtra pelo ID
    fetch('http://localhost:8080/api/produtos')
        .then(response => response.json())
        .then(listaProdutos => {
            // O ID no banco é numérico, então convertemos
            const produtoEncontrado = listaProdutos.find(p => p.id == idProduto);

            if (produtoEncontrado) {
                document.getElementById('nomeProduto').value = produtoEncontrado.nome;
                document.getElementById('precoUnitario').value = produtoEncontrado.precoVenda;
                document.getElementById('quantidade').focus();
            } else {
                alert("Produto código " + idProduto + " não existe!");
                document.getElementById('nomeProduto').value = "";
                document.getElementById('precoUnitario').value = "";
            }
        })
        .catch(erro => console.error("Erro ao buscar produtos:", erro));
});

// --- 3. ADICIONAR AO CARRINHO (Visual apenas) ---
document.getElementById('btnAdicionar').addEventListener('click', function() {
    const idProd = document.getElementById('codProduto').value;
    const nome = document.getElementById('nomeProduto').value;
    const preco = parseFloat(document.getElementById('precoUnitario').value);
    const qtd = parseInt(document.getElementById('quantidade').value);

    if (!nome || isNaN(preco) || isNaN(qtd) || qtd <= 0) {
        alert("Selecione um produto válido e quantidade positiva.");
        return;
    }

    // Adiciona ao array de controle (que será enviado pro Java)
    itensCarrinho.push({
        produto: { id: idProd }, // Formato que o Java espera: Objeto Produto dentro do Item
        quantidade: qtd,
        precoUnitario: preco
    });

    // Atualiza a tabela visual
    const subtotal = preco * qtd;
    totalVenda += subtotal;
    
    const tabela = document.getElementById('tabelaItens').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();
    novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${qtd}</td>
        <td>R$ ${preco.toFixed(2)}</td>
        <td>R$ ${subtotal.toFixed(2)}</td>
    `;
    
    document.getElementById('valorTotalVenda').innerText = totalVenda.toFixed(2);

    // Limpa campos
    document.getElementById('codProduto').value = "";
    document.getElementById('nomeProduto').value = "";
    document.getElementById('precoUnitario').value = "";
    document.getElementById('quantidade').value = "1";
    document.getElementById('codProduto').focus();
});

// --- 4. FINALIZAR VENDA (POST para o Java) ---
document.getElementById('btnFinalizar').addEventListener('click', function() {
    if (itensCarrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }
    
    if (!clienteSelecionado) {
        alert("Por favor, identifique o cliente antes de finalizar (Busque pelo CPF).");
        return;
    }

    // Monta o JSON Exato que a VendaController espera
    const vendaJSON = {
        cliente: { id: clienteSelecionado.id }, // Só precisamos mandar o ID
        itens: itensCarrinho
    };

    // Envia para o Back-end
    fetch('http://localhost:8080/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendaJSON)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao registrar venda");
        return response.json();
    })
    .then(vendaSalva => {
        alert(`VENDA REALIZADA COM SUCESSO!\nID da Venda: ${vendaSalva.id}\nTotal: R$ ${vendaSalva.valorTotal}`);
        location.reload(); // Recarrega a página para nova venda
    })
    .catch(erro => {
        console.error(erro);
        alert("Erro ao enviar venda para o servidor. Veja o console.");
    });
});