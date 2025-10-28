"use client"

import { useState } from "react"
import { Gift, Star, Trophy, Zap, Coins, Crown, Sparkles, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface LoyaltyRewardsProps {
  userPoints?: number
}

export default function LoyaltyRewards({ userPoints = 250 }: LoyaltyRewardsProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const rewards = [
    {
      id: 'welcome10',
      title: 'Welcome Bonus',
      description: 'Get 10% off on your first order',
      points: 100,
      icon: Gift,
      color: 'from-orange-400 to-orange-500',
      claimed: false
    },
    {
      id: 'free-delivery',
      title: 'Free Delivery',
      description: 'Free shipping on next 3 orders',
      points: 200,
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      claimed: false
    },
    {
      id: 'exclusive20',
      title: 'Exclusive 20% Off',
      description: 'On orders above ₹1000',
      points: 500,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      claimed: false
    },
    {
      id: 'vip-member',
      title: 'VIP Membership',
      description: '1 month of VIP benefits',
      points: 1000,
      icon: Trophy,
      color: 'from-red-500 to-pink-500',
      claimed: false
    }
  ]

  const currentTier = userPoints >= 1000 ? 'Gold' : userPoints >= 500 ? 'Silver' : 'Bronze'
  const nextTierPoints = currentTier === 'Gold' ? 1000 : currentTier === 'Silver' ? 1000 : 500
  const progressToNext = (userPoints / nextTierPoints) * 100

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 via-orange-50 to-pink-50 dark:from-orange-900/20 dark:via-orange-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="h-8 w-8 text-yellow-500 animate-pulse" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-orange-600 bg-clip-text text-transparent">
              Loyalty Rewards
            </h2>
            <Sparkles className="h-8 w-8 text-orange-500 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Earn points with every purchase and unlock exclusive rewards
          </p>
        </div>

        {/* User Points Card */}
        {/* <Card className="mb-8 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500  text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">Your Points Balance</h3>
                </div>
                <div className="text-4xl font-bold mb-2">{userPoints.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white">
                    {currentTier} Member
                  </Badge>
                  <span className="text-sm opacity-90">
                    {nextTierPoints - userPoints} points to {currentTier === 'Gold' ? 'stay Gold' : 'next tier'}
                  </span>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Coins className="h-12 w-12 text-yellow-300" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{currentTier}</span>
                <span>{currentTier === 'Gold' ? 'Max Level' : 'Next Tier'}</span>
              </div>
              <Progress value={progressToNext} className="h-3 bg-white/20 dark:bg-white/10" />
            </div>
          </CardContent>
        </Card> */}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {rewards.map((reward) => {
            const Icon = reward.icon
            const canAfford = userPoints >= reward.points
            const isSelected = selectedReward === reward.id
            
            return (
              <Card 
                key={reward.id}
                className={`group cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected ? 'ring-2 ring-orange-500 shadow-xl scale-105' : 'hover:shadow-xl hover:scale-105'
                } ${!canAfford ? 'opacity-60' : ''}`}
                onClick={() => canAfford && setSelectedReward(isSelected ? null : reward.id)}
              >
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${reward.color}`}></div>
                  
                  <div className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${reward.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                      {reward.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {reward.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg text-orange-600">{reward.points}</span>
                      <span className="text-sm text-gray-500">points</span>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        canAfford 
                          ? `bg-gradient-to-r ${reward.color} hover:opacity-90 text-white`
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!canAfford || reward.claimed}
                    >
                      {reward.claimed ? 'Claimed' : canAfford ? 'Redeem' : 'Need More Points'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* How to Earn Section */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              How to Earn Points
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Shop & Earn</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1 point for every ₹10 spent
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Write Reviews</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  10 points for every product review
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Refer Friends</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  50 points for each successful referral
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
