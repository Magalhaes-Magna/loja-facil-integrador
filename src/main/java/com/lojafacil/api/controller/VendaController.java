package com.lojafacil.api.controller;

import com.lojafacil.api.model.ItemVenda;
import com.lojafacil.api.model.Produto;
import com.lojafacil.api.model.Venda;
import com.lojafacil.api.repository.ProdutoRepository;
import com.lojafacil.api.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository; // Para baixar estoque

    @PostMapping
    public Venda registrarVenda(@RequestBody Venda venda) {
        venda.setDataHora(LocalDateTime.now());
        
        double total = 0.0;
        
        for (ItemVenda item : venda.getItens()) {
            item.setVenda(venda);
            
            // --- LÓGICA DE BAIXA DE ESTOQUE  ---
            // 1. Busca o produto no banco
            Produto produtoNoBanco = produtoRepository.findById(item.getProduto().getId()).orElse(null);
            
            if (produtoNoBanco != null) {
                // 2. Abate a quantidade vendida
                int novoEstoque = produtoNoBanco.getQuantidade() - item.getQuantidade();
                produtoNoBanco.setQuantidade(novoEstoque);
                
                // 3. Salva o produto com estoque novo
                produtoRepository.save(produtoNoBanco);
                
                // Garante que o preço da venda seja o preço atual do produto
                item.setPrecoUnitario(produtoNoBanco.getPrecoVenda());
            }
            // ------------------------------------------

            total += item.getPrecoUnitario() * item.getQuantidade();
        }
        venda.setValorTotal(total);

        return vendaRepository.save(venda);
    }
    
    //  Métodos de relatórios ) ...
    @GetMapping("/relatorio/datas")
    public List<Venda> buscarPorDatas(@RequestParam String inicio, @RequestParam String fim) {
        LocalDateTime dataInicio = LocalDateTime.parse(inicio + "T00:00:00");
        LocalDateTime dataFim = LocalDateTime.parse(fim + "T23:59:59");
        return vendaRepository.findByDataHoraBetween(dataInicio, dataFim);
    }

    @GetMapping("/relatorio/cliente/{id}")
    public List<Venda> buscarPorCliente(@PathVariable Integer id) {
        return vendaRepository.findByClienteId(id);
    }
}
