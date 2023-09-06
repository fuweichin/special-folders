/**
 * Derived from https://github.com/juliangruber/downloads-folder
 */
import {join as pathJoin} from 'node:path';
import {existsSync, mkdirSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {env} from 'node:process';
import os from 'node:os';
const registry = (os.platform() === 'win32') ? (await import('registry-js')).default : null;

/**
 * @readonly
 * @enum {string}
 */
export const SpecialFolder = {
  Desktop: 'desktop',
  Documents: 'documents',
  Downloads: 'downloads',
  Music: 'music',
  Pictures: 'pictures',
  Videos: 'videos',
};
/**
 * @readonly
 * @enum {string}
 */
export const SpecialFolderOption = {
  DoNotVerify: 'do-not-verify',
  Create: 'create',
  None: ''
};

let specialFolders;
/**
 * @param {SpecialFolder} id 
 * @param {SpecialFolderOption} options
 * @returns {string}
 */
export function getFolderPath(id, option = '') {
  if (!specialFolders) {
    try {
      specialFolders = getFolderPaths();
    } catch (e) {
      specialFolders = {};
    }
  }
  let value;
  switch (id) {
    case 'desktop':
    case 'documents':
    case 'downloads':
    case 'music':
    case 'pictures':
    case 'videos': value = specialFolders[id]; break;
    default: throw new Error('Invalid id ' + id);
  }
  if (option === SpecialFolderOption.DoNotVerify)
    return value;
  if (!existsSync(value)) {
    if (option === SpecialFolderOption.Create) { // The path to the folder is created if it does not already exist
      mkdirSync(value, {recursive: true});
    } else { // If the folder does not exist, an empty string is returned
      return '';
    }
  } 
  return value;
}
/**
 * not-verified paths of special folders
 * @returns {Object}
 */
export function getFolderPaths() {
  let base = os.homedir();
  let obj = {
    'desktop': pathJoin(base, 'Desktop'),
    'documents': pathJoin(base, 'Documents'),
    'downloads': pathJoin(base, 'Downloads'),
    'music': pathJoin(base, 'Music'),
    'pictures': pathJoin(base, 'Pictures'),
    'videos': pathJoin(base, 'Videos')
  };
  switch (os.platform()) {
    case 'win32': {
      let map = {
        'Desktop': 'desktop',
        'Personal': 'documents',
        '{374DE290-123F-4565-9164-39C4925E467B}': 'downloads',
        'My Music': 'music',
        'My Pictures': 'pictures',
        'My Video': 'videos',
      };
      const entries = registry.enumerateValues(registry.HKEY.HKEY_CURRENT_USER,
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders');
      for (let e of entries) {
        let id = map[e.name];
        if (id) {
          obj[id] = e.data.replace(/%([A-Za-z0-9_]+)%/g, ($0, $1) => (env[$1] || $0));
        }
      }
      break;
    }
    case 'darwin': {
      obj['videos'] = pathJoin(base, 'Movies');
      break;
    }
    case 'linux':
    default: {
      // https://wiki.archlinux.org/title/XDG_user_directories
      // read /etc/xdg/user-dirs.defaults, ~/.config/user-dirs.dirs
      let map = {
        XDG_DESKTOP_DIR: 'desktop',
        XDG_DOCUMENTS_DIR: 'documents',
        XDG_DOWNLOAD_DIR: 'downloads',
        XDG_MUSIC_DIR: 'music',
        XDG_PICTURES_DIR: 'pictures',
        XDG_VIDEOS_DIR: 'videos',
      };
      let value;
      for (let name of Object.keys(map)) {
        let id = map[name];
        try {
          value = execSync('xdg-user-dir ' + name.slice(4, -4), {encoding: 'utf8'}).trim();
          if (value) {
            obj[id] = value;
          }
        } catch (_) {
          break;
        }
      }
      break;
    }
  }
  return obj;
}
