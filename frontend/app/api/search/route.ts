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
  if (lowerQuery.includes('graphic design') || lowerQuery.includes('design') || lowerQuery.includes('logo')) {
    results.push({
      type: 'member',
      data: {
        id: 1,
        first_name: 'Alex',
        last_name: 'Chen',
        skills: 'Graphic Design, UI/UX, Social Media Marketing, Brand Identity, Logo Design',
        location: 'San Francisco, CA',
        pod: 'Stripe',
        session: '2023',
        email: 'alex.chen@example.com',
        additional_info: 'Experienced in creating brand identities and marketing materials for startups. Specializes in logo design and social media graphics.'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 2,
        first_name: 'Emma',
        last_name: 'Rodriguez',
        skills: 'Visual Design, Illustration, Digital Marketing, Content Creation, Brand Strategy',
        location: 'New York, NY',
        pod: 'Zoom',
        session: '2022',
        email: 'emma.rodriguez@example.com',
        additional_info: 'Specializes in social media graphics and marketing campaigns. Has worked with multiple startups on branding projects.'
      }
    });
  }

  if (lowerQuery.includes('startup') || lowerQuery.includes('founder') || lowerQuery.includes('dashboard') || lowerQuery.includes('mvp')) {
    results.push({
      type: 'project',
      data: {
        id: 1,
        title: 'Founder Dashboard',
        type: 'Startup',
        stage: 'MVP',
        what_are_they_looking_for: 'Looking for marketing and design talent to help with branding and user acquisition. Also need developers familiar with React and Node.js.',
        founders: [{ first_name: 'Mike', last_name: 'Davis' }],
        additional_info: 'A comprehensive dashboard for young founders to track projects, goals, startup progress, and even prep for apps or pitches.'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 3,
        first_name: 'David',
        last_name: 'Kim',
        skills: 'Product Management, Startup Strategy, User Research, Growth Hacking, MVP Development',
        location: 'Austin, TX',
        pod: 'Google',
        session: '2023',
        email: 'david.kim@example.com',
        additional_info: 'Former founder looking to join early-stage startups. Experienced in building and launching MVPs.'
      }
    });
  }

  if (lowerQuery.includes('boston') || lowerQuery.includes('location') || lowerQuery.includes('local')) {
    results.push({
      type: 'member',
      data: {
        id: 4,
        first_name: 'Sarah',
        last_name: 'Johnson',
        skills: 'Marketing, Content Creation, Brand Strategy, Event Planning, Networking',
        location: 'Boston, MA',
        pod: 'Zoom',
        session: '2023',
        email: 'sarah.johnson@example.com',
        additional_info: 'Based in Boston and available for local collaborations. Active in the local startup community and always open to coffee meetings.'
      }
    });
  }

  if (lowerQuery.includes('software engineer') || lowerQuery.includes('mobile') || lowerQuery.includes('developer') || lowerQuery.includes('react native') || lowerQuery.includes('ios')) {
    results.push({
      type: 'member',
      data: {
        id: 5,
        first_name: 'James',
        last_name: 'Wilson',
        skills: 'Mobile Development, React Native, iOS, Android, Full Stack Development, JavaScript',
        location: 'Seattle, WA',
        pod: 'Microsoft',
        session: '2022',
        email: 'james.wilson@example.com',
        additional_info: 'Experienced mobile developer with 3+ years building iOS and Android apps. Strong background in React Native and native iOS development.'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 6,
        first_name: 'Lisa',
        last_name: 'Zhang',
        skills: 'Full Stack Development, React, Node.js, Python, Database Design, PostgreSQL',
        location: 'San Francisco, CA',
        pod: 'Stripe',
        session: '2023',
        email: 'lisa.zhang@example.com',
        additional_info: 'Full stack developer with experience in startup environments. Proficient in React, Node.js, and PostgreSQL.'
      }
    });
  }

  if (lowerQuery.includes('marketing') || lowerQuery.includes('cmo') || lowerQuery.includes('content creation') || lowerQuery.includes('social media')) {
    results.push({
      type: 'member',
      data: {
        id: 7,
        first_name: 'Rachel',
        last_name: 'Thompson',
        skills: 'Digital Marketing, Growth Marketing, Brand Strategy, Customer Acquisition, Content Creation, Social Media Strategy',
        location: 'Los Angeles, CA',
        pod: 'Google',
        session: '2022',
        email: 'rachel.thompson@example.com',
        additional_info: 'Marketing specialist with experience in B2B and B2C campaigns. Expert in content creation and social media strategy.'
      }
    });
  }

  if (lowerQuery.includes('rove') || lowerQuery.includes('intern') || lowerQuery.includes('internship')) {
    results.push({
      type: 'member',
      data: {
        id: 8,
        first_name: 'Kevin',
        last_name: 'Park',
        skills: 'Data Analysis, Market Research, Business Strategy, Financial Modeling, Venture Capital',
        location: 'New York, NY',
        pod: 'Stripe',
        session: '2023',
        email: 'kevin.park@example.com',
        additional_info: 'Currently interning at Rove, interested in venture capital and startup ecosystem. Happy to share insights about the internship experience.'
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
        description: 'A community of fintech professionals and enthusiasts. Great place to network and learn about the latest in financial technology.',
        website: 'https://fintechnexus.com'
      }
    });
    results.push({
      type: 'member',
      data: {
        id: 9,
        first_name: 'Amanda',
        last_name: 'Foster',
        skills: 'Fintech, Blockchain, Financial Services, Product Strategy, Networking',
        location: 'Chicago, IL',
        pod: 'Zoom',
        session: '2022',
        email: 'amanda.foster@example.com',
        additional_info: 'Active member of FinTech Nexus community. Always happy to connect with other fintech professionals.'
      }
    });
  }

  if (lowerQuery.includes('web dev') || lowerQuery.includes('full stack') || lowerQuery.includes('postgresql') || lowerQuery.includes('no code')) {
    results.push({
      type: 'member',
      data: {
        id: 10,
        first_name: 'Taylor',
        last_name: 'Brown',
        skills: 'Full Stack Development, React, Node.js, PostgreSQL, No-Code Platforms, Web Development',
        location: 'Denver, CO',
        pod: 'Microsoft',
        session: '2023',
        email: 'taylor.brown@example.com',
        additional_info: 'Experienced in both traditional web development and no-code solutions. Can help evaluate different approaches for MVPs.'
      }
    });
  }

  // If no specific matches, return some general results
  if (results.length === 0) {
    results.push({
      type: 'member',
      data: {
        id: 11,
        first_name: 'Jordan',
        last_name: 'Miller',
        skills: 'General Business, Networking, Project Management, Startup Ecosystem',
        location: 'San Francisco, CA',
        pod: 'Google',
        session: '2023',
        email: 'jordan.miller@example.com',
        additional_info: 'Open to new opportunities and collaborations. Always happy to help connect people in the network.'
      }
    });
  }

  return results;
} 