package com.lojafacil.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

@Data
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido") // Validação do Hibernate para CPF brasileiro!
    private String cpf;

    private String endereco;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido") // Valida se tem @ e ponto
    private String email;

    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;
}
