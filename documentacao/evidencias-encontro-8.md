# Encontro 8 — Integração da API

## Tecnologias utilizadas

O projeto usa HTML, CSS e JavaScript no Front-End, conforme combinado com o professor. A API foi desenvolvida com Node.js e Express, e a persistência utiliza MySQL.

## Funcionalidades integradas

- Listagem das máquinas cadastradas no MySQL;
- Cadastro com `POST /maquinas`;
- Consulta para edição com `GET /maquinas/:id`;
- Atualização com `PUT /maquinas/:id`;
- Exclusão com `DELETE /maquinas/:id`;
- Indicadores e tabela-resumo do Dashboard carregados pela API;
- Filtros de nome e status na tela de máquinas;
- Mensagens de carregamento, sucesso e erro;
- Confirmação antes da exclusão;
- Bloqueio temporário dos botões durante requisições.

## Como executar

1. Inicie o MySQL e confirme que o banco `industria_conectada` existe.
2. Abra um terminal na pasta `backend`.
3. Instale as dependências com `npm.cmd install`.
4. Inicie a API com `npm.cmd run dev`.
5. Confirme o funcionamento em `http://localhost:3000/saude`.
6. Abra a pasta `frontend` usando o Live Server do VS Code.

> No PowerShell com execução de scripts bloqueada, use `npm.cmd` no lugar de `npm`.

## Validação realizada

O fluxo CRUD foi testado diretamente contra a API e o MySQL:

1. Uma máquina temporária foi cadastrada;
2. O registro foi consultado pelo identificador;
3. O registro foi atualizado;
4. O registro foi excluído;
5. A listagem final confirmou que o banco voltou ao estado original.

Resultado: as operações `GET`, `POST`, `PUT` e `DELETE` estão funcionando.

## Observação

Os dados de máquinas já são reais e persistidos no MySQL. Produção e sustentabilidade continuam como protótipos visuais porque ainda não possuem rotas próprias na API.
