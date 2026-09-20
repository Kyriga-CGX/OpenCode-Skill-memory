import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };
  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      frontmatter[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return { frontmatter, content: match[2] };
};

let _bootstrapCache;

const mindSkillsDir = () => {
  const home = os.homedir();
  const envDir = process.env.OPENCODE_CONFIG_DIR;
  const configDir = envDir ? path.resolve(envDir) : path.join(home, '.config', 'opencode');
  return path.join(configDir, 'mind', 'skills');
};

const getBootstrapContent = () => {
  if (_bootstrapCache !== undefined) return _bootstrapCache;

  const skillPath = path.join(mindSkillsDir(), 'using-mind', 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    _bootstrapCache = null;
    return null;
  }

  const fullContent = fs.readFileSync(skillPath, 'utf8');
  const { content } = extractAndStripFrontmatter(fullContent);

  _bootstrapCache = `<EXTREMELY_IMPORTANT>
Hai "mind" attivo.

**La skill using-mind è già caricata qui sotto — NON richiamarla di nuovo con il tool skill.**

${content}
</EXTREMELY_IMPORTANT>`;
  return _bootstrapCache;
};

export default {
  id: "mind",
  server: async ({ client, directory }) => {
    return {
      config: async (config) => {
        config.skills = config.skills || {};
        config.skills.paths = config.skills.paths || [];
        const dir = mindSkillsDir();
        if (!config.skills.paths.includes(dir)) {
          config.skills.paths.push(dir);
        }
      },
      'experimental.chat.system.transform': async (_input, output) => {
        const bootstrap = getBootstrapContent();
        if (!bootstrap || !output.system?.length) return;
        const joined = output.system.join('\n');
        if (joined.includes('EXTREMELY_IMPORTANT')) return;
        output.system.unshift(bootstrap);
      }
    };
  }
};