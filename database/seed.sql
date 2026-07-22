USE industria_conectada;

INSERT INTO maquinas (
    nome,
    setor,
    tipo,
    status,
    consumo_energia,
    temperatura
) VALUES
(
    'Torno CNC 01',
    'Usinagem',
    'Torno',
    'Em operação',
    45.00,
    42.00
),
(
    'Prensa Hidráulica',
    'Estamparia',
    'Prensa',
    'Em manutenção',
    70.00,
    28.00
),
(
    'Esteira 03',
    'Montagem',
    'Esteira',
    'Parada',
    20.00,
    24.00
);

INSERT INTO producoes (
    produto,
    quantidade_produzida,
    quantidade_esperada,
    data_producao,
    maquina_id
) VALUES
(
    'Engrenagem A',
    850,
    1000,
    '2026-07-15',
    1
);

INSERT INTO sustentabilidade (
    consumo_energia,
    consumo_agua,
    residuos,
    quantidade_reciclada,
    reducao_emissoes,
    data_registro
) VALUES
(
    620.00,
    42.00,
    250.00,
    180.00,
    18.00,
    '2026-07-01'
);

INSERT INTO ocorrencias (
    tipo,
    local,
    data_ocorrencia,
    nivel_risco,
    descricao,
    medida_preventiva
) VALUES
(
    'Risco mecânico',
    'Setor de usinagem',
    '2026-07-10',
    'Médio',
    'Proteção da máquina estava mal posicionada.',
    'Revisar a proteção antes de iniciar a operação.'
);