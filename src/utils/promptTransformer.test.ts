import test from 'node:test';
import assert from 'node:assert/strict';
import {
  synthesizeDesignerPrompt,
  PRESET_RECIPES,
  STYLE_DEFINITIONS,
  MOTION_DEFINITIONS,
} from './promptTransformer';

test('PRESET_RECIPES includes dashboard loading and modular drag & drop', () => {
  assert.ok(PRESET_RECIPES.length >= 7);
  const dashboardLoading = PRESET_RECIPES.find((p) => p.id === 'dashboard-loading');
  assert.ok(dashboardLoading, 'dashboard-loading preset must exist');
  assert.match(dashboardLoading.designerPrompt, /平滑递增/);
  assert.match(dashboardLoading.designerPrompt, /Ease-Out/);

  const dragDrop = PRESET_RECIPES.find((p) => p.id === 'modular-drag-drop');
  assert.ok(dragDrop, 'modular-drag-drop preset must exist');
  assert.match(dragDrop.designerPrompt, /自由拖拽/);
  assert.match(dragDrop.designerPrompt, /弹性吸附/);

  const flip3D = PRESET_RECIPES.find((p) => p.id === 'card-3d-flip');
  assert.ok(flip3D, 'card-3d-flip preset must exist');
  assert.match(flip3D.designerPrompt, /180°/);

  const spatialExpand = PRESET_RECIPES.find((p) => p.id === 'card-spatial-expand');
  assert.ok(spatialExpand, 'card-spatial-expand preset must exist');
  assert.match(spatialExpand.designerPrompt, /共享元素/);

  const stack3D = PRESET_RECIPES.find((p) => p.id === 'cards-3d-stack');
  assert.ok(stack3D, 'cards-3d-stack preset must exist');
  assert.match(stack3D.designerPrompt, /堆叠/);
});

test('synthesizeDesignerPrompt handles raw dashboard prompt with high fidelity', () => {
  const result = synthesizeDesignerPrompt(
    'dashboard添加一些动效，让页面看起来更加平滑，每个标签采用标签卡片的形式显示。'
  );

  assert.ok(result.enhancedPrompt.length > 50);
  assert.match(result.enhancedPrompt, /Dashboard/i);
  assert.ok(result.cursorPrompt.includes('Principal UI/UX'));
  assert.ok(result.v0Prompt.length > 50);
  assert.ok(result.markdownPRD.includes('# PRD'));
  assert.ok(result.motionSpec.springStiffness > 0);
  assert.ok(result.tags.length > 0);
});

test('synthesizeDesignerPrompt customizes motion spec and styles', () => {
  const result = synthesizeDesignerPrompt('做一个商品购买弹窗', {
    style: 'neo-brutalist',
    motionTone: 'snappy-spring',
  });

  assert.match(result.designTokens.radius, /8px/);
  assert.equal(result.motionSpec.springStiffness, 420);
  assert.ok(result.codeRecipe.tailwindClasses.length > 0);
  assert.ok(result.intentAnalysis.identifiedGaps.length >= 3);
});

test('STYLE_DEFINITIONS and MOTION_DEFINITIONS are comprehensive', () => {
  assert.ok(STYLE_DEFINITIONS['linear-dark']);
  assert.ok(STYLE_DEFINITIONS['minimal-clean']);
  assert.ok(MOTION_DEFINITIONS['apple-ease']);
  assert.ok(MOTION_DEFINITIONS['snappy-spring']);
});
