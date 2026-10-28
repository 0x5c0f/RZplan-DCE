import rawPresets from './presets.json' with { type: 'json' };

export type DesignStyle = 'linear-dark' | 'minimal-clean' | 'neo-brutalist' | 'glassmorphism' | 'saas-dense';
export type MotionTone = 'apple-ease' | 'snappy-spring' | 'micro-delight' | 'subdued';

export interface PresetRecipe {
  id: string;
  title: string;
  shortTitle?: string;
  category: string;
  rawInput: string;
  designerPrompt: string;
  style: DesignStyle;
  motionTone: MotionTone;
  icon?: string;
  highlightTags: string[];
  isQuickPick?: boolean;
  archetype?: 'dashboard' | 'dragdrop' | 'card3d' | 'expand' | 'stack' | 'streaming' | 'command-palette' | string;
  sandboxData?: Record<string, any>;
}

export const PRESET_RECIPES: PresetRecipe[] = rawPresets as PresetRecipe[];

export const QUICK_PICK_PRESETS: PresetRecipe[] = PRESET_RECIPES.filter(
  (p) => p.isQuickPick !== false
);
