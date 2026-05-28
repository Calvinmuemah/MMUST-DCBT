/*
  Simple integration test script for /auth/onboarding endpoint.
  Usage:
    TEST_BASE_URL=http://localhost:3000/api/v1 TEST_TOKEN=<token> node scripts/run_onboarding_test.js
*/

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000/api/v1';
const token = process.env.TEST_TOKEN || '';

if (!token) {
  console.error('TEST_TOKEN environment variable is required for protected endpoints');
  process.exit(2);
}

async function run() {
  console.log('Running onboarding integration tests against', baseUrl);

  const validPayload = {
    answers: [
      { questionNumber: 1, question: 'Q1', answer: 'Not at all', score: 0 },
      { questionNumber: 2, question: 'Q2', answer: 'Several days', score: 1 },
    ],
    totalScore: 1,
    riskLevel: 'Low',
  };

  const invalidPayload = {
    answers: 'not-an-array',
    totalScore: 'NaN',
    riskLevel: 'Low',
  };

  try {
    // Valid request
    const res1 = await fetch(`${baseUrl}/auth/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validPayload),
    });

    const body1 = await res1.json().catch(() => ({}));
    console.log('\nValid payload response:', res1.status, JSON.stringify(body1));

    // Invalid request
    const res2 = await fetch(`${baseUrl}/auth/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invalidPayload),
    });

    const body2 = await res2.json().catch(() => ({}));
    console.log('\nInvalid payload response:', res2.status, JSON.stringify(body2));

    // Partial invalid item in answers
    const badItemPayload = {
      answers: [ { questionNumber: 1, question: 'Q1', answer: 'OK', score: 0 }, { questionNumber: 'two' } ],
      totalScore: 0,
      riskLevel: 'Low',
    };

    const res3 = await fetch(`${baseUrl}/auth/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(badItemPayload),
    });

    const body3 = await res3.json().catch(() => ({}));
    console.log('\nBad item payload response:', res3.status, JSON.stringify(body3));

    console.log('\nTest run complete.');
  } catch (err) {
    console.error('Error running tests:', err);
    process.exit(1);
  }
}

run();
