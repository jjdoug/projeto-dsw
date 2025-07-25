
# Sistema de Logística de Entregas

Este projeto é um sistema web de rastreamento e administração de entregas, desenvolvido com HTML, CSS e JavaScript. Ele é dividido em três áreas principais: Página Inicial, Rastreamento e Administração.

## Estrutura de Pastas

```
/
├── css/
│   ├── admin.css               # Estilos da área administrativa
│   └── rastreamento.css        # Estilos da área de rastreamento
│
├── js/
│   ├── script_clientes.js      # Funcionalidades de cadastro e listagem de clientes
│   ├── script_encomendas.js    # Funcionalidades de cadastro e listagem de encomendas
│   ├── script_entregas.js      # Lógica para entregas
│   ├── script_rastreamento.js  # Lógica para busca de encomendas via código de rastreio
│   └── script_rotas.js         # Funcionalidades relacionadas às rotas de entrega
│
├── admin.html                  # Área administrativa (requer login)
├── index.html                  # Página inicial
├── login.html                  # Tela de login da administração
└── rastreamento.html           # Página de rastreamento público
```

##  Funcionalidades Implementadas

-  **Tela de Login** para acesso à área administrativa (com controle por `sessionStorage`).
-  **Página de Rastreamento** que permite buscar encomendas por código.
-  **Cadastro e Consulta** de Clientes e Encomendas.
-  **Listagem com Filtros** para facilitar a navegação de dados.
-  **Scripts JavaScript** dedicados para cada módulo (clientes, encomendas, entregas, rotas).

##  Observações

- O sistema é apenas frontend e consome dados de uma API REST fornecida pelo professor.
- A navegação e a persistência da sessão são controladas via JavaScript, utilizando sessionStorage.
