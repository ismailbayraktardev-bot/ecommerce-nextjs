
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * GET /api/dashboard/stats - Get statistics for the user's dashboard
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ 
      success: false, 
      message: 'Oturum açmanız gerekiyor', 
      error: { code: 'UNAUTHORIZED' } 
    }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Perform all count queries in a single transaction for efficiency
    const [totalSites, totalPages, recentActivity] = await prisma.$transaction([
      // 1. Get total number of sites
      prisma.site.count({
        where: { userId },
      }),
      // 2. Get total number of pages across all sites
      prisma.page.count({
        where: { userId },
      }),
      // 3. Get recent activities (e.g., last 5 created sites)
      // This is a simplified version. A more robust solution would involve a dedicated Activity model.
      prisma.site.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

    // Format recent activity to match Luna's requested format
    const formattedActivity = recentActivity.map(site => ({
      id: site.id,
      type: 'site_created',
      message: `Yeni bir site oluşturdunuz: ${site.name}`,
      timestamp: site.createdAt.toISOString(),
    }));

    const stats = {
      totalSites,
      totalPages,
      totalVisitors: 0, // Placeholder as requested
      activeStatus: totalSites, // Assuming all sites are active for now
      recentActivity: formattedActivity,
    };

    return NextResponse.json({ success: true, data: stats });

  } catch (error) {
    console.error("GET_DASHBOARD_STATS_ERROR", error);
    return NextResponse.json({ 
      success: false, 
      message: 'İstatistikler getirilirken bir hata oluştu.', 
      error: { code: 'INTERNAL_ERROR' } 
    }, { status: 500 });
  }
}
