# Dicionário de Dados

Este documento descreve as tabelas, os campos e as regras do banco de dados do sistema **Indústria Conectada**.

## Legenda

- **PK (Primary Key):** chave primária que identifica cada registro.
- **FK (Foreign Key):** chave estrangeira que relaciona duas tabelas.
- **NOT NULL:** o campo é obrigatório.
- **AUTO_INCREMENT:** o valor é gerado automaticamente pelo banco.
- **DEFAULT:** valor utilizado quando nenhum outro é informado.

## Tabela `maquinas`

Armazena os equipamentos monitorados pelo sistema.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador único da máquina. |
| `nome` | VARCHAR(100) | NOT NULL | Nome utilizado para identificar a máquina. |
| `setor` | VARCHAR(100) | NOT NULL | Setor da indústria onde a máquina está localizada. |
| `tipo` | VARCHAR(100) | NOT NULL | Categoria ou tipo do equipamento. |
| `status` | ENUM | NOT NULL | Situação atual: Em operação, Em manutenção, Parada ou Desativada. |
| `consumo_energia` | DECIMAL(10,2) UNSIGNED | NOT NULL | Consumo médio de energia da máquina em kWh. |
| `temperatura` | DECIMAL(5,2) | NOT NULL | Temperatura atual da máquina em graus Celsius. |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data e hora em que o registro foi criado. |
| `atualizado_em` | DATETIME | Atualização automática | Data e hora da última alteração do registro. |

## Tabela `producoes`

Armazena os registros de produção realizados pelas máquinas.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador único da produção. |
| `produto` | VARCHAR(150) | NOT NULL | Nome do produto fabricado. |
| `quantidade_produzida` | INT UNSIGNED | NOT NULL | Quantidade de unidades efetivamente produzidas. |
| `quantidade_esperada` | INT UNSIGNED | NOT NULL, maior que zero | Meta de unidades para o período. |
| `data_producao` | DATE | NOT NULL | Data em que a produção foi realizada. |
| `maquina_id` | INT UNSIGNED | FK, NOT NULL | Identificador da máquina utilizada na produção. |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data e hora em que o registro foi criado. |

### Relacionamento

O campo `maquina_id` referencia `maquinas.id`. Uma máquina pode possuir vários registros de produção, mas cada produção pertence a uma única máquina.

## Tabela `sustentabilidade`

Armazena os indicadores ambientais da indústria.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador único do registro ambiental. |
| `consumo_energia` | DECIMAL(10,2) UNSIGNED | NOT NULL | Energia consumida no período em kWh. |
| `consumo_agua` | DECIMAL(10,2) UNSIGNED | NOT NULL | Água consumida no período em metros cúbicos. |
| `residuos` | DECIMAL(10,2) UNSIGNED | NOT NULL | Quantidade total de resíduos gerados em quilogramas. |
| `quantidade_reciclada` | DECIMAL(10,2) UNSIGNED | NOT NULL | Quantidade de resíduos reciclados em quilogramas. |
| `reducao_emissoes` | DECIMAL(5,2) UNSIGNED | DEFAULT 0, máximo 100 | Percentual de redução de emissões. |
| `data_registro` | DATE | NOT NULL | Data de referência dos indicadores. |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data e hora em que o registro foi criado. |

### Regra de negócio

A `quantidade_reciclada` não pode ser maior que o total de `residuos`. A taxa de reciclagem será calculada assim:

```text
taxa de reciclagem = (quantidade reciclada / resíduos) × 100
```

## Tabela `ocorrencias`

Armazena registros relacionados à saúde e segurança no trabalho.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador único da ocorrência. |
| `tipo` | VARCHAR(100) | NOT NULL | Tipo de risco, acidente ou situação observada. |
| `local` | VARCHAR(100) | NOT NULL | Local onde a ocorrência foi identificada. |
| `data_ocorrencia` | DATE | NOT NULL | Data em que a ocorrência aconteceu. |
| `nivel_risco` | ENUM | NOT NULL | Classificação: Baixo, Médio, Alto ou Crítico. |
| `descricao` | TEXT | NOT NULL | Explicação detalhada da ocorrência. |
| `medida_preventiva` | TEXT | NOT NULL | Ação recomendada para evitar ou corrigir o problema. |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data e hora em que o registro foi criado. |

## Resumo dos relacionamentos

| Tabela de origem | Campo | Tabela de destino | Campo | Cardinalidade |
|---|---|---|---|---|
| `producoes` | `maquina_id` | `maquinas` | `id` | Muitas produções para uma máquina (N:1). |
