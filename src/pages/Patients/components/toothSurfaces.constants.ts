export const TOOTH_SURFACE_IDS = ['buccal', 'distal', 'lingual', 'mesial', 'occlusal'] as const

export type ToothSurfaceId = (typeof TOOTH_SURFACE_IDS)[number]

export const TOOTH_SURFACE_PATHS: Record<ToothSurfaceId, string> = {
  buccal: 'M 5 5 L 95 5 L 62 38 L 38 38 Z',
  distal: 'M 95 5 L 95 95 L 62 62 L 62 38 Z',
  lingual: 'M 5 95 L 95 95 L 62 62 L 38 62 Z',
  mesial: 'M 5 5 L 38 38 L 38 62 L 5 95 Z',
  occlusal: 'M 38 38 L 62 38 L 62 62 L 38 62 Z',
}
