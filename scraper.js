const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const TARGET_URL = 'https://news.ycombinator.com/';
const userLimit = parseInt(process.argv[2], 10) || 5;

/**
 * Robust network fetch helper wrapped in an automatic Retry Algorithm
 */
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            return response.data;
        } catch (error) {
            console.warn(`⚠️ Connection attempt ${attempt} failed. Error: ${error.message}`);
            if (attempt === retries) throw new Error(`🔴 All ${retries} network retry attempts exhausted.`);
            
            console.log(`⏱️ Waiting ${delay / 1000}s before retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function scrapeRawHTMLHomepage(limit) {
    try {
        console.log(`📡 Targeting raw HTML stream from: ${TARGET_URL}`);
        
        const html = await fetchWithRetry(TARGET_URL);
        console.log(`✅ Raw HTML fetched successfully. Initializing parser...`);

        const $ = cheerio.load(html);
        const scrapedStories = [];

        $('.athing').slice(0, limit).each((index, element) => {
            const titleRow = $(element);
            const subtextRow = titleRow.next();

            const id = titleRow.attr('id');
            const title = titleRow.find('.titleline > a').first().text();
            const url = titleRow.find('.titleline > a').first().attr('href');
            
            const author = subtextRow.find('.hnuser').text() || 'Anonymous';
            const scoreText = subtextRow.find('.score').text() || '0 points';
            const score = parseInt(scoreText.replace('points', '').trim(), 10);

            scrapedStories.push({
                id: parseInt(id, 10),
                title,
                author,
                score,
                url: url.startsWith('item?id=') ? `https://news.ycombinator.com/${url}` : url
            });
        });

        scrapedStories.sort((a, b) => b.score - a.score);

        const timestamp = new Date().toISOString().split('T')[0];
        fs.writeFileSync('stories.json', JSON.stringify(scrapedStories, null, 4), 'utf-8');
        fs.writeFileSync(`stories-archive-${timestamp}.json`, JSON.stringify(scrapedStories, null, 4), 'utf-8');

        console.log(`💾 Live file updated and archived with raw HTML datasets.`);
        console.log(`\n📊 --- WEB SCRAPED RAW DATA (TOP ${limit} SORTED) ---`);
        console.table(scrapedStories);

    } catch (error) {
        console.error('❌ Critical Pipeline Failure:', error.message);
    }
}

scrapeRawHTMLHomepage(userLimit);