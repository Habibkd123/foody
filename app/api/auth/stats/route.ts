// User statistics and analytics API

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { userStatsQuerySchema } from '@/lib/user-validations';
import { 
  handleUserError, 
  createUserSuccessResponse
} from '@/utils/user-utils';
import { UserStatsResponse } from '@/types/user-types';

// GET - Get user statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const { startDate, endDate } = userStatsQuerySchema.parse(queryData);

    // Build date filter if provided
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get current date boundaries for time-based stats
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Execute all statistics queries in parallel
    const [
      totalUsers,
      adminUsers,
      regularUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      usersWithAddresses,
      roleDistribution,
      registrationTrend
    ] = await Promise.all([
      // Total users
      User.countDocuments(dateFilter),

      // Admin users
      User.countDocuments({ ...dateFilter, role: 'admin' }),

      // Regular users
      User.countDocuments({ ...dateFilter, role: 'user' }),

      // New users today
      User.countDocuments({
        ...dateFilter,
        createdAt: { $gte: todayStart }
      }),

      // New users this week
      User.countDocuments({
        ...dateFilter,
        createdAt: { $gte: weekStart }
      }),

      // New users this month
      User.countDocuments({
        ...dateFilter,
        createdAt: { $gte: monthStart }
      }),

      // Users with addresses
      User.countDocuments({
        ...dateFilter,
        addresses: { $exists: true, $not: { $size: 0 } }
      }),

      // Role distribution with aggregation
      User.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),

      // Registration trend (last 7 days)
      User.aggregate([
        {
          $match: {
            ...dateFilter,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Format role distribution
    const roles = roleDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Format registration trend
    const trend = registrationTrend.map(item => ({
      date: item._id,
      registrations: item.count
    }));

    const stats: UserStatsResponse = {
      totalUsers,
      adminUsers,
      regularUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      usersWithAddresses,
    };

    const responseData = {
      ...stats,
      roleDistribution: roles,
      registrationTrend: trend,
      averageUsersPerDay: newUsersThisWeek / 7,
      growthRate: {
        daily: totalUsers > 0 ? ((newUsersToday / totalUsers) * 100) : 0,
        weekly: totalUsers > 0 ? ((newUsersThisWeek / totalUsers) * 100) : 0,
        monthly: totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100) : 0,
      },
      addressStats: {
        usersWithAddresses,
        usersWithoutAddresses: totalUsers - usersWithAddresses,
        percentageWithAddresses: totalUsers > 0 ? ((usersWithAddresses / totalUsers) * 100) : 0
      }
    };

    return createUserSuccessResponse(responseData);

  } catch (error) {
    return handleUserError(error);
  }
}

// POST - Get detailed analytics
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      groupBy = 'day', 
      period = 30,
      metrics = ['registrations', 'roles'] 
    } = body;

    const periodStart = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    let dateFormat = '%Y-%m-%d';
    if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    } else if (groupBy === 'week') {
      dateFormat = '%Y-W%V';
    } else if (groupBy === 'hour') {
      dateFormat = '%Y-%m-%d %H:00';
    }

    const queries = [];

    // Registration metrics
    if (metrics.includes('registrations')) {
      queries.push(
        User.aggregate([
          { $match: { createdAt: { $gte: periodStart } } },
          {
            $group: {
              _id: {
                period: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                role: '$role'
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.period': 1 } }
        ])
      );
    }

    // Address metrics
    if (metrics.includes('addresses')) {
      queries.push(
        User.aggregate([
          { $match: { createdAt: { $gte: periodStart } } },
          {
            $group: {
              _id: {
                period: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                hasAddresses: { 
                  $cond: { 
                    if: { $gt: [{ $size: { $ifNull: ['$addresses', []] } }, 0] }, 
                    then: true, 
                    else: false 
                  } 
                }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.period': 1 } }
        ])
      );
    }

    const results = await Promise.all(queries);

    const analytics: any = {
      period: period,
      groupBy: groupBy,
      metrics: {} as Record<string, any>,
      summary: {
        totalPeriods: 0,
        averagePerPeriod: 0
      }
    };

    // Process registration metrics
    if (metrics.includes('registrations') && results[0]) {
      analytics.metrics.registrations = results[0];
    }

    // Process address metrics
    if (metrics.includes('addresses') && results[1]) {
      analytics.metrics.addresses = results[1];
    }

    return createUserSuccessResponse(analytics);

  } catch (error) {
    return handleUserError(error);
  }
}