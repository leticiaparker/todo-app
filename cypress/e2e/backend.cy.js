// cypress/e2e/backend.cy.js
// Testes de API do Backend — cy.request (sem UI)

const API = 'http://localhost:3001/api';

describe('Backend API — /api/tasks', () => {
  beforeEach(() => {
    cy.request('POST', `${API}/reset`);
  });

  // ────────────────────────────────────────────────
  // GET /api/tasks
  // ────────────────────────────────────────────────
  it('GET /api/tasks retorna lista vazia inicialmente', () => {
    cy.request('GET', `${API}/tasks`).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  it('GET /api/tasks retorna todas as tarefas criadas', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Tarefa 1' });
    cy.request('POST', `${API}/tasks`, { title: 'Tarefa 2' });
    cy.request('GET', `${API}/tasks`).then(res => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.length(2);
    });
  });

  // ────────────────────────────────────────────────
  // POST /api/tasks
  // ────────────────────────────────────────────────
  it('POST /api/tasks cria tarefa com todos os campos esperados', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Nova tarefa' }).then(res => {
      expect(res.status).to.eq(201);
      expect(res.body).to.include({ title: 'Nova tarefa', completed: false });
      expect(res.body.completedAt).to.be.null;
      expect(res.body.id).to.be.a('number');
      expect(res.body.createdAt).to.be.a('string');
    });
  });

  it('POST /api/tasks retorna 400 quando title está ausente', () => {
    cy.request({ method: 'POST', url: `${API}/tasks`, body: {}, failOnStatusCode: false })
      .then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.contain('required');
      });
  });

  it('POST /api/tasks retorna 400 quando title está vazio', () => {
    cy.request({ method: 'POST', url: `${API}/tasks`, body: { title: '   ' }, failOnStatusCode: false })
      .then(res => {
        expect(res.status).to.eq(400);
      });
  });

  it('POST /api/tasks remove espaços extras do título', () => {
    cy.request('POST', `${API}/tasks`, { title: '  Limpar espaços  ' }).then(res => {
      expect(res.body.title).to.eq('Limpar espaços');
    });
  });

  it('POST /api/tasks incrementa IDs em tarefas consecutivas', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Primeira' }).then(r1 => {
      cy.request('POST', `${API}/tasks`, { title: 'Segunda' }).then(r2 => {
        expect(r2.body.id).to.be.greaterThan(r1.body.id);
      });
    });
  });

  // ────────────────────────────────────────────────
  // GET /api/tasks/:id
  // ────────────────────────────────────────────────
  it('GET /api/tasks/:id retorna a tarefa correta', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Buscar por ID' }).then(post => {
      const id = post.body.id;
      cy.request('GET', `${API}/tasks/${id}`).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.id).to.eq(id);
        expect(res.body.title).to.eq('Buscar por ID');
      });
    });
  });

  it('GET /api/tasks/:id retorna 404 para id inexistente', () => {
    cy.request({ method: 'GET', url: `${API}/tasks/9999`, failOnStatusCode: false })
      .then(res => {
        expect(res.status).to.eq(404);
        expect(res.body.error).to.exist;
      });
  });

  // ────────────────────────────────────────────────
  // PUT /api/tasks/:id — título
  // ────────────────────────────────────────────────
  it('PUT /api/tasks/:id atualiza o título da tarefa', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Original' }).then(post => {
      const id = post.body.id;
      cy.request('PUT', `${API}/tasks/${id}`, { title: 'Atualizado' }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.title).to.eq('Atualizado');
      });
    });
  });

  it('PUT /api/tasks/:id retorna 400 quando título atualizado está vazio', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Válido' }).then(post => {
      const id = post.body.id;
      cy.request({ method: 'PUT', url: `${API}/tasks/${id}`, body: { title: '' }, failOnStatusCode: false })
        .then(res => {
          expect(res.status).to.eq(400);
        });
    });
  });

  it('PUT /api/tasks/:id retorna 404 para id inexistente', () => {
    cy.request({ method: 'PUT', url: `${API}/tasks/9999`, body: { title: 'X' }, failOnStatusCode: false })
      .then(res => {
        expect(res.status).to.eq(404);
      });
  });

  // ────────────────────────────────────────────────
  // PUT /api/tasks/:id — completedAt
  // ────────────────────────────────────────────────
  it('PUT /api/tasks/:id registra completedAt ao marcar como concluída', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Concluir' }).then(post => {
      const id = post.body.id;
      cy.request('PUT', `${API}/tasks/${id}`, { completed: true }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.completed).to.be.true;
        expect(res.body.completedAt).to.be.a('string');
        // Verificar que é um ISO date válido
        expect(new Date(res.body.completedAt).getTime()).to.not.be.NaN;
      });
    });
  });

  it('PUT /api/tasks/:id limpa completedAt ao desmarcar tarefa', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Desmarcar' }).then(post => {
      const id = post.body.id;
      cy.request('PUT', `${API}/tasks/${id}`, { completed: true });
      cy.request('PUT', `${API}/tasks/${id}`, { completed: false }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.completed).to.be.false;
        expect(res.body.completedAt).to.be.null;
      });
    });
  });

  it('PUT /api/tasks/:id completedAt é diferente para tarefas concluídas em momentos distintos', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Tarefa 1' }).then(p1 => {
      cy.request('POST', `${API}/tasks`, { title: 'Tarefa 2' }).then(p2 => {
        cy.request('PUT', `${API}/tasks/${p1.body.id}`, { completed: true }).then(r1 => {
          cy.wait(10);
          cy.request('PUT', `${API}/tasks/${p2.body.id}`, { completed: true }).then(r2 => {
            // Ambos devem ter completedAt preenchido
            expect(r1.body.completedAt).to.be.a('string');
            expect(r2.body.completedAt).to.be.a('string');
          });
        });
      });
    });
  });

  // ────────────────────────────────────────────────
  // DELETE /api/tasks/:id
  // ────────────────────────────────────────────────
  it('DELETE /api/tasks/:id remove a tarefa com sucesso', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Deletar' }).then(post => {
      const id = post.body.id;
      cy.request('DELETE', `${API}/tasks/${id}`).then(res => {
        expect(res.status).to.eq(204);
      });
      cy.request({ method: 'GET', url: `${API}/tasks/${id}`, failOnStatusCode: false })
        .then(res => expect(res.status).to.eq(404));
    });
  });

  it('DELETE /api/tasks/:id retorna 404 para id inexistente', () => {
    cy.request({ method: 'DELETE', url: `${API}/tasks/9999`, failOnStatusCode: false })
      .then(res => {
        expect(res.status).to.eq(404);
      });
  });

  // ────────────────────────────────────────────────
  // DELETE /api/tasks — limpar concluídas
  // ────────────────────────────────────────────────
  it('DELETE /api/tasks remove apenas tarefas concluídas', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Manter' });
    cy.request('POST', `${API}/tasks`, { title: 'Remover' }).then(post => {
      cy.request('PUT', `${API}/tasks/${post.body.id}`, { completed: true });
    });
    cy.request('DELETE', `${API}/tasks`).then(res => {
      expect(res.status).to.eq(204);
    });
    cy.request('GET', `${API}/tasks`).then(res => {
      expect(res.body).to.have.length(1);
      expect(res.body[0].title).to.eq('Manter');
      expect(res.body[0].completed).to.be.false;
    });
  });

  it('DELETE /api/tasks não afeta tarefas ativas', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Ativa 1' });
    cy.request('POST', `${API}/tasks`, { title: 'Ativa 2' });
    cy.request('DELETE', `${API}/tasks`);
    cy.request('GET', `${API}/tasks`).then(res => {
      expect(res.body).to.have.length(2);
    });
  });

  // ────────────────────────────────────────────────
  // POST /api/reset
  // ────────────────────────────────────────────────
  it('POST /api/reset limpa todas as tarefas', () => {
    cy.request('POST', `${API}/tasks`, { title: 'Será apagada' });
    cy.request('POST', `${API}/reset`).then(res => {
      expect(res.status).to.eq(200);
    });
    cy.request('GET', `${API}/tasks`).then(res => {
      expect(res.body).to.be.empty;
    });
  });
});
