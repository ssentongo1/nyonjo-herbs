import { getProducts } from '@/lib/db'

export default async function TestDBPage() {
  const products = await getProducts()
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Database Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Products Table Test</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(products, null, 2)}
        </pre>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Connection Status:</h3>
          <div className={`inline-block px-4 py-2 rounded ${products.length >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {products.length >= 0 ? '✅ Database connected successfully!' : '❌ Database connection failed'}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Products Count:</h3>
          <p>{products.length} products found</p>
        </div>
      </div>
    </div>
  )
}