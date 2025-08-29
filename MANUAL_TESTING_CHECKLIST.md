# Manual Testing Checklist for Tower Defense Game

## Pre-Test Setup

### Environment Setup
- [ ] Verify Bun runtime is installed and working (`bun --version`)
- [ ] Start development server (`bun --hot ./index.ts`)
- [ ] Access game at http://localhost:3000
- [ ] Open browser developer tools for console monitoring
- [ ] Test in multiple browsers: Chrome, Firefox, Safari, Edge
- [ ] Test on different devices: Desktop, tablet, mobile

### Initial Load Testing
- [ ] Game loads without console errors
- [ ] All assets load properly (no 404 errors)
- [ ] Level selector appears correctly
- [ ] Audio context initializes (check for audio warnings)
- [ ] No JavaScript errors in console
- [ ] Page loads within 3 seconds on standard connection

---

## Core Game Functionality

### Level Selection
- [ ] All 6 levels are displayed with correct thumbnails
- [ ] Level difficulty stars display correctly (1-3 stars)
- [ ] Only level 1 is unlocked initially
- [ ] Completed levels show completion badge
- [ ] High scores display for completed levels
- [ ] Level cards are clickable and responsive
- [ ] Hover effects work on level cards
- [ ] Level names and descriptions are accurate

### Game Initialization
- [ ] Selected level loads without errors
- [ ] Game canvas renders at correct size
- [ ] Level grid displays with correct path visualization
- [ ] Starting money displays correctly (varies by level)
- [ ] Lives counter shows 10 initially
- [ ] Wave counter shows "Wave 1 of X"
- [ ] Tower selection UI appears
- [ ] Game controls are visible and accessible

---

## Tower Defense Mechanics

### Tower Placement
- [ ] Can place Basic Tower ($50) on valid tower slots
- [ ] Can place Sniper Tower ($100) on valid tower slots  
- [ ] Can place Rapid-Fire Tower ($75) on valid tower slots
- [ ] Cannot place towers on path cells
- [ ] Cannot place towers on spawn/goal cells
- [ ] Cannot place towers without sufficient money
- [ ] Cannot place towers on top of existing towers
- [ ] Tower range preview shows on hover
- [ ] Placed towers appear with correct visual styling
- [ ] Money decreases correctly after tower placement

### Tower Behavior
- [ ] Basic towers target closest enemy in range (90px)
- [ ] Sniper towers have longer range (180px) and higher damage
- [ ] Rapid-fire towers shoot faster but with less damage
- [ ] Towers rotate/aim toward targets
- [ ] Towers respect fire rate limitations
- [ ] Towers only target alive enemies
- [ ] Multiple towers can target same enemy
- [ ] Towers stop shooting when no targets in range

### Projectile System
- [ ] Projectiles spawn at tower position
- [ ] Projectiles move toward targeted enemies
- [ ] Projectiles hit enemies and deal damage
- [ ] Projectiles disappear on impact
- [ ] Projectiles don't follow dead enemies
- [ ] Multiple projectiles can exist simultaneously
- [ ] Projectile speed appears consistent and smooth

### Enemy Behavior
- [ ] Enemies spawn at designated spawn points
- [ ] Enemies follow predefined paths correctly
- [ ] Enemies move at consistent speed
- [ ] Enemies take damage when hit by projectiles
- [ ] Enemy health bars decrease visually (if implemented)
- [ ] Enemies die when health reaches 0
- [ ] Dead enemies reward money ($5 default)
- [ ] Enemies that reach goal decrease lives by 1
- [ ] Enemy movement is smooth across different frame rates

---

## Wave Management

### Wave Progression
- [ ] Waves start when "Start Wave" button is clicked
- [ ] Enemy spawn timing follows wave configuration
- [ ] Correct number of enemies spawn per wave
- [ ] Wave counter updates during gameplay
- [ ] Wave completion detection works correctly
- [ ] Next wave becomes available after current wave ends
- [ ] Final wave completion triggers victory condition

### Game State Management
- [ ] Pause functionality works correctly
- [ ] Game can be resumed from pause
- [ ] Restart functionality resets game to initial state
- [ ] Victory screen appears after all waves completed
- [ ] Defeat screen appears when lives reach 0
- [ ] Victory/defeat screens allow returning to level select
- [ ] Progress is saved correctly on completion

---

## User Interface

### HUD Elements
- [ ] Money counter updates in real-time
- [ ] Lives counter updates when enemies escape
- [ ] Wave progress indicator is accurate
- [ ] Tower selection buttons are responsive
- [ ] Selected tower type is visually highlighted
- [ ] Start wave button enables/disables appropriately
- [ ] Pause button works and updates text
- [ ] Camera controls function properly

### Visual Feedback
- [ ] Muzzle flash effects appear when towers shoot
- [ ] Explosion effects appear when enemies die
- [ ] Impact effects appear when projectiles hit
- [ ] Particle effects don't cause performance issues
- [ ] Visual effects are synchronized with game events
- [ ] No visual glitches or artifacts
- [ ] Animations are smooth at 60fps

### Audio System
- [ ] Tower placement sound plays
- [ ] Tower shooting sounds play
- [ ] Enemy death sounds play
- [ ] Wave start audio cues play
- [ ] Victory/defeat sounds play
- [ ] Audio doesn't cut out or glitch
- [ ] Audio volume is appropriate
- [ ] Audio works after browser interaction requirement

---

## Camera and Controls

### Camera Functionality
- [ ] Camera can be panned by dragging
- [ ] Camera zoom in/out works with mouse wheel
- [ ] Camera zoom controls work with buttons
- [ ] Camera reset centers view on game area
- [ ] Camera bounds prevent excessive panning
- [ ] Camera transforms apply correctly to all rendered elements
- [ ] Touch devices support pan and pinch-to-zoom

### Input Handling
- [ ] Mouse clicks register correctly on canvas
- [ ] Mouse hover shows tower placement preview
- [ ] Keyboard shortcuts work (if implemented)
- [ ] Touch input works on mobile devices
- [ ] Input doesn't conflict between canvas and UI elements
- [ ] No input lag or delayed responses

---

## Performance Testing

### Frame Rate
- [ ] Game maintains 60fps during normal gameplay
- [ ] Performance remains stable with many entities
- [ ] No significant frame drops during combat
- [ ] Smooth animation during camera movement
- [ ] Particle effects don't cause frame drops
- [ ] Performance consistent across different browsers

### Memory Usage
- [ ] Memory usage remains stable over time
- [ ] No memory leaks during extended gameplay
- [ ] Game handles entity cleanup properly
- [ ] Browser memory usage stays reasonable
- [ ] No performance degradation in long sessions

### Resource Loading
- [ ] Game assets load efficiently
- [ ] No unnecessary network requests
- [ ] Level transitions are smooth
- [ ] No blocking operations during gameplay

---

## Cross-Browser Compatibility

### Browser-Specific Testing
- [ ] **Chrome**: Full functionality works
- [ ] **Firefox**: All features operational
- [ ] **Safari**: Canvas and audio work properly
- [ ] **Edge**: Complete compatibility
- [ ] **Mobile Chrome**: Touch input responsive
- [ ] **Mobile Safari**: iOS-specific behaviors work

### Feature Support
- [ ] Canvas 2D rendering works in all browsers
- [ ] Web Audio API functions properly
- [ ] localStorage saving works
- [ ] requestAnimationFrame performance is good
- [ ] Touch events work on mobile browsers

---

## Responsive Design

### Screen Size Testing
- [ ] **Desktop (1920x1080)**: Full layout displays correctly
- [ ] **Laptop (1366x768)**: UI scales appropriately
- [ ] **Tablet (768x1024)**: Portrait orientation works
- [ ] **Mobile (414x896)**: Game remains playable
- [ ] **Small mobile (320x568)**: Minimum viable experience

### Layout Adaptation
- [ ] Game canvas scales to fit screen
- [ ] UI elements remain accessible at all sizes
- [ ] Text remains readable on small screens
- [ ] Touch targets are appropriately sized
- [ ] No horizontal scrolling required

---

## Accessibility Testing

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Keyboard shortcuts work consistently
- [ ] Focus indicators are visible
- [ ] No keyboard traps exist

### Screen Reader Support
- [ ] Important game state changes announced
- [ ] Interactive elements have proper labels
- [ ] Game status communicated to assistive technology
- [ ] Error messages are announced
- [ ] Navigation is logical for screen readers

### Visual Accessibility
- [ ] Sufficient color contrast ratios
- [ ] Game doesn't rely solely on color for information
- [ ] Text is readable at various zoom levels
- [ ] Visual indicators supplement audio cues

---

## Error Handling

### Network Errors
- [ ] Graceful handling of connection issues
- [ ] Appropriate error messages for failed requests
- [ ] Game continues to function offline (if applicable)

### Game Errors
- [ ] Invalid tower placement handled gracefully
- [ ] Corrupt save data doesn't crash game
- [ ] Missing assets don't prevent gameplay
- [ ] JavaScript errors don't break entire game

### User Errors
- [ ] Clear feedback for invalid actions
- [ ] Undo functionality where appropriate
- [ ] Helpful guidance for new players

---

## Save System

### Progress Persistence
- [ ] Level completion saves correctly
- [ ] High scores persist between sessions
- [ ] Level unlock progression works
- [ ] Last played level is remembered
- [ ] Save data survives browser refresh
- [ ] Multiple browser tabs don't conflict

### Data Integrity
- [ ] Save data validates correctly
- [ ] Corrupt data handled gracefully
- [ ] No data loss during normal gameplay
- [ ] Privacy considerations met (local storage only)

---

## Stress Testing

### High Load Scenarios
- [ ] Game with maximum enemies (100+) on screen
- [ ] All towers shooting simultaneously
- [ ] Extended play sessions (30+ minutes)
- [ ] Rapid tower placement/removal
- [ ] Quick successive level transitions

### Edge Cases
- [ ] Pausing during critical game moments
- [ ] Rapid clicking on UI elements
- [ ] Browser tab switching during gameplay
- [ ] Window resizing during active game
- [ ] Low battery conditions on mobile

---

## Final Quality Assurance

### Polish and User Experience
- [ ] Game feels responsive and fun to play
- [ ] Visual feedback is satisfying
- [ ] Audio enhances the experience
- [ ] Learning curve is appropriate
- [ ] Victory feels earned and rewarding
- [ ] No significant bugs affect gameplay

### Documentation and Help
- [ ] Game rules are clear without explanation
- [ ] Tower differences are obvious from UI
- [ ] Progression system is intuitive
- [ ] Error messages are helpful
- [ ] Game provides adequate feedback

---

## Sign-off Checklist

### Pre-Release Requirements
- [ ] All critical bugs fixed
- [ ] Performance meets requirements (60fps)
- [ ] Cross-browser compatibility verified
- [ ] Mobile experience is acceptable
- [ ] Accessibility requirements met
- [ ] Save system works reliably

### Quality Standards Met
- [ ] Game is fun and engaging
- [ ] No game-breaking bugs exist
- [ ] Audio-visual polish is complete
- [ ] User interface is intuitive
- [ ] Performance is consistent
- [ ] Code quality standards met

---

**Testing Notes:**
- Record any issues found during testing
- Note performance metrics for each test scenario
- Document browser-specific behaviors
- Track user feedback during testing sessions
- Verify fixes don't introduce regressions

**Testers:** _[Name and date]_  
**Environment:** _[Browser, OS, device details]_  
**Build Version:** _[Git commit hash or version number]_