<div align="center">

# A E T H E R
### The Upper Atmosphere | Premium Weather Dashboard

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/AnindyaHazra1/Aether/blob/main/LICENSE)
![React](https://img.shields.io/badge/React-18-61dafb.svg?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38b2ac.svg?style=flat&logo=tailwind-css)

<br />

**Aether** is a next-generation weather dashboard designed with a philosophy of "Data as Art."   
Moving beyond generic weather apps, Aether combines real-time meteorological data with immersive, game-tier visual fidelity.

</div>

<br />

## 🌌 Core Experience

Aether isn't just about showing numbers; it's about *feeling* the weather.

*   **Immersive Environmental Simulation**: The interface dynamically adapts to real-time weather conditions, rendering high-fidelity backdrops that reflect current atmospheric states—from clear starry nights to heavy precipitation.
*   **Context-Aware Visual Feedback**: Advanced visibility indicators utilize dynamic blur filters to visually represent fog and haze conditions, mimicking real-world optical effects.
*   **Sophisticated User Interface**: Built on a modern glassmorphic design system, featuring multi-layered transparency and ambient lighting to establish a clear visual hierarchy.
*   **Precision Meteorological Data**: Seamless integration with the OpenWeatherMap API ensures the delivery of accurate, real-time forecasting, Air Quality Index (PM2.5), and UV radiation metrics.

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

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a **Pull Request**

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
    <sub>Built with precision by Anindya Hazra.</sub>
</div>
