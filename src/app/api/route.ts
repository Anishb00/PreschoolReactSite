
import query from '@/lib/query';

export async function GET() {
  const rows = await query()
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
