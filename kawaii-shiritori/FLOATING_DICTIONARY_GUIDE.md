# 📖 Floating Dictionary Guide

Complete guide to using the **floating dictionary** feature with Picture-in-Picture mode, opacity controls, and hide/show functionality.

---

## 🎯 Features

### ✨ Display Modes

**1. Full Mode (Default)**
- Full-size dictionary with search
- Complete word definitions
- Multiple results
- All features accessible

**2. Picture-in-Picture (PiP) Mode**
- Compact 280px × 320px window
- Shows only selected word
- Minimal interference with gameplay
- Perfect for quick reference

**3. Minimized Mode**
- Floating icon with Japanese text (辞書)
- Draggable anywhere
- Click to restore

**4. Hidden Mode**
- Small icon in bottom-right corner
- Click to show dictionary
- Completely out of the way

### 🎨 Opacity Control

- Adjustable transparency (30% - 100%)
- Slider control in footer
- Works in all modes
- Real-time preview

### 📍 Positioning

- **Draggable** - Grab the header to move
- **Fixed position** - Stays where you put it
- **Smart boundaries** - Can't drag off-screen
- **Default position** - Top-right corner

---

## 🚀 How to Use

### Opening the Dictionary

The floating dictionary can be opened from:
- Game interface button
- Keyboard shortcut (if implemented)
- Component integration

### Modes & Controls

#### **Picture-in-Picture Mode**

**How to enter:**
1. Click the PiP icon (📺) in the header
2. Dictionary shrinks to compact size
3. Shows only the currently selected word

**Perfect for:**
- Playing while learning
- Quick word reference
- Minimizing screen clutter
- Mobile/tablet gameplay

**Features in PiP:**
- Word display (kanji + reading)
- Top 2 definitions
- Audio pronunciation button
- Opacity slider
- Exit PiP button
- Hide button

#### **Hiding the Dictionary**

**How to hide:**
1. Click the eye-off icon (👁️) in any mode
2. Dictionary minimizes to small icon
3. Icon appears in bottom-right corner

**How to show:**
1. Click the floating icon
2. Dictionary restores to previous state

**Use when:**
- Playing competitively
- Need full screen space
- Taking breaks

#### **Opacity Control**

**Location:**
- Footer of full/PiP modes
- Slider with eye icon

**How to adjust:**
1. Drag slider left/right
2. See real-time transparency
3. Percentage shown (30% - 100%)

**Recommended settings:**
- **100%** - Default, fully visible
- **70-80%** - See game behind dictionary
- **50-60%** - Minimal interference
- **30-40%** - Ultra-transparent, emergency

---

## 💡 Usage Scenarios

### Scenario 1: Learning While Playing

```
1. Start game
2. Open dictionary (full mode)
3. Click PiP icon (📺)
4. Drag to corner of screen
5. Set opacity to 70%
6. Play game with quick word reference
```

**Result:** Compact dictionary doesn't block game, words visible when needed.

### Scenario 2: Serious Gameplay

```
1. Dictionary open
2. Click hide icon (👁️)
3. Play game with full screen
4. Click floating icon when need word
5. Search and hide again
```

**Result:** Full screen for gameplay, instant access to dictionary.

### Scenario 3: Study Mode

```
1. Open dictionary (full mode)
2. Set opacity to 90%
3. Position on side of screen
4. Keep expanded view
5. Learn while playing casually
```

**Result:** Full dictionary features while playing.

---

## 🎮 Controls Reference

### Header Buttons (Left to Right)

| Icon | Action | Description |
|------|--------|-------------|
| 📺 | PiP Mode | Switch to compact view |
| ⛶ | Expand/Minimize | Toggle window size |
| 👁️ | Hide | Minimize to corner icon |
| ▼ | Minimize | Show floating icon |
| ✕ | Close | Close dictionary |

### Keyboard Interactions

- **Drag header** - Move dictionary
- **Search input** - Type to search
- **Enter** - Submit search
- **Slider** - Adjust opacity

---

## 🎨 Visual States

### Full Mode
```
┌──────────────────────────┐
│ 📖 Japanese Dictionary   │ ← Draggable header
├──────────────────────────┤
│ [Search input]    [🔍]   │ ← Search bar
├──────────────────────────┤
│                          │
│  Word Results            │
│  • Main word             │
│  • Definitions           │
│  • Other results         │
│                          │
├──────────────────────────┤
│ Jisho.org   [👁️ ▬▬▬] 80% │ ← Opacity control
└──────────────────────────┘
Width: 400px (normal) / 600px (expanded)
Height: Up to 500px / 80vh
```

### PiP Mode
```
┌──────────────┐
│ 📖 辞書   [⛶][👁️] │ ← Compact header
├──────────────┤
│ 言葉          │
│ ことば        │
│              │
│ 1. word      │
│ 2. language  │
│              │
├──────────────┤
│ [👁️ ▬▬▬] 70% │ ← Opacity slider
└──────────────┘
Width: 280px
Height: Up to 320px
```

### Hidden State
```
                    Screen

                    
                    
                    
                    
                    
              [📖] ← Click to show
```

### Minimized State
```
[📖 辞書] ← Draggable, click to expand
```

---

## 💻 Technical Details

### Component Props

```typescript
interface FloatingDictionaryProps {
  onClose?: () => void;  // Optional close callback
}
```

### State Management

```typescript
const [isPipMode, setIsPipMode] = useState(false);      // PiP mode
const [isMinimized, setIsMinimized] = useState(false);   // Minimized
const [isHidden, setIsHidden] = useState(false);         // Hidden
const [opacity, setOpacity] = useState(1);               // 0.3 - 1.0
const [position, setPosition] = useState({ x, y });      // Position
```

### Features

- **Framer Motion** animations
- **Jisho.org API** integration
- **Drag & drop** positioning
- **Responsive** sizing
- **Speech synthesis** for pronunciation
- **Backdrop blur** effect

---

## 🎯 Best Practices

### For Players

✅ **DO:**
- Use PiP mode during active gameplay
- Adjust opacity to see game behind
- Hide dictionary when not needed
- Drag to comfortable position
- Use audio pronunciation

❌ **DON'T:**
- Block game interface completely
- Use full mode in competitive play
- Keep at 100% opacity when playing
- Leave in center of screen

### For Developers

✅ **DO:**
- Import and mount component
- Provide close callback
- Test all modes
- Verify mobile responsiveness
- Check z-index conflicts

❌ **DON'T:**
- Override z-index (9999)
- Block pointer events
- Interfere with drag behavior
- Remove opacity control

---

## 🔧 Integration Example

```tsx
import FloatingDictionary from './components/FloatingDictionary';

function GameComponent() {
  const [showDict, setShowDict] = useState(false);

  return (
    <>
      {/* Game UI */}
      <button onClick={() => setShowDict(true)}>
        📖 Dictionary
      </button>

      {/* Floating Dictionary */}
      {showDict && (
        <FloatingDictionary 
          onClose={() => setShowDict(false)} 
        />
      )}
    </>
  );
}
```

---

## 📊 Performance

### Optimizations

- ✅ Backdrop blur for modern feel
- ✅ Motion animations (60fps)
- ✅ Lazy API calls (on search)
- ✅ Debounced drag updates
- ✅ Conditional rendering

### Resource Usage

- **Initial load:** ~15KB component
- **Memory:** Minimal (state only)
- **Network:** Only on search
- **CPU:** Low (animations optimized)

---

## 🎓 Tips & Tricks

### Tip 1: Quick Toggle

Set opacity to 40% and use PiP mode for:
- Always-visible reference
- Minimal distraction
- Quick glances during play

### Tip 2: Study Sessions

Use full mode with:
- 90% opacity
- Expanded view
- Positioned on side
- Multiple results visible

### Tip 3: Mobile Gaming

On mobile/tablet:
- Start in hidden mode
- Show only when needed
- Use PiP for quick reference
- Higher opacity (70%+)

### Tip 4: Streaming/Recording

For streamers:
- Position in corner
- 80% opacity
- PiP mode recommended
- Clean, professional look

---

## 🐛 Troubleshooting

### Dictionary Not Moving

**Problem:** Can't drag dictionary

**Solutions:**
- Grab the **header** (top bar only)
- Not in Hidden mode
- Check for z-index conflicts

### Opacity Not Changing

**Problem:** Slider doesn't work

**Solutions:**
- Check browser support
- Verify CSS `opacity` property
- Try different browser

### Dictionary Behind Game

**Problem:** Can't see dictionary

**Solutions:**
- Check z-index (should be 9999)
- Verify not hidden
- Increase opacity

### PiP Mode Empty

**Problem:** No word showing in PiP

**Solutions:**
- Search for a word first
- Select result
- Then switch to PiP mode

---

## 🎉 Summary

The floating dictionary now has:

✅ **4 display modes** - Full, PiP, Minimized, Hidden  
✅ **Opacity control** - 30% to 100% transparency  
✅ **Draggable positioning** - Move anywhere  
✅ **Smart boundaries** - Can't go off-screen  
✅ **Backdrop blur** - Modern glass effect  
✅ **Compact PiP mode** - 280px minimal interference  
✅ **Quick hide/show** - Bottom-right icon  
✅ **Smooth animations** - Framer Motion  
✅ **Real-time opacity** - See changes instantly  

**Perfect for:**
- Learning while playing
- Quick word lookups
- Study sessions
- Competitive gameplay
- Streaming/recording

**The dictionary now stays out of your way while remaining accessible!** 📖✨

---

*Last updated: July 2026*  
*Component: FloatingDictionary.tsx*  
*Status: ✅ Production Ready*
