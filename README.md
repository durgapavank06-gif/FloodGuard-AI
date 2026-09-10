# FloodGuard AI: Urban Flood Intelligence & Nowcasting

[![SIH Problem Statement 26085](https://img.shields.io/badge/SIH%202024-Problem%2026085-06B6D4?style=for-the-badge)](https://sih.gov.in)
[![Ministry of Earth Sciences](https://img.shields.io/badge/MoES-NCMRWF-38BDF8?style=for-the-badge)](https://www.ncmrwf.gov.in)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

> **High-Resolution Street-Level Predictive Urban Flood Nowcasting (0–3 Hour Lead Window)**  
> Developed for **Smart India Hackathon (SIH) — Problem Statement 26085**  
> **Organization:** Ministry of Earth Sciences (MoES)  
> **Department:** National Centre for Medium Range Weather Forecasting (NCMRWF)  
> **Category:** Software | **Theme:** Disaster Management  

---

## 🌧️ The Problem Statement (SIH 26085)

Urban flooding across Indian metros (Hyderabad, Mumbai, Chennai, Bengaluru, Delhi) has become an annual recurring crisis. Traditional Numerical Weather Prediction (NWP) models indicate how much total rain will fall, but **they cannot predict where street-level water will accumulate**.

Urban flooding is a hyper-local phenomenon dictated by:
1. **Micro-topography** (road depressions, railway underpasses, valley sinks)
2. **Concrete imperviousness** (high surface runoff rates)
3. **Underground drainage bottlenecks** (surcharged culverts, silted pipes, and outfall backflow)

**FloodGuard AI** solves this crisis through a **coupled framework** that fuses:
- Real-time Doppler Weather Radar (DWR) precipitation nowcasts
- 1-meter Digital Elevation Models (DEM) for 2D surface runoff routing
- Directed graph mathematical modeling of underground stormwater drainage conduits (manhole nodes & pipe edges)

The system computes hydraulic capacity in real time, predicting exactly which roads, intersections, and underpasses will flood with **0–3 hours of actionable lead time**.

---

## 🎯 Design Direction: Command Center Aesthetic

FloodGuard AI is styled as a **Professional Emergency & Disaster Management Command Center** (EOC), moving far beyond generic weather websites into a mission-critical tactical interface:
- **Command-Center Dark Palette:** Deep slate & obsidian backgrounds (`#070B12`, `#0B111D`, `#141E30`), glassmorphic panels, and subtle cyan/radar glows.
- **Consistent Risk Spectrum:**
  - 🟢 **Low Risk** (`#10B981` / Emerald) — Shallow street sheet flow (<10 cm)
  - 🟡 **Moderate Risk** (`#F59E0B` / Amber) — Curb pooling (10–20 cm)
  - 🟠 **High Risk** (`#F97316` / Orange) — Traffic impediment (20–35 cm)
  - 🔴 **Critical Risk** (`#EF4444` / Crimson) — Dangerous submergence (>35 cm) with animated radar ping wave
- **Dual Persona Architecture:** Tailored interfaces for both everyday **Citizens** and government **Authority/EOC** operators.
- **Fully Responsive:** Smooth UI scaling from 320px mobile screens (bottom navigation bar) to 1440px+ command center wall displays.

---

## 🧭 Product Structure & Routes

### 🌐 Public Experience
| Route | Description |
|---|---|
| `/` | **Landing Page:** Futuristic radar visualization, 5-stage processing pipeline, 6 core capability cards, and CTAs. |
| `/role-selection` | **Role Selection Portal:** Interactive persona selector directing users to Citizen or Authority mode. |

### 👤 Citizen Experience
| Route | Description |
|---|---|
| `/citizen` | **Citizen Home:** Location card (Hyderabad), current risk status (**HIGH — 78% probability, 42 min onset, 48 mm/h rain**), quick action tiles, and nearby active alerts. |
| `/citizen/map` | **Flood Risk Map:** Interactive GIS map displaying color-coded zones, layer toggles, and slide-out zone telemetry panels. |
| `/citizen/forecast` | **3-Hour Nowcasting:** Interactive time progression selector (`NOW`, `+30m`, `+60m`, `+90m`, `+120m`, `+180m`) with rainfall/probability curves. |
| `/citizen/alerts` | **Alerts & Warnings:** Filterable emergency public warnings (`All`, `Critical`, `High`, `Moderate`, `Resolved`) with safety recommendations. |
| `/citizen/routes` | **Safe Route Planner:** Origin/Destination routing engine providing 3 distinct alternatives (e.g. Route B: +0.9 km, 0% flood exposure) with elevation profiles. |

### 🛡️ Authority Command Center
| Route | Description |
|---|---|
| `/authority` | **EOC Command Dashboard:** Real-time monitoring status (`🟢 Monitoring Active`), 4 core KPIs, live interactive map, and telemetry health monitors. |
| `/authority/map` | **Live GIS Workspace:** Full-screen multi-layer workspace with zone search, risk filter toggles, and dispatch action drawers. |
| `/authority/forecast` | **Hydraulic Nowcasting:** 3-hour surcharge curves and priority basin vulnerability rankings (Zone 14, Zone 10, Zone 09, Zone 11, Zone 21, Zone 17). |
| `/authority/alerts` | **Incident Management Table:** Operational table supporting live incident lifecycle actions (`Acknowledge`, `Escalate`, `Resolve`) and flash broadcasts. |
| `/authority/drainage` | **Drainage Network Graph:** Directed graph of manhole inlets (nodes) & underground conduits (edges) with surcharge states and flow rates ($m^3/s$). |
| `/authority/risk-analysis` | **Multimodal AI Risk Attribution:** Factor decomposition across Rainfall (92%), Drainage (85%), Elevation (78%), Runoff (69%), and Historical (61%). |
| `/authority/simulation` | **Flood Scenario Simulator:** Interactive sliders for Rainfall (10–150 mm/h), Duration, Drainage Capacity, and Runoff with Before-vs-After comparison. |
| `/authority/history` | **Historical Flood Intelligence:** Multi-timeframe analytics (7 Days, 30 Days, 3 Months, 1 Year), vulnerable basin rankings, and disaster logs. |

### ⚙️ Common
| Route | Description |
|---|---|
| `/settings` | **Settings & Preferences:** Notification thresholds, audio alert toggles, DEM resolution selectors, and MoES/NCMRWF accreditation. |

---

## ⚡ Key Interactive Capabilities

1. **Interactive Vector GIS Engine (`InteractiveMap.tsx`)**
   - Renders Hyderabad's geographic topography (Hussain Sagar, Musi River, Durgam Cheruvu, major highway networks, and 16 catchment micro-basins).
   - Multi-layer controls: *Flood Risk Zones, Roads, Rainfall Heatmap, Drainage Conduits, Elevation Contours, Historical Floods*.
   - Click any zone to trigger the slide-out telemetry drawer showing estimated depth, onset time, and mitigation actions.

2. **Smart Safe Route Planner (`RouteMap.tsx`)**
   - Compares 3 alternative transit paths between user-selected origins and destinations.
   - Flags hazardous underpasses (e.g., Begumpet Railway Subway at 42 cm depth) and recommends safe elevated ridge corridors (Route B via Panjagutta Flyover).
   - Features a dynamic elevation cross-section profile comparing terrain elevation against surface floodwater depth.

3. **Underground Stormwater Drainage Graph (`DrainageGraph.tsx`)**
   - Mathematically models the storm drainage network as a directed graph.
   - Identifies manholes operating under pressure head above hydraulic grade line (HGL) and predicts surface backflow geysers.

4. **Flood Scenario Simulator (`BeforeAfterView.tsx`)**
   - Real-time reactive hydrological calculations simulating variations in cloudburst intensity, duration, pipe desilting, and concrete runoff.
   - Computes dynamic Before vs. After deltas for affected road kilometers, exposed population, and required mobile dewatering pumps.

5. **Citizen Crowdsourced Incident Reporting (`ReportFloodingModal.tsx`)**
   - Allows citizens to submit ground depth estimates (ankle, knee, waist, submerged) and hazard types with immediate toast feedback.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on Node `v22.20.0`)
- **NPM**: `v9.0.0` or higher

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd c:\Users\harsh\OneDrive\Desktop\SIH
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000/
   (or http://localhost:3001/ if port 3000 is occupied)
   ```

### Production Build & Preview

To verify or generate the production-ready static bundle:
```bash
# Typecheck & build bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Codebase Directory Structure

```text
SIH/
├── index.html                  # HTML entry point with meta tags & Inter typography
├── package.json                # Project dependencies & npm scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript compiler options
├── tailwind.config.js          # Custom command-center theme & risk color tokens
├── postcss.config.js           # PostCSS Tailwind plugins
├── src/
│   ├── main.tsx                # React DOM root render
│   ├── App.tsx                 # Master hash router & responsive layout shells
│   ├── index.css               # Command center scrollbars, grid patterns & animations
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Zone, Alert, Drainage, etc.)
│   ├── data/
│   │   ├── zones.ts            # 16 detailed Hyderabad micro-basins data
│   │   ├── alerts.ts           # Active incident alerts & warnings
│   │   ├── rainfall.ts         # 0-3 hour radar nowcasting time-series
│   │   ├── drainage.ts         # Directed graph nodes, conduits & capacities
│   │   ├── routes.ts           # Safe route alternatives & elevation profiles
│   │   └── history.ts          # Historical inundation archives & benchmarks
│   ├── context/
│   │   ├── AppContext.tsx      # Global state (role, route, toast manager, modals)
│   │   └── SimulationContext.tsx # Hydrological scenario calculation engine
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx      # Role switcher & live telemetry banner
│   │   │   ├── Sidebar.tsx     # Authority collapsible navigation drawer
│   │   │   ├── MobileBottomNav.tsx # Mobile navigation bar
│   │   │   ├── RiskBadge.tsx   # Color-coded risk status badges
│   │   │   ├── StatCard.tsx    # Command center metric cards
│   │   │   ├── RiskCard.tsx    # Citizen current risk highlight card
│   │   │   ├── AlertCard.tsx   # Incident card with triage actions
│   │   │   ├── Modal.tsx       # Reusable accessible dialog modal
│   │   │   ├── Toast.tsx       # Live status feedback notifications
│   │   │   └── FeedbackStates.tsx # Loading, empty & error fallback states
│   │   ├── map/
│   │   │   ├── InteractiveMap.tsx # Street-level GIS canvas with layer toggles
│   │   │   ├── MapLegend.tsx   # Color-coded depth & risk legend
│   │   │   ├── ZoneDetailsPanel.tsx # In-depth catchment telemetry drawer
│   │   │   └── RouteMap.tsx    # Multi-route navigation comparison overlay
│   │   ├── charts/
│   │   │   ├── ForecastChart.tsx # SVG rainfall vs. probability curve
│   │   │   ├── RiskTimeline.tsx  # 0-3h interval time selector buttons
│   │   │   ├── DrainageCard.tsx  # Conduit capacity & backflow monitor
│   │   │   ├── DrainageGraph.tsx # Directed graph manhole network
│   │   │   └── FactorBar.tsx     # Multimodal AI risk attribution bar
│   │   ├── simulation/
│   │   │   ├── SimulationControl.tsx # Rainfall & drainage scenario sliders
│   │   │   └── BeforeAfterView.tsx   # Before vs After delta metrics
│   │   └── citizen/
│   │       └── ReportFloodingModal.tsx # Citizen crowd-reporting modal
│   └── pages/
│       ├── LandingPage.tsx           # Public showcase landing page
│       ├── RoleSelectionPage.tsx     # Dual persona access portal
│       ├── SettingsPage.tsx          # Configuration & telemetry preferences
│       ├── citizen/
│       │   ├── CitizenHome.tsx       # Personalized local risk overview
│       │   ├── CitizenMap.tsx        # Citizen street flood map
│       │   ├── CitizenForecast.tsx   # 3-hour nowcast timeline
│       │   ├── CitizenAlerts.tsx     # Public warning notifications
│       │   └── CitizenRoutes.tsx     # Safe flood-avoidance routing
│       └── authority/
│           ├── AuthorityDashboard.tsx    # EOC command center dashboard
│           ├── AuthorityMap.tsx          # Full-screen GIS workspace
│           ├── AuthorityForecast.tsx     # 0-3h hydraulic surcharge nowcast
│           ├── AuthorityAlerts.tsx       # Incident lifecycle management
│           ├── AuthorityDrainage.tsx     # Underground drainage monitoring
│           ├── AuthorityRiskAnalysis.tsx # AI risk factor decomposition
│           ├── AuthoritySimulation.tsx   # Hydrological scenario simulator
│           └── AuthorityHistory.tsx      # Longitudinal flood intelligence
```

---

## 🏛️ Acknowledgments & Credits

- **Smart India Hackathon (SIH) 2024** — Problem Statement 26085
- **Ministry of Earth Sciences (MoES)**, Government of India
- **National Centre for Medium Range Weather Forecasting (NCMRWF)**
- **India Meteorological Department (IMD)** — Hyderabad Doppler Weather Radar Station