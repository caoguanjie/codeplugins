export interface MarketplaceJson {
  name: string;
  description: string;
  owner: {
    name: string;
    email: string;
  };
  plugins: PluginEntry[];
}

export interface PluginEntry {
  name: string;
  description: string;
  version: string;
  source: string;
  author: {
    name: string;
    email: string;
  };
}

export interface PluginJson {
  name: string;
  version: string;
  description: string;
}

export interface SettingsJson {
  enabledPlugins?: Record<string, boolean>;
  extraKnownMarketplaces?: Record<string, {
    source: {
      source: string;
      path: string;
    };
  }>;
  [key: string]: unknown;
}

export interface InstallOptions {
  yes?: boolean;
}

export interface RemoveOptions {
  yes?: boolean;
}

export interface SyncOptions {
  yes?: boolean;
}
