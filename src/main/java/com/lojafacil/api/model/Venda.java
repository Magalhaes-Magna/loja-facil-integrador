package com.lojafacil.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "vendas")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime dataHora = LocalDateTime.now(); // Data automática de agora

    private Double valorTotal;

    @ManyToOne // Muitas vendas para um Cliente
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Uma venda tem MUITOS itens
    // cascade = ALL: Se eu salvar a Venda, o Java salva os Itens automaticamente!
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItemVenda> itens = new ArrayList<>();
}