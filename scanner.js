// Scanner JavaScript for NutriDot
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'SignIn.html';
            return;
        }
        initializeScanner();
    });

    function initializeScanner() {
        const scanBtn = document.getElementById('scan-btn');
        const scanSection = document.getElementById('scan-section');
        const resultsSection = document.getElementById('results-section');
        const scanAnotherBtn = document.getElementById('scan-another-btn');
        const addToDiaryBtn = document.getElementById('add-to-diary-btn');

        // Sample nutrition data for the scanned product
        const sampleNutritionData = {
            protein: { value: 12, percentage: 80, unit: 'g' },
            sugars: { value: 8, percentage: 45, unit: 'g' },
            saturatedFat: { value: 3, percentage: 25, unit: 'g' },
            sodium: { value: 180, percentage: 15, unit: 'mg' },
            calories: { value: 150, percentage: 35, unit: 'kcal' }
        };

        scanBtn.addEventListener('click', function() {
            // Simulate scanning process
            scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
            scanBtn.disabled = true;

            setTimeout(() => {
                showResults();
            }, 2000);
        });

        scanAnotherBtn.addEventListener('click', function() {
            showScanSection();
        });

        addToDiaryBtn.addEventListener('click', function() {
            // In a real app, this would save to the user's food diary
            addToDiaryBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
            addToDiaryBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                addToDiaryBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Food Diary';
                addToDiaryBtn.style.background = '';
            }, 2000);
        });

        function showResults() {
            scanSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Update nutrition values and colors
            updateNutritionBars();
        }

        function showScanSection() {
            resultsSection.style.display = 'none';
            scanSection.style.display = 'block';
            
            // Reset scan button
            scanBtn.innerHTML = '<i class="fas fa-qrcode"></i> Start Scanning';
            scanBtn.disabled = false;
        }

        function updateNutritionBars() {
            Object.keys(sampleNutritionData).forEach(nutrient => {
                const data = sampleNutritionData[nutrient];
                
                // Update value
                const valueElement = document.getElementById(`${nutrient === 'saturatedFat' ? 'saturated-fat' : nutrient}-value`);
                if (valueElement) {
                    valueElement.textContent = `${data.value}${data.unit}`;
                }
                
                // Update percentage
                const percentageElement = document.getElementById(`${nutrient === 'saturatedFat' ? 'saturated-fat' : nutrient}-percentage`);
                if (percentageElement) {
                    percentageElement.textContent = `${data.percentage}%`;
                }
                
                // Update bar width and color
                const barElement = document.getElementById(`${nutrient === 'saturatedFat' ? 'saturated-fat' : nutrient}-bar`);
                if (barElement) {
                    // Animate bar width
                    setTimeout(() => {
                        barElement.style.width = `${data.percentage}%`;
                    }, 300);
                    
                    // Apply color based on health logic
                    const colorClass = getColorClass(nutrient, data.percentage);
                    barElement.className = `bar-fill ${nutrient === 'saturatedFat' ? 'saturated-fat' : nutrient}-bar ${colorClass}`;
                }
            });
        }

        function getColorClass(nutrient, percentage) {
            // Protein uses reverse logic (high = good)
            if (nutrient === 'protein') {
                if (percentage >= 80) return 'green-bar';
                if (percentage >= 60) return 'yellow-bar';
                return 'red-bar';
            } else {
                // Other nutrients: low = good, high = bad
                if (percentage <= 30) return 'green-bar';
                if (percentage <= 60) return 'yellow-bar';
                return 'red-bar';
            }
        }

        setupLogout();
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

// Add additional color classes to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .green-bar {
        background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%) !important;
    }
    .yellow-bar {
        background: linear-gradient(90deg, #FF9800 0%, #f57c00 100%) !important;
    }
    .red-bar {
        background: linear-gradient(90deg, #f44336 0%, #d32f2f 100%) !important;
    }
`;
document.head.appendChild(style);