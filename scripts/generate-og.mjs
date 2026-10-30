import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="g"><stop stop-color="#328350"/><stop offset="1" stop-color="#050a08"/></radialGradient></defs>
<rect width="1200" height="630" fill="#050a08"/><ellipse cx="990" cy="70" rx="520" ry="430" fill="url(#g)"/>
<g fill="none" stroke="#6cff85" opacity=".18"><circle cx="1050" cy="220" r="150"/><circle cx="1050" cy="220" r="220"/><circle cx="1050" cy="220" r="290"/></g>
<path d="m92 72 20 12v24l-20 12-20-12V84Z" fill="none" stroke="#6cff85" stroke-width="4"/>
<g font-family="Segoe UI, sans-serif"><text x="134" y="104" fill="#edf5ef" font-size="26">Osvaldo Cintra García</text>
<text x="74" y="266" fill="#f8faf9" font-size="77" font-weight="600" letter-spacing="-4">Thoughtful interfaces.</text>
<text x="74" y="356" fill="#b6c6ba" font-size="77" font-weight="600" letter-spacing="-4">Powerful systems.</text>
<text x="78" y="440" fill="#a8b7ad" font-size="25">Fullstack Developer · UI/UX · Montevideo, Uruguay</text>
<rect x="78" y="510" width="158" height="44" rx="22" fill="#6cff85"/><text x="103" y="539" fill="#102a17" font-size="18">Let’s build.</text>
</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('Generated public/og.png (1200 × 630)');
