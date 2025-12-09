package com.lojafacil.api.repository;

import com.lojafacil.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    // Aqui método .save() e .findAll() 
}