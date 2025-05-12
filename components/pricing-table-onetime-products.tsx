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
}

const products: Product[] = [
  {
    name: 'Single Adventure',
    description: 'Perfect for a one-time special event. Create and host a unique mystery game.',
    price: 9.90,
    features: ['One complete mystery game', 'Access to basic tools', 'Community support'],
    stripeLink: 'https://buy.stripe.com/test_singleAdventure',
    showPrice: true,
  },
  {
    name: 'Mystery Bundle',
    description: 'Get a collection of pre-made mysteries plus the ability to create your own.',
    price: 24.90,
    features: [
      'Three mystery games',
      'Create one custom game',
      'Access to all tools',
      'Premium support'
    ],
    stripeLink: 'https://buy.stripe.com/test_mysteryBundle',
    showPrice: true,
  },
  {
    name: 'Custom Package',
    description: 'Tailored solution for special events and large organizations',
    price: 99.99,
    features: [
      'Custom number of games',
      'Branded experience',
      'Advanced tools access',
      'Priority support',
      'Custom features'
    ],
    stripeLink: 'https://buy.stripe.com/test_customPackage',
    showPrice: false,
  },
]

export function OneTimePricingTableComponent() {
  const { user } = useUser()

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">One-Time Purchase Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.name} className="flex flex-col bg-gray-700 border-transparent">
            <CardHeader>
              <CardTitle className="text-white">{product.name}</CardTitle>
              <CardDescription className="text-gray-200">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {product.showPrice && (
                <p className="text-3xl font-bold mb-4 text-white">
                  ${product.price.toFixed(2)}
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
                <a href={`${product.stripeLink}?prefilled_email=${user?.email}`}>
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