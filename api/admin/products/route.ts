import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // In production, save to database
    // For now, we'll just return success
    console.log("New product:", productData)

    return NextResponse.json({
      message: "Product added successfully",
      product: productData,
    })
  } catch (error) {
    return NextResponse.json({ message: "Failed to add product" }, { status: 500 })
  }
}
