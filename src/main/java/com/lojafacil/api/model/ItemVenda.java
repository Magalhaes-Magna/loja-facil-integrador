package com.lojafacil.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "itens_venda")
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne // Um item pertence a uma venda
    @JoinColumn(name = "venda_id")
    @JsonIgnore // Importante: Evita loop infinito no JSON (Venda chama Item -> Item chama Venda...)
    private Venda venda;

    @ManyToOne // Um item se refere a um produto
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private Integer quantidade;
    private Double precoUnitario; // Preço no momento da venda (histórico)
}