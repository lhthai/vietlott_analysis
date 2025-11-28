# Vietlott Statistics

A React application for analyzing Vietlott lottery data with automatic data crawling capabilities.

## Features

- **Power 6/55 Analysis**: Complete number analysis for Power 6/55 lottery
- **Power 6/45 Analysis**: Complete number analysis for Power 6/45 lottery
- **History Viewer**: Browse all historical draw results
- **Automatic Data Crawling**: Automatically fetch new results from Vietlott website
- **Real-time Updates**: Keep data files updated with latest results

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn start
```

## Data Crawling

The application includes an automatic crawler that fetches new results from the Vietlott website.

### Manual Crawling

Run the crawler once to fetch new data:
```bash
yarn crawl
```

### Continuous Crawling

Run the crawler in watch mode to automatically check for new data every minute:
```bash
yarn crawl:watch
```

### Crawler Features

- **Automatic Detection**: Detects new draws and adds them to the data file
- **Duplicate Prevention**: Prevents adding duplicate entries
- **Data Validation**: Validates lottery numbers (1-55 for Power 6/55, 1-45 for Power 6/45)
- **Multiple Formats**: Handles different date and number formats from the website
- **Error Handling**: Robust error handling for network issues and website changes

### Data Files

The crawler updates these files:
- `data/power655.jsonl` - Power 6/55 historical data
- `public/data/power655.jsonl` - Data accessible by the React app

## Analysis Features

### Individual Number Analysis
- Most frequent individual numbers
- Frequency counts for each number
- Color-coded visualization

### Combination Analysis
- **3-Number Combinations**: Most frequent 3-number combinations
- **4-Number Combinations**: Most frequent 4-number combinations  
- **5-Number Combinations**: Most frequent 5-number combinations

### Statistics Summary
- Total draws analyzed
- Most frequent numbers and combinations
- Comprehensive statistics for both lottery types

## Technology Stack

- **React 19** with JavaScript
- **Material-UI v7** for UI components
- **Puppeteer** for web scraping
- **Node.js** for data processing

## Project Structure

```
vietlott_statistics/
├── src/
│   ├── components/
│   │   ├── History.js              # Power 6/55 history viewer
│   │   ├── NumberAnalysis655.js    # Power 6/55 analysis
│   │   └── NumberAnalysis645.js    # Power 6/45 analysis
│   ├── App.js                      # Main application
│   └── index.js                    # Application entry point
├── data/
│   ├── power655.jsonl              # Power 6/55 data
│   └── power645.jsonl              # Power 6/45 data
├── public/data/                    # Data accessible by React app
├── crawler.js                      # Automatic data crawler
└── package.json                    # Dependencies and scripts
```

## Usage

1. **Start the application**: `yarn start`
2. **Navigate between tabs**:
   - Dashboard: Overview and navigation
   - History: View all Power 6/55 draws
   - 6/55 Analysis: Power 6/55 number patterns
   - 6/45 Analysis: Power 6/45 number patterns
3. **Update data**: Run `yarn crawl` to fetch new results

## Data Format

Each entry in the JSONL files contains:
```json
{
  "date": "YYYY-MM-DD",
  "id": "Draw ID",
  "result": [number1, number2, number3, number4, number5, number6],
  "page": "Page number",
  "process_time": "ISO timestamp"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the crawler and application
5. Submit a pull request

## License

This project is for educational and research purposes. Please respect the Vietlott website's terms of service when using the crawler.
