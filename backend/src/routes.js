import express from 'express';
import { prisma } from './db.js';

const router = express.Router();

// Health
router.get('/health', (_req, res) => res.json({ ok: true }));

// Click: /click?affiliate_id=1&campaign_id=1&click_id=abc123
router.get('/click', async (req, res) => {
  try {
    const { affiliate_id, campaign_id, click_id } = req.query;
    if (!affiliate_id || !campaign_id || !click_id) {
      return res.status(400).json({ status: 'error', message: 'Missing params' });
    }

    // Validate affiliate/campaign exist
    const [aff, camp] = await Promise.all([
      prisma.affiliate.findUnique({ where: { id: Number(affiliate_id) } }),
      prisma.campaign.findUnique({ where: { id: Number(campaign_id) } }),
    ]);
    if (!aff || !camp) {
      return res.status(400).json({ status: 'error', message: 'Invalid affiliate_id or campaign_id' });
    }

    // Upsert-like via unique constraint
    await prisma.click.create({
      data: {
        affiliateId: Number(affiliate_id),
        campaignId: Number(campaign_id),
        clickId: String(click_id),
      },
    }).catch(() => {}); // ignore duplicate

    return res.json({ status: 'success', message: 'Click logged' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Postback: /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
router.get('/postback', async (req, res) => {
  try {
    const { affiliate_id, click_id, amount, currency } = req.query;
    if (!affiliate_id || !click_id || !amount || !currency) {
      return res.status(400).json({ status: 'error', message: 'Missing params' });
    }

    // Find click for that affiliate
    const click = await prisma.click.findFirst({
      where: { affiliateId: Number(affiliate_id), clickId: String(click_id) },
      select: { id: true },
    });
    if (!click) {
      return res.status(400).json({ status: 'error', message: 'Invalid click_id for affiliate' });
    }

    await prisma.conversion.create({
      data: {
        clickId: click.id,
        amount: Number(amount),
        currency: String(currency).toUpperCase(),
      },
    });

    return res.json({ status: 'success', message: 'Conversion tracked' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Read endpoints for dashboard
router.get('/affiliates', async (_req, res) => {
  const list = await prisma.affiliate.findMany({ orderBy: { id: 'asc' } });
  console.log(list);
  res.json(list);
});

router.get('/affiliates/:id/clicks', async (req, res) => {
  const id = Number(req.params.id);
  const clicks = await prisma.click.findMany({
    where: { affiliateId: id },
    orderBy: { id: 'asc' },
    take: 200,
    include: { campaign: true },
  });
  console.log(clicks);
  res.json(clicks.map(c => ({
    id: c.id, click_id: c.clickId, campaign_id: c.campaignId,
    campaign_name: c.campaign.name, ts: c.ts
  })));
});

router.get('/affiliates/:id/conversions', async (req, res) => {
  const id = Number(req.params.id);
  const convs = await prisma.conversion.findMany({
    where: { click: { affiliateId: id } },
    orderBy: { id: 'asc' },
    take: 200,
    include: { click: { include: { campaign: true } } },
  });
  res.json(convs.map(v => ({
    id: v.id, amount: v.amount, currency: v.currency, ts: v.ts,
    click_id: v.click.clickId, campaign_id: v.click.campaignId, campaign_name: v.click.campaign.name
  })));
});

export default router;
