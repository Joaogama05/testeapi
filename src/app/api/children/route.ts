import { NextResponse, NextRequest } from 'next/server';
import { ChildService, FilterOptions, PaginationOptions } from '@/modules/children/services/ChildService';

// Controller da Rota para Listagem com Filtros e Paginação
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const pagination: PaginationOptions = { page, limit };
    
    const filters: FilterOptions = {};
    if (searchParams.has('bairro')) {
      filters.bairro = searchParams.get('bairro') as string;
    }
    if (searchParams.has('tem_alertas')) {
      filters.tem_alertas = searchParams.get('tem_alertas') === 'true';
    }
    if (searchParams.has('revisado')) {
      filters.revisado = searchParams.get('revisado') === 'true';
    }
    if (searchParams.has('search')) {
      filters.search = searchParams.get('search') as string;
    }

    const childService = new ChildService();
    const result = await childService.getFilteredChildren(filters, pagination);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('[API Controller] - Erro ao buscar lista de crianças:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao buscar as crianças. Tente novamente mais tarde.'
    }, { status: 500 });
  }
}
