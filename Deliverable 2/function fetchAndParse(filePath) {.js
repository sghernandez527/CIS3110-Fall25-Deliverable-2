function fetchAndParse(filePath) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: function(results) {
                if (results.data && results.data.length > 0) {
                    const cleanedData = results.data.filter(d => 
                        Object.values(d).some(x => x !== null)
                    );
                    if (cleanedData.length === 0) {
                        reject(`Error: File ${filePath} loaded but contained only empty rows.`);
                    } else {
                        resolve(cleanedData);
                    }
                } else {
                    reject(`Error: Data not found or empty in ${filePath}.`);
                }
            },
            error: function(error) {
                reject(`Error parsing CSV file ${filePath}: ${error}`);
            }
        });
    });
}

async function loadAllData() {
    try {
        const [rawSales, rawTracks, rawCustomers, rawGenre, rawInventory] = await Promise.all([
            fetchAndParse('daily_sales_revenue.csv'),
            fetchAndParse('track_purchase_counts.csv'),
            fetchAndParse('customer_demographics.csv'),
            fetchAndParse('genre_playback_time.csv'),
            fetchAndParse('inventory_stock_levels.csv'),
        ]);

        const salesData = rawSales.map(d => ({ 
            Date: d.Date, 
            Revenue_USD: parseFloat(d.Revenue_USD) 
        }));
        
        const trackData = rawTracks.map(d => ({ 
            Track_ID: d.Track_ID,
            Purchase_Count: parseInt(d.Purchase_Count) 
        }));
        
        const customerData = rawCustomers.map(d => ({ 
            Age_Group: d.Age_Group, 
            Total_Purchases: parseInt(d.Total_Purchases) 
        }));
        
        const genreData = rawGenre.map(d => ({ 
            Genre: d.Genre, 
            Total_Minutes_Played: parseInt(d.Total_Minutes_Played) 
        }));
        
        const inventoryData = rawInventory.map(d => ({ 
            Product_Category: d.Product_Category, 
            Current_Stock: parseInt(d.Current_Stock) 
        }));

        renderSalesChart(salesData);
        renderGenreChart(genreData);
        renderTrackChart(trackData);
        renderInventoryChart(inventoryData);
        renderDemographicsChart(customerData);

    } catch (error) {
        // --- CRITICAL ERROR LOGGING ---
        console.error("CRITICAL DASHBOARD FAILURE:", error);
        document.querySelector('.container-fluid').innerHTML = 
            `<div class="alert alert-danger" role="alert">CRITICAL ERROR: Failed to load data. Check console (F12) for the specific failing file: <b>${error}</b></div>`;
    }
}

function renderSalesChart(data) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.Date),
            datasets: [{
                label: 'Daily Revenue (USD)',
                data: data.map(d => d.Revenue_USD),
                borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.1)', tension: 0.3, pointRadius: 0
            }]
        },
        options: {responsive: true, maintainAspectRatio: false, scales: {x: { type: 'category' }, y: { beginAtZero: true }}}
    });
}

function renderGenreChart(data) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    const colors = ['#dc3545', '#fd7e14', '#20c997', '#6f42c1', '#17a2b8'];
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => d.Genre),
            datasets: [{
                label: 'Total Minutes Played',
                data: data.map(d => d.Total_Minutes_Played),
                backgroundColor: colors, hoverOffset: 4
            }]
        },
        options: {responsive: true, maintainAspectRatio: false, plugins: {legend: { position: 'right' }}}
    });
}

function renderTrackChart(data) {
    const ctx = document.getElementById('trackChart').getContext('2d');
    const topData = data.sort((a, b) => b.Purchase_Count - a.Purchase_Count).slice(0, 10);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topData.map(d => `Track ${d.Track_ID}`),
            datasets: [{
                label: 'Purchase Count',
                data: topData.map(d => d.Purchase_Count),
                backgroundColor: 'rgba(40, 167, 69, 0.7)',
            }]
        },
        options: {indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true } } }
    });
}

function renderInventoryChart(data) {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    const colors = ['#0d6efd', '#6c757d', '#198754', '#ffc107', '#dc3545'];
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: data.map(d => d.Product_Category),
            datasets: [{
                label: 'Current Stock Units',
                data: data.map(d => d.Current_Stock),
                backgroundColor: colors.map(c => c + 'B0'), borderColor: colors, borderWidth: 1
            }]
        },
        options: {responsive: true, maintainAspectRatio: false, scales: { r: { pointLabels: { display: true, centerPointLabels: true } } }, plugins: { legend: { position: 'bottom' } } }
    });
}

function renderDemographicsChart(data) {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    const ageOrder = { '18-25': 1, '26-35': 2, '36-45': 3, '46-60': 4, '60+': 5 };
    const ageLabels = Object.keys(ageOrder);
    const scatterData = data.map(d => ({x: ageOrder[d.Age_Group], y: d.Total_Purchases}));
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Purchases per Age Group Bin',
                data: scatterData,
                backgroundColor: 'rgba(99, 102, 241, 0.8)', borderColor: 'rgb(99, 102, 241)', pointRadius: 8
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: {type: 'linear', position: 'bottom', ticks: {callback: function(value) { return ageLabels[value - 1]; }}, title: { display: true, text: 'Age Group' }},
                y: { beginAtZero: true, title: { display: true, text: 'Total Purchases' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

loadAllData();