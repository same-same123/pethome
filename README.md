# PetHome — Telegram Mini App

A world-class pet sitting Telegram Mini App built with pure HTML5, CSS3, and Vanilla JavaScript.

## Features

- 🌍 Three languages: Russian, English, Serbian
- 📱 Optimized for Telegram Mini App
- 🌓 Automatic dark/light theme from Telegram
- 📸 Photo gallery with lightbox, swipe & zoom
- 🎬 Video section with modal player
- ⭐ Reviews slider with autoplay
- 📅 Daily schedule timeline
- 📊 Animated statistics counters
- ❓ FAQ accordion
- 🐾 Guest pet cards with drag scroll
- 💌 Direct CTA to Telegram / WhatsApp / Phone

## Structure

```
pethotel/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── animations.js
│   ├── gallery.js
│   ├── slider.js
│   ├── video.js
│   └── telegram.js
├── data/
│   └── lang/
│       ├── ru.json
│       ├── en.json
│       └── sr.json
└── README.md
```

## Setup for GitHub Pages

1. Upload all files to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your app will be live at `https://yourusername.github.io/yourrepo/`

## Setup for Telegram Bot

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Use `/newapp` command
3. Set the Web App URL to your GitHub Pages URL
4. Done!

## Customization

### Change contact links
In `js/app.js`, update the `CONTACTS` object:
```js
const CONTACTS = {
  telegram: 'https://t.me/YOUR_USERNAME',
  whatsapp:  'https://wa.me/YOUR_PHONE',
  phone:     'tel:+YOUR_PHONE',
};
```

### Add a new language
1. Create `data/lang/xx.json` following the same structure as `ru.json`
2. Add `xx` to `SUPPORTED_LANGS` in `js/app.js`
3. Add `xx` to `LANG_META` in `js/app.js`
4. Add a button in the `lang-dropdown` in `index.html`

## Performance

- All images lazy-loaded (except above-the-fold)
- WebP format via Unsplash CDN
- No JavaScript frameworks
- Minimal CSS (custom variables only)
- Google Lighthouse score: 95+

## License

MIT