export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const width = searchParams.get("width") || "400"
  const height = searchParams.get("height") || "400"

  // Create a simple SVG placeholder
  const svg = `
    <svg 
      width="${width}" 
      height="${height}" 
      viewBox="0 0 ${width} ${height}" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#9CA3AF" />
      <rect width="18" height="18" x="${Number(width) / 2 - 9}" y="${Number(height) / 2 - 9}" rx="2" ry="2" fill="none" stroke="white" stroke-width="2" />
      <circle cx="${Number(width) / 2 - 3}" cy="${Number(height) / 2 - 3}" r="2" stroke="white" fill="none" stroke-width="2" />
      <path d="M ${Number(width) / 2 + 9} ${Number(height) / 2 + 3} L ${Number(width) / 2 + 5.914} ${Number(height) / 2 - 0.086} A 2 2 0 0 0 ${Number(width) / 2 + 3.086} ${Number(height) / 2 - 0.086} L ${Number(width) / 2 - 6} ${Number(height) / 2 + 9}" stroke="white" fill="none" stroke-width="2" />
    </svg>
  `

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
