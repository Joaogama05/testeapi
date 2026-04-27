import { Child } from '../domain/Child';
import { ChildRepository } from '../repository/ChildRepository';

export interface FilterOptions {
  bairro?: string;
  tem_alertas?: boolean;
  revisado?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

export class ChildService {
  private repository: ChildRepository;

  constructor() {
    this.repository = ChildRepository.getInstance();
  }

  private temAlerta = (cat: any) => cat != null && Array.isArray(cat.alertas) && cat.alertas.length > 0;

  private hasAnyAlert(child: Child): boolean {
    return this.temAlerta(child.saude) || this.temAlerta(child.educacao) || this.temAlerta(child.assistencia_social);
  }

  public async getFilteredChildren(
    filters: FilterOptions,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Child>> {
    const allChildren = await this.repository.findAll();

    // Pipeline de Filtros
    let filtered = allChildren;

    const filterHandlers = [
      (children: Child[]) => filters.bairro ? children.filter(c => c.bairro === filters.bairro) : children,
      (children: Child[]) => filters.tem_alertas !== undefined 
        ? children.filter(c => this.hasAnyAlert(c) === filters.tem_alertas) 
        : children,
      (children: Child[]) => filters.revisado !== undefined
        ? children.filter(c => c.revisado === filters.revisado)
        : children,
      (children: Child[]) => filters.search
        ? children.filter(c => 
            (c.nome && c.nome.toLowerCase().includes(filters.search!.toLowerCase())) || 
            c.id.includes(filters.search!)
          )
        : children
    ];

    for (const handler of filterHandlers) {
      filtered = handler(filtered);
    }

    const total = filtered.length;
    const last_page = Math.ceil(total / pagination.limit) || 1;
    const offset = (pagination.page - 1) * pagination.limit;
    
    const paginatedData = filtered.slice(offset, offset + pagination.limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page: pagination.page,
        last_page
      }
    };
  }

  public async getSummary() {
    const allChildren = await this.repository.findAll();
    
    return allChildren.reduce((acc, child) => {
      acc.total++;
      if (child.revisado) acc.revisados++;
      else acc.pendentes++;
      
      if (this.hasAnyAlert(child)) {
        acc.com_alertas++;
      }
      return acc;
    }, {
      total: 0,
      revisados: 0,
      pendentes: 0,
      com_alertas: 0
    });
  }

  public async updateReview(id: string, payload: { revisado: boolean, revisado_por: string }): Promise<Child | null> {
    const child = await this.repository.findById(id);
    if (!child) return null;

    child.revisado = payload.revisado;
    child.revisado_por = payload.revisado_por;
    child.revisado_em = new Date().toISOString();

    await this.repository.update(child);
    return child;
  }

  public async getChildById(id: string): Promise<Child | null> {
    return this.repository.findById(id);
  }
}
