import {existsSync} from 'node:fs';
import {getFolderPaths, getFolderPath, SpecialFolder} from '../lib/special-folders.js';

describe('special-folders', () => {
  it('getFolderPath', () => {
    [
      SpecialFolder.Desktop,
      SpecialFolder.Documents,
      SpecialFolder.Downloads,
      SpecialFolder.Music,
      SpecialFolder.Pictures,
      SpecialFolder.Videos
    ].forEach((id) => {
      let verifiedPath = getFolderPath(id);
      console.log(id + ': ' + verifiedPath);
      if (verifiedPath) {
        expect(existsSync(verifiedPath)).toBe(true);
      }
    });
  });
  it('getFolderPaths', () => {
    let obj = getFolderPaths();
    console.log(obj);
    expect(Object.keys(obj).length).toBe(6);
  });
});
