# Audio Files for Study Garden

## Required Audio Files

Place the following audio files in this directory:

### Background Music (Loop)
1. **lofi.mp3** - Lo-fi beats music for studying
2. **rain.mp3** - Rain and nature sounds
3. **cafe.mp3** - Cafe ambience sounds
4. **piano.mp3** - Classical piano music

### Sound Effects
5. **timer-end.mp3** - Sound when countdown timer ends

## Audio Specifications

- **Format**: MP3 (recommended for browser compatibility)
- **Bitrate**: 128-192 kbps (balance between quality and file size)
- **Duration**: 
  - Background music: 5-10 minutes (will loop automatically)
  - Timer end sound: 2-5 seconds

## Where to Get Free Audio

### Background Music:
1. **YouTube Audio Library**: https://studio.youtube.com/
   - Free, no attribution required
   - Search for: "lofi", "rain sounds", "cafe ambience", "piano"

2. **Pixabay**: https://pixabay.com/music/
   - Free for commercial use
   - No attribution required

3. **Free Music Archive**: https://freemusicarchive.org/
   - Various licenses available
   - Check license before use

4. **Incompetech**: https://incompetech.com/
   - Free with attribution
   - Great for background music

### Sound Effects:
1. **Freesound**: https://freesound.org/
   - Search for: "bell", "chime", "notification"
   - Free with attribution

2. **Zapsplat**: https://www.zapsplat.com/
   - Free sound effects
   - Registration required

3. **Mixkit**: https://mixkit.co/free-sound-effects/
   - Free sound effects
   - No attribution required

## How to Add Audio Files

1. Download audio files from the sources above
2. Rename them according to the list above:
   - `lofi.mp3`
   - `rain.mp3`
   - `cafe.mp3`
   - `piano.mp3`
   - `timer-end.mp3`
3. Place them in this `audio/` directory
4. Refresh the application

## Alternative: Use Online Audio URLs

If you don't want to download files, you can modify `js/app.js` to use online URLs:

```javascript
const musicSources = {
  'lofi': 'https://example.com/lofi.mp3',
  'rain': 'https://example.com/rain.mp3',
  'cafe': 'https://example.com/cafe.mp3',
  'piano': 'https://example.com/piano.mp3',
  'none': ''
};
```

## Recommended Tracks

### Lo-fi Beats:
- "Lofi Study" by Ghostrifter Official
- "Chill Abstract" by Coma-Media

### Rain Sounds:
- "Rain and Thunder" - Nature sounds
- "Gentle Rain" - Ambient sounds

### Cafe Ambience:
- "Coffee Shop Ambience"
- "Cafe Background Noise"

### Classical Piano:
- "Gymnopédie No.1" by Erik Satie
- "Clair de Lune" by Claude Debussy

### Timer End Sound:
- "Bell Chime"
- "Soft Notification"
- "Gentle Alarm"

## Testing Audio

After adding files, test them by:
1. Opening the app in browser
2. Selecting each music option
3. Adjusting volume
4. Testing countdown timer completion

## Troubleshooting

**Audio not playing?**
- Check browser console for errors
- Verify file paths are correct
- Ensure files are in MP3 format
- Try clicking on the page first (browsers block autoplay)

**Audio too loud/quiet?**
- Adjust volume slider in app
- Or normalize audio files using Audacity

**Audio not looping?**
- The `<audio>` tag has `loop` attribute
- Check if file is corrupted

## License Compliance

Always check the license of audio files you use:
- ✅ Public Domain (CC0)
- ✅ Creative Commons (with attribution if required)
- ❌ Copyrighted music without permission

Add attribution in your app if required by the license.
