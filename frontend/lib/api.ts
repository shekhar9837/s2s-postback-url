export const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function getAffiliates() {
  const r = await fetch(`${API}/affiliates`, { cache: 'no-store' });
  console.log(r);
  return r.json();
}

export async function getClicks(id: string) {
  const r = await fetch(`${API}/affiliates/${id}/clicks`, { cache: 'no-store' });
  console.log(r);
  return r.json();
}

export async function getConversions(id: string) {
  const r = await fetch(`${API}/affiliates/${id}/conversions`, { cache: 'no-store' });
  return r.json();
}

export async function logClick(affiliateId: string, campaignId: string, clickId: string) {
  const params = new URLSearchParams({
    affiliate_id: affiliateId,
    campaign_id: campaignId,
    click_id: clickId,
  });
  const r = await fetch(`${API}/click?${params}`, { method: 'GET' });
  return r.json();
}

export async function logConversion(affiliateId: string, clickId: string, amount: string, currency: string) {
  const params = new URLSearchParams({
    affiliate_id: affiliateId,
    click_id: clickId,
    amount: amount,
    currency: currency,
  });
  const r = await fetch(`${API}/postback?${params}`, { method: 'GET' });
  return r.json();
}
