import { NextResponse } from 'next/server';
import { ChildService } from '@/modules/children/services/ChildService';

// Controller da Rota para Listagem
export async function GET() {
  try {
    const childService = new ChildService();
    const children = await childService.getAllChildren();
    
    return NextResponse.json({
      success: true,
      data: children
    });
  } catch (error) {
    console.error('[API Controller] - Erro ao buscar lista de crianças:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao buscar as crianças. Tente novamente mais tarde.'
    }, { status: 500 });
  }
}
