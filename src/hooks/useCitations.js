import { citations } from '../data/citations-registry'

export function useCitations(keys) {
  if (!keys) return []
  const keyArr = Array.isArray(keys) ? keys : [keys]
  return keyArr.map(k => citations[k]).filter(Boolean)
}

export function getCitation(key) {
  return citations[key] || null
}
