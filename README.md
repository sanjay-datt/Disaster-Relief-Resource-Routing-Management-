🚨 Disaster Relief Resource Routing Platform

Full-Stack Web Application: Express.js + MongoDB + Vanilla JavaScript

A data-driven disaster relief resource allocation and route optimization system that helps NGOs and authorities prioritize affected locations, allocate limited resources efficiently, and compute optimal delivery routes during emergencies.

Show Images

📋 Table of Contents

Features
Tech Stack
System Architecture
Installation
Usage
API Documentation
Algorithms
Deployment
Contributing


✨ Features
Core Functionality

🎯 Priority Scoring Engine: Automatically ranks affected areas using weighted algorithm
📦 Resource Management: Track relief center inventories and affected area needs
🗺️ Route Optimization: Dijkstra's algorithm for shortest path computation
🛣️ Road Network Modeling: Graph-based representation with blocked road handling
📊 Real-time Dashboard: Live statistics and priority rankings
💾 Data Persistence: MongoDB database for permanent storage
🔄 RESTful API: Complete backend API for all operations

Technical Features

✅ Full CRUD operations for all entities
✅ Input validation and error handling
✅ Responsive web interface
✅ Real-time API health monitoring
✅ Sample data seeder for quick setup
✅ Delete functionality with confirmation


🛠️ Tech Stack
Backend

Runtime: Node.js (v16+)
Framework: Express.js 4.18+
Database: MongoDB 6.0+
ODM: Mongoose 8.0+
Middleware: CORS, dotenv

Frontend

Structure: HTML5
Styling: CSS3 (Custom design)
Logic: Vanilla JavaScript (ES6+)
API Calls: Fetch API

Development

Nodemon: Auto-restart server on changes
Environment Variables: dotenv configuration


🏗️ System Architecture
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│              HTML + CSS + JavaScript                         │
└────────────────┬─────────────────────────────────────────────┘
                 │ HTTP Requests (Fetch API)
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS SERVER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/centers, /api/areas, etc.)        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • Priority Scoring Algorithm                        │   │
│  │  • Dijkstra's Shortest Path Algorithm               │   │
│  │  • CRUD Operations                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────────┘
                 │ Mongoose ODM
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB DATABASE                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Centers   │  │    Areas    │  │    Roads    │         │
│  │ Collection  │  │ Collection  │  │ Collection  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘

📦 Installation
Prerequisites

Node.js (v16 or higher)

bash   node --version  # Check if installed
Download from: https://nodejs.org/

MongoDB (Choose one):

Local: https://www.mongodb.com/try/download/community
Atlas (Cloud): https://www.mongodb.com/cloud/atlas (Free tier available)


Git (Optional)

bash   git --version
Step-by-Step Setup
1. Clone or Download Project
bash# Create project directory
mkdir disaster-relief-platform
cd disaster-relief-platform
2. Create Project Structure
bash# Create directories
mkdir backend frontend
mkdir backend/models backend/routes
3. Setup Backend
bashcd backend

# Initialize npm
npm init -y

# Install dependencies
npm install express mongoose cors dotenv

# Install dev dependencies
npm install --save-dev nodemon
4. Create Backend Files
Copy the following files from the artifacts:
File Structure:
backend/
├── models/
│   ├── Center.js      # Copy from "MongoDB Models" artifact
│   ├── Area.js
│   └── Road.js
├── routes/
│   ├── centers.js     # Copy from "API Routes" artifact
│   ├── areas.js
│   ├── roads.js
│   └── analytics.js
├── server.js          # Copy from "Backend Server" artifact
├── seed.js            # Copy from "Seed Data" artifact
└── package.json       # Copy from "package.json" artifact
5. Configure Environment
Create .env file in root directory:
bash# .env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/disaster-relief
For MongoDB Atlas (Cloud):
bashMONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/disaster-relief
6. Setup Frontend
bashcd ../frontend
# Copy index.html from "Frontend - index.html (API Connected)" artifact
7. Load Sample Data
bashcd ../backend
npm run seed
Expected output:
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Inserted 2 relief centers
✅ Inserted 5 affected areas
✅ Inserted 9 road connections

🎉 Database seeded successfully!
8. Start the Server
bash# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
Server will run on: http://localhost:5000

🚀 Usage
1. Access the Application
Open your browser and navigate to:
http://localhost:5000
2. Initial Setup
The sample data is already loaded. You should see:

2 Relief Centers (Haldwani, Nainital)
5 Affected Areas (various villages)
9 Road Connections

3. Basic Workflow
Step 1: View Dashboard

See overview statistics
Check priority rankings

Step 2: Compute Priorities

Click "🔄 Compute Priorities" button
Areas will be ranked by urgency score
Highest priority appears at top

Step 3: Plan Route

Go to "🚛 Route Planning" tab
Select a relief center (e.g., Haldwani Central Hub)
Select affected area (e.g., Rampur Village)
Click "🗺️ Compute Route"
View optimal path with distance

Step 4: Add Custom Data

Navigate to respective tabs
Fill in forms
Click "Add" buttons

4. Testing with Sample Scenario
Scenario: Flash flood in Uttarakhand

View Priority Rankings

Rampur Village should be #1 (450 people, severity 5, difficult access)
Priority Score: ~1.0


Compute Route

From: Haldwani Central Hub
To: Rampur Village
Distance: 5.2 km (shortest path)


Update Road Status

Go to Road Network tab
Mark a road as "Blocked"
Re-compute route to see alternative path




📡 API Documentation
Base URL
http://localhost:5000/api
Endpoints
Health Check
httpGET /api/health
Response:
json{
  "status": "ok",
  "message": "Disaster Relief API is running",
  "timestamp": "2026-02-10T12:00:00.000Z"
}

Relief Centers
Get All Centers
httpGET /api/centers
Get Single Center
httpGET /api/centers/:id
Create Center
httpPOST /api/centers
Content-Type: application/json

{
  "name": "Dehradun Hub",
  "latitude": 30.3165,
  "longitude": 78.0322,
  "food": 750,
  "water": 1500,
  "medical": 250
}
Update Center
httpPUT /api/centers/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "food": 800
}
Delete Center
httpDELETE /api/centers/:id

Affected Areas
Get All Areas
httpGET /api/areas
Create Area
httpPOST /api/areas
Content-Type: application/json

{
  "name": "Kedarnath Village",
  "latitude": 30.7346,
  "longitude": 79.0669,
  "peopleAffected": 500,
  "severity": 5,
  "accessDifficulty": 1,
  "food": 300,
  "water": 600,
  "medical": 100
}
Delete Area
httpDELETE /api/areas/:id

Roads
Get All Roads
httpGET /api/roads
Create Road
httpPOST /api/roads
Content-Type: application/json

{
  "fromLocation": "60a7c8d9e4b0a1c2d3e4f5a6",
  "fromModel": "Center",
  "toLocation": "60a7c8d9e4b0a1c2d3e4f5a7",
  "toModel": "Area",
  "distance": 15.5,
  "travelTime": 45,
  "isBlocked": false
}
Update Road
httpPUT /api/roads/:id
Content-Type: application/json

{
  "isBlocked": true
}

Analytics
Compute Priorities
httpPOST /api/analytics/compute-priorities
Response:
json{
  "message": "Priorities computed successfully",
  "areas": [...]
}
Compute Route
httpPOST /api/analytics/compute-route
Content-Type: application/json

{
  "startId": "60a7c8d9e4b0a1c2d3e4f5a6",
  "endId": "60a7c8d9e4b0a1c2d3e4f5a7"
}
Response:
json{
  "path": [...],
  "distance": 25.5,
  "found": true
}
Get Statistics
httpGET /api/analytics/statistics
Response:
json{
  "centers": 2,
  "areas": 5,
  "roads": 9,
  "totalPeople": 1450,
  "totalResources": {
    "food": 800,
    "water": 1600,
    "medical": 350
  }
}

🧮 Algorithms
1. Priority Scoring Algorithm
Formula:
P = w₁ × S_norm + w₂ × N_norm + w₃ × A

Where:
  P = Priority Score (0 to 1)
  S_norm = Normalized Severity (severity / 5)
  N_norm = Normalized Population (people / max_people)
  A = Access Difficulty (0 or 1)
  
Weights:
  w₁ = 0.5 (Severity - 50%)
  w₂ = 0.3 (Population - 30%)
  w₃ = 0.2 (Access - 20%)
Example Calculation:
Area: Rampur Village
- People: 450 (max across all areas)
- Severity: 5
- Access: 1 (difficult)

Calculation:
  S_norm = 5/5 = 1.0
  N_norm = 450/450 = 1.0
  A = 1
  
  P = 0.5(1.0) + 0.3(1.0) + 0.2(1)
    = 0.5 + 0.3 + 0.2
    = 1.0 (Highest Priority)
Time Complexity: O(n log n) where n = number of areas

2. Dijkstra's Shortest Path Algorithm
Purpose: Find optimal route from relief center to affected area
Steps:

Initialize distances (all ∞ except start = 0)
Create unvisited set of all nodes
While unvisited nodes exist:

Select node with minimum distance
Update distances to neighbors
Mark as visited


Reconstruct path using predecessor tracking

Time Complexity: O((V + E) log V) where V = vertices, E = edges
Implementation Details:

Nodes: All relief centers + affected areas
Edges: Road connections with distance weights
Blocked roads are excluded from traversal
Returns: [path array, total distance, success boolean]


🚀 Deployment
Option 1: Heroku
bash# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
Option 2: Railway

Visit https://railway.app
Create new project
Connect GitHub repository
Add MongoDB plugin
Set environment variables
Deploy automatically

Option 3: Render

Visit https://render.com
Create new web service
Connect repository
Add environment variables:

MONGODB_URI
PORT (optional)


Deploy

Option 4: DigitalOcean App Platform

Visit https://cloud.digitalocean.com/apps
Create new app
Connect GitHub
Configure MongoDB connection
Deploy


🐛 Troubleshooting
Issue: "Cannot connect to MongoDB"
Solution:
bash# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
Issue: "Port 5000 already in use"
Solution: Change PORT in .env:
PORT=3000
Issue: "Module not found"
Solution:
bashcd backend
rm -rf node_modules package-lock.json
npm install
Issue: "API Disconnected" in frontend
Solutions:

Ensure backend server is running
Check API_BASE URL in frontend HTML (line ~389)
Verify CORS is enabled in server.js
Check browser console for errors

Issue: Seed script fails
Solution:
bash# Ensure MongoDB is running first
npm run seed

📝 Project Structure
disaster-relief-platform/
│
├── backend/
│   ├── models/
│   │   ├── Center.js          # Relief center schema
│   │   ├── Area.js             # Affected area schema
│   │   └── Road.js             # Road network schema
│   │
│   ├── routes/
│   │   ├── centers.js          # Center CRUD endpoints
│   │   ├── areas.js            # Area CRUD endpoints
│   │   ├── roads.js            # Road CRUD endpoints
│   │   └── analytics.js        # Algorithms & analytics
│   │
│   ├── server.js               # Main Express app
│   ├── seed.js                 # Sample data loader
│   ├── package.json            # Dependencies
│   └── .env                    # Environment config
│
├── frontend/
│   └── index.html              # Full web interface
│
├── .gitignore
└── README.md                   # This file

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open Pull Request


📄 License
This project is licensed under the MIT License.

👥 Authors

Your Name - Initial work - [GitHub Profile]


🙏 Acknowledgments

India Disaster Resource Network (IDRN) for data references
National Disaster Management Authority (NDMA) for guidelines
OpenStreetMap for road network data
MongoDB, Express.js communities for excellent documentation


📞 Support
For issues and questions:

Open an issue on GitHub
Email: your.email@example.com


🎯 Future Enhancements

 Real-time satellite imagery integration (ISRO NDEM API)
 Mobile application (React Native)
 Multi-vehicle route optimization
 SMS/WhatsApp integration for field updates
 Machine learning for disaster severity prediction
 Blockchain-based supply chain tracking
 IoT sensor integration
 Advanced analytics dashboard
 Multi-language support
 Role-based access control (RBAC)


Made with ❤️ for disaster relief operations