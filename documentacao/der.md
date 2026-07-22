# Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    MAQUINAS ||--o{ PRODUCOES : realiza

    MAQUINAS {
        int id PK
        varchar nome
        varchar setor
        varchar tipo
        enum status
        decimal consumo_energia
        decimal temperatura
        datetime criado_em
        datetime atualizado_em
    }

    PRODUCOES {
        int id PK
        varchar produto
        int quantidade_produzida
        int quantidade_esperada
        date data_producao
        int maquina_id FK
        datetime criado_em
    }

    SUSTENTABILIDADE {
        int id PK
        decimal consumo_energia
        decimal consumo_agua
        decimal residuos
        decimal quantidade_reciclada
        decimal reducao_emissoes
        date data_registro
        datetime criado_em
    }

    OCORRENCIAS {
        int id PK
        varchar tipo
        varchar local
        date data_ocorrencia
        enum nivel_risco
        text descricao
        text medida_preventiva
        datetime criado_em
    }
    