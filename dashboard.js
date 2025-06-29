// Dashboard JavaScript for NutriDot
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'SignIn.html';
            return;
        }
        initializeDashboard();
    });

    // Sample nutrition data - in a real app, this would come from your database
    const nutritionData = {
        daily: {
            calories: { value: 1850, max: 2000, data: [1650, 1750, 1850, 1900, 1800, 1850, 1950] },
            protein: { value: 65, max: 60, data: [55, 60, 65, 70, 62, 65, 68] },
            sugars: { value: 45, max: 50, data: [40, 45, 50, 42, 48, 45, 47] },
            saturatedFat: { value: 18, max: 20, data: [15, 18, 20, 16, 19, 18, 17] },
            sodium: { value: 1200, max: 2300, data: [1100, 1200, 1300, 1150, 1250, 1200, 1180] },
            carbs: { value: 220, max: 300, data: [200, 220, 240, 210, 230, 220, 225] }
        },
        weekly: {
            calories: { value: 12950, max: 14000, data: [12000, 12500, 12950, 13200, 12800] },
            protein: { value: 455, max: 420, data: [400, 430, 455, 470, 445] },
            sugars: { value: 315, max: 350, data: [300, 320, 315, 330, 310] },
            saturatedFat: { value: 126, max: 140, data: [120, 125, 126, 130, 128] },
            sodium: { value: 8400, max: 16100, data: [8000, 8200, 8400, 8600, 8300] },
            carbs: { value: 1540, max: 2100, data: [1500, 1520, 1540, 1580, 1560] }
        },
        monthly: {
            calories: { value: 55650, max: 60000, data: [52000, 54000, 55650, 57000, 56000] },
            protein: { value: 1950, max: 1800, data: [1800, 1900, 1950, 2000, 1920] },
            sugars: { value: 1350, max: 1500, data: [1300, 1320, 1350, 1380, 1340] },
            saturatedFat: { value: 540, max: 600, data: [520, 535, 540, 560, 545] },
            sodium: { value: 36000, max: 69000, data: [35000, 35500, 36000, 36800, 36200] },
            carbs: { value: 6600, max: 9000, data: [6400, 6500, 6600, 6800, 6650] }
        }
    };

    let currentPeriod = 'daily';
    let charts = {};

    function initializeDashboard() {
        setupFilterButtons();
        createCharts();
        updateChartStatuses();
        setupLogout();
    }

    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                currentPeriod = this.dataset.period;
                updateCharts();
                updateChartStatuses();
            });
        });
    }

    function createCharts() {
        const chartConfigs = [
            { id: 'caloriesChart', nutrient: 'calories', color: '#FF6384' },
            { id: 'proteinChart', nutrient: 'protein', color: '#36A2EB' },
            { id: 'sugarsChart', nutrient: 'sugars', color: '#FFCE56' },
            { id: 'saturatedFatChart', nutrient: 'saturatedFat', color: '#FF9F40' },
            { id: 'sodiumChart', nutrient: 'sodium', color: '#9966FF' },
            { id: 'carbsChart', nutrient: 'carbs', color: '#4BC0C0' }
        ];

        chartConfigs.forEach(config => {
            const ctx = document.getElementById(config.id).getContext('2d');
            charts[config.nutrient] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: getDaysLabels(),
                    datasets: [{
                        label: config.nutrient.charAt(0).toUpperCase() + config.nutrient.slice(1),
                        data: nutritionData[currentPeriod][config.nutrient].data,
                        borderColor: config.color,
                        backgroundColor: config.color + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: config.color,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: config.color,
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    const max = nutritionData[currentPeriod][config.nutrient].max;
                                    const percentage = ((value / max) * 100).toFixed(1);
                                    return `${value} (${percentage}% of target)`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            },
                            ticks: {
                                color: '#666'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#666'
                            }
                        }
                    }
                }
            });
        });
    }

    function updateCharts() {
        Object.keys(charts).forEach(nutrient => {
            const chart = charts[nutrient];
            chart.data.labels = getDaysLabels();
            chart.data.datasets[0].data = nutritionData[currentPeriod][nutrient].data;
            chart.update();
        });

        // Update values
        Object.keys(nutritionData[currentPeriod]).forEach(nutrient => {
            const valueElement = document.getElementById(`${nutrient === 'saturatedFat' ? 'saturated-fat' : nutrient === 'carbs' ? 'carbs' : nutrient}-value`);
            if (valueElement) {
                const data = nutritionData[currentPeriod][nutrient];
                let unit = '';
                switch(nutrient) {
                    case 'calories': unit = ' kcal'; break;
                    case 'protein': case 'sugars': case 'saturatedFat': case 'carbs': unit = 'g'; break;
                    case 'sodium': unit = 'mg'; break;
                }
                valueElement.textContent = data.value + unit;
            }
        });
    }

    function updateChartStatuses() {
        const statusUpdates = {
            calories: getStatusInfo('calories', nutritionData[currentPeriod].calories),
            protein: getStatusInfo('protein', nutritionData[currentPeriod].protein, true), // Protein uses reverse logic
            sugars: getStatusInfo('sugars', nutritionData[currentPeriod].sugars),
            saturatedFat: getStatusInfo('saturatedFat', nutritionData[currentPeriod].saturatedFat),
            sodium: getStatusInfo('sodium', nutritionData[currentPeriod].sodium),
            carbs: getStatusInfo('carbs', nutritionData[currentPeriod].carbs)
        };

        Object.keys(statusUpdates).forEach(nutrient => {
            const statusElement = document.getElementById(`${nutrient === 'saturatedFat' ? 'saturated-fat' : nutrient}-status`);
            if (statusElement) {
                const status = statusUpdates[nutrient];
                statusElement.textContent = status.message;
                statusElement.className = `chart-status ${status.color}`;
            }
        });
    }

    function getStatusInfo(nutrient, data, reverseLogic = false) {
        const percentage = (data.value / data.max) * 100;
        
        if (reverseLogic) {
            // For protein: high = good, low = bad
            if (percentage >= 90) return { color: 'green', message: 'Excellent protein intake!' };
            if (percentage >= 70) return { color: 'yellow', message: 'Good protein level' };
            return { color: 'red', message: 'Low protein - increase intake' };
        } else {
            // For others: low = good, high = bad
            if (percentage <= 60) return { color: 'green', message: 'Within healthy range' };
            if (percentage <= 85) return { color: 'yellow', message: 'Moderate - watch intake' };
            return { color: 'red', message: 'High - reduce intake' };
        }
    }

    function getDaysLabels() {
        switch(currentPeriod) {
            case 'daily':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'weekly':
                return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
            case 'monthly':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
            default:
                return [];
        }
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                firebase.auth().signOut().then(() => {
                    window.location.href = 'SignIn.html';
                }).catch(error => {
                    console.error('Logout error:', error);
                });
            });
        }
    }
});