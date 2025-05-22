# 🧠 Crypto Asset Tracker

An interactive, lightweight crypto performance tracker built with React, Zustand, Recharts, and wagmi.  
This application allows users to track and compare the historical performance of selected cryptocurrencies using live data from CoinGecko.

## 🌐 Live Preview

https://crypto-asset-tacker.netlify.app/

---

## ✨ Features

- **🔍 Asset Selection**  
  Search and select crypto assets (e.g., BTC, ETH, SOL) using a multi-select dropdown with persistent selection.

- **📈 Performance Charting**  
  View historical price data with toggles for Week, Month, and Year intervals. Built with Recharts for smooth, interactive visuals.

- **📊 Multi-Asset Comparison**  
  Compare up to two crypto assets side by side in the same chart with color-coded trend lines.

- **⚡ Local Caching**  
  Asset data is cached in localStorage for improved performance and reduced API calls.

- **🦊 MetaMask Integration**  
  Self-custody wallet support using wagmi v2 + viem. Users can connect MetaMask for future wallet-based asset insights.

- **🧪 Unit-Test Ready**  
  Core logic components can be tested using Vitest and React Testing Library.

---

## 🛠 Tech Stack

| Tool        | Purpose                                |
|-------------|----------------------------------------|
| **React + TypeScript** | Frontend framework + types  |
| **Vite**    | Lightning-fast bundler                 |
| **Tailwind CSS (v4)** | Utility-first styling        |
| **ShadCN UI** | Reusable, accessible UI primitives   |
| **Zustand** | Minimal global state management        |
| **Recharts** | Charting library for data viz         |
| **wagmi + viem** | Wallet integration (EVM-compatible) |
| **CoinGecko API** | Real-time asset price data       |

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/crypto-tracker.git
cd crypto-tracker
npm install
npm run dev
```

---

## 🧠 Design Considerations

This project was built with scalability and clarity in mind.
It demonstrates:

- Clean, modular React architecture with reusable components

- State decoupling via Zustand for better maintainability

- A clear user experience focused on responsiveness and feedback

- Integration with real-world APIs and wallet tooling to mirror production use cases

