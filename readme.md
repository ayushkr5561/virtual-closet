✅ Core Web Pages & Features
🔵 1. Splash Screen
Display a short animated logo splash screen when the user visits the site.
Transition to the login/signup page after 2 seconds.

🔐 2. Login / Signup Page
Aesthetic, modern design with:
✨ Signup: name, email, password
🔑 Login: email, password
Store user credentials in localStorage or IndexedDB
No server authentication — all data remains on the user's device.

🏠 3. Home Page – Outfit Recommendations
🔼 Top Section:
🌦️ Weather widget (use OpenWeatherMap API)
Two function buttons:
🗓️ Day of Week selector (Mon–Sun)
☀️ Time of Day selector (Morning, Afternoon, Night)
👕 Horizontally scrollable top clothing items filtered by:
Weather
Day/time
👖 Horizontally scrollable bottom clothing items
❤️ Option to mark items as Favorites
📷 4. Add Clothing Item

Upload a clothing photo from file
Choose:
Top / Bottom
✅ Weather Suitability: Summer / In-between / Winter
🎯 Style Tags: Casual, Formal, Work, Sports, Nightout, Lounge, Rainy
🎨 Pick color from swatches
🏷️ Add optional tags: Brand, Notes
💾 Save item locally in IndexedDB or localStorage
🎨 5. Closet Page

Grid or card layout showing all saved items and outfits
Option to:
Edit/Delete items
Create new outfit combinations by pairing tops and bottoms
Save outfits with names/tags

⭐ 6. Favorites Page
View all favorited clothing items

👤 7. Profile Page
Store & edit basic info (e.g., name, gender)
Settings for dark mode, reset data, etc.

📦 Data Handling
Use localStorage or IndexedDB for:
User data (email, name, preferences)
Uploaded images (as base64 or blob URLs)
Tags, clothing items, outfits
Optional: allow users to export/import their closet data as JSON

🌦️ Weather Integration
Use OpenWeatherMap API
Detect user location or allow manual location input
Display animated weather card (sun, clouds, rain)
Suggest outfits based on:
Current weather
Time of day
Clothing weather tags

🖌️ UI/UX Design Goals
Clean, minimal aesthetic
Rounded cards with shadows
Bright tag colors & animated weather icons
Responsive layout (mobile, tablet, desktop)
Smooth page transitions

🔧 Tech Stack Suggestions (optional)
Framework: React.js or Next.js
Storage: localStorage / IndexedDB
Styling: Tailwind CSS or Styled Components
Animations: Framer Motion
Weather API: OpenWeatherMap