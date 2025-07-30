import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // In production, this would point to your Django backend
    // For now, we'll return mock data based on the query
    const mockResults = generateMockResults(query);
    
    return NextResponse.json({
      results: mockResults,
      query: query,
      total: mockResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

function generateMockResults(query: string) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  // Mock data based on query patterns
  if (lowerQuery.includes('graphic design') || lowerQuery.includes('design')) {
    results.push({
      type: 'member',
      data: {
        id: 1,
        first_name: 'Alex',
        last_name: 'Chen',
        skills: 'Graphic Design, UI/UX, Social Media Marketing, Brand Identity',
        location: 'San Francisco, CA',
        pod: 'Stripe',
        session: '2023',
        email: 'alex.chen@example.com',
        additional_info: 'Experienced in creating brand identities and marketing materials for startups'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 2,
        first_name: 'Emma',
        last_name: 'Rodriguez',
        skills: 'Visual Design, Illustration, Digital Marketing, Content Creation',
        location: 'New York, NY',
        pod: 'Zoom',
        session: '2022',
        email: 'emma.rodriguez@example.com',
        additional_info: 'Specializes in social media graphics and marketing campaigns'
      }
    });
  }

  if (lowerQuery.includes('startup') || lowerQuery.includes('founder')) {
    results.push({
      type: 'project',
      data: {
        id: 1,
        title: 'Founder Dashboard',
        type: 'Startup',
        stage: 'MVP',
        what_are_they_looking_for: 'Looking for marketing and design talent to help with branding and user acquisition',
        founders: [{ first_name: 'Mike', last_name: 'Davis' }],
        additional_info: 'A comprehensive dashboard for young founders to track projects, goals, and startup progress'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 3,
        first_name: 'David',
        last_name: 'Kim',
        skills: 'Product Management, Startup Strategy, User Research, Growth Hacking',
        location: 'Austin, TX',
        pod: 'Google',
        session: '2023',
        email: 'david.kim@example.com',
        additional_info: 'Former founder looking to join early-stage startups'
      }
    });
  }

  if (lowerQuery.includes('boston') || lowerQuery.includes('location')) {
    results.push({
      type: 'member',
      data: {
        id: 4,
        first_name: 'Sarah',
        last_name: 'Johnson',
        skills: 'Marketing, Content Creation, Brand Strategy, Event Planning',
        location: 'Boston, MA',
        pod: 'Zoom',
        session: '2023',
        email: 'sarah.johnson@example.com',
        additional_info: 'Based in Boston and available for local collaborations'
      }
    });
  }

  if (lowerQuery.includes('software engineer') || lowerQuery.includes('mobile') || lowerQuery.includes('developer')) {
    results.push({
      type: 'member',
      data: {
        id: 5,
        first_name: 'James',
        last_name: 'Wilson',
        skills: 'Mobile Development, React Native, iOS, Android, Full Stack Development',
        location: 'Seattle, WA',
        pod: 'Microsoft',
        session: '2022',
        email: 'james.wilson@example.com',
        additional_info: 'Experienced mobile developer with 3+ years building iOS and Android apps'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 6,
        first_name: 'Lisa',
        last_name: 'Zhang',
        skills: 'Full Stack Development, React, Node.js, Python, Database Design',
        location: 'San Francisco, CA',
        pod: 'Stripe',
        session: '2023',
        email: 'lisa.zhang@example.com',
        additional_info: 'Full stack developer with experience in startup environments'
      }
    });
  }

  if (lowerQuery.includes('marketing') || lowerQuery.includes('cmo')) {
    results.push({
      type: 'member',
      data: {
        id: 7,
        first_name: 'Rachel',
        last_name: 'Thompson',
        skills: 'Digital Marketing, Growth Marketing, Brand Strategy, Customer Acquisition',
        location: 'Los Angeles, CA',
        pod: 'Google',
        session: '2022',
        email: 'rachel.thompson@example.com',
        additional_info: 'Marketing specialist with experience in B2B and B2C campaigns'
      }
    });
  }

  if (lowerQuery.includes('rove') || lowerQuery.includes('intern')) {
    results.push({
      type: 'member',
      data: {
        id: 8,
        first_name: 'Kevin',
        last_name: 'Park',
        skills: 'Data Analysis, Market Research, Business Strategy, Financial Modeling',
        location: 'New York, NY',
        pod: 'Stripe',
        session: '2023',
        email: 'kevin.park@example.com',
        additional_info: 'Currently interning at Rove, interested in venture capital and startup ecosystem'
      }
    });
  }

  if (lowerQuery.includes('fintech nexus') || lowerQuery.includes('fintech')) {
    results.push({
      type: 'organization',
      data: {
        id: 1,
        name: 'FinTech Nexus',
        type: 'Professional Community',
        description: 'A community of fintech professionals and enthusiasts',
        website: 'https://fintechnexus.com'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 9,
        first_name: 'Amanda',
        last_name: 'Foster',
        skills: 'Fintech, Blockchain, Financial Services, Product Strategy',
        location: 'Chicago, IL',
        pod: 'Zoom',
        session: '2022',
        email: 'amanda.foster@example.com',
        additional_info: 'Active member of FinTech Nexus community'
      }
    });
  }

  // If no specific matches, return some general results
  if (results.length === 0) {
    results.push({
      type: 'member',
      data: {
        id: 10,
        first_name: 'Taylor',
        last_name: 'Brown',
        skills: 'General Business, Networking, Project Management',
        location: 'Denver, CO',
        pod: 'Microsoft',
        session: '2023',
        email: 'taylor.brown@example.com',
        additional_info: 'Open to new opportunities and collaborations'
      }
    });
  }

  return results;
} 