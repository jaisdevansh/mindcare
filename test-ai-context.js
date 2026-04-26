// Test AI Context - Automated Testing Script
// Run: node test-ai-context.js

const API_URL = 'http://localhost:5000';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    step: (msg) => console.log(`${colors.cyan}🔹 ${msg}${colors.reset}`),
};

// Test user credentials
const testUser = {
    email: 'test@mindcare.com',
    password: 'Test123!',
    name: 'Test User'
};

let token = '';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`API call failed: ${error.message}`);
    }
}

// Test functions
async function testLogin() {
    log.step('Step 1: Logging in...');
    
    try {
        const response = await apiCall('/auth/login', 'POST', {
            email: testUser.email,
            password: testUser.password
        });

        if (response.success && response.data.token) {
            token = response.data.token;
            log.success('Login successful');
            return true;
        } else {
            log.error('Login failed - trying to register...');
            return await testRegister();
        }
    } catch (error) {
        log.error(`Login error: ${error.message}`);
        return false;
    }
}

async function testRegister() {
    log.step('Registering new test user...');
    
    try {
        const response = await apiCall('/auth/register', 'POST', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            role: 'user'
        });

        if (response.success) {
            log.success('Registration successful');
            return await testLogin();
        } else {
            log.error('Registration failed');
            return false;
        }
    } catch (error) {
        log.error(`Registration error: ${error.message}`);
        return false;
    }
}

async function sendMessage(message) {
    log.step(`Sending message: "${message}"`);
    
    try {
        const response = await apiCall('/ai/chat', 'POST', { message });
        
        if (response.success) {
            log.success(`AI Response: "${response.data.aiResponse}"`);
            log.info(`Mood: ${response.data.mood.mood} (${response.data.mood.score}%)`);
            log.info(`Depression Score: ${response.data.depressionRisk.depressionScore}/100`);
            log.info(`Risk Level: ${response.data.depressionRisk.riskLevel}`);
            return response.data;
        } else {
            log.error('Message failed');
            return null;
        }
    } catch (error) {
        log.error(`Message error: ${error.message}`);
        return null;
    }
}

async function analyzeResponse(response, expectedBehavior) {
    console.log('\n' + '='.repeat(60));
    log.info('ANALYZING AI RESPONSE...');
    console.log('='.repeat(60));
    
    const aiResponse = response.aiResponse.toLowerCase();
    
    // Check if AI is asking about mood (BAD)
    if (aiResponse.includes('how are you feeling') || 
        aiResponse.includes('how do you feel')) {
        log.error('AI is asking about mood (mood already detected!)');
        log.warning('This indicates AI is NOT using context properly');
        return false;
    } else {
        log.success('AI is NOT asking about mood (good!)');
    }
    
    // Check if response is specific
    if (expectedBehavior.shouldAskAbout) {
        const keywords = expectedBehavior.shouldAskAbout;
        const hasKeyword = keywords.some(kw => aiResponse.includes(kw.toLowerCase()));
        
        if (hasKeyword) {
            log.success(`AI is asking about expected topic: ${keywords.join(' or ')}`);
            return true;
        } else {
            log.warning(`AI should ask about: ${keywords.join(' or ')}`);
            log.warning(`But asked: "${response.aiResponse}"`);
            return false;
        }
    }
    
    return true;
}

async function runTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 AI CONTEXT TEST - AUTOMATED');
    console.log('='.repeat(60) + '\n');
    
    log.info('Testing if AI uses conversation context or gives static responses');
    log.info('Watch backend console for detailed logs!\n');
    
    // Step 1: Login
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
        log.error('Cannot proceed without authentication');
        return;
    }
    
    console.log('\n' + '='.repeat(60));
    log.info('TEST 1: First Message (No Context)');
    console.log('='.repeat(60) + '\n');
    
    const response1 = await sendMessage("I'm feeling stressed");
    if (!response1) return;
    
    await analyzeResponse(response1, {
        shouldAskAbout: ['cause', 'causing', 'reason', 'why', 'what']
    });
    
    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n' + '='.repeat(60));
    log.info('TEST 2: Follow-up Message (Should Use Context)');
    console.log('='.repeat(60) + '\n');
    
    const response2 = await sendMessage("Work has been overwhelming");
    if (!response2) return;
    
    const contextUsed = await analyzeResponse(response2, {
        shouldAskAbout: ['work', 'workload', 'pressure', 'job', 'deadline']
    });
    
    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n' + '='.repeat(60));
    log.info('TEST 3: Deep Conversation (Should Reference Previous)');
    console.log('='.repeat(60) + '\n');
    
    const response3 = await sendMessage("It's the workload, too many deadlines");
    if (!response3) return;
    
    await analyzeResponse(response3, {
        shouldAskAbout: ['long', 'duration', 'how long', 'when', 'sleep', 'affect']
    });
    
    // Final Summary
    console.log('\n' + '='.repeat(60));
    log.info('TEST SUMMARY');
    console.log('='.repeat(60) + '\n');
    
    log.info('Check backend console for detailed logs:');
    console.log('  - Recent Messages Count should increase (0 → 1 → 2)');
    console.log('  - Last AI Question should appear after first message');
    console.log('  - Mood History Count should increase (1 → 2 → 3)');
    console.log('  - AI responses should be specific, not generic\n');
    
    if (contextUsed) {
        log.success('AI appears to be using context! ✨');
    } else {
        log.warning('AI might NOT be using context properly');
        log.warning('Check backend logs for details');
    }
    
    console.log('\n' + '='.repeat(60));
    log.info('NEXT STEPS:');
    console.log('='.repeat(60));
    console.log('1. Check backend console for detailed logs');
    console.log('2. Look for "🧠 CONTEXT SUMMARY" sections');
    console.log('3. Verify Recent Messages Count increases');
    console.log('4. Verify Last Question appears');
    console.log('5. See TEST_AI_CONTEXT.md for manual testing\n');
}

// Run tests
runTests().catch(error => {
    log.error(`Test failed: ${error.message}`);
    console.log('\nMake sure:');
    console.log('1. Backend is running (npm run dev in backend folder)');
    console.log('2. MongoDB is running');
    console.log('3. Backend is accessible at http://localhost:5000\n');
});
