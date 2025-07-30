import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock stats data - in production this would come from your Django backend
    const stats = {
      total_members: 156,
      total_organizations: 23,
      total_projects: 34,
      total_experiences: 289,
      total_resources: 12,
      members_by_region: [
        { region: 'NA', count: 89 },
        { region: 'EU', count: 34 },
        { region: 'AS', count: 18 },
        { region: 'SA', count: 8 },
        { region: 'AF', count: 4 },
        { region: 'OC', count: 3 }
      ],
      organizations_by_type: [
        { type: 'CO', count: 12 },
        { type: 'CM', count: 6 },
        { type: 'AC', count: 3 },
        { type: 'EV', count: 2 }
      ],
      projects_by_stage: [
        { stage: 'J', count: 8 },
        { stage: 'MVP', count: 15 },
        { stage: 'L', count: 11 }
      ]
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
} 