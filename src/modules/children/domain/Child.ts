/**
 * Representa os dados de saúde da criança.
 * Em muitos casos na base da Prefeitura, esses dados não foram coletados ou 
 * o prontuário não possui histórico, por isso todos os campos são opcionais (nullable).
 */
export interface Saude {
  ultima_consulta: string | null;
  vacinas_em_dia: boolean | null;
  alertas: string[];
}

/**
 * Representa o status educacional da criança.
 * Devido à evasão escolar ou falta de integração com as escolas municipais,
 * os dados podem vir nulos.
 */
export interface Educacao {
  escola: string | null;
  frequencia_percent: number | null;
  alertas: string[];
}

/**
 * Informações sobre a participação em programas sociais.
 * Dados frequentemente vazios se a família nunca acionou um CRAS.
 */
export interface AssistenciaSocial {
  cad_unico: boolean | null;
  beneficio_ativo: boolean | null;
  alertas: string[];
}

/**
 * Entidade principal que representa uma Criança monitorada.
 * Apenas o `id` é garantido. Todos os demais campos podem ser nulos porque
 * o fluxo de ingestão `seed.json` mescla dados de diferentes secretarias 
 * (Saúde, Educação, Social), podendo gerar registros altamente esparsos.
 */
export interface Child {
  id: string;
  nome: string | null;
  data_nascimento: string | null;
  bairro: string | null;
  responsavel: string | null;
  saude: Saude | null;
  educacao: Educacao | null;
  assistencia_social: AssistenciaSocial | null;
  revisado: boolean;
  revisado_por: string | null;
  revisado_em: string | null;
}
