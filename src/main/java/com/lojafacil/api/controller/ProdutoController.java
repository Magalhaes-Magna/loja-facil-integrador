package com.lojafacil.api.controller;

import com.lojafacil.api.model.Produto;
import com.lojafacil.api.repository.ProdutoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController // Diz que essa classe responde requisições REST (JSON)
@RequestMapping("/api/produtos") // Todos os métodos começam com /api/produtos
public class ProdutoController {

    @Autowired // Injeta o repositório automaticamente
    private ProdutoRepository repository;

    // 1. Salvar Produto (POST)
    @PostMapping
    public Produto cadastrar(@RequestBody Produto produto) {
        return repository.save(produto);
    }

    // 2. Listar Todos (GET)
    @GetMapping
    public List<Produto> listar() {
        return repository.findAll();
    }
    
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
