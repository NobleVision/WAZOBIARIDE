# Quick Start: Mapbox Integration Setup

## Steps to Get Your Map Working in 5 Minutes

### 1. Get Your Mapbox Access Token

1. Go to [mapbox.com](https://www.mapbox.com/) and sign up (free)
2. Navigate to your **Account** → **Tokens**
3. Click **Create a token**
4. Give it a name (e.g., "WaZoBiaRide Dev")
5. Copy the token (starts with `pk.`)

### 2. Add Your Token to .env File

Open `client/.env` and replace the placeholder:

```bash
# Before
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here

# After (paste your actual token)
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2...
```

### 3. Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

### 4. Test the Map

1. Open your browser to `http://localhost:5173`
2. Navigate to **Rider Dashboard** (or any dashboard with a map)
3. You should see:
   - Real interactive map of South West Nigeria
   - Lagos and Ibadan clearly visible
   - Smooth 3D perspective
   - Pan/zoom controls in the bottom-right

## Troubleshooting

### "Mapbox access token is required" error
- ✅ Verify token in `.env` starts with `pk.`
- ✅ Make sure you restarted the dev server
- ✅ Check that `.env` is in the `client/` folder

### Blank map or gray screen
- ✅ Check browser console (F12) for errors
- ✅ Verify token has no extra spaces
- ✅ Try a different token from Mapbox

### Wrong location
- ✅ This is expected! Map defaults to Lagos (6.5244°N, 3.3792°E)
- ✅ When markers are added, map will auto-fit to show them

## What's Working Now?

✅ **Real Nigeria geography** - No more SVG demo map  
✅ **Interactive** - Pan, zoom, rotate with mouse/touch  
✅ **Professional styling** - Mapbox Streets V12  
✅ **Custom markers** - Green/gold brand colors  
✅ **Animations** - Smooth flyTo transitions  
✅ **Zero dashboard changes** - All existing code works unchanged  

## Next Steps

1. **Explore the map** - Try the Rider, Driver, and Admin dashboards
2. **Add markers** - Your existing mock data should show automatically
3. **Customize style** - See `docs/MAPBOX_INTEGRATION.md` for options
4. **Get production token** - Create a separate token for deployment

## Key Files Changed

```
client/
├── .env                          # ✅ NEW - Add your Mapbox token here
├── .env.example                   # ✅ NEW - Reference format
├── src/
│   ├── main.tsx                   # ✅ MODIFIED - Added Mapbox CSS
│   └── components/shared/
│       └── MapView.tsx           # ✅ REPLACED - Now uses Mapbox
docs/
└── MAPBOX_INTEGRATION.md          # ✅ NEW - Full documentation
```

## Need Help?

- 📖 **Full docs**: `docs/MAPBOX_INTEGRATION.md`
- 🌐 **Mapbox docs**: [mapbox.com](https://docs.mapbox.com/)
- 💬 **Issues**: Open a GitHub issue

---

**Done! Your WaZoBiaRide app now has professional-grade maps! 🎉**