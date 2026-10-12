import { NextRequest, NextResponse } from 'next/server';
import { shopeeClient } from '../../../lib/shopee-api';
import { INITIAL_PRODUCTS } from '../../../lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const productsToSync = body.products || INITIAL_PRODUCTS;

    const result = await shopeeClient.syncCatalogToShopee(productsToSync);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Shopee Open Platform API Bridge',
    status: 'connected',
    partnerConfigured: shopeeClient.isConfigured,
  });
}

