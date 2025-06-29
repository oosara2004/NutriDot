from flask import Flask, request, jsonify
from flask_cors import CORS  
import re
import time

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "NutriDot ChatBot API - Ready to help with nutrition questions!"

@app.route('/chatbot', methods=['POST', 'OPTIONS'])
def chatbot():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        user_input = request.json.get('message', '').lower().strip()
        
        if not user_input:
            return jsonify({'response': "I didn't receive your message. Could you please try again?"})

        # Enhanced keyword matching with better responses
        response = generate_response(user_input)
        
        # Simulate processing time for better UX
        time.sleep(0.5)
        
        return jsonify({'response': response})
        
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'response': "I'm experiencing some technical difficulties. Please try again in a moment."})

def generate_response(user_input):
    """Generate contextual responses based on user input"""
    
    # Nutrition-related keywords
    nutrition_keywords = [
        'nutrition', 'calories', 'ingredients', 'diet', 'food label', 'protein', 
        'carbs', 'carbohydrates', 'fat', 'sugar', 'sodium', 'vitamins', 'minerals',
        'healthy eating', 'meal planning', 'weight loss', 'weight gain', 'fitness'
    ]
    
    # Scanning-related keywords
    scan_keywords = [
        'scan', 'scanning', 'barcode', 'read', 'product', 'camera', 'qr code',
        'not working', 'error', 'failed', 'trouble', 'issue', 'problem'
    ]
    
    # Account-related keywords
    account_keywords = [
        'sign up', 'signup', 'register', 'create account', 'sign in', 'signin', 
        'log in', 'login', 'access account', 'password', 'forgot password',
        'reset password', 'profile', 'settings', 'account'
    ]
    
    # App features keywords
    features_keywords = [
        'features', 'dashboard', 'charts', 'goals', 'tracking', 'history',
        'reports', 'statistics', 'progress', 'how to use', 'tutorial'
    ]
    
    # Greeting keywords
    greeting_keywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
    
    # Check for greetings first
    if any(keyword in user_input for keyword in greeting_keywords):
        return ("Hello! 👋 Welcome to NutriDot! I'm here to help you with:\n\n"
                "🥗 Nutrition advice and meal planning\n"
                "📱 App features and how to use them\n"
                "📷 Scanning products and reading labels\n"
                "👤 Account and profile management\n\n"
                "What would you like to know about?")
    
    # Nutrition advice
    if any(keyword in user_input for keyword in nutrition_keywords):
        if 'protein' in user_input:
            return ("🥩 Protein is essential for muscle building and repair! Here are some tips:\n\n"
                    "• Aim for 0.8-1g per kg of body weight daily\n"
                    "• Include lean meats, fish, eggs, beans, and nuts\n"
                    "• Spread protein intake throughout the day\n"
                    "• Use NutriDot's scanner to check protein content in products!\n\n"
                    "Need help tracking your protein intake?")
        
        elif 'calories' in user_input:
            return ("🔥 Managing calories effectively:\n\n"
                    "• Create a moderate deficit for weight loss (300-500 calories)\n"
                    "• Focus on nutrient-dense, whole foods\n"
                    "• Track your intake with NutriDot's dashboard\n"
                    "• Remember: quality matters as much as quantity!\n\n"
                    "Would you like help setting up your calorie goals?")
        
        elif any(word in user_input for word in ['sugar', 'carbs', 'carbohydrates']):
            return ("🍯 Smart carbohydrate choices:\n\n"
                    "• Choose complex carbs (whole grains, vegetables)\n"
                    "• Limit added sugars to less than 10% of daily calories\n"
                    "• Time carbs around workouts for energy\n"
                    "• Use our scanner to identify hidden sugars!\n\n"
                    "Need help reading nutrition labels?")
        
        else:
            return ("🥗 I'd love to help with your nutrition questions! Here's what I can assist with:\n\n"
                    "• Meal planning and balanced nutrition\n"
                    "• Understanding macronutrients (protein, carbs, fats)\n"
                    "• Reading and interpreting food labels\n"
                    "• Setting realistic health goals\n"
                    "• Tracking your daily intake\n\n"
                    "What specific nutrition topic interests you most?")
    
    # Scanning help
    elif any(keyword in user_input for keyword in scan_keywords):
        return ("📷 Having trouble with scanning? Let me help you out:\n\n"
                "**Common Solutions:**\n"
                "• Ensure good lighting when scanning\n"
                "• Hold your phone steady and center the barcode\n"
                "• Clean your camera lens\n"
                "• Try scanning from different angles\n"
                "• Make sure the barcode isn't damaged or wrinkled\n\n"
                "**Still not working?**\n"
                "• Restart the app and try again\n"
                "• Check your internet connection\n"
                "• Update to the latest app version\n\n"
                "If problems persist, please contact our support team!")
    
    # Account help
    elif any(keyword in user_input for keyword in account_keywords):
        if any(word in user_input for word in ['password', 'forgot', 'reset']):
            return ("🔐 Password reset help:\n\n"
                    "1. Go to the Sign In page\n"
                    "2. Click 'Forgot Password?'\n"
                    "3. Enter your email address\n"
                    "4. Check your email for reset instructions\n"
                    "5. Follow the link to create a new password\n\n"
                    "**Tips for a strong password:**\n"
                    "• Use at least 8 characters\n"
                    "• Include numbers and special characters\n"
                    "• Avoid common words or personal info\n\n"
                    "Still having trouble? Contact our support team!")
        
        elif any(word in user_input for word in ['sign up', 'signup', 'register', 'create']):
            return ("📝 Creating your NutriDot account:\n\n"
                    "1. Click 'Sign Up' on the main page\n"
                    "2. Fill in your personal information\n"
                    "3. Set your health and nutrition goals\n"
                    "4. Choose your dietary preferences\n"
                    "5. Create a secure password\n"
                    "6. Verify your email address\n\n"
                    "**Why create an account?**\n"
                    "• Track your nutrition progress\n"
                    "• Save your favorite foods\n"
                    "• Get personalized recommendations\n"
                    "• Access your data across devices\n\n"
                    "Ready to start your healthy journey?")
        
        else:
            return ("👤 Account management help:\n\n"
                    "**I can help you with:**\n"
                    "• Creating a new account\n"
                    "• Signing in to your existing account\n"
                    "• Resetting your password\n"
                    "• Updating your profile information\n"
                    "• Managing your privacy settings\n"
                    "• Understanding your nutrition data\n\n"
                    "What specific account issue can I help you resolve?")
    
    # App features
    elif any(keyword in user_input for keyword in features_keywords):
        return ("🚀 NutriDot Features Overview:\n\n"
                "**📊 Dashboard:** View your nutrition stats with colorful charts\n"
                "**📷 Scanner:** Instantly scan product barcodes for nutrition info\n"
                "**👤 Account:** Manage your profile and family members\n"
                "**⚙️ Settings:** Customize your goals and preferences\n"
                "**🤖 Chat Bot:** Get help anytime (that's me!)\n\n"
                "**Pro Tips:**\n"
                "• Use daily/weekly/monthly filters on your dashboard\n"
                "• Set realistic nutrition goals in settings\n"
                "• Scan products before eating to track intake\n\n"
                "Which feature would you like to learn more about?")
    
    # Help with specific issues
    elif any(word in user_input for word in ['help', 'support', 'problem', 'issue', 'trouble']):
        return ("🆘 I'm here to help! Here are the most common topics I assist with:\n\n"
                "**🥗 Nutrition & Diet**\n"
                "• Meal planning and healthy eating tips\n"
                "• Understanding macronutrients\n"
                "• Reading nutrition labels\n\n"
                "**📱 App Support**\n"
                "• How to use scanning features\n"
                "• Navigating the dashboard\n"
                "• Account and profile management\n\n"
                "**📞 Additional Support**\n"
                "• Contact our support team for technical issues\n"
                "• Check our FAQ section\n"
                "• Visit our help center\n\n"
                "What specific area do you need help with?")
    
    # Thank you responses
    elif any(word in user_input for word in ['thank', 'thanks', 'appreciate']):
        return ("You're very welcome! 😊 I'm always happy to help with your nutrition and health journey.\n\n"
                "Remember, I'm here 24/7 to assist with:\n"
                "• Nutrition questions and advice\n"
                "• App features and troubleshooting\n"
                "• Account support\n\n"
                "Feel free to ask me anything else!")
    
    # Default response for unrecognized input
    else:
        return ("🤔 I want to make sure I give you the most helpful response! Could you tell me more about what you're looking for?\n\n"
                "I'm great at helping with:\n"
                "• **Nutrition advice** - meal planning, macronutrients, healthy eating\n"
                "• **App features** - dashboard, scanner, settings\n"
                "• **Technical support** - scanning issues, account problems\n"
                "• **General questions** - how to use NutriDot effectively\n\n"
                "Try asking something like:\n"
                "• 'How do I scan a product?'\n"
                "• 'What's a healthy amount of protein?'\n"
                "• 'How do I reset my password?'\n"
                "• 'Show me app features'")

if __name__ == '__main__':
    print("🤖 NutriDot ChatBot starting up...")
    print("📡 Server will be available at http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)