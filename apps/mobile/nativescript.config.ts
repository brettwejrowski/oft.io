import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'io.placewise.app',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
} satisfies NativeScriptConfig;
