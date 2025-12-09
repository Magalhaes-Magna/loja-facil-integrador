package com.lojafacil.api.repository;

import com.lojafacil.api.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

// <Tipo da Entidade, Tipo do ID>
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}