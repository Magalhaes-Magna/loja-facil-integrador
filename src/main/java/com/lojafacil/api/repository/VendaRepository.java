package com.lojafacil.api.repository;

import com.lojafacil.api.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Integer> {
    
    // Busca customizada por Datas
    @Query("SELECT v FROM Venda v WHERE v.dataHora BETWEEN :inicio AND :fim")
    List<Venda> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    // Busca customizada por Cliente
    List<Venda> findByClienteId(Integer id);
}