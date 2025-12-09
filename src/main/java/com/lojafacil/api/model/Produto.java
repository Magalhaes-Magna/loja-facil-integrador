package com.lojafacil.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data // O Lombok cria Getters, Setters e toString automaticamente
@Entity // Avisa ao Spring que isso é uma tabela no banco
@Table(name = "produtos") // Nome da tabela no MySQL
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Integer id;

    @NotBlank(message = "O nome do produto é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "O preço de custo é obrigatório")
    @Min(value = 0, message = "O preço não pode ser negativo")
    private Double precoCusto;

    @NotNull(message = "O preço de venda é obrigatório")
    @Min(value = 0, message = "O preço não pode ser negativo")
    private Double precoVenda;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 0, message = "A quantidade não pode ser negativa")
    private Integer quantidade;
    
    private Integer quantidadeMinima; // Para o alerta de estoque
}
