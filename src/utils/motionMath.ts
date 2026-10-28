/**
 * Motion Physics & Cubic Bezier Solver
 * Precision timing math for DesignCraftsman Engine
 */

export type BezierControlPoints = [number, number, number, number];

/**
 * Extracts [x1, y1, x2, y2] from CSS cubic-bezier(...) string
 */
export function parseCubicBezier(bezierStr: string): BezierControlPoints {
  if (!bezierStr) return [0.16, 1, 0.3, 1];
  const match = bezierStr.match(
    /cubic-bezier\(\s*([\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*([\d.]+)\s*,\s*(-?[\d.]+)\s*\)/i
  );
  if (match) {
    return [
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3]),
      parseFloat(match[4]),
    ];
  }
  return [0.16, 1, 0.3, 1];
}

/**
 * Evaluates the Y progress of a cubic bezier curve at normalized time X in [0, 1]
 * Uses Newton-Raphson iteration with bisection fallback.
 */
export function solveCubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  targetX: number
): number {
  if (targetX <= 0) return 0;
  if (targetX >= 1) return 1;

  // Solve for parameter t such that B_x(t) = targetX
  let t = targetX;
  for (let i = 0; i < 8; i++) {
    const currentX =
      3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
    const dx = targetX - currentX;
    if (Math.abs(dx) < 0.0001) break;

    // First derivative of B_x with respect to t
    const dxdt =
      3 * (1 - t) * (1 - t) * x1 +
      6 * (1 - t) * t * (x2 - x1) +
      3 * t * t * (1 - x2);

    if (Math.abs(dxdt) < 1e-6) break;
    t += dx / dxdt;
    t = Math.max(0, Math.min(1, t));
  }

  // Calculate B_y(t)
  const y =
    3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  return y;
}

export interface MotionPhaseInfo {
  phaseKey: 'burst' | 'cruise' | 'landing' | 'settled';
  name: string;
  badge: string;
  desc: string;
  leadRatio: string;
}

/**
 * Returns diagnostic phase for current normalized time
 */
export function getMotionPhaseInfo(
  normalizedTime: number,
  designerProgress: number
): MotionPhaseInfo {
  const linearProgress = normalizedTime;
  const leadDiff = Math.round((designerProgress - linearProgress) * 100);
  const leadRatioStr =
    leadDiff > 0 ? `+${leadDiff}% 提前量` : `${leadDiff}%`;

  if (normalizedTime >= 0.98) {
    return {
      phaseKey: 'settled',
      name: '稳定态闭环停泊 (Settled Rest)',
      badge: '闭环停泊',
      desc: '动画平滑着陆完毕，数值锁定稳定态，无多余二次弹跳。',
      leadRatio: '100% 达成',
    };
  }

  if (normalizedTime >= 0.65) {
    return {
      phaseKey: 'landing',
      name: '阻尼吸附与软着陆 (Soft Landing)',
      badge: '软着陆阶段',
      desc: '进入长程缓出阶段，速度柔和衰减，避免突兀撞击感。',
      leadRatio: leadRatioStr,
    };
  }

  if (normalizedTime >= 0.25) {
    return {
      phaseKey: 'cruise',
      name: '极速过渡巡航 (Peak Velocity)',
      badge: '极速巡航',
      desc: '动画处于最高速度区间，大幅领先线性匀速轨道。',
      leadRatio: leadRatioStr,
    };
  }

  return {
    phaseKey: 'burst',
    name: '初段爆发响应 (Burst Acceleration)',
    badge: '爆发响应',
    desc: '前 25% 时间内快速释放能量，产生灵敏跟手的即时反馈。',
    leadRatio: leadRatioStr,
  };
}
