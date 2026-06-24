const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const userLimit = parseInt(process.argv[2], 10) || 5;

async function scrapeSortAndArchive(limit) {
    try {
        console.log(`📡 Fetching top stories from Hacker News...`);
        
        const topStoriesResponse = await axios.get(`${BASE_URL}/topstories.json`);
        const storyIds = topStoriesResponse.data.slice(0, limit);
        
        console.log(`✅ Dynamically requested top ${limit} story IDs.`);
        console.log(`🔄 Fetching detailed data for each story...`);

        const storyPromises = storyIds.map(id => axios.get(`${BASE_URL}/item/${id}.json`));
        const responses = await Promise.all(storyPromises);
        
        const cleanStories = responses.map(res => {
            const item = res.data;
            return {
                id: item.id,
                title: item.title,
                author: item.by,
                score: item.score,
                url: item.url || `https://news.ycombinator.com/item?id=${item.id}`
            };
        });

        cleanStories.sort((a, b) => b.score - a.score);
        console.log(`📊 Data sorted successfully by highest score.`);

        // --- NEW ARCHIVE LOGIC ---
        // Generates a clean timestamp string like "2026-06-24"
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Always save the latest version as stories.json
        fs.writeFileSync('stories.json', JSON.stringify(cleanStories, null, 4), 'utf-8');
        
        // Also save a historical archive file that won't get overwritten!
        const archiveName = `stories-archive-${timestamp}.json`;
        fs.writeFileSync(archiveName, JSON.stringify(cleanStories, null, 4), 'utf-8');
        
        console.log(`💾 Success! Live file updated: stories.json`);
        console.log(`📦 History logged safely to: ${archiveName}`);

        console.log(`\n📊 --- SCRAPED DATA RESULTS (TOP ${limit} SORTED) ---`);
        console.table(cleanStories);
        
        return cleanStories;

    } catch (error) {
        console.error('❌ Error executing scraper task:', error.message);
    }
}

scrapeSortAndArchive(userLimit);