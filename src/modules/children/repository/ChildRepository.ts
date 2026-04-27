import fs from 'fs';
import path from 'path';
import { Child } from '../domain/Child';

// Usando armazenamento em memória por simplicidade no desafio,
// mas em produção deveria ser uma DB SQL (PostgreSQL, por exemplo).
export class ChildRepository {
  private static instance: ChildRepository;
  private data: Map<string, Child> = new Map();

  private constructor() {
    this.loadSeedData();
  }

  public static getInstance(): ChildRepository {
    if (!ChildRepository.instance) {
      ChildRepository.instance = new ChildRepository();
    }
    return ChildRepository.instance;
  }

  private loadSeedData() {
    try {
      const seedPath = path.join(process.cwd(), 'src', 'data', 'seed.json');
      const fileContent = fs.readFileSync(seedPath, 'utf-8');
      const children: Child[] = JSON.parse(fileContent);

      children.forEach((child) => {
        // Garantir que todos os campos da interface estão presentes, mesmo se ausentes no JSON (nulos defensivos)
        this.data.set(child.id, {
          id: child.id,
          nome: child.nome ?? null,
          data_nascimento: child.data_nascimento ?? null,
          bairro: child.bairro ?? null,
          responsavel: child.responsavel ?? null,
          saude: child.saude ?? null,
          educacao: child.educacao ?? null,
          assistencia_social: child.assistencia_social ?? null,
          revisado: child.revisado ?? false,
          revisado_por: child.revisado_por ?? null,
          revisado_em: child.revisado_em ?? null,
        });
      });
      console.log(`[ChildRepository] - Dados em memória carregados com sucesso. Total: ${this.data.size} registros.`);
    } catch (error) {
      console.error('[ChildRepository] - Erro crítico ao carregar dados do seed.json:', error);
      // Aqui a falha é engolida no constructor, mas o Map ficará vazio,
      // tornando a aplicação resiliente contra crashes fatais na leitura.
    }
  }

  public async findAll(): Promise<Child[]> {
    // Retorna todos em formato de array. O `async` simula uma chamada a banco real.
    return Array.from(this.data.values());
  }

  public async findById(id: string): Promise<Child | null> {
    return this.data.get(id) || null;
  }

  public async update(child: Child): Promise<void> {
    if (!this.data.has(child.id)) {
      throw new Error(`Child with id ${child.id} not found.`);
    }
    this.data.set(child.id, child);
    
    // Persistindo em disco para o desafio parecer um banco real
    try {
      const seedPath = path.join(process.cwd(), 'src', 'data', 'seed.json');
      const allData = Array.from(this.data.values());
      fs.writeFileSync(seedPath, JSON.stringify(allData, null, 2), 'utf-8');
      console.log(`[ChildRepository] - Estado salvo no disco (seed.json).`);
    } catch (e) {
      console.error('[ChildRepository] - Erro ao salvar no disco:', e);
    }
  }
}
