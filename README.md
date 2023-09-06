# special-folders

To get folder paths of special folders like desktop, downloads, pictures, ...

Inspired by [window.showDirectoryPicker](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker), [Environment.GetFolderPath](https://learn.microsoft.com/en-us/dotnet/api/system.environment.getfolderpath?view=net-7.0) and [downloads-folder](https://github.com/juliangruber/downloads-folder)



## Usage

```js
import path from 'node:path';
import fs from 'node:fs';
import {getFolderPath, SpecialFolder, SpecialFolderOption} from 'special-folders';


let downloadsPath = getFolderPath(SpecialFolder.Downloads);
if(!downloadsPath){
  throw new Error('Cannot get downloads folder which exists');
}

// or

let downloadsPath = getFolderPath(SpecialFolder.Downloads, SpecialFolderOption.DoNotVerify);
if(!fs.existsSync(downloadsPath)) { // rare but still trying
  fs.mkdirSync(downloadsPath, {recursive: true});
}

```



Notes for Windows users:

When installing on Windows, the postinstall script of this package will install additional dependency [registry-js](https://www.npmjs.com/package/registry-js), which is not listed in package.json.



## License

[MIT](./LICENSE)