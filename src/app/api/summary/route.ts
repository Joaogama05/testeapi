import { NextResponse } from 'next/server';
import { ChildService } from '@/modules/children/services/ChildService';

export async function GET() {
  try {
    const childService = new ChildService();
    const summary = await childService.getSummary();
    
    return NextResponse.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('[API Controller] - Erro ao buscar sumário:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao buscar o sumário.'
    }, { status: 500 });
  }
}
