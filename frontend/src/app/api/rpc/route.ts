const RPC_URL = process.env.NEXT_PUBLIC_RPC_HTTPS || process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.evently-organizer.site'

export async function POST(req: Request) {
  const body = await req.json()

  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data)
}
