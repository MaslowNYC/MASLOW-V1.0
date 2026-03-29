import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PKPass } from 'passkit-generator';
import { createClient } from '@supabase/supabase-js';

const PASS_TYPE_ID = 'pass.nyc.maslow';
const TEAM_ID = 'M3CUX3AF75';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, member_number, membership_tier, credits')
    .eq('id', user.id)
    .single();

  const memberNumber = profile?.member_number
    ? `#${String(profile.member_number).padStart(5, '0')}`
    : '#00001';
  const memberName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Member';

  function formatTier(tier: string | null) {
    if (!tier) return 'Member';
    const t = tier.toLowerCase();
    if (t === 'founding') return 'Founding Member';
    if (t === 'architect') return 'Architect';
    if (t === 'sovereign') return 'Sovereign';
    return 'Member';
  }

  const iconPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==', 'base64');

  try {
    const pass = new PKPass({
      'icon.png': iconPng,
      'icon@2x.png': iconPng,
    }, {
      signerCert: process.env.APPLE_PASS_CERT_PEM!,
      signerKey: process.env.APPLE_PASS_KEY_PEM!,
      wwdr: process.env.APPLE_WWDR_CERT_PEM!,
    }, {
      description: 'Maslow NYC Membership',
      formatVersion: 1,
      organizationName: 'Maslow',
      passTypeIdentifier: PASS_TYPE_ID,
      serialNumber: `maslow-${user.id.substring(0, 8)}-${Date.now()}`,
      teamIdentifier: TEAM_ID,
      foregroundColor: 'rgb(245, 240, 230)',
      backgroundColor: 'rgb(40, 107, 205)',
      labelColor: 'rgb(212, 175, 106)',
      logoText: 'MASLOW',
    });

    pass.type = 'generic';
    pass.primaryFields.push({ key: 'member', label: 'MEMBER', value: memberName });
    pass.secondaryFields.push(
      { key: 'tier', label: 'TIER', value: formatTier(profile?.membership_tier) },
      { key: 'number', label: 'NUMBER', value: memberNumber }
    );
    pass.auxiliaryFields.push({ key: 'credits', label: 'CREDITS', value: String(profile?.credits || 0) });
    pass.backFields.push(
      { key: 'terms', label: 'Terms', value: 'This pass grants access to Maslow NYC. Present at entry. Non-transferable.' },
      { key: 'contact', label: 'Contact', value: 'hello@maslow.nyc' },
      { key: 'website', label: 'Website', value: 'https://maslow.nyc' }
    );
    pass.setBarcodes({ format: 'PKBarcodeFormatQR', message: user.id, messageEncoding: 'iso-8859-1' });

    const buffer = await pass.getAsBuffer();

    await supabase.from('profiles').update({
      has_wallet_pass: true,
      wallet_pass_added_at: new Date().toISOString(),
      wallet_last_updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', 'attachment; filename="maslow-pass.pkpass"');
    return res.status(200).send(buffer);

  } catch (err) {
    console.error('Pass generation error:', err);
    return res.status(500).json({
      error: 'Failed to generate pass',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}
