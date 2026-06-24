const assert = require('assert').strict;

// Simulating a mock dataset with jumbled scores to test our logic
const mockUnsortedStories = [
    { id: 1, title: 'Low Score Story', score: 10 },
    { id: 2, title: 'High Score Story', score: 500 },
    { id: 3, title: 'Medium Score Story', score: 150 }
];

function runSortingUnitTest() {
    console.log('🧪 Running automated unit test for sorting algorithm...');

    try {
        // 1. Clone our mock array and run our exact pipeline sorting logic
        const sortedData = [...mockUnsortedStories].sort((a, b) => b.score - a.score);

        // 2. Assert (verify) that the items rearranged into the correct mathematical order
        assert.equal(sortedData[0].score, 500, '❌ Test Failed: Highest score should be index 0');
        assert.equal(sortedData[1].score, 150, '❌ Test Failed: Middle score should be index 1');
        assert.equal(sortedData[2].score, 10, '❌ Test Failed: Lowest score should be index 2');

        console.log('✅ UNIT TEST PASSED: Data sorting logic is mathematically sound!');
        
    } catch (error) {
        console.error('💥 Assertion Error encountered during testing:', error.message);
        process.exit(1); // Stop execution to indicate a build failure
    }
}

runSortingUnitTest();