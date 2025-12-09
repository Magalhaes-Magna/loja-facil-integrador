/* relatorio-validador.js */

// Função para controlar a troca de abas
function abrirAba(evento, tipoId) {
    // 1. Remove a classe 'active' de todas as seções e botões
    document.querySelectorAll('.report-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // 2. Adiciona a classe 'active' na seção escolhida e no botão clicado
    document.getElementById(tipoId).classList.add('active');
    evento.currentTarget.classList.add('active');
    
    // 3. Limpa resultados anteriores para não confundir o usuário
    limparResultados();
}

function limparResultados() {
    document.getElementById('areaResultados').style.display = 'none';
}

// ATUALIZAÇÃO: Relatório de Período
function gerarRelatorioPeriodo() {
    const inicio = document.getElementById('dataInicio').value;
    const fim = document.getElementById('dataFim').value;

    if(!inicio || !fim) { alert("Selecione as datas!"); return; }

    fetch(`http://localhost:8080/api/vendas/relatorio/datas?inicio=${inicio}&fim=${fim}`)
        .then(res => res.json())
        .then(vendas => {
            preencherTabelaRelatorio(vendas, "Vendas de " + inicio + " até " + fim);
        })
        .catch(err => alert("Erro ao buscar relatório: " + err));
}

// ATUALIZAÇÃO: Relatório de Cliente
function gerarRelatorioCliente() {
    const cpf = document.getElementById('buscaCpf').value;
    if(!cpf) { alert("Digite o CPF!"); return; }

    // 1. Acha o ID do cliente pelo CPF
    fetch('http://localhost:8080/api/clientes')
        .then(res => res.json())
        .then(clientes => {
            const cliente = clientes.find(c => c.cpf === cpf);
            if(!cliente) { alert("Cliente não encontrado!"); return; }

            // 2. Busca vendas desse ID
            return fetch(`http://localhost:8080/api/vendas/relatorio/cliente/${cliente.id}`);
        })
        .then(res => res.json())
        .then(vendas => {
            preencherTabelaRelatorio(vendas, "Histórico do Cliente");
        });
}

// Função auxiliar para não repetir código
function preencherTabelaRelatorio(vendas, titulo) {
    if (vendas.length === 0) { alert("Nenhum registro encontrado."); return; }
    
    let html = "";
    let qtdItens = 0;
    let valorTotal = 0;

    vendas.forEach(v => {
        const dataFormatada = new Date(v.dataHora).toLocaleDateString('pt-BR');
        // Proteção caso cliente tenha sido excluído ou nulo
        const nomeCliente = v.cliente ? v.cliente.nome : "Desconhecido"; 
        
        html += `
            <tr>
                <td>#${v.id}</td>
                <td>${dataFormatada}</td>
                <td>${nomeCliente}</td>
                <td>${v.itens.length}</td>
                <td>R$ ${v.valorTotal.toFixed(2)}</td>
            </tr>
        `;
        qtdItens += v.itens.length;
        valorTotal += v.valorTotal;
    });
    
    mostrarResultado(titulo, html, vendas.length, qtdItens, valorTotal.toFixed(2));
}

// Função auxiliar para exibir a tabela e totais
function mostrarResultado(titulo, linhasTabela, qtdVendas, qtdItens, valorTotal) {
    document.getElementById('tituloResultado').innerText = titulo;
    document.getElementById('tabelaCorpo').innerHTML = linhasTabela;
    
    document.getElementById('totalQtdVendas').innerText = qtdVendas;
    document.getElementById('totalQtdItens').innerText = qtdItens;
    document.getElementById('totalValor').innerText = valorTotal;
    
    document.getElementById('areaResultados').style.display = 'block';
}

// Pequena função utilitária para formatar data (ano-mes-dia -> dia/mes/ano)
function formatarData(dataAmericana) {
    if(!dataAmericana) return "";
    return dataAmericana.split('-').reverse().join('/');
}