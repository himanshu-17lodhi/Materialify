import { describe, expect, it } from 'vitest';
import {
  resolveFileIconName,
  resolveFolderIcon,
  resolveFolderIconName,
} from './index';
import {
  DEFAULT_FILE_ICON,
  DEFAULT_FOLDER_ICON,
  DEFAULT_FOLDER_OPEN_ICON,
} from '@app/util';

const emptyIcons: any[] = [];
const mockPlugin = {
  getIconPackManager: () => ({
    getIconPacks: (): any[] => emptyIcons,
    getPreloadedIcons: (): any[] => emptyIcons,
  }),
} as any;

describe('Material Icon Theme resolver', () => {
  it('resolves exact filenames before extensions', () => {
    expect(resolveFileIconName(mockPlugin, 'package.json')).toBe('MiNodejs');
    expect(resolveFileIconName(mockPlugin, 'tsconfig.json')).toBe('MiTsconfig');
    expect(resolveFileIconName(mockPlugin, 'docker-compose.yml')).toBe(
      'MiDocker',
    );
    expect(resolveFileIconName(mockPlugin, 'README.md')).toBe('MiReadme');
  });

  it('resolves file extensions and compound extensions', () => {
    expect(resolveFileIconName(mockPlugin, '.env')).toBe('MiTune');
    expect(resolveFileIconName(mockPlugin, 'script.py')).toBe('MiPython');
    expect(resolveFileIconName(mockPlugin, 'Component.tsx')).toBe('MiReactTs');
    expect(resolveFileIconName(mockPlugin, 'schema.schema.json')).toBe(
      'MiJsonSchema',
    );
  });

  it('resolves semantic filenames for markdown notes before markdown fallback', () => {
    expect(resolveFileIconName(mockPlugin, 'type.js.md')).toBe('MiJavascript');
    expect(resolveFileIconName(mockPlugin, 'component.tsx.md')).toBe(
      'MiReactTs',
    );
    expect(resolveFileIconName(mockPlugin, 'Drawing.excalidraw.md')).toBe(
      'MiExcalidraw',
    );
    expect(resolveFileIconName(mockPlugin, 'docker-compose.yml.md')).toBe(
      'MiDocker',
    );
    expect(resolveFileIconName(mockPlugin, 'notes.md')).toBe('MiMarkdown');
    expect(resolveFileIconName(mockPlugin, 'randomfile.md')).toBe('MiMarkdown');
  });

  it('resolves special config filenames from path suffixes', () => {
    expect(resolveFileIconName(mockPlugin, 'project/.github/FUNDING.yml')).toBe(
      'MiGithubSponsors',
    );
    expect(resolveFileIconName(mockPlugin, 'tailwind.config.js')).toBe(
      'MiTailwindcss',
    );
  });

  it('resolves folder names and nested folder suffixes', () => {
    expect(resolveFolderIconName(mockPlugin, '.github')).toBe('MiFolderGithub');
    expect(resolveFolderIconName(mockPlugin, 'src')).toBe('MiFolderSrc');
    expect(resolveFolderIconName(mockPlugin, 'src', true)).toBe(
      'MiFolderSrcOpen',
    );
    expect(resolveFolderIconName(mockPlugin, 'node_modules')).toBe(
      'MiFolderNode',
    );
    expect(resolveFolderIconName(mockPlugin, 'project/.github/workflows')).toBe(
      'MiFolderGhWorkflows',
    );
  });

  it('resolves VS Code defaults for unmatched files and folders', () => {
    expect(resolveFileIconName(mockPlugin, 'unknown.nopeext')).toBe(
      DEFAULT_FILE_ICON,
    );
    expect(resolveFolderIconName(mockPlugin, 'qwertyunmapped')).toBe(
      DEFAULT_FOLDER_ICON,
    );
    expect(resolveFolderIconName(mockPlugin, 'qwertyunmapped', true)).toBe(
      DEFAULT_FOLDER_OPEN_ICON,
    );
    expect(resolveFolderIconName(mockPlugin, 'parent/qwertyunmapped')).toBe(
      DEFAULT_FOLDER_ICON,
    );
  });

  it('switches folder icon IDs between base and open variants dynamically', () => {
    expect(resolveFolderIcon(mockPlugin, 'MiFolderPython', false)).toBe(
      'MiFolderPython',
    );
    expect(resolveFolderIcon(mockPlugin, 'MiFolderPython', true)).toBe(
      'MiFolderPythonOpen',
    );
    expect(resolveFolderIcon(mockPlugin, 'MiFolderPythonOpen', false)).toBe(
      'MiFolderPython',
    );
    expect(resolveFolderIcon(mockPlugin, 'MiFolderCursorLight', true)).toBe(
      'MiFolderCursorLight',
    );
  });
});
