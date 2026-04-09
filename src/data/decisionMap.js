import { decisionTrees } from './mindmap'

const buildRegistry = (node, parent = null, map = {}) => {
  map[node.id] = {
    ...node,
    parent,
    next: node.children?.map((child) => child.id) ?? [],
  }
  node.children?.forEach((child) => buildRegistry(child, node.id, map))
  return map
}

const treeRoot = decisionTrees.comparison
const nodesMap = buildRegistry(treeRoot)
const rootDecisionId = treeRoot.id

export const getPathToNode = (nodeId) => {
  if (!nodeId || !nodesMap[nodeId]) return [rootDecisionId]
  const path = []
  let cursor = nodesMap[nodeId]
  while (cursor) {
    path.unshift(cursor.id)
    cursor = cursor.parent ? nodesMap[cursor.parent] : null
  }
  return path
}

const normalizeSlug = (value) =>
  value
    ?.toLowerCase()
    .replace(/[’'"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const TEST_ALIAS = {
  'z-test': 'z-test',
  'one-sample-t-test': 'one-sample-t',
  'independent-t-test': 't-test',
  'welch-t-test': 'welch-t-test',
  'mann-whitney-u': 'mann-whitney-u',
  'mann-whitney': 'mann-whitney-u',
  'paired-t-test': 'paired-t-test',
  'wilcoxon': 'wilcoxon',
  'wilcoxon-signed-rank': 'wilcoxon',
  anova: 'anova',
  'welch-anova': 'welch-anova',
  'kruskal-wallis': 'kruskal-wallis',
  'tukey-hsd': 'tukey',
  bonferroni: 'bonferroni',
  'dunns-test': 'dunn',
  'chi-square': 'chi-square',
  'fishers-exact': 'fishers-exact',
  mcnemar: 'mcnemar',
}

const safePush = (target, path) => {
  if (target && nodesMap[target]) {
    path.push(target)
    return true
  }
  return false
}

const normalizeGroups = (value) => {
  if (!value) return '2'
  const normalized = value.toString().toLowerCase()
  if (normalized.includes('3') || normalized.includes('multiple') || normalized.includes('3+')) return '3+'
  if (normalized.includes('1')) return '1'
  return '2'
}

const normalizeNormality = (value) => {
  if (!value) return 'unknown'
  const normalized = value.toString().toLowerCase()
  if (normalized.includes('not') || normalized.includes('non') || normalized.includes('no')) return 'not_normal'
  if (normalized.includes('yes') || normalized.includes('normal')) return 'normal'
  return 'unknown'
}

const normalizePairing = (value) => {
  if (!value) return 'independent'
  const normalized = value.toString().toLowerCase()
  if (normalized.includes('paired') || normalized.includes('match')) return 'paired'
  return 'independent'
}

export const mapAIToPath = (ai) => {
  const path = [rootDecisionId]
  if (!ai) return path

  const normalizedTest = normalizeSlug(ai.recommended_test)
  if (normalizedTest && TEST_ALIAS[normalizedTest]) {
    return getPathToNode(TEST_ALIAS[normalizedTest])
  }

  const dataType = ai.data_type === 'categorical' ? 'categorical' : 'numerical'
  safePush(dataType, path)

  if (dataType === 'numerical') {
    const groups = normalizeGroups(ai.groups)
    const groupMap = {
      '1': 'one-group',
      '2': 'two-groups',
      '3+': 'three-groups',
    }
    safePush(groupMap[groups], path)

    const normality = normalizeNormality(ai.normality)

    if (groups === '1') {
      safePush(normality === 'normal' ? 'z-test' : 'one-sample-t', path)
    } else if (groups === '2') {
      const pairing = normalizePairing(ai.pairing)
      safePush(pairing, path)
      if (pairing === 'independent') {
        const nextLeaf = normality === 'not_normal' ? 'mann-whitney-u' : normality === 'normal' ? 't-test' : 'welch-t-test'
        safePush(nextLeaf, path)
      } else {
        const nextLeaf = normality === 'not_normal' ? 'wilcoxon' : 'paired-t-test'
        safePush(nextLeaf, path)
      }
    } else if (groups === '3+') {
      const nextLeaf = normality === 'not_normal' ? 'kruskal-wallis' : normality === 'unknown' ? 'welch-anova' : 'anova'
      safePush(nextLeaf, path)
    }
  } else {
    const catGroups = normalizeGroups(ai.groups)
    if (normalizePairing(ai.pairing) === 'paired') {
      safePush('paired-categorical', path)
      safePush('mcnemar', path)
    } else {
      const nextDecision = catGroups === '1' ? 'one-variable' : 'two-variables'
      safePush(nextDecision, path)
      const normality = normalizeNormality(ai.normality)
      if (nextDecision === 'two-variables') {
        const chiNode = normality === 'not_normal' ? 'fishers-exact' : 'chi-square'
        safePush(chiNode, path)
      } else {
        safePush('chi-square', path)
      }
    }
  }

  return path
}

export { nodesMap, rootDecisionId }
