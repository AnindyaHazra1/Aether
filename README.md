<div align="center">

# A E T H E R
### The Upper Atmosphere | Premium Weather Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38b2ac.svg?style=flat&logo=tailwind-css)

<br />

**Aether** is a next-generation weather dashboard designed with a philosophy of "Data as Art."   
Moving beyond generic weather apps, Aether combines real-time meteorological data with immersive, game-tier visual fidelity.

</div>

<br />

## 🌌 Core Experience

Aether isn't just about showing numbers; it's about *feeling* the weather.

*   **Dynamic Atmospherics**: The interface simulates the actual weather outside. From **Starry Nights** to **Thunderstorms**, the entire UI adapts with high-fidelity backdrops and ambient glows.
*   **Through-the-Lens Visibility**: Our proprietary Visibility Card uses a camera viewfinder aesthetic that dynamically blurs focus based on real-world fog and haze levels.
*   **Fluid Glassmorphism**: Built on a modern glass UI stack, every element floats with calculated transparency, blurs, and border-glows that react to user interaction.
*   **Data Fidelity**: Real-time integration with OpenWeatherMap APIs for precise forecasting, Air Quality Index (PM2.5), and UV radiation levels.

## ✨ Features

### 🖥️ Premium UI/UX
*   **Adaptive Theme**: Seamless Day/Night transitions that alter the color palette and ambient lighting of the dashboard.
*   **Micro-Interactions**: Hover effects, smooth transitions, and a custom-designed animated scrollbar that glows on touch.
*   **Responsive Layout**: A fluid grid system that reshapes itself from desktop monitors down to mobile viewports without losing visual impact.

### 🔮 Advanced Visualizations
*   **Liquid Humidity**: A dynamic water-drop simulation that fills and wobbles based on humidity percentage.
*   **Radial Pressure**: An aviation-inspired gauge for atmospheric pressure.
*   **Solar Track**: A mathematical arc calculating the precise position of the Sun or Moon based on local sunrise/sunset times.

### 🗺️ Interactive Maps
*   **Radar Layers**: Switchable layers for Clouds, Precipitation, and Temperature.
*   **Vector Tiles**: High-contrast, dark-mode map tiles powered by CartoDB Voyager for distraction-free navigation.
*   **Custom Controls**: Ultra-minimalist floating map controls designed to maximize screen real estate.

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite)
*   **Styling**: Tailwind CSS (Custom Config)
*   **State Management**: React Context API
*   **Maps**: Leaflet / React-Leaflet
*   **Weather Data**: OpenWeatherMap API
*   **Icons**: Lucide React & Custom SVG Assets

## 🚀 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/AnindyaHazra1/Aether.git
    cd Aether
    ```

2.  **Install Dependencies**
    ```bash
    # Install Client
    cd client
    npm install

    # Install Server (Optional for backend proxy)
    cd ../server
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the `client` directory:
    ```env
    VITE_WEATHER_API_KEY=your_api_key_here
    ```

4.  **Launch Aether**
    ```bash
    # Run Frontend
    npm run dev
    ```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
    <sub>Built with precision by Anindya Hazra.</sub>
</div>
