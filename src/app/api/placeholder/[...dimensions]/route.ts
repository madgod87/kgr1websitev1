import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimensions: string[] }> }
) {
  try {
    const resolvedParams = await params
    const [width = '800', height = '600'] = resolvedParams.dimensions || []
    
    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#374151"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#9CA3AF" text-anchor="middle" dy=".3em">
          ${width} × ${height}
        </text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="#6B7280" text-anchor="middle" dy=".3em">
          Placeholder Image
        </text>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000', // 1 year
      },
    })
  } catch (error) {
    console.error('Placeholder API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate placeholder' },
      { status: 500 }
    )
  }
}
