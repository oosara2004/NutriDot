// Settings JavaScript for NutriDot
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'SignIn.html';
            return;
        }
        initializeSettings();
    });

    function initializeSettings() {
        loadUserSettings();
        setupEventListeners();
        setupLogout();
    }

    function loadUserSettings() {
        // Load settings from localStorage or Firebase
        const savedSettings = JSON.parse(localStorage.getItem('nutridot-settings')) || {};
        
        // Apply saved settings to form elements
        if (savedSettings.dailyCalories) {
            document.getElementById('daily-calories').value = savedSettings.dailyCalories;
        }
        if (savedSettings.proteinGoal) {
            document.getElementById('protein-goal').value = savedSettings.proteinGoal;
        }
        if (savedSettings.carbsGoal) {
            document.getElementById('carbs-goal').value = savedSettings.carbsGoal;
        }
        if (savedSettings.fatGoal) {
            document.getElementById('fat-goal').value = savedSettings.fatGoal;
        }
        
        // Apply toggle settings
        if (savedSettings.mealReminders !== undefined) {
            document.getElementById('meal-reminders').checked = savedSettings.mealReminders;
        }
        if (savedSettings.goalAchievements !== undefined) {
            document.getElementById('goal-achievements').checked = savedSettings.goalAchievements;
        }
        if (savedSettings.weeklyReports !== undefined) {
            document.getElementById('weekly-reports').checked = savedSettings.weeklyReports;
        }
        if (savedSettings.dataSharing !== undefined) {
            document.getElementById('data-sharing').checked = savedSettings.dataSharing;
        }
        if (savedSettings.twoFactor !== undefined) {
            document.getElementById('two-factor').checked = savedSettings.twoFactor;
        }
        
        // Apply select settings
        if (savedSettings.theme) {
            document.getElementById('theme-select').value = savedSettings.theme;
        }
        if (savedSettings.units) {
            document.getElementById('units-select').value = savedSettings.units;
        }
        if (savedSettings.language) {
            document.getElementById('language-select').value = savedSettings.language;
        }
    }

    function setupEventListeners() {
        // Save settings button
        document.getElementById('save-settings').addEventListener('click', saveSettings);
        
        // Data management buttons
        document.querySelector('.export-btn').addEventListener('click', exportData);
        document.querySelector('.backup-btn').addEventListener('click', backupData);
        document.querySelector('.danger-btn').addEventListener('click', deleteAllData);
        
        // Real-time validation for number inputs
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('input', validateNumberInput);
        });
        
        // Theme change handler
        document.getElementById('theme-select').addEventListener('change', applyTheme);
    }

    function saveSettings() {
        const settings = {
            // Nutrition goals
            dailyCalories: document.getElementById('daily-calories').value,
            proteinGoal: document.getElementById('protein-goal').value,
            carbsGoal: document.getElementById('carbs-goal').value,
            fatGoal: document.getElementById('fat-goal').value,
            
            // Notifications
            mealReminders: document.getElementById('meal-reminders').checked,
            goalAchievements: document.getElementById('goal-achievements').checked,
            weeklyReports: document.getElementById('weekly-reports').checked,
            
            // Privacy & Security
            dataSharing: document.getElementById('data-sharing').checked,
            twoFactor: document.getElementById('two-factor').checked,
            
            // App preferences
            theme: document.getElementById('theme-select').value,
            units: document.getElementById('units-select').value,
            language: document.getElementById('language-select').value,
            
            // Timestamp
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('nutridot-settings', JSON.stringify(settings));
        
        // In a real app, also save to Firebase
        const user = firebase.auth().currentUser;
        if (user) {
            // Save to Firestore (commented out for demo)
            // firebase.firestore().collection('users').doc(user.uid).update({
            //     settings: settings
            // });
        }

        // Show success message
        const saveBtn = document.getElementById('save-settings');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Settings Saved!';
        saveBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }

    function validateNumberInput(event) {
        const input = event.target;
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }

    function applyTheme() {
        const theme = document.getElementById('theme-select').value;
        
        // Apply theme immediately
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // In a real app, you would implement full dark mode styles
        console.log('Theme changed to:', theme);
    }

    function exportData() {
        // Simulate data export
        const userData = {
            settings: JSON.parse(localStorage.getItem('nutridot-settings') || '{}'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'nutridot-data-export.json';
        link.click();
        
        // Show success message
        const btn = document.querySelector('.export-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Data Exported!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }

    function backupData() {
        // Simulate cloud backup
        const btn = document.querySelector('.backup-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Backing up...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Backup Complete!';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }, 3000);
    }

    function deleteAllData() {
        const confirmed = confirm(
            'Are you sure you want to delete all your data? This action cannot be undone.\n\n' +
            'This will remove:\n' +
            '• All nutrition logs\n' +
            '• Personal settings\n' +
            '• Account preferences\n' +
            '• Saved goals and targets'
        );
        
        if (confirmed) {
            const doubleConfirm = confirm('This is your final warning. Are you absolutely sure?');
            
            if (doubleConfirm) {
                // Clear localStorage
                localStorage.removeItem('nutridot-settings');
                
                // In a real app, also delete from Firebase
                // const user = firebase.auth().currentUser;
                // if (user) {
                //     firebase.firestore().collection('users').doc(user.uid).delete();
                // }
                
                alert('All data has been deleted. You will be redirected to the sign-in page.');
                
                // Sign out and redirect
                firebase.auth().signOut().then(() => {
                    window.location.href = 'SignIn.html';
                });
            }
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