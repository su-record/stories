export const CATEGORY_LABELS = {
  methodology: 'Methodology',
  'dev-log': 'Dev Log',
  tech: 'Tech',
  story: 'Story',
  insight: 'Insights',
}

export const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS)

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category
}
