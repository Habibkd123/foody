
"use client";
import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }: any) => {
  const isPositive = trend === 'up';

  return (
    <Card className="border-none shadow-soft transition-all duration-300 hover:shadow-soft-lg group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-xl transition-colors ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1.5">
          <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {trendValue}%
          </span>
          <span className="text-[10px] text-muted-foreground ml-1.5 whitespace-nowrap">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹1,24,592',
      icon: DollarSign,
      trend: 'up',
      trendValue: '12.5',
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
    {
      title: 'Active Orders',
      value: '142',
      icon: ShoppingBag,
      trend: 'up',
      trendValue: '8.2',
      colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
      title: 'Active Users',
      value: '1,205',
      icon: Users,
      trend: 'up',
      trendValue: '5.1',
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      icon: TrendingUp,
      trend: 'down',
      trendValue: '0.4',
      colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ];

  const recentOrders = [
    { id: '#ORD-7234', customer: 'Rahul Sharma', item: 'Paneer Butter Masala', amount: '₹420', status: 'Delivered', time: '5m ago' },
    { id: '#ORD-7235', customer: 'Priya Patel', item: 'Chicken Biryani', amount: '₹350', status: 'Processing', time: '12m ago' },
    { id: '#ORD-7236', customer: 'Amit Singh', item: 'Veg Thali', amount: '₹280', status: 'Cancelled', time: '25m ago' },
    { id: '#ORD-7237', customer: 'Sneha Rao', item: 'Masala Dosa', amount: '₹120', status: 'Delivered', time: '40m ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="shadow-sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="shadow-soft bg-primary hover:bg-primary/90 text-white font-semibold">
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Large */}
        <Card className="lg:col-span-2 border-none shadow-soft overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>You have 12 new orders today.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/5">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-6 font-medium font-mono text-sm">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`
                          ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                          ${order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                          border-none font-medium
                        `}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 text-muted-foreground text-xs">{order.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Tips / Actions */}
        <Card className="border-none shadow-soft flex flex-col">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time status of your platform services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="space-y-4">
              {[
                { label: 'API Gateway', status: 'Operational', color: 'bg-emerald-500' },
                { label: 'Database Cluster', status: 'Operational', color: 'bg-emerald-500' },
                { label: 'Payment Gateway', status: 'Operational', color: 'bg-emerald-500' },
                { label: 'Notification Service', status: 'Busy', color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.status}</span>
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border mt-auto">
              <p className="text-sm font-semibold mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">Add Product</Button>
                <Button variant="outline" size="sm" className="text-xs">New Banner</Button>
                <Button variant="outline" size="sm" className="text-xs">Site Settings</Button>
                <Button variant="outline" size="sm" className="text-xs">Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;