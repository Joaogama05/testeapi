import fs from 'fs';
import path from 'path';
import { Child } from '../domain/Child';

export class ChildRepository {
  private static instance: ChildRepository;
  private seedPath = path.join(process.cwd(), 'src', 'data', 'seed.json');

  private constructor() {}

  public static getInstance(): ChildRepository {
    if (!ChildRepository.instance) {
      ChildRepository.instance = new ChildRepository();
    }
    return ChildRepository.instance;
  }

  private readData(): Child[] {
    try {
      const fileContent = fs.readFileSync(this.seedPath, 'utf-8');
      const children: Child[] = JSON.parse(fileContent);
      return children.map(child => ({
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
      }));
    } catch (error) {
      console.error('[ChildRepository] - Erro ao ler dados do seed.json:', error);
      return [];
    }
  }

  private writeData(data: Child[]): void {
    try {
      fs.writeFileSync(this.seedPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[ChildRepository] - Erro ao salvar no disco:', e);
    }
  }

  public async findAll(): Promise<Child[]> {
    return this.readData();
  }

  public async findById(id: string): Promise<Child | null> {
    const data = this.readData();
    return data.find(c => c.id === id) || null;
  }

  public async update(child: Child): Promise<void> {
    const data = this.readData();
    const index = data.findIndex(c => c.id === child.id);
    if (index === -1) {
      throw new Error(`Child with id ${child.id} not found.`);
    }
    data[index] = child;
    this.writeData(data);
  }
}
