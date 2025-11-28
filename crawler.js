const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VietlottCrawler {
  constructor() {
    this.baseUrl = 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-655';
    this.dataFile = path.join(__dirname, 'data', 'power655.jsonl');
    this.existingData = this.loadExistingData();
  }

  loadExistingData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const content = fs.readFileSync(this.dataFile, 'utf8');
        const lines = content.trim().split('\n');
        return lines.map(line => JSON.parse(line));
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
    return [];
  }

  async crawlData() {
    console.log('Starting Vietlott Power 6/55 data crawler...');
    console.log(`Existing data entries: ${this.existingData.length}`);
    
    const browser = await puppeteer.launch({
      headless: false, // Set to false for debugging
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      console.log('Navigating to Vietlott website...');
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-screenshot.png' });
      console.log('Screenshot saved as debug-screenshot.png');
      
      console.log('Extracting data from website...');
      const newData = await this.extractData(page);
      
      console.log(`Extracted ${newData.length} results from website`);
      
      if (newData.length > 0) {
        console.log(`Found ${newData.length} new results`);
        await this.updateDataFile(newData);
      } else {
        console.log('No new data found');
      }
      
    } catch (error) {
      console.error('Error during crawling:', error);
    } finally {
      await browser.close();
    }
  }

  async extractData(page) {
    try {
      const results = await page.evaluate(() => {
        const data = [];
        
        // Find the divResultContent div
        const resultContent = document.querySelector('#divResultContent');
        if (!resultContent) {
          console.log('divResultContent not found');
          return data;
        }
        
        console.log('Found divResultContent');
        
        // Find all links with href containing the draw ID pattern
        const links = resultContent.querySelectorAll('a[href*="/vi/trung-thuong/ket-qua-trung-thuong/655?id="]');
        console.log(`Found ${links.length} draw links`);
        
        links.forEach((link, index) => {
          const href = link.getAttribute('href');
          console.log(`Link ${index}: ${href}`);
          
          // Extract draw ID from href
          const idMatch = href.match(/id=(\d+)/);
          if (idMatch) {
            const drawId = idMatch[1].padStart(5, '0'); // Ensure 5-digit format
            console.log(`Extracted draw ID: ${drawId}`);
            
            // Find the parent row or container
            let row = link.closest('tr');
            if (!row) {
              row = link.closest('div');
            }
            
            if (row) {
              const cells = row.querySelectorAll('td');
              console.log(`Row ${index}: ${cells.length} cells`);
              
              if (cells.length >= 3) {
                // Log cell contents for debugging
                const cellContents = Array.from(cells).map(cell => cell.textContent?.trim());
                console.log(`Row ${index} cell contents:`, cellContents);
                
                // Try different cell positions for data
                const possibleData = {
                  drawId: drawId,
                  dateText: cells[0]?.textContent?.trim() || cells[1]?.textContent?.trim(),
                  numbersText: cells[1]?.textContent?.trim() || cells[2]?.textContent?.trim()
                };
                
                console.log(`Row ${index} possible data:`, possibleData);
                
                if (possibleData.dateText && possibleData.numbersText) {
                  // Parse date - try different formats
                  let date = null;
                  const dateFormats = [
                    /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
                    /(\d{4})-(\d{2})-(\d{2})/,   // YYYY-MM-DD
                    /(\d{2})-(\d{2})-(\d{4})/,   // DD-MM-YYYY
                    /(\d{1,2})\/(\d{1,2})\/(\d{4})/ // D/M/YYYY
                  ];
                  
                  for (const format of dateFormats) {
                    const match = possibleData.dateText.match(format);
                    if (match) {
                      if (format.source.includes('YYYY')) {
                        const [, day, month, year] = match;
                        date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                      } else {
                        const [, year, month, day] = match;
                        date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                      }
                      console.log(`Row ${index} parsed date: ${date}`);
                      break;
                    }
                  }
                  
                  if (date) {
                    // Parse numbers - try different separators
                    const numberTexts = [
                      possibleData.numbersText,
                      possibleData.numbersText.replace(/[^\d\s,]/g, ''),
                      possibleData.numbersText.replace(/[^\d\s-]/g, ''),
                      possibleData.numbersText.replace(/[^\d\s]/g, '')
                    ];
                    
                    for (const numberText of numberTexts) {
                      const numbers = numberText
                        .split(/[,\s-]+/)
                        .map(num => parseInt(num.trim()))
                        .filter(num => !isNaN(num) && num > 0 && num <= 55);
                      
                      console.log(`Row ${index} parsed numbers:`, numbers);
                      
                      if (numbers.length >= 6) {
                        data.push({
                          date: date,
                          id: drawId,
                          result: numbers.slice(0, 6), // Ensure only 6 numbers
                          page: Math.floor(index / 20) + 1,
                          process_time: new Date().toISOString()
                        });
                        console.log(`Row ${index} added to data`);
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        });
        
        console.log(`Total data entries extracted: ${data.length}`);
        return data;
      });
      
      return results;
    } catch (error) {
      console.error('Error extracting data:', error);
      return [];
    }
  }

  async updateDataFile(newData) {
    try {
      console.log(`Processing ${newData.length} extracted results`);
      
      // Filter out duplicates based on draw ID
      const existingIds = new Set(this.existingData.map(item => item.id));
      console.log(`Existing IDs: ${Array.from(existingIds).slice(0, 10).join(', ')}...`);
      
      const uniqueNewData = newData.filter(item => !existingIds.has(item.id));
      console.log(`Unique new data: ${uniqueNewData.length} entries`);
      
      if (uniqueNewData.length === 0) {
        console.log('No new unique data to add');
        return;
      }
      
      console.log('New unique entries:');
      uniqueNewData.forEach(item => {
        console.log(`  ID: ${item.id}, Date: ${item.date}, Numbers: ${item.result.join(', ')}`);
      });
      
      // Sort new data by date (oldest first)
      uniqueNewData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Combine existing and new data
      const allData = [...this.existingData, ...uniqueNewData];
      
      // Sort all data by date (newest first)
      allData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Write to file
      const content = allData.map(item => JSON.stringify(item)).join('\n');
      fs.writeFileSync(this.dataFile, content);
      
      console.log(`Successfully updated data file with ${uniqueNewData.length} new entries`);
      console.log(`Total entries in file: ${allData.length}`);
      
      // Also update the public data file for the React app
      const publicDataFile = path.join(__dirname, 'public', 'data', 'power655.jsonl');
      if (fs.existsSync(path.dirname(publicDataFile))) {
        fs.writeFileSync(publicDataFile, content);
        console.log('Updated public data file for React app');
      }
      
    } catch (error) {
      console.error('Error updating data file:', error);
    }
  }
}

// Run the crawler
async function main() {
  const crawler = new VietlottCrawler();
  await crawler.crawlData();
}

// Handle command line arguments
if (require.main === module) {
  main().catch(console.error);
}

module.exports = VietlottCrawler; 