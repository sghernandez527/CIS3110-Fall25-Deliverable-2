function fetchAndParse(filePath) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: function(results) {
                if (results.data && results.data.length > 0) {
                    // Logs a success message and the first few rows of data
                    console.log(`SUCCESS: Papa Parse loaded ${filePath}. First 5 rows:`, results.data.slice(0, 5));
                    resolve(results.data.filter(d => Object.values(d).some(x => x !== null)));
                } else {
                    console.error(`ERROR: Data not found or empty in ${filePath}.`);
                    reject(`Error: Data not found or empty in ${filePath}`);
                }
            },
            error: function(error) {
                console.error(`ERROR: Failed to parse CSV file ${filePath}:`, error);
                reject(`Error parsing CSV file ${filePath}: ${error}`);
            }
        });
    });
}

async function runDiagnostic() {
    console.log("--- Starting Data Diagnostic Test ---");
    try {
        const data = await fetchAndParse('daily_sales_revenue.csv');
        
        if (data && data.length > 0) {
            console.log("Diagnostic complete. Data is ready for charting. Total rows loaded:", data.length);
        } else {
            console.error("Data loaded but appears empty after cleaning.");
        }
    } catch (error) {
        console.error("Diagnostic Failed. File loading failed. Check file name, casing, and server status.");
    }
}

runDiagnostic();