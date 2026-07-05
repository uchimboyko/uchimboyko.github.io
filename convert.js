const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, 'main.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const pieces = ['ладья.webp', 'конь.webp', 'слон.webp', 'королева.webp', 'король.webp', 'пешка.webp'];
pieces.forEach(p => {
    const imgPath = path.join(__dirname, p);
    if(fs.existsSync(imgPath)) {
        const b64 = fs.readFileSync(imgPath).toString('base64');
        const dataUri = 'data:image/webp;base64,' + b64;
        html = html.split("url('" + p + "')").join("url('" + dataUri + "')");
    }
});
fs.writeFileSync(htmlPath, html);
console.log("Done");
