CREATE DATABASE IF NOT EXISTS industria_conectada
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE industria_conectada;

CREATE TABLE IF NOT EXISTS maquinas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    setor VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    status ENUM(
        'Em operação',
        'Em manutenção',
        'Parada',
        'Desativada'
    ) NOT NULL,
    consumo_energia DECIMAL(10, 2) UNSIGNED NOT NULL,
    temperatura DECIMAL(5, 2) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS producoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    produto VARCHAR(150) NOT NULL,
    quantidade_produzida INT UNSIGNED NOT NULL,
    quantidade_esperada INT UNSIGNED NOT NULL,
    data_producao DATE NOT NULL,
    maquina_id INT UNSIGNED NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_producoes_maquina
        FOREIGN KEY (maquina_id)
        REFERENCES maquinas(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_quantidade_esperada
        CHECK (quantidade_esperada > 0)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS sustentabilidade (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    consumo_energia DECIMAL(10, 2) UNSIGNED NOT NULL,
    consumo_agua DECIMAL(10, 2) UNSIGNED NOT NULL,
    residuos DECIMAL(10, 2) UNSIGNED NOT NULL,
    quantidade_reciclada DECIMAL(10, 2) UNSIGNED NOT NULL,
    reducao_emissoes DECIMAL(5, 2) UNSIGNED NOT NULL DEFAULT 0,
    data_registro DATE NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_quantidade_reciclada
        CHECK (quantidade_reciclada <= residuos),

    CONSTRAINT chk_reducao_emissoes
        CHECK (reducao_emissoes <= 100)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS ocorrencias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    local VARCHAR(100) NOT NULL,
    data_ocorrencia DATE NOT NULL,
    nivel_risco ENUM(
        'Baixo',
        'Médio',
        'Alto',
        'Crítico'
    ) NOT NULL,
    descricao TEXT NOT NULL,
    medida_preventiva TEXT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;