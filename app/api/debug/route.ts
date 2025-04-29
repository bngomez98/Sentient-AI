export async function GET() {
  const pplxKey = process.env.PPLX_API_KEY || "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"

  // Mask the key for security
  const maskKey = (key: string) => {
    if (!key) return "not set"
    if (key.length <= 8) return "***"
    return key.substring(0, 4) + "..." + key.substring(key.length - 4)
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      environment: process.env.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,
      api: {
        perplexity: {
          configured: !!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,
          key: pplx(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),
        },
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  )
}
