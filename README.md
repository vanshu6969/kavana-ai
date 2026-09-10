# Kavana AI - Interactive Story & 18+ Uncensored Roleplay Platform

A 1:1 clone of Kavana AI featuring **105+ curated interactive scenarios**, dynamic search and category filtering, multilingual character roleplay (English, Hinglish, Punjabi, Hindi, Urdu), and "Make Them Dance" animation studio.

## ✨ Features
- **105+ Interactive Scenarios**: Spanning Drama, Broken Marriages, Mafia & Billionaires, Spicy 18+, Dark Fantasy, Desi & Bollywood Drama, Anime & Cyberpunk, and Psychological Thrillers.
- **1:1 Kavana UI Experience**: Deep obsidian dark mode, sticky Role Assignment banner (`You are: [Role]`), glowing tags, and interactive player counts.
- **Dynamic Smart Reply Chips**: Clickable prompt choices that let users shape the plot message by message without typing.
- **Multi-Provider AI Engine**:
  - **OpenRouter** (Pre-configured for uncensored roleplay with `gryphe/mythomax-l2-13b`)
  - **Google Gemini** (`gemini-1.5-flash`)
  - **Groq** (`llama-3.3-70b-versatile`)
  - **Local Ollama** (`dolphin-llama3` / `llama3`)
  - **Dynamic Procedural Engine** (Zero key fallback with high-entropy neural generation)
- **Multilingual Dialogue**: Real-time dialect response in fluent Punjabi, spicy Hinglish, Hindi, and English.
- **Visual Novel Reader Mode**: Branching chapter narratives with choices and intimacy meters.
- **"Make Them Dance" Studio**: Interactive dance routines (Bhangra, Hip-Hop, Sensual Tango, Waltz) with procedural Web Audio beat synthesizer.

## 🚀 Live Demo & Deployment
- Deploy easily on Vercel with zero configuration:
  ```bash
  npx vercel --prod
  ```

## 🛠 Local Setup
```bash
# Clone the repository
git clone https://github.com/vanshu6969/kavana-ai.git

# Navigate into the project
cd kavana-ai

# Start a local HTTP server
python -m http.server 3000
```
Open `http://localhost:3000` in your browser.
