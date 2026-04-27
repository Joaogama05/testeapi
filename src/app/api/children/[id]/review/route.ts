import { NextResponse, NextRequest } from 'next/server';
import { ChildService } from '@/modules/children/services/ChildService';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'JSON payload inválido.' }, { status: 400 });
    }

    const revisado = body.revisado;
    
    // Obter o usuario mockado do header injetado pelo Edge Middleware
    const revisado_por = request.headers.get('x-user-username') || 'sistema';

    if (typeof revisado !== 'boolean') {
      return NextResponse.json({ error: 'Payload invalido, "revisado" deve ser boolean.' }, { status: 400 });
    }

    const childService = new ChildService();
    const child = await childService.updateReview(id, { revisado, revisado_por });

    if (!child) {
      return NextResponse.json({ error: 'Criança não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: child
    });
  } catch (error) {
    console.error('[API Controller] - Erro ao atualizar status de revisão:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao atualizar.'
    }, { status: 500 });
  }
}
