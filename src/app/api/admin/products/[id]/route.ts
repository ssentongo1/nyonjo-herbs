import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productData = await request.json()
    
    console.log('Updating product:', id, productData)
    
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        short_description: productData.short_description,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        benefits: Array.isArray(productData.benefits) ? productData.benefits : productData.benefits || [],
        usage_instructions: productData.usage_instructions,
        images: Array.isArray(productData.images) ? productData.images : productData.images || [],
        in_stock: Boolean(productData.in_stock),
        featured: Boolean(productData.featured),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = createAdminClient()
    
    // First get the product to get image URLs
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching product for deletion:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch product for deletion: ' + fetchError.message },
        { status: 500 }
      )
    }

    // Delete images from storage if they exist
    if (product && product.images && Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        if (typeof imageUrl === 'string' && imageUrl.includes('supabase.co/storage/v1/object/public/product-images/')) {
          try {
            // Extract filename from URL
            const urlParts = imageUrl.split('/')
            const fileName = urlParts[urlParts.length - 1]
            
            if (fileName && fileName.includes('-')) {
              await supabase.storage
                .from('product-images')
                .remove([fileName])
            }
          } catch (imgError) {
            console.warn('Error deleting image from storage:', imgError)
            // Continue with product deletion
          }
        }
      }
    }

    // Delete the product from database
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}