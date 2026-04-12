// Proxies faucet requests to the VPS faucet server
const FAUCET_URL = process.env.FAUCET_URL || 'http://43.157.201.151:7777'

export async function POST(req: Request) {
  const { address } = await req.json()

  if (!address || typeof address !== 'string') {
    return Response.json({ error: 'Address required' }, { status: 400 })
  }

  try {
    const res = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (err) {
    console.error('Faucet proxy error:', err)
    return Response.json({ error: 'Faucet service unavailable' }, { status: 503 })
  }
}
