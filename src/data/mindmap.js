export const decisionTrees = {
  comparison: {
    id: 'comparison',
    type: 'decision',
    label: 'Comparison (Hypothesis Testing)',
    short: 'Pick the right test based on data type, groups, and assumptions.',
    question: 'What is your data type?',
    children: [
      {
        id: 'data-type',
        type: 'decision',
        label: 'Data Type?',
        short: 'Numerical vs categorical outcomes drive different paths.',
        question: 'Which measurement type describes the target?',
        children: [
          {
            id: 'numerical',
            type: 'decision',
            label: 'Numerical Targets',
            short: 'Split by number of groups and pairing.',
            question: 'How many groups and pairing assumptions?',
            children: [
              {
                id: 'one-group',
                type: 'decision',
                label: 'One Group',
                short: 'Choose Z-test or one-sample t-test based on sample size.',
                question: 'Is your sample large or small?',
                children: [
                  {
                    id: 'z-test',
                    type: 'leaf',
                    label: 'Z-test (n ≥ 30)',
                    short: 'Large samples; variance known or approximated.',
                    detail: {
                      when: 'n ≥ 30, population variance known or sample variance stable.',
                      assumptions: ['normality (CLT)', 'known variance'],
                      why: 'Use when the central limit theorem guarantees normality.',
                    },
                  },
                  {
                    id: 'one-sample-t',
                    type: 'leaf',
                    label: 'One-sample t-test (n < 30)',
                    short: 'Small samples compare mean to a baseline.',
                    detail: {
                      when: 'n < 30 or slightly non-normal data.',
                      assumptions: ['normality', 'random sampling'],
                      why: 'The t-distribution adjusts for small-sample uncertainty.',
                    },
                  },
                ],
              },
              {
                id: 'two-groups',
                type: 'decision',
                label: 'Two Groups',
                short: 'Independent or paired comparison dictates the test.',
                children: [
                  {
                    id: 'independent',
                    type: 'decision',
                    label: 'Independent',
                    short: 'Assess normality and variance equality.',
                    children: [
                      {
                        id: 't-test',
                        type: 'leaf',
                        label: 't-test',
                        short: 'Normal + equal variance.',
                        detail: {
                          when: 'Independent samples, normal data, equal spread.',
                          assumptions: ['normality', 'equal variance', 'independence'],
                          why: 'Classic parametric comparison of means.',
                        },
                      },
                      {
                        id: 'welch-t-test',
                        type: 'leaf',
                        label: 'Welch t-test',
                        short: 'Normal but unequal variance.',
                        detail: {
                          when: 'Independent, normal data with unequal variance.',
                          assumptions: ['normality', 'independence'],
                          why: 'Welch adjusts degrees of freedom for unequal spreads.',
                        },
                      },
                      {
                        id: 'mann-whitney-u',
                        type: 'leaf',
                        label: 'Mann-Whitney U',
                        short: 'Non-parametric alternative.',
                        detail: {
                          when: 'Continuous but non-normal, independent samples.',
                          assumptions: ['ordinal data', 'independence'],
                          why: 'Rank-based test that avoids normality.',
                        },
                      },
                    ],
                  },
                  {
                    id: 'paired',
                    type: 'decision',
                    label: 'Paired',
                    short: 'Repeated measures or matched pairs.',
                    children: [
                      {
                        id: 'paired-t-test',
                        type: 'leaf',
                        label: 'Paired t-test',
                        short: 'Normal differences within pairs.',
                        detail: {
                          when: 'Same units measured twice with normal differences.',
                          assumptions: ['normal differences', 'paired data'],
                          why: 'Controls for within-unit variability.',
                        },
                      },
                      {
                        id: 'wilcoxon',
                        type: 'leaf',
                        label: 'Wilcoxon signed-rank',
                        short: 'Non-parametric paired test.',
                        detail: {
                          when: 'Paired data without normal differences.',
                          assumptions: ['symmetry', 'paired'],
                          why: 'Uses ranks to bypass distributional assumptions.',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'three-groups',
                type: 'decision',
                label: 'Three+ Groups',
                short: 'Select ANOVA family or Kruskal-Wallis.',
                children: [
                  {
                    id: 'anova',
                    type: 'leaf',
                    label: 'ANOVA',
                    short: 'Normal data + equal variance.',
                    detail: {
                      when: 'Three or more groups, equal spread, normality.',
                      assumptions: ['normality', 'equal variance', 'independence'],
                      why: 'Omnibus parametric comparison of means.',
                    },
                  },
                  {
                    id: 'welch-anova',
                    type: 'leaf',
                    label: 'Welch ANOVA',
                    short: 'Unequal variances case.',
                    detail: {
                      when: 'Normal data but unequal spreads.',
                      assumptions: ['normality', 'independence'],
                      why: 'Welch corrects for heteroscedasticity.',
                    },
                  },
                  {
                    id: 'kruskal-wallis',
                    type: 'leaf',
                    label: 'Kruskal-Wallis',
                    short: 'Non-parametric omnibus test.',
                    detail: {
                      when: 'Non-normal data across >2 groups.',
                      assumptions: ['independence', 'ordinal data'],
                      why: 'Rank-based generalization of the Mann-Whitney U.',
                    },
                  },
                  {
                    id: 'post-hoc',
                    type: 'decision',
                    label: 'Post-hoc / Non-parametric',
                    short: 'Correct for multiple comparisons.',
                    children: [
                      {
                        id: 'tukey',
                        type: 'leaf',
                        label: 'Tukey HSD',
                        short: 'Equal-variance post-hoc.',
                        detail: {
                          when: 'Significant ANOVA with equal variance.',
                          assumptions: ['same as ANOVA', 'balanced designs help'],
                          why: 'Controls family-wise error for pairwise checks.',
                        },
                      },
                      {
                        id: 'bonferroni',
                        type: 'leaf',
                        label: 'Bonferroni',
                        short: 'Generic error correction.',
                        detail: {
                          when: 'Multiple comparisons regardless of test.',
                          assumptions: ['independence across tests'],
                          why: 'Simple, conservative adjustment for repeated tests.',
                        },
                      },
                      {
                        id: 'dunn',
                        type: 'leaf',
                        label: 'Dunn’s test',
                        short: 'Non-parametric post-hoc.',
                        detail: {
                          when: 'Kruskal-Wallis followed by pairwise ranks.',
                          assumptions: ['rank-based independence'],
                          why: 'Pairwise comparisons when data is ordinal.',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'categorical',
            type: 'decision',
            label: 'Categorical Targets',
            short: 'Chi-square, Fisher, McNemar for nominal data.',
            children: [
              {
                id: 'one-variable',
                type: 'leaf',
                label: 'Chi-square (GOF)',
                short: 'Single categorical variable.',
                detail: {
                  when: 'Compare observed counts to expected distribution.',
                  assumptions: ['sufficient expected counts', 'independence'],
                  why: 'Goodness-of-fit for a single variable.',
                },
              },
              {
                id: 'two-variables',
                type: 'decision',
                label: 'Two Variables',
                short: 'Large vs small sample.',
                children: [
                  {
                    id: 'chi-square',
                    type: 'leaf',
                    label: 'Chi-square',
                    short: 'Large sample contingency tables.',
                    detail: {
                      when: 'At least five expected counts per cell.',
                      assumptions: ['independence', 'large counts'],
                      why: 'Tests independence between categorical variables.',
                    },
                  },
                  {
                    id: 'fishers-exact',
                    type: 'leaf',
                    label: 'Fisher’s Exact',
                    short: 'Small sample contingency tables.',
                    detail: {
                      when: 'Small counts (<5) or sparse tables.',
                      assumptions: ['fixed margins', 'nominal data'],
                      why: 'Exact test for contingency tables.',
                    },
                  },
                ],
              },
              {
                id: 'paired-categorical',
                type: 'leaf',
                label: 'McNemar',
                short: 'Paired binary outcomes.',
                detail: {
                  when: 'Two related categorical measurements.',
                  assumptions: ['paired', 'binary outcomes'],
                  why: 'Captures symmetry in paired contingency data.',
                },
              },
            ],
          },
        ],
      },
    ],
  },
}
