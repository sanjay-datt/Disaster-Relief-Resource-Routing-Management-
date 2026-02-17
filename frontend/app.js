// API Base URL
const API_URL = 'http://localhost:5000/api';

// State
let centers = [];
let areas = [];
let roads = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    updateLastUpdated();
    setInterval(updateLastUpdated, 1000);
    
    // Load initial data
    loadCenters();
    loadAreas();
    loadRoads();
    
    // Setup form handlers
    setupFormHandlers();
});

// Tab Navigation
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
            
            // Load data for specific tabs
            if (targetTab === 'routing' || targetTab === 'resources') {
                populateRouteSelects();
                populateRoadSelects();
            }
        });
    });
}

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = timeString;
}

// API Helpers
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        document.getElementById('systemStatus').textContent = 'ERROR';
        document.getElementById('systemStatus').classList.remove('online');
        return null;
    }
}

// Load Centers
async function loadCenters() {
    try {
        centers = await apiRequest('/centers');
        if (centers) {
            displayCenters(centers);
        }
    } catch (error) {
        console.error('Error loading centers:', error);
    }
}

function displayCenters(data) {
    const container = document.getElementById('centersList');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No relief centers found</p>';
        return;
    }
    
    container.innerHTML = data.map(center => `
        <div class="data-item">
            <strong>${center.name}</strong><br>
            📍 ${center.latitude.toFixed(4)}, ${center.longitude.toFixed(4)}<br>
            🍱 Food: ${center.resources.food} | 💧 Water: ${center.resources.water} | 🏥 Medical: ${center.resources.medical}
        </div>
    `).join('');
}

// Load Areas
async function loadAreas() {
    try {
        areas = await apiRequest('/areas');
        if (areas) {
            displayAreas(areas);
        }
    } catch (error) {
        console.error('Error loading areas:', error);
    }
}

function displayAreas(data) {
    const container = document.getElementById('areasList');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No affected areas found</p>';
        return;
    }
    
    container.innerHTML = data.map(area => `
        <div class="data-item">
            <strong>${area.name}</strong><br>
            📍 ${area.latitude.toFixed(4)}, ${area.longitude.toFixed(4)}<br>
            👥 People: ${area.peopleAffected} | ⚠️ Severity: ${area.severity}/5 | 🚧 Access: ${area.accessDifficulty === 1 ? 'Difficult' : 'Easy'}<br>
            ${area.priorityScore > 0 ? `<span class="priority-badge priority-${getPriorityLevel(area.priorityScore)}">Priority: ${area.priorityScore.toFixed(3)}</span>` : ''}
        </div>
    `).join('');
}

function getPriorityLevel(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
}

// Load Roads
async function loadRoads() {
    try {
        roads = await apiRequest('/roads');
        if (roads) {
            displayRoads(roads);
        }
    } catch (error) {
        console.error('Error loading roads:', error);
    }
}

function displayRoads(data) {
    const container = document.getElementById('roadsList');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No roads found</p>';
        return;
    }
    
    container.innerHTML = data.map(road => `
        <div class="data-item" style="border-left-color: ${road.isBlocked ? 'var(--emergency-red)' : 'var(--safe-green)'}">
            <strong>${road.fromLocation?.name || 'Unknown'}</strong> ↔ <strong>${road.toLocation?.name || 'Unknown'}</strong><br>
            📏 ${road.distance} km | ⏱️ ${road.travelTime} min | 
            ${road.isBlocked ? '🚫 <strong style="color: var(--emergency-red)">BLOCKED</strong>' : '✅ Open'}
        </div>
    `).join('');
}

// Compute Priorities
async function computePriorities() {
    const resultContainer = document.getElementById('prioritiesResult');
    resultContainer.innerHTML = '<div class="loading"></div> Computing priorities...';
    
    try {
        const result = await apiRequest('/analytics/compute-priorities', 'POST');
        
        if (result && result.areas) {
            areas = result.areas;
            const sorted = [...result.areas].sort((a, b) => b.priorityScore - a.priorityScore);
            
            resultContainer.innerHTML = `
                <h3 style="margin-bottom: 15px; color: var(--safe-green);">✓ Priority Computation Complete</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Area Name</th>
                            <th>Priority Score</th>
                            <th>People</th>
                            <th>Severity</th>
                            <th>Access</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map((area, index) => `
                            <tr>
                                <td><strong>${index + 1}</strong></td>
                                <td>${area.name}</td>
                                <td><span class="priority-badge priority-${getPriorityLevel(area.priorityScore)}">${area.priorityScore.toFixed(3)}</span></td>
                                <td>${area.peopleAffected}</td>
                                <td>${area.severity}/5</td>
                                <td>${area.accessDifficulty === 1 ? 'Hard' : 'Easy'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            
            // Refresh areas display
            loadAreas();
            
            // Show allocation summary
            showAllocationSummary(sorted);
        } else {
            resultContainer.innerHTML = `<p style="color: var(--emergency-red);">Error computing priorities</p>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: var(--emergency-red);">Error: ${error.message}</p>`;
    }
}

// Show allocation summary
function showAllocationSummary(sortedAreas) {
    const container = document.getElementById('allocationSummary');
    
    const totalRequired = {
        food: sortedAreas.reduce((sum, a) => sum + a.resourcesNeeded.food, 0),
        water: sortedAreas.reduce((sum, a) => sum + a.resourcesNeeded.water, 0),
        medical: sortedAreas.reduce((sum, a) => sum + a.resourcesNeeded.medical, 0)
    };
    
    const totalAvailable = {
        food: centers.reduce((sum, c) => sum + c.resources.food, 0),
        water: centers.reduce((sum, c) => sum + c.resources.water, 0),
        medical: centers.reduce((sum, c) => sum + c.resources.medical, 0)
    };
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div style="padding: 15px; background: var(--bg-tertiary); border-radius: 8px;">
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">FOOD KITS</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${totalAvailable.food} / ${totalRequired.food}</div>
                <div style="font-size: 0.9rem; color: ${totalAvailable.food >= totalRequired.food ? 'var(--safe-green)' : 'var(--alert-orange)'}">
                    ${((totalAvailable.food / totalRequired.food) * 100).toFixed(1)}% available
                </div>
            </div>
            <div style="padding: 15px; background: var(--bg-tertiary); border-radius: 8px;">
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">WATER UNITS</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${totalAvailable.water} / ${totalRequired.water}</div>
                <div style="font-size: 0.9rem; color: ${totalAvailable.water >= totalRequired.water ? 'var(--safe-green)' : 'var(--alert-orange)'}">
                    ${((totalAvailable.water / totalRequired.water) * 100).toFixed(1)}% available
                </div>
            </div>
            <div style="padding: 15px; background: var(--bg-tertiary); border-radius: 8px;">
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">MEDICAL KITS</div>
                <div style="font-size: 1.3rem; font-weight: 700;">${totalAvailable.medical} / ${totalRequired.medical}</div>
                <div style="font-size: 0.9rem; color: ${totalAvailable.medical >= totalRequired.medical ? 'var(--safe-green)' : 'var(--alert-orange)'}">
                    ${((totalAvailable.medical / totalRequired.medical) * 100).toFixed(1)}% available
                </div>
            </div>
        </div>
    `;
}

// Populate Route Selects
function populateRouteSelects() {
    const centerSelect = document.getElementById('routeCenterId');
    const areaSelect = document.getElementById('routeAreaId');
    
    if (!centerSelect || !areaSelect) return;
    
    centerSelect.innerHTML = centers.map(c => 
        `<option value="${c._id}">${c.name}</option>`
    ).join('');
    
    areaSelect.innerHTML = areas.map(a => 
        `<option value="${a._id}">${a.name}</option>`
    ).join('');
}

// Populate Road Selects
function populateRoadSelects() {
    const roadFrom = document.getElementById('roadFrom');
    const roadTo = document.getElementById('roadTo');
    
    if (!roadFrom || !roadTo) return;
    
    const allLocations = [
        ...centers.map(c => ({ id: c._id, name: c.name, type: 'Center' })),
        ...areas.map(a => ({ id: a._id, name: a.name, type: 'Area' }))
    ];
    
    const options = allLocations.map(loc => 
        `<option value="${loc.id}|${loc.type}">${loc.name} (${loc.type})</option>`
    ).join('');
    
    roadFrom.innerHTML = '<option value="">Select location...</option>' + options;
    roadTo.innerHTML = '<option value="">Select location...</option>' + options;
}

// Find Single Route
async function findRoute(event) {
    event.preventDefault();
    
    const centerId = document.getElementById('routeCenterId').value;
    const areaId = document.getElementById('routeAreaId').value;
    
    const resultContainer = document.getElementById('routeResult');
    const infoContainer = document.getElementById('routeInfo');
    
    resultContainer.innerHTML = '<div class="loading"></div> Computing route...';
    infoContainer.innerHTML = '';
    
    try {
        const result = await apiRequest('/analytics/compute-route', 'POST', {
            startId: centerId,
            endId: areaId
        });
        
        if (result && result.found) {
            const routePath = result.path.map((node, index) => {
                const nodeClass = index === 0 ? 'center' : 'area';
                const arrow = index < result.path.length - 1 ? '<span class="route-arrow">→</span>' : '';
                return `<div class="route-node ${nodeClass}">${node.name}</div>${arrow}`;
            }).join('');
            
            resultContainer.innerHTML = `
                <h3 style="margin-bottom: 15px; color: var(--safe-green);">✓ Route Found</h3>
                <div class="route-path">${routePath}</div>
            `;
            
            infoContainer.innerHTML = `
                <h3 style="margin-bottom: 15px; color: var(--info-blue);">Route Details</h3>
                <div style="padding: 15px; background: var(--bg-tertiary); border-radius: 8px;">
                    <strong>Total Distance:</strong> ${result.distance} km<br>
                    <strong>Number of Stops:</strong> ${result.path.length}<br>
                    <strong>Start:</strong> ${result.path[0].name}<br>
                    <strong>End:</strong> ${result.path[result.path.length - 1].name}
                </div>
            `;
        } else {
            resultContainer.innerHTML = `<p style="color: var(--emergency-red);">❌ No route found between selected locations</p>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: var(--emergency-red);">Error: ${error.message}</p>`;
    }
}

// Setup Form Handlers
function setupFormHandlers() {
    // Route form
    const routeForm = document.getElementById('routeForm');
    if (routeForm) {
        routeForm.addEventListener('submit', findRoute);
    }
    
    // Add center form
    const centerForm = document.getElementById('addCenterForm');
    if (centerForm) {
        centerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                latitude: parseFloat(formData.get('latitude')),
                longitude: parseFloat(formData.get('longitude')),
                food: parseInt(formData.get('food')),
                water: parseInt(formData.get('water')),
                medical: parseInt(formData.get('medical'))
            };
            
            try {
                const result = await apiRequest('/centers', 'POST', data);
                if (result) {
                    alert('✅ Relief center added successfully!');
                    e.target.reset();
                    loadCenters();
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            }
        });
    }
    
    // Add area form
    const areaForm = document.getElementById('addAreaForm');
    if (areaForm) {
        areaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                latitude: parseFloat(formData.get('latitude')),
                longitude: parseFloat(formData.get('longitude')),
                peopleAffected: parseInt(formData.get('peopleAffected')),
                severity: parseInt(formData.get('severity')),
                accessDifficulty: parseInt(formData.get('accessDifficulty')),
                food: parseInt(formData.get('food')),
                water: parseInt(formData.get('water')),
                medical: parseInt(formData.get('medical'))
            };
            
            try {
                const result = await apiRequest('/areas', 'POST', data);
                if (result) {
                    alert('✅ Affected area added successfully!');
                    e.target.reset();
                    loadAreas();
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            }
        });
    }
    
    // Add road form
    const roadForm = document.getElementById('addRoadForm');
    if (roadForm) {
        roadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            const from = formData.get('from');
            const to = formData.get('to');
            
            if (!from || !to) {
                alert('❌ Please select both locations');
                return;
            }
            
            const [fromId, fromModel] = from.split('|');
            const [toId, toModel] = to.split('|');
            
            const data = {
                fromLocation: fromId,
                fromModel: fromModel,
                toLocation: toId,
                toModel: toModel,
                distance: parseFloat(formData.get('distance')),
                travelTime: parseInt(formData.get('travelTime')),
                isBlocked: formData.get('isBlocked') === 'on'
            };
            
            try {
                const result = await apiRequest('/roads', 'POST', data);
                if (result) {
                    alert('✅ Road connection added successfully!');
                    e.target.reset();
                    loadRoads();
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            }
        });
    }
}