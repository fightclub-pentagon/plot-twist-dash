// components/one-time-products.tsx
'use client'

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/contexts/UserContext'

interface Product {
  name: string
  description: string
  price: number
  features: string[]
  stripeLink: string
  showPrice: boolean
  isRecommended?: boolean
}

const products: Product[] = [
  {
    name: '100 Credits Pack',
    description: 'Start your mystery journey with enough credits to create your first adventures.',
    price: 4.90,
    features: [
      '100 Credits Balance',
      'Generate 1 Mystery Game',
      'Access to All Creation Tools'
    ],
    stripeLink: process.env.NEXT_PUBLIC_PRODUCT_LINK_100!,
    showPrice: true,
  },
  {
    name: '300 Credits Pack',
    description: 'Perfect for creating multiple mysteries and exploring different storylines.',
    price: 7.90,
    features: [
      '300 Credits Balance',
      'Generate 3 Mystery Games',
      'Access to All Creation Tools'
    ],
    stripeLink: process.env.NEXT_PUBLIC_PRODUCT_LINK_300!,
    showPrice: true,
    isRecommended: true,
  },
  {
    name: '1000 Credits Pack',
    description: 'Best value for mystery enthusiasts and frequent creators.',
    price: 12.90,
    features: [
      '1000 Credits Balance',
      'Generate 10 Mystery Games',
      'Access to All Creation Tools'
    ],
    stripeLink: process.env.NEXT_PUBLIC_PRODUCT_LINK_1000!,
    showPrice: true,
  },
]

export function OneTimePricingTableComponent() {
  const { user } = useUser()

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Get your credits here</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card 
            key={product.name} 
            className={`flex flex-col bg-gray-700 relative ${
              product.isRecommended ? 'border-2 border-yellow-500' : 'border-transparent'
            }`}
          >
            {product.isRecommended && (
              <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-3 py-0.5 rounded-full text-xs font-medium">
                Recommended
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-white">{product.name}</CardTitle>
              <CardDescription className="text-gray-200">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {product.showPrice && (
                <p className="text-3xl font-bold mb-4 text-white">
                  €{product.price.toFixed(2)}
                  <span className="text-sm font-normal"> one-time</span>
                </p>
              )}
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-400">
                    <Check className="mr-2 h-4 w-4 text-green-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-700 hover:bg-purple-600" asChild>
                <a href={`${product.stripeLink}?prefilled_email=${user?.email}&client_reference_id=${user?.uid}`}>
                  {product.showPrice ? 'Buy Now' : 'Contact Sales'}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}