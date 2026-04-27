# Plataforma de Monitoramento de Crianças em Situação de Vulnerabilidade

Sistema SaaS focado em alta resiliência e performance, desenvolvido para técnicos de campo. Permite o acompanhamento unificado de dados provindos de diferentes secretarias (Saúde, Educação, Social), lidando com inconsistências e garantindo atualizações otimistas.

## 🚀 Decisões Arquiteturais e Trade-offs

### 1. In-Memory Database (MVP)
Para fins de desafio/MVP, o `ChildRepository` foi construído com padrão Singleton gerenciando um `Map` em memória. 
- **Trade-off:** Alta performance (latência $O(1)$) para leitura, porém sem persistência no disco. Em produção, este repositório seria substituído por PostgreSQL (com Prisma).

### 2. Edge Proxy & Segurança JWT
Substituímos o tradicional `middleware.ts` pela nova API `proxy.ts` (Next 16). 
- **Decisão:** Validação super rápida na borda utilizando a biblioteca `jose`, rejeitando requisições inválidas antes mesmo de tocarem a infraestrutura principal.

### 3. Tailwind v4 & Glassmorphism
O sistema visual não utiliza pacotes pesados de componentes (MUI/Ant). Em vez disso, foi criado um design system direto via Tailwind CSS puro focado na performance de mobile-first.

### 4. Filtros no Backend & O(N) Summary
- **Filtros Pipeline:** Em vez de blocos `if` aninhados, a busca utiliza uma cadeia de handlers escalável.
- **Sumário O(N):** As métricas do dashboard rodam em apenas um laço (loop) em memória, extraindo 4 indicadores cruciais simultaneamente sem gargalos.

### 5. Client-Side Optimistic Updates
Quando o técnico marca um registro como "Revisado", o estado visual muda no mesmo milissegundo (UX zero-latency). O rollback ocorre transparentemente se a Promise falhar.

## 🐳 Dockerização
A aplicação está 100% conteinerizada com Node 20 alpine.
```bash
docker-compose up --build
```
Isso levantará a aplicação na porta `3000`, espelhando a exata imagem de produção.
