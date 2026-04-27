# Plataforma de Monitoramento de Crianças em Situação de Vulnerabilidade

Sistema SaaS focado em alta resiliência e performance, desenvolvido para técnicos de campo acompanharem unificadamente os dados provindos de diferentes secretarias (Saúde, Educação, Social).

## 🚀 Como Rodar o Projeto Localmente

O projeto está totalmente dockerizado (Next.js Standalone Mode) para rodar instantaneamente na sua máquina, garantindo que o ambiente espelhe a exata imagem de produção.

**Pré-requisitos:** Docker e Docker Compose instalados.

1. Clone o repositório.
2. Na raiz do projeto, execute o comando:
   ```bash
   docker-compose up --build -d
   ```
3. Aguarde o build da imagem (Node 20 Alpine) finalizar.
4. Acesse no seu navegador: [http://localhost:3000](http://localhost:3000)

### 🔑 Credenciais de Teste
A autenticação do MVP foi desenvolvida com um mock que simula o fluxo JWT (gerando um token assinado real pela lib `jose` na Edge). 
Para testar o acesso, **você não precisa digitar nenhuma senha específica**. Basta clicar diretamente no botão **"Acessar Sistema (Mock)"** na tela de login. Você será autenticado automaticamente como o usuário `tecnico_admin` e redirecionado para o painel.

---

## 🏗️ Decisões Arquiteturais e Trade-offs

1. **In-Memory Database (MVP)**
   Para fins de desafio e facilidade de teste do avaliador (sem requerer instâncias de DB locais), o `ChildRepository` foi construído com padrão Singleton gerenciando um `Map` na memória a partir dos dados limpos do `seed.json`. 
   - **Trade-off:** Alta performance (latência de tempo constante O(1)) e arquitetura Zero-Config. Contudo, não há persistência após o restart do Docker. Na vida real, trocaríamos essa camada de abstração (Repository) por um conector ao PostgreSQL usando ORM.

2. **Edge Proxy & Segurança Híbrida**
   Substituímos o `middleware.ts` tradicional pelo `src/proxy.ts` (Padrão Next.js).
   - **Decisão:** Isso barra qualquer tráfego desprotegido (seja UI ou chamadas `/api/children/[id]/review`) diretamente na "borda" usando validação de Cookies, antes de custar processamento do Node.js.

3. **Filtragem Escalável e O(N) Summary**
   - **Pipeline de Filtros:** Em vez de blocos de validação aninhados `if...else`, implementei um padrão de "handlers pipeline" onde filtros de Bairro, Status e Textuais (`search`) são acumulados limpos.
   - **Redução O(N):** O componente Dashboard invoca o Service e calcula todas as 4 métricas base de forma simultânea com um único `reduce()`.

4. **Client-Side Optimistic Updates & UI Resiliente**
   Para a melhor UX possível aos técnicos (que podem sofrer com rede 3G/4G ruim em campo), as atualizações de status de revisão são aplicadas **otimisticamente na tela no mesmo milissegundo**, e apenas revertidas se a Request (PATCH) falhar no background. O estado das filtragens (Bairro, Alertas) está 100% gravado na URL (`searchParams`), mantendo os links compartilháveis e rastreáveis.

---

## 🔮 O que faria diferente com mais tempo?

Se este projeto tivesse mais semanas de prazo e fosse se tornar o ambiente final produtivo corporativo, as seguintes melhorias seriam fundamentais:

1. **Banco de Dados Real & Migrations:** Adicionaria um serviço `postgres` no `docker-compose.yml`, instalaria o **Prisma ORM** e construiria esquemas relacionais sólidos entre Crianças, Históricos Escolares e Profissionais de Saúde.
2. **Autenticação Autoritativa:** Integraria uma solução madura como o **NextAuth.js (Auth.js)** conectando-se a um provedor OAuth ou Identity Provider da prefeitura, controlando Níveis de Acesso (RBAC) dependendo de quem acessa o painel.
3. **Pipeline de Testes Automatizados:** Configuraria a base de testes unitários com **Vitest** para os Services (garantindo que as contas de alertas não quebrem) e instalaria o **Playwright/Cypress** para rodar End-to-End na UI inteira, garantindo que o login redirecione e os filtros na URL funcionem sem regressions.
4. **Paginação do Banco (Offset/Keyset):** A paginação atual apenas "fatia" (slice) a Array inteira. Numa escala de 10.000 crianças, o Banco de Dados (SQL) precisaria fazer o LIMIT/OFFSET otimizado.
