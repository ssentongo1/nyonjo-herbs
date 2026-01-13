import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    console.log('Received product data:', productData)
    
    // Validation
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Prepare data
    const dataToInsert = {
      name: productData.name,
      short_description: productData.short_description || '',
      description: productData.description || productData.short_description || '',
      price: parseFloat(productData.price),
      category: productData.category,
      benefits: productData.benefits ? 
        (Array.isArray(productData.benefits) ? productData.benefits : productData.benefits.split('\n').filter((b: string) => b.trim())) 
        : [],
      usage_instructions: productData.usage_instructions || '',
      images: productData.images ? 
        (Array.isArray(productData.images) ? productData.images.filter((img: string) => img.trim()) : []) 
        : [],
      in_stock: productData.in_stock === 'true' || productData.in_stock === true,
      featured: productData.featured === 'true' || productData.featured === true
    }

    console.log('Inserting data:', dataToInsert)
    
    const { data, error } = await supabase
      .from('products')
      .insert([dataToInsert])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      product: data,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}