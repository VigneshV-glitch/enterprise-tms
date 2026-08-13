export function parsePlannedQuantity(qtyStr: string): { value: number; unit: string } {
  if (!qtyStr) return { value: 0, unit: '' };
  const match = qtyStr.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return { value: Number(qtyStr) || 0, unit: '' };
  return { value: Number(match[1]) || 0, unit: match[2] };
}

export function calculateSeverity(reason: string, planned: number, actual: number): 'Critical' | 'High' | 'Medium' | 'Low' | 'None' {
  const diff = Math.abs(planned - actual);
  const pct = planned > 0 ? (diff / planned) * 100 : 0;
  if (pct > 50 || reason === 'vehicle_breakdown' || reason === 'accident') return 'Critical';
  if (pct > 25 || reason === 'severe_delay') return 'High';
  if (pct > 10 || reason === 'moderate_delay') return 'Medium';
  if (pct > 0) return 'Low';
  return 'None';
}

export function getSpecificGoodsList(goodsType: string, stopIdx: number, tripId: string, totalSteps: number) {
  return [{ quantity: '1000 kg', name: goodsType || 'General Cargo' }];
}
