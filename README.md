# 🏛️ GatiAI – AI Infrastructure Planning Assistant

[![Live Application](https://img.shields.io/badge/Live%20App-https%3A%2F%2Fgati--ai.onrender.com-0d9488?style=for-the-badge&logo=render&logoColor=white)](https://gati-ai.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Vamsikrishna2006%2Fgati--ai-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Vamsikrishna2006/gati-ai)

> 🌐 **Live Web Application URL:** [https://gati-ai.onrender.com](https://gati-ai.onrender.com)  
> 📁 **GitHub Repository:** [https://github.com/Vamsikrishna2006/gati-ai](https://github.com/Vamsikrishna2006/gati-ai)

---

> **"Real Routes + Real GIS Features + Real Geometric Math + Grounded AI Explanation"**  
> *Inspired by the PM Gati Shakti National Master Plan for Integrated Multi-Modal Infrastructure.*

---

## 📌 Executive Overview

**GatiAI** is an AI-powered early-stage infrastructure corridor screening assistant designed to help government planners, highway engineers, and inter-departmental authorities evaluate candidate highway and railway alignments before ground-breaking occurs.

By cross-checking candidate driving routes against **real OpenStreetMap spatial geometries**—including forest reserves, protected sanctuaries, river systems, mapped gas/oil pipelines, and underground power cables—GatiAI surfaces environmental friction and utility conflicts in **under 30 seconds**.

---

## 🚀 Live Application & Deployment

| Resource | Link | Description |
| :--- | :--- | :--- |
| 🌐 **Production App** | [https://gati-ai.onrender.com](https://gati-ai.onrender.com) | Live Web Service hosted on Render |
| 📁 **GitHub Source Code** | [https://github.com/Vamsikrishna2006/gati-ai](https://github.com/Vamsikrishna2006/gati-ai) | Complete source repository |

---

## 🎯 Problem Statement & National Impact

1. **Uncoordinated Inter-Departmental Road Redigging:**  
   Highway authorities (MoRTH/NHAI) traditionally build roads without early spatial visibility into existing or planned utility lines. As a result, newly paved highways are frequently dug up weeks after completion to lay power or water lines, causing massive financial waste and traffic disruption.

2. **Late Statutory & Environmental Clearance Stalls:**  
   Candidate alignments chosen purely on shortest driving distance often hit mapped forest reserves, wildlife sanctuaries, or major river floodplains late in the planning cycle, triggering 18–24 month regulatory stalls under the Forest Conservation Act (FCA).

3. **Slow, Manual & Unbacked Pre-Feasibility Screening:**  
   Pre-feasibility screening takes 3–4 weeks to manually cross-check GIS layers, while existing AI tools invent hallucinated ₹ crore cost predictions or declare biased "winner" routes.

---

## ⭐ Key Features Implemented

* 🛣️ **Multi-Corridor Driving Engine:** Computes two distinct, separated candidate alignments using real road networks (OpenRouteService API) with perpendicular spatial via-point detours ($\approx 95\text{ km}$ offset).
* 🌲 **Environmental Constraints Layer:** Detects mapped forest reserves (`landuse=forest`), protected sanctuaries (`boundary=protected_area`), and 2D river line crossings (🌊).
* ⚡ **Existing Utility Infrastructure Layer:** Detects mapped pipelines (`man_made=pipeline`), underground power cables (`power=cable` with `location=underground`), and 2D line intersection markers (◆).
* 🤝 **Inter-Departmental Coordination Hub:** Implements the **PM Gati Shakti Multi-Ministry Pre-Paving Protocol** with 4 departmental action cards:
  * ⚡ **Power DISCOM:** Co-lay underground power cables in roadside utility ducts BEFORE asphalt paving.
  * 💧 **Jal Shakti:** Co-locate water supply pipelines in roadside service corridors and bridge pier ducts.
  * 🌲 **MoEFCC:** File Stage-I Forest Conservation Act (FCA) diversion clearance for mapped forest overlaps ($\text{km}$).
  * 🌉 **Rivers Authority:** Coordinate bridge pier span clearances and high-flood level (HFL) data.
* 🗺️ **4 Interactive Basemap Views:**
  * **Dark Vector:** High-contrast dark GIS vector map.
  * **Satellite View:** High-resolution Esri World Imagery photography.
  * **Hybrid Map View:** Satellite photography + real road network and city labels.
  * **Terrain Vector:** Topographic elevation contours and terrain map.
* 📄 **DPR Report PDF Generator:** Downloadable official Detailed Project Report (DPR) PDF containing Ref ID, alignment comparison matrix, utility inventory, and **Inter-Departmental Pre-Paving Coordination Protocol Certificate**.
* 🤖 **Grounded Google Gemini AI Trade-off & Monsoon Risk Analysis:** Ingests measured GIS metrics and regional monsoon risk profiles (Western Ghats landslide exposure, Gangetic floodplains). Strict system prompt forbids winner declaration, fake cost predictions, or arbitrary risk percentages.
* 📱 **Device-to-Device Responsive UI:** Tabbed view switcher (`[ Layers | Legend | Both ]`) and auto-collapsing mobile trigger (`[ 🥞 GIS Layers 🔽 ]`) for 100% device compatibility.

---

## 🛠️ Technology Stack & Architecture

* **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS v4, Leaflet.js, Lucide Icons, jsPDF.
* **Backend:** Node.js, Express.js (`server.ts`), esbuild.
* **Geospatial APIs & Engines:**
  * **OpenRouteService API:** Driving directions & route geometries.
  * **OpenStreetMap Overpass API:** Real vector polygon/line geometries for forests, protected areas, rivers, pipelines, and underground cables.
  * **Google Gemini AI (`@google/genai`):** Grounded comparative route trade-off explanations.
* **Vector Math:** 2D line segment intersection algorithm ($P_1P_2 \cap Q_1Q_2$) with OSM element ID deduplication.

---

## 🚀 Local Installation & Setup

### Prerequisites
* **Node.js:** v18.0 or higher
* **npm:** v9.0 or higher

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Vamsikrishna2006/gati-ai.git
   cd gati-ai
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**  
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY="your_google_gemini_api_key"
   ORS_API_KEY="your_openrouteservice_api_key"
   ```

4. **Build the Production Bundle:**
   ```bash
   npm run build
   ```

5. **Start the Production Server:**
   ```bash
   npm start
   ```

6. Open **`http://localhost:3000`** in your browser!

---

## 📄 License & Acknowledgments

* **License:** MIT License.
* **Data Provenance:** OpenStreetMap contributors, OpenRouteService, Esri World Imagery, Google Gemini API.
