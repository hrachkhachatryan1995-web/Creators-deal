export default async function handler(req, res) {
  res.setHeader('Allow', 'POST')
  return res.status(410).json({
    error: 'Deprecated endpoint. Sign in with a verified account and use /api/sync-plan instead.',
  })
}
