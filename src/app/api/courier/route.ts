import { NextRequest, NextResponse } from 'next/server';
import { createCourierShipment, COURIER_PROVIDERS } from '../../../lib/courier-api';

export async function POST(req: NextRequest) {
  try {
    const { order, courier } = await req.json();

    if (!order || !courier) {
      return NextResponse.json({ error: 'Order and courier are required' }, { status: 400 });
    }

    const shipment = await createCourierShipment(order, courier);
    return NextResponse.json(shipment);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Thai Couriers Logistics API',
    supportedCouriers: Object.keys(COURIER_PROVIDERS),
  });
}

