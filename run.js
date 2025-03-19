const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// Directory to store uploaded images
const uploadDir = path.join(__dirname, 'uploads');
const passcode = 'WsaPl2!Xc';

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;

    if (filePath === './') filePath = './index.html';
    if (filePath === './legal') filePath = './legal/legal.html';
    if (filePath === './legal/privacy') filePath = './legal/privacy.html';
    if (filePath === './legal/tos') filePath = './legal/tos.html';
    if (filePath === './invite') filePath = './invite.html';
    if (filePath === './discord') filePath = './discord.html';

    // Serve uploaded images
    if (req.url.startsWith('/uploads/')) {
        const filePath = path.join(uploadDir, req.url.replace('/uploads/', ''));
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('404 Not Found');
            }

            const extname = path.extname(filePath);
            const mimeTypes = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.bmp': 'image/bmp',
            };

            res.writeHead(200, { 'Content-Type': mimeTypes[extname] || 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
        });
        return;
    }

    // Handle image upload
    if (req.method === 'POST' && req.url === '/upload') {
        const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'File upload failed', details: err.message }));
            }

            const submittedPasscode = fields.passcode?.[0];
            if (submittedPasscode !== passcode) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Forbidden: Invalid passcode' }));
            }

            const uploadedFile = files.image?.[0];
            if (!uploadedFile || !uploadedFile.filepath) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No valid file uploaded' }));
            }

            const safeFilename = `${generateRandomFilename(10)}${path.extname(uploadedFile.originalFilename || 'unknown')}`;
            const newFilePath = path.join(uploadDir, safeFilename);

            fs.rename(uploadedFile.filepath, newFilePath, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to save file' }));
                }

                const imageUrl = `https://${req.headers.host}/i/${safeFilename}`;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: imageUrl }));
            });
        });
        return;
    }

    // Serve Open Graph preview for images
    if (req.url.startsWith('/i/')) {
        const filePath = path.join(uploadDir, req.url.replace('/i/', ''));
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('404 Not Found');
            }

            const imageUrl = `http://${req.headers.host}/uploads/${path.basename(filePath)}`;
            const html = `
                <html>
                    <head>
                        <meta property="og:title" content="Fluxxy's Image Stash" />
                        <meta property="og:description" content="^-^" />
                        <meta property="og:image" content="${imageUrl}" />
                        <meta property="og:type" content="website" />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:image" content="${imageUrl}" />
                        <meta name="robots" content="noindex, nofollow" />
                        <title>Image</title>
                        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                        <meta http-equiv="Pragma" content="no-cache" />
                        <meta http-equiv="Expires" content="0" />
                    </head>
                    <body>
                        <img src="${imageUrl}" alt="Uploaded Image" style="display: block; margin: auto;" />
                    </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
        return;
    }

    // Serve static files
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
        } else {
            const mimeTypes = {
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.html': 'text/html',
                '.png': 'image/png',
            };

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                } else {
                    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
    });
});

// Function to generate a random alphanumeric string
function generateRandomFilename(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const PORT = 21942;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});