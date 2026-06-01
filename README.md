Lista de Tarefas — Full Stack com Testes Cypress

Aplicação de Lista de Tarefas com **frontend HTML/CSS/JS** e **backend Node.js + Express**, com testes automatizados usando **Cypress** e workflows de **GitHub Actions**.

---

Estrutura do Projeto

```
todo-app/
├── backend/
│   ├── server.js               # API REST com Express
│   └── package.json
├── frontend/
│   └── index.html              # Interface HTML/CSS/JS
├── cypress/
│   ├── e2e/
│   │   ├── frontend.cy.js      # Testes E2E da interface (25 testes)
│   │   └── backend.cy.js       # Testes de API — cy.request (22 testes)
│   └── support/
│       └── e2e.js              # Comandos customizados
├── .github/
│   └── workflows/
│       ├── frontend-tests.yml  # CI — testes de UI
│       └── backend-tests.yml   # CI — testes de API
├── cypress.config.js
└── package.json
```

---

Funcionalidades

| Funcionalidade | Descrição |
|---|---|
Adicionar tarefa | Campo de texto + botão ou Enter |
Concluir tarefa | Clique no círculo — aplica risco no título |
Horário de conclusão | Exibido abaixo do título ao ser concluída |
Ordenação automática | Tarefas concluídas vão para o final da lista |
Excluir com confirmação | Ícone de lixeira + modal "Tem certeza?" |
Filtros | Abas: Todas / Ativas / Concluídas |
Limpar concluídas | Remove todas as tarefas concluídas de uma vez |

---

Como Executar Localmente

1. Instalar dependências

```bash
# Na raiz (Cypress)
npm install

# Backend
cd backend && npm install
```

2. Iniciar o backend

```bash
cd backend
node server.js
# Rodando em http://localhost:3001
```

3. Servir o frontend

```bash
# Na raiz do projeto
npx serve frontend -l 8080
# Acesse http://localhost:8080
```

4. Executar os testes

```bash
# Todos os testes (headless)
npm run test:e2e

# Interface gráfica do Cypress
npm run test:e2e:open

# Apenas testes de frontend
npx cypress run --spec "cypress/e2e/frontend.cy.js"

# Apenas testes de backend (API)
npx cypress run --spec "cypress/e2e/backend.cy.js"
```

---

API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/tasks` | Listar todas as tarefas |
| `GET` | `/api/tasks/:id` | Buscar tarefa por ID |
| `POST` | `/api/tasks` | Criar nova tarefa |
| `PUT` | `/api/tasks/:id` | Atualizar tarefa (título / completed) |
| `DELETE` | `/api/tasks/:id` | Deletar tarefa |
| `DELETE` | `/api/tasks` | Deletar todas as concluídas |
| `POST` | `/api/reset` | Resetar dados (usado nos testes) |

Exemplo de tarefa

```json
{
  "id": 1,
  "title": "Estudar Cypress",
  "completed": true,
  "completedAt": "2024-06-01T14:32:00.000Z",
  "createdAt": "2024-06-01T10:00:00.000Z"
}
```

---

 Cobertura de Testes

### Frontend (`frontend.cy.js`) — 25 testes
- Título e subtítulo centralizados visíveis
- Presença das abas Todas / Ativas / Concluídas
- Adicionar tarefa via botão e via Enter
- Validação de entrada vazia
- Contador de tarefas restantes
- **Ícone de lixeira** visível em cada tarefa
- **Modal de confirmação** ao clicar na lixeira
- Nome da tarefa exibido no modal
- Cancelar exclusão mantém a tarefa
- Confirmar exclusão remove a tarefa
- Fechar modal pelo overlay
- Marcar tarefa como concluída (círculo vira verde)
- **Risco (line-through)** no título da tarefa concluída
- **Tarefa concluída vai para o final** da lista
- **Horário de conclusão** exibido no formato dd/mm/yyyy, hh:mm
- Horário removido ao desmarcar tarefa
- Filtros Ativas / Concluídas / Todas
- Destaque visual na aba ativa
- Limpar concluídas

 Backend (`backend.cy.js`) — 22 testes
- `GET /api/tasks` — listagem vazia e com itens
- `POST /api/tasks` — campos, validações, trim, IDs incrementais
- `GET /api/tasks/:id` — busca e 404
- `PUT /api/tasks/:id` — update título, status, **completedAt**, desmarcar limpa completedAt
- `DELETE /api/tasks/:id` — remoção e 404
- `DELETE /api/tasks` — limpa só concluídas, preserva ativas
- `POST /api/reset` — limpa tudo

---

 GitHub Actions

Dois workflows disparados em cada **push** ou **pull request**:

- **`frontend-tests.yml`** → sobe backend + serve frontend → roda `frontend.cy.js`
- **`backend-tests.yml`** → sobe backend → roda `backend.cy.js`
