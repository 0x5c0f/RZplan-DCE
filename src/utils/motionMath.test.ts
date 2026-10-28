import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  parseCubicBezier,
  solveCubicBezier,
  getMotionPhaseInfo,
} from './motionMath';

describe('motionMath Unit Tests', () => {
  test('parseCubicBezier accurately parses Apple Ease bezier', () => {
    const pts = parseCubicBezier('cubic-bezier(0.16, 1, 0.3, 1)');
    assert.deepStrictEqual(pts, [0.16, 1, 0.3, 1]);
  });

  test('parseCubicBezier accurately parses Snappy Spring bezier with overshoot', () => {
    const pts = parseCubicBezier('cubic-bezier(0.34, 1.56, 0.64, 1)');
    assert.deepStrictEqual(pts, [0.34, 1.56, 0.64, 1]);
  });

  test('solveCubicBezier calculates boundary conditions', () => {
    const y0 = solveCubicBezier(0.16, 1, 0.3, 1, 0);
    const y1 = solveCubicBezier(0.16, 1, 0.3, 1, 1);
    assert.strictEqual(y0, 0);
    assert.strictEqual(y1, 1);
  });

  test('solveCubicBezier shows Apple Ease leads Linear in early burst phase', () => {
    // At t = 0.3 (30% duration), Apple Ease should be significantly above 0.30
    const progressAt30Percent = solveCubicBezier(0.16, 1, 0.3, 1, 0.3);
    assert.ok(
      progressAt30Percent > 0.65,
      `Expected Apple Ease at 30% time to be > 65%, got ${progressAt30Percent}`
    );
  });

  test('getMotionPhaseInfo provides clear phase diagnostics', () => {
    const burst = getMotionPhaseInfo(0.15, 0.45);
    assert.strictEqual(burst.phaseKey, 'burst');

    const landing = getMotionPhaseInfo(0.75, 0.95);
    assert.strictEqual(landing.phaseKey, 'landing');

    const settled = getMotionPhaseInfo(0.99, 1.0);
    assert.strictEqual(settled.phaseKey, 'settled');
  });
});
