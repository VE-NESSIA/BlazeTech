import fs from 'fs';
import path from 'path';

const src = path.resolve('./src');

function listFiles(dir) {
    const res = [];
    for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res.push(...listFiles(p));
    else if (p.endsWith('.js')) res.push(p);
    }
    return res;
}

(async () => {
    const files = listFiles(src);
    for (const f of files) {
    try {
        await import('file://' + f);
        console.log('ok', f);
    } catch (err) {
        console.error('fail', f, err && err.message);
    }
    }
})();
