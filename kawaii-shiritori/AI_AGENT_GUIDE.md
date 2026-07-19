# 🤖 AI Agent Integration Guide

## What You Already Have

Your game **already uses AI**! You're currently using **Google Gemini AI** for:

- ✅ Word validation
- ✅ Bot opponent moves
- ✅ Hint generation
- ✅ Japanese translation

**Current AI Flow:**

```
Player types "neko"
  ↓
React → Express server → Gemini API
  ↓
Gemini validates: "ねこ = cat, valid word!"
  ↓
Response → React → UI updates
```

## 🆓 Free AI Options Now Available

### Option 1: Google Gemini (Current - Paid)

- **Status**: ✅ Already working
- **Cost**: $0.00075 per 1K chars (very cheap)
- **Pros**: Accurate, fast, cloud-based
- **Cons**: Requires API key, costs money
- **Best for**: Production use

### Option 2: Ollama (NEW - Free)

- **Status**: ✅ Just added
- **Cost**: $0 (runs on your computer)
- **Pros**: Completely free, private, offline
- **Cons**: Needs local installation, uses computer resources
- **Best for**: Development, testing, learning

### Option 3: Dictionary Fallback (NEW - Free)

- **Status**: ✅ Just added
- **Cost**: $0 (uses your dictionary.json)
- **Pros**: Always works, no setup, instant
- **Cons**: Limited to dictionary words only
- **Best for**: Backup when AI unavailable

---

## 🚀 Quick Start: Add Free AI

### Option A: Keep Gemini (Recommended for Now)

**Nothing to do!** Your game already works perfectly with Gemini.

**Pros:**

- Already configured
- No setup needed
- Best accuracy
- Cloud-based (no local resources)

**Cost:** ~$0.01-0.05 per day of gameplay (very affordable)

### Option B: Switch to Ollama (100% Free)

**Step 1: Install Ollama**

```bash
# Mac
brew install ollama

# Windows/Linux
# Download from: https://ollama.com
```

**Step 2: Download AI Model**

```bash
# Recommended: Qwen (best for Japanese)
ollama pull qwen3

# Alternatives:
ollama pull mistral    # Fast, English-focused
ollama pull phi        # Lightweight
ollama pull gemma      # Google's open model
```

**Step 3: Start Ollama**

```bash
ollama serve
# Runs at http://localhost:11434
```

**Step 4: Update .env**

```env
# Change this line:
VITE_AI_PROVIDER="ollama"
```

**Step 5: Restart Server**

```bash
npm run dev
```

✅ **Done!** Your game now uses free local AI.

---

## 🧠 AI Agent Architecture

### Current System

```
React Components
  ↓
GameRoomView.tsx
  ↓
/api/gemini/evaluate-word ────→ Gemini API
/api/gemini/opponent-turn ────→ Gemini API
/api/gemini/word-hint ────────→ Gemini API
  ↓
Express Server (server.ts)
  ↓
Google Gemini AI
```

### New Flexible System

```
React Components
  ↓
GameRoomView.tsx
  ↓
Choose Provider:
  ├─→ /api/gemini/*  (Paid, cloud)
  ├─→ /api/ollama/*  (Free, local)
  └─→ Dictionary     (Free, fallback)
  ↓
Express Server
  ↓
AI Provider:
  ├─→ Gemini API
  ├─→ Ollama (localhost:11434)
  └─→ dictionary.json
```

### Agent Class Structure

```typescript
ShiritoriAgent
├── validateWord()
│   ├── Gemini provider
│   ├── Ollama provider
│   └── Dictionary fallback
│
├── getOpponentMove()
│   ├── Gemini provider
│   ├── Ollama provider
│   └── Dictionary fallback
│
└── getHints()
    ├── Gemini provider
    ├── Ollama provider
    └── Dictionary fallback
```

---

## 📚 AI Provider Comparison

| Feature              | Gemini       | Ollama          | Dictionary              |
| -------------------- | ------------ | --------------- | ----------------------- |
| **Cost**             | ~$0.01/day   | $0              | $0                      |
| **Setup**            | API key      | Install + model | None                    |
| **Speed**            | Fast (200ms) | Medium (1-3s)   | Instant (<10ms)         |
| **Accuracy**         | Excellent    | Good            | Perfect for known words |
| **Japanese Support** | Excellent    | Good (Qwen)     | Perfect                 |
| **Offline**          | ❌ No        | ✅ Yes          | ✅ Yes                  |
| **Privacy**          | Cloud        | Local           | Local                   |
| **Vocabulary**       | Unlimited    | Very large      | 500+ words              |
| **Creativity**       | High         | Medium          | None                    |

---

## 🛠️ API Endpoints

### Gemini Endpoints (Existing)

```typescript
POST / api / gemini / evaluate - word;
POST / api / gemini / opponent - turn;
POST / api / gemini / word - hint;
```

### Ollama Endpoints (NEW)

```typescript
POST / api / ollama / evaluate - word;
POST / api / ollama / opponent - turn;
POST / api / ollama / word - hint;
```

### Example: Validate Word

**Gemini:**

```typescript
const response = await fetch("/api/gemini/evaluate-word", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ word: "neko" }),
});
```

**Ollama:**

```typescript
const response = await fetch("/api/ollama/evaluate-word", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ word: "neko" }),
});
```

**Same response format!** Both return:

```json
{
  "valid": true,
  "word": "neko",
  "hiragana": "ねこ",
  "kanji": "猫",
  "romaji": "neko",
  "translation": "cat",
  "startSound": "ね",
  "endSound": "こ",
  "endsInN": false
}
```

---

## 🎯 Use Cases

### When to Use Each Provider

**Use Gemini:**

- ✅ Production deployment
- ✅ Need best accuracy
- ✅ Playing with advanced players
- ✅ Don't want to install anything
- ✅ Mobile/cloud hosting

**Use Ollama:**

- ✅ Development/testing
- ✅ Want 100% free
- ✅ Privacy concerns
- ✅ Offline gameplay
- ✅ Learning AI integration
- ✅ Have decent computer

**Use Dictionary:**

- ✅ Fallback when AI fails
- ✅ Instant response needed
- ✅ Basic word validation
- ✅ No internet available
- ✅ Ultra-low resource usage

---

## 🔧 Advanced: Multi-Agent System (Future)

Your current agent is a **single agent**. You can expand to **multi-agent** later:

### Potential Agents:

**1. Referee Agent**

- Validates Shiritori rules
- Checks word starts/ends
- Detects ん endings
- Checks duplicates

**2. Coach Agent**

- Gives strategic hints
- Explains mistakes
- Adjusts difficulty
- Tracks player progress

**3. Opponent Agent**

- Plays against you
- Uses strategy
- Remembers your patterns
- Adapts difficulty

**4. Translator Agent**

- Japanese ↔ English
- Explains kanji
- Teaches vocabulary
- Provides examples

**5. Voice Agent**

- Speech-to-text
- Pronunciation feedback
- Audio playback
- Accent detection

### Multi-Agent Frameworks (For Later)

**LangGraph** (Most powerful)

- Stateful agents with memory
- Tool usage
- Human-in-the-loop
- Complex workflows
- Best for serious apps

**CrewAI** (Easiest to understand)

- Role-based agents
- Multi-agent collaboration
- Simple API
- Good documentation

**Microsoft Semantic Kernel**

- Enterprise-grade
- Python/.NET
- Production-ready
- Good structure

---

## 💻 Free AI Models for Ollama

### Recommended for Japanese Games:

**Qwen (Best Choice)**

```bash
ollama pull qwen3        # Latest version
ollama pull qwen2.5:7b   # Larger, more accurate
```

- Excellent Japanese support
- Fast
- Good at structured JSON
- Apache 2.0 license

**Gemma (Google)**

```bash
ollama pull gemma4       # Latest
ollama pull gemma2:2b    # Lightweight
```

- Google's open model
- Decent Japanese
- Fast on low-end hardware
- Gemini license (check before commercial use)

**Mistral**

```bash
ollama pull mistral
```

- Fast and efficient
- Better for English
- Okay for Japanese
- Apache 2.0 license

**Phi (Microsoft)**

```bash
ollama pull phi3
```

- Very lightweight
- Runs on anything
- Decent accuracy
- MIT license

### Model Size Comparison:

| Model     | Size  | RAM Needed | Speed     | Japanese Quality     |
| --------- | ----- | ---------- | --------- | -------------------- |
| Qwen3     | 4.9GB | 8GB        | Fast      | Excellent ⭐⭐⭐⭐⭐ |
| Gemma2:2b | 1.6GB | 4GB        | Very Fast | Good ⭐⭐⭐⭐        |
| Phi3      | 2.3GB | 4GB        | Very Fast | Okay ⭐⭐⭐          |
| Mistral   | 4.1GB | 8GB        | Fast      | Good ⭐⭐⭐⭐        |

---

## 🧪 Testing Your AI

### Test Gemini:

```bash
curl -X POST http://localhost:3000/api/gemini/evaluate-word \
  -H "Content-Type: application/json" \
  -d '{"word":"neko"}'
```

### Test Ollama:

```bash
# Start Ollama first
ollama serve

# Test
curl -X POST http://localhost:3000/api/ollama/evaluate-word \
  -H "Content-Type: application/json" \
  -d '{"word":"neko"}'
```

### Expected Response:

```json
{
  "valid": true,
  "word": "neko",
  "hiragana": "ねこ",
  "kanji": "猫",
  "romaji": "neko",
  "translation": "cat",
  "startSound": "ね",
  "endSound": "こ",
  "endsInN": false
}
```

---

## 🔒 Security & Privacy

### Gemini (Cloud AI):

- ⚠️ Data sent to Google servers
- ⚠️ Requires API key in environment
- ✅ Google's privacy policy applies
- ✅ Encrypted in transit

### Ollama (Local AI):

- ✅ Everything runs locally
- ✅ No data leaves your computer
- ✅ No API keys needed
- ✅ 100% private

### Dictionary (Local):

- ✅ Just file lookup
- ✅ No network calls
- ✅ Instant
- ✅ No privacy concerns

---

## 💰 Cost Analysis

### Gemini Pricing:

- Free tier: 1,500 requests/day
- After that: ~$0.00075 per 1K chars
- Average game: ~10-20 requests
- **Daily cost: $0.01 - $0.05**
- **Monthly cost: ~$1-2**

### Ollama Pricing:

- **Cost: $0.00**
- Uses: CPU, RAM, maybe GPU
- Electricity: ~$0.01/hour (computer running)
- **Monthly cost: $0**

### Recommendation:

- **Development**: Use Ollama (free)
- **Production**: Use Gemini (better accuracy)
- **Personal use**: Either works!

---

## 🎓 Learning Path

### Phase 1: Current State ✅

- You already have Gemini working
- Word validation functional
- Bot opponents working
- Hints system operational

### Phase 2: Add Free Alternative (Now)

- Install Ollama
- Test local AI
- Switch between providers
- Compare results

### Phase 3: Hybrid System (Soon)

- Use Ollama for dev
- Use Gemini for production
- Dictionary as fallback
- Auto-switch on errors

### Phase 4: Multi-Agent (Future)

- Add LangGraph
- Create Coach Agent
- Add memory/state
- Track player progress

### Phase 5: Advanced (Later)

- Voice integration
- Custom fine-tuned models
- Real-time strategy
- Multiplayer AI referee

---

## 🚧 Troubleshooting

### Ollama Not Working:

**Problem: "Connection refused"**

```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama
ollama serve
```

**Problem: "Model not found"**

```bash
# List installed models
ollama list

# Pull the model
ollama pull qwen3
```

**Problem: "Out of memory"**

```bash
# Use smaller model
ollama pull gemma2:2b

# Or increase RAM in settings
```

### Gemini Not Working:

**Problem: "API key invalid"**

```bash
# Check .env file
cat .env | grep GEMINI

# Get new key from:
# https://makersuite.google.com/app/apikey
```

**Problem: "Rate limit exceeded"**

- Wait 60 seconds
- Or switch to Ollama temporarily

---

## 📖 Code Examples

### Using AI Agent in React:

```typescript
import { createShiritoriAgent } from "@/lib/aiAgent";

// Use Gemini (default)
const agent = createShiritoriAgent();

// Or use Ollama
const agent = createShiritoriAgent({ provider: "ollama" });

// Or use Dictionary
const agent = createShiritoriAgent({ provider: "dictionary" });

// Validate word
const result = await agent.validateWord("neko");
console.log(result.valid); // true
console.log(result.translation); // "cat"

// Get opponent move
const move = await agent.getOpponentMove("ね", "easy", []);
console.log(move.word); // "neko"

// Get hints
const hints = await agent.getHints("こ", []);
console.log(hints); // ["koi", "kome", "koinu"]
```

### Environment Configuration:

```env
# .env file

# Use Gemini (paid, accurate)
VITE_AI_PROVIDER="gemini"
GEMINI_API_KEY="your_api_key"

# OR use Ollama (free, local)
VITE_AI_PROVIDER="ollama"
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="qwen3"
```

---

## 🎉 Summary

### What You Have Now:

✅ **Gemini AI** (working, paid)

- Word validation
- Bot opponents
- Hints
- Best accuracy

✅ **Ollama AI** (new, free)

- Same features
- Runs locally
- 100% private
- No cost

✅ **Dictionary Fallback** (new, free)

- Basic validation
- Fast lookup
- Always works
- No setup

### How to Switch:

**Gemini → Ollama:**

1. Install Ollama
2. Pull model: `ollama pull qwen3`
3. Start: `ollama serve`
4. Change .env: `VITE_AI_PROVIDER="ollama"`
5. Restart server

**Ollama → Gemini:**

1. Change .env: `VITE_AI_PROVIDER="gemini"`
2. Restart server

### Best Practice:

- **Development**: Ollama (free, test without API costs)
- **Production**: Gemini (best accuracy, cloud)
- **Fallback**: Dictionary (always works)

---

## 🔗 Resources

**Ollama:**

- Website: https://ollama.com
- GitHub: https://github.com/ollama/ollama
- Models: https://ollama.com/library

**LangGraph (Future):**

- Docs: https://langchain-ai.github.io/langgraph/
- GitHub: https://github.com/langchain-ai/langgraph

**CrewAI (Future):**

- Website: https://www.crewai.com
- GitHub: https://github.com/joaomdmoura/crewAI

**Gemini AI:**

- Console: https://makersuite.google.com
- Pricing: https://ai.google.dev/pricing

---

## 🎯 Next Steps

1. **Try Ollama** (optional, free)
   - Install and test locally
   - Compare with Gemini
   - See which you prefer

2. **Keep using Gemini** (recommended)
   - Already working great
   - Best for your current needs
   - Very affordable

3. **Plan for future** (optional)
   - Consider multi-agent system
   - Add voice AI agent
   - Create coach agent

**Your game already has great AI! The new options give you flexibility and choice.** 🚀

がんばってください！🤖
