// Customer.io CDP API - 2026-02-07

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, memberNumber, memberTier, firstName } = req.body;

  // Log to verify we're getting the data
  console.log('Received userId:', userId);
  console.log('Received email:', email);

  if (!userId || !email) {
    console.error('Missing userId or email');
    return res.status(400).json({ error: 'userId and email are required' });
  }

  try {
    const response = await fetch('https://cdp.customer.io/v1/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic NTllOTRjYzJkYjA3ZDkyY2I4NzM6'
      },
      body: JSON.stringify({
        userId: userId,
        traits: {
          email: email,
          member_number: memberNumber || null,
          member_tier: memberTier || 'free',
          name: firstName || '',
          created_at: Math.floor(Date.now() / 1000)
        }
      })
    });

    console.log('Customer.io CDP response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Customer.io CDP error:', errorText);
      return res.status(response.status).json({ error: 'Customer.io failed', details: errorText });
    }

    console.log('✅ User identified in Customer.io:', email);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Customer.io error:', error.message);
    return res.status(500).json({ error: 'Customer.io failed', details: error.message });
  }
}
