import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_FILES = new Set([
  'products.json',
  'purchase-orders.json',
  'deliveries.json',
  'payments.json',
  'documents.json',
  'settings.json'
]);

/** Dev-only API: POST /__api/local-data writes JSON files to public/data/ */
export function localDataApiPlugin() {
  const dataDir = path.resolve(__dirname, 'public', 'data');

  return {
    name: 'local-data-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__api/local-data')) {
          return next();
        }

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ available: true }));
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const body = JSON.parse(Buffer.concat(chunks).toString());

          for (const [filename, content] of Object.entries(body)) {
            if (!ALLOWED_FILES.has(filename)) continue;
            await fs.writeFile(
              path.join(dataDir, filename),
              `${JSON.stringify(content, null, 2)}\n`,
              'utf8'
            );
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
