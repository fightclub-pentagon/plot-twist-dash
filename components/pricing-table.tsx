'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useUser } from '@/contexts/UserContext'

const plans = [
  {
    name: 'Creative Detective',
    description: 'Create your own plots tailored to your group. Make it fun and spice it up. Expore and play other game developed by the community.',
    weeklyPrice: 3.90,
    monthlyPrice: 11.90,
    features: ['Create 1 game per week', 'Play all community games'],
    weeklyLink: 'https://buy.stripe.com/test_eVa8ywgK42pt3Ha5kn',
    monthlyLink: 'https://buy.stripe.com/test_8wM8yw9hC4xBa5y148',
    showPrice: true,
  },
  {
    name: 'Party Leader',
    description: 'Create your own plots tailored to your group. Make it fun and spice it up. Expore and play other game developed by the community. Receive new features before the rest.',
    weeklyPrice: 9.90,
    monthlyPrice: 29.90,
    features: ['Create 7 games per week', 'Play all community games', 'Early access to new features'],
    weeklyLink: 'https://buy.stripe.com/test_eVa7us9hC1lp6Tm6oq',
    monthlyLink: 'https://buy.stripe.com/test_4gwg0YctO3tx3Ha6op',
    showPrice: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large teams',
    weeklyPrice: 49.99,
    monthlyPrice: 199.99,
    features: ['Unlimited games', 'Play all community games', 'Early access to new features', 'Dedicated support'],
    weeklyLink: 'https://example.com/pay/enterprise-weekly',
    monthlyLink: 'https://example.com/pay/enterprise-monthly',
    showPrice: false,
  },
]

export function PricingTableComponent() {
  const [isMonthly, setIsMonthly] = useState(true)
  const {user} = useUser()
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-4 text-white">Choose Your Plan</h2>
      <div className="flex items-center justify-center mb-8 text-white">
        <span className="mr-2 text-sm font-medium">Weekly</span>
        <Switch
          checked={isMonthly}
          onCheckedChange={setIsMonthly}
        />
        <span className="ml-2 text-sm font-medium">Monthly</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col bg-gray-700 border-transparent">
            <CardHeader>
              <CardTitle className="text-white">{plan.name}</CardTitle>
              <CardDescription className="text-gray-200">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {plan.showPrice && (
                <p className="text-3xl font-bold mb-4 text-white">
                  ${isMonthly ? plan.monthlyPrice.toFixed(2) : plan.weeklyPrice.toFixed(2)}
                  <span className="text-sm font-normal">/{isMonthly ? 'month' : 'week'}</span>
                </p>
              )}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-400">
                    <Check className="mr-2 h-4 w-4 text-green-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-700" asChild>
                <a href={isMonthly && plan.showPrice ? `${plan.monthlyLink}?prefilled_email=${user?.email}` : `${plan.monthlyLink}?prefilled_email=${user?.email}`}>
                  {plan.showPrice ? 'Subscribe Now' : 'Contact Sales'}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}