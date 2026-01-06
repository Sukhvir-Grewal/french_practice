# French Pronunciation Learning App - Development Prompt

Create a mobile-first French pronunciation learning web application using Next.js 14+ with App Router, TypeScript, and Tailwind CSS. The app should have a Duolingo-inspired design with an interactive, colorful, and engaging interface.

## Core Requirements

### 1. Technology Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS for styling
- Shadcn/ui components for UI elements
- Web Speech API for text-to-speech functionality
- Responsive design (mobile-first)

### 2. French Sounds Data Structure

Create the following sound categories with their phonetic representations and example words:

**Sound 1: ô, au, eau**
- Phonetic: /o/
- Examples: eau (water), jeune (young), bleu (blue), faux (false), homme (man), revoir (goodbye)

**Sound 2: au, eau**
- Examples: faux (false), eau (water)

**Sound 3: an, am, en, em → ã**
- Phonetic: /ã/
- Examples: charman (charming), vent (wind), langue (language)

**Sound 4: ch → sh**
- Phonetic: /ʃ/
- Examples: chat (cat), chien (dog)

**Sound 5: ain, aim, ein, em, in, im, yn, ym → ẽ**
- Phonetic: /ɛ̃/
- Examples: vin (wine), pain (bread), malin (clever), matin (morning)

**Sound 6: ui → we**
- Examples: oui (yes), nuit (night)

**Sound 7: ou → Ø**
- Phonetic: /u/
- Examples: rouge (red), rue (street), où (where)

**Sound 8: on, om → õ**
- Phonetic: /õ/
- Examples: ronde (round), ∫oma (noel)

**Sound 9: eau → o**
- Examples: chapeau (hat), bateau (boat), château (castle), gâteau (cake)

**Sound 10: oi → wa**
- Phonetic: /wa/
- Examples: poisson (fish), oiseau (bird)
- Note: Surrounded by two vowels, it becomes 2 sounds

## Features to Implement

### A. Learning Mode
1. **Sound Cards Display**
   - Show one sound category at a time
   - Display the phonetic representation prominently
   - List all example words with their English translations
   - Each word has a speaker icon button next to it
   - Clicking the speaker button plays the French pronunciation using Web Speech API with French locale

2. **Navigation**
   - Tab-based or swipeable navigation between different sounds
   - Visual indicators showing current sound (e.g., 1/10)
   - Previous/Next buttons with smooth transitions
   - Progress indicator showing which sounds have been studied

3. **Card Design**
   - Large, colorful cards similar to Duolingo
   - Clear typography with different font sizes for emphasis
   - Animated transitions when switching between sounds
   - Use bright, friendly colors (greens, blues, yellows, oranges)
   - Rounded corners and shadows for depth

### B. Practice/Test Mode
1. **Random Word Selection**
   - Button to start practice mode
   - Randomly select words from all sound categories
   - Display the French word without translation initially
   - Show a "Hear Pronunciation" button (speaker icon)
   - Show a "Reveal Translation" button
   - Show "I Got It!" and "Try Again" buttons
   - After clicking either button, show the next random word
   - Display counter showing progress (e.g., "Word 3 of 10")

2. **Practice Session**
   - Default: 10 random words per session
   - Option to continue for more words or end session
   - Show score/progress at the end of session
   - Celebration animation when completing a session
   - Option to retry words marked as "Try Again"

3. **Interactive Elements**
   - Smooth fade-in animations for new words
   - Confetti or success animation after completing session
   - Sound effects for button clicks (optional)
   - Visual feedback on button interactions (scale, color change)

### C. UI/UX Design Guidelines
1. **Duolingo-Inspired Theme**
   - Primary color: Bright green (#58CC02 or similar)
   - Secondary colors: Blue, yellow, orange, red for variety
   - White/light gray background
   - Large, friendly buttons with rounded corners
   - Playful icons and illustrations
   - Clear, sans-serif fonts (Inter, Nunito, or similar)

2. **Mobile-First Layout**
   - Full-width cards on mobile
   - Touch-friendly button sizes (min 44px height)
   - Bottom navigation bar with icons
   - Sticky header with progress
   - Smooth scroll behavior
   - Swipe gestures for navigation (optional enhancement)

3. **Components to Create**
   - `SoundCard` - displays a sound category with examples
   - `WordItem` - individual word with speaker button
   - `PracticeCard` - card for practice mode
   - `NavigationTabs` - switch between sounds
   - `ProgressBar` - visual progress indicator
   - `SpeakerButton` - reusable button for pronunciation
   - `ModeToggle` - switch between Learn and Practice modes
   - `SessionComplete` - completion screen with stats

### D. Technical Implementation Details

1. **Text-to-Speech Implementation**
```typescript
// Use Web Speech API with French locale
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.8; // Slightly slower for learning
  window.speechSynthesis.speak(utterance);
};
```

2. **State Management**
- Use React hooks (useState, useEffect) for simple state
- Consider Zustand or Context API if needed for global state
- Track: current sound, practice mode status, user progress

3. **File Structure**
```
app/
  page.tsx (main landing/mode selection)
  learn/
    page.tsx (learning mode)
  practice/
    page.tsx (practice mode)
components/
  SoundCard.tsx
  WordItem.tsx
  PracticeCard.tsx
  NavigationTabs.tsx
  ProgressBar.tsx
  SpeakerButton.tsx
  ModeToggle.tsx
  SessionComplete.tsx
lib/
  sounds-data.ts (sound categories and words)
  speech.ts (text-to-speech utilities)
types/
  index.ts (TypeScript interfaces)
```

4. **Responsive Breakpoints**
- Mobile: < 640px (primary focus)
- Tablet: 640px - 1024px
- Desktop: > 1024px (optional enhancement)

### E. Additional Features (Nice to Have)
- Dark mode toggle
- Sound playback speed control (slow/normal/fast)
- Bookmark favorite words
- Track learning streaks
- Local storage to save progress
- Share progress on social media
- Voice recording to compare pronunciation (advanced)

## Development Instructions
1. Set up Next.js project with TypeScript and Tailwind CSS
2. Install Shadcn/ui and configure components
3. Create the data structure for French sounds in a separate file
4. Build the Learning Mode first with all sound cards
5. Implement the text-to-speech functionality and test thoroughly
6. Build the Practice Mode with random word selection
7. Add animations and transitions for better UX
8. Optimize for mobile devices and test on various screen sizes
9. Add error handling for speech synthesis
10. Test accessibility (keyboard navigation, screen readers)

## Expected User Flow
1. User lands on homepage with two large buttons: "Learn Sounds" and "Practice"
2. **Learn Mode**: User browses through 10 sound categories, listens to pronunciations
3. **Practice Mode**: User clicks "Start Practice", sees random words, tries to pronounce them, clicks speaker to hear correct pronunciation, marks themselves as correct/incorrect
4. After 10 words, user sees completion screen with option to continue or return to main menu

## Success Criteria
- ✅ All 10 sounds are clearly displayed with examples
- ✅ Text-to-speech works correctly for all French words
- ✅ Interface is colorful, engaging, and Duolingo-like
- ✅ Mobile-responsive and touch-friendly
- ✅ Practice mode randomly selects words and tracks progress
- ✅ Smooth animations and transitions throughout
- ✅ Intuitive navigation between sounds and modes
- ✅ Fast loading and performant on mobile devices

---

Build this application with attention to detail, focusing on creating a delightful and effective learning experience. Prioritize clean code, reusable components, and excellent user experience.