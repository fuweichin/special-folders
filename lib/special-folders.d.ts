export enum SpecialFolder {
  Desktop = 'desktop',
  Documents = 'documents',
  Downloads = 'downloads',
  Music = 'music',
  Pictures = 'pictures',
  Videos = 'videos',
}

export enum SpecialFolderOption {
  DoNotVerify = 'do-not-verify',
  Create = 'create',
  None = ''
}

export declare function getFolderPath(id:SpecialFolder, option?:SpecialFolderOption):string;

export declare function getFolderPaths():Record<SpecialFolder, string>;
