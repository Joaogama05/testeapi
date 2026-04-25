import { Child } from '../domain/Child';
import { ChildRepository } from '../repository/ChildRepository';

export class ChildService {
  private repository: ChildRepository;

  constructor() {
    this.repository = ChildRepository.getInstance();
  }

  /**
   * Obtém todas as crianças cadastradas.
   */
  public async getAllChildren(): Promise<Child[]> {
    return this.repository.findAll();
  }

  /**
   * Obtém o detalhe de um filho pelo ID.
   */
  public async getChildById(id: string): Promise<Child | null> {
    return this.repository.findById(id);
  }

  /**
   * Poderíamos colocar regras de negócio aqui, por exemplo:
   * filtrarCriançasEvasaoEscolar()
   * verificarConsistenciaAlertas()
   */
}
