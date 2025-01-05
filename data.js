let currentMetric = 'Proving time';
let chartInstance = null; 
let currView = 'table';


function toggleView(view) {
    const tableButton = document.getElementById('tableButton');
    const chartButton = document.getElementById('chartButton');
    const chartCanvas = document.getElementById('myChart');
    const resultsContainer = document.getElementById('benchmark-results');

    if (view === 'table') {
        chartCanvas.style.display = 'none';
        resultsContainer.style.display = 'block';
        tableButton.classList.add('active');
        chartButton.classList.remove('active');
        currView = 'table';
    } else if (view === 'chart') {
        chartCanvas.style.display = 'block';
        resultsContainer.style.display = 'none';
        chartButton.classList.add('active');
        tableButton.classList.remove('active');
        currView = 'chart';
    }
}

function updateChart(metric) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const metricKey = metric.toLowerCase().replace(/ /g, '_');
    const metricData = benchmarkData[metricKey];

    const labels = [];
    const risc0Data = [];
    const sp1Data = [];

    Object.entries(metricData).forEach(([category, categoryData]) => {
        Object.entries(categoryData).forEach(([test, results]) => {
            labels.push(`${category} - ${test}`);
            risc0Data.push(parseFloat(results.risc0.replace(/[^0-9.]/g, '')));
            sp1Data.push(parseFloat(results.sp1.replace(/[^0-9.]/g, '')));
        });
    });

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'RISC0',
                    data: risc0Data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'SP1',
                    data: sp1Data,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    // TODO: if we dont do this the chart disappears
    if (currView === 'chart') {
        toggleView('chart');
    }
}


fetch('data.json')
    .then(response => response.json())
    .then(data => {
        benchmarkData = data;
        showMetric('Proving time');
    })
    .catch(error => console.error('Error fetching data:', error));
