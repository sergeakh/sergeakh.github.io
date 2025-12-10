import { createConfig } from 'p1-front-configs/eslint.common.config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createConfig({ projectRoot: __dirname });
