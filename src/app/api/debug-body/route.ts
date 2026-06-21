export async function POST(request: Request) {
  const raw = await request.text()
  const hexDump = Buffer.from(raw).toString('hex').slice(0, 100)
  return Response.json({
    raw: raw.slice(0, 500),
    length: raw.length,
    hexStart: hexDump,
    contentType: request.headers.get('content-type'),
  })
}
