# Sound Assets

## Required Files

### bear-roar.mp3

- **Purpose**: Startup sound that plays on first user interaction
- **Duration**: ~2 seconds
- **Requirements**: Royalty-free bear roar sound effect
- **Format**: MP3

## Suggested Sources for Royalty-Free Sound

- freesound.org (Creative Commons)
- pixabay.com/sound-effects
- zapsplat.com

## Implementation Notes

- The sound plays once per browser session on first user interaction
- Users can disable the sound via the sidebar toggle
- Sound preference is persisted in localStorage
- Session playback state is tracked in sessionStorage
