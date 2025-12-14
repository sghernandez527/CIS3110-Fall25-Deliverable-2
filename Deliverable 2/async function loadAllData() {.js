async function loadAllData() {
    const [salesData, trackData, customerData, genreData, inventoryData] = await Promise.all([
        fetchAndParse('daily_sales.csv'),
        fetchAndParse('track_purchase_counts.csv'),
        
    ]);

   
    renderSalesChart(salesData);
}

async function fetchAndParse(filePath) {
}