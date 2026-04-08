export const mindmapStructure = {
  name: 'START',
  children: [
    {
      name: '🔹 -1. PRE-ANALYSIS',
      children: [
        {
          name: 'A Priori Power Analysis',
          attributes: {
            Notes: 'Effect size, α, power → required sample',
          },
          children: [
            { name: 'Inputs: effect size, α, power (1-β)' },
            { name: 'Output: required sample size (n)' },
          ],
        },
        {
          name: 'Sensitivity Analysis',
          attributes: {
            Notes: 'Flip power analysis when n is fixed',
          },
          children: [{ name: 'Detect smallest effect size given n' }],
        },
      ],
    },
    {
      name: '🔹 0. DATA CLEANING & ASSUMPTIONS',
      children: [
        { name: 'Missing values → Impute / Drop' },
        { name: 'Outliers → Z-score / IQR' },
        { name: 'Normality → Shapiro-Wilk / KS' },
        { name: 'Variance → Levene / Bartlett' },
        { name: 'Homoscedasticity → Residual plots' },
        { name: 'Multicollinearity → VIF' },
      ],
    },
    {
      name: '🔹 1. EDA',
      children: [
        { name: 'Distributions → Hist./KDE/Q-Q' },
        { name: 'Relationships → Scatter / Corr. heatmap' },
        { name: 'Group insights → Box / Violin' },
      ],
    },
    {
      name: '🔹 1.5 FEATURE ENGINEERING',
      children: [
        { name: 'Transformations → Log / Sqrt / Box-Cox' },
        { name: 'Encoding → One-hot / Target encoding' },
        { name: 'Scaling → Standardization / Normalization' },
        { name: 'Interaction terms → X × Z' },
        { name: 'Feature selection → Remove noise/redundancy' },
      ],
    },
    {
      name: '► A. COMPARISON',
      children: [
        {
          name: 'Numerical',
          children: [
            { name: 'One group → Z / t-test' },
            {
              name: 'Two groups',
              children: [
                {
                  name: 'Independent → t, Welch, Mann-Whitney',
                },
                { name: 'Paired → paired t-test, Wilcoxon' },
              ],
            },
            {
              name: 'Three+ groups',
              children: [
                { name: 'ANOVA / Welch / Kruskal-Wallis' },
                { name: 'Post-hoc → Tukey / Bonferroni / Dunn' },
              ],
            },
          ],
        },
        {
          name: 'Categorical',
          children: [
            { name: 'One variable → Chi-square (GOF)' },
            {
              name: 'Two variables',
              children: [
                { name: 'Large sample → Chi-square' },
                { name: 'Small sample → Fisher’s exact' },
              ],
            },
            { name: 'Paired → McNemar' },
          ],
        },
      ],
    },
    {
      name: '► B. RELATIONSHIP',
      children: [
        {
          name: 'Numerical vs Numerical',
          children: [
            { name: 'Linear → Pearson' },
            { name: 'Non-linear → Spearman' },
          ],
        },
        { name: 'Categorical vs Numerical → t-test / ANOVA' },
        { name: 'Categorical vs Categorical → Chi-square' },
      ],
    },
    {
      name: '► C. PREDICTION',
      children: [
        {
          name: 'Regression',
          children: [
            { name: 'Simple linear' },
            { name: 'Multiple linear' },
          ],
        },
        {
          name: 'Classification',
          children: [
            { name: 'Logistic regression' },
            { name: 'Random forest / SVM / KNN' },
          ],
        },
        { name: 'Survival → Cox' },
        {
          name: 'Assumption checklist',
          children: [
            { name: 'Linearity' },
            { name: 'Homoscedasticity' },
            { name: 'Multicollinearity' },
          ],
        },
      ],
    },
    {
      name: '► D. UNSUPERVISED LEARNING',
      children: [
        {
          name: 'Clustering → K-means / Hierarchical',
        },
        {
          name: 'Dimensionality reduction → PCA / Factor analysis',
        },
      ],
    },
    {
      name: '► E. TIME SERIES',
      children: [
        { name: 'Trend / Seasonality decomposition' },
        { name: 'Stationarity → ADF Test' },
        { name: 'Autocorrelation → Durbin-Watson / ACF/PACF' },
      ],
    },
    {
      name: '► F. CAUSAL INFERENCE',
      children: [
        { name: 'DAGs to identify confounders' },
        {
          name: 'Methods',
          children: [
            { name: 'Propensity score matching' },
            { name: 'Difference-in-differences' },
            { name: 'Regression discontinuity' },
          ],
        },
        { name: 'Goal → Correlation → Causation' },
      ],
    },
    {
      name: '► G. BAYESIAN ANALYSIS',
      children: [
        { name: 'Prior → Existing belief' },
        { name: 'Likelihood → Data' },
        { name: 'Posterior → Updated belief' },
        { name: 'Credible intervals' },
      ],
    },
    {
      name: '🔹 3. MAGNITUDE & INTERPRETATION',
      children: [
        {
          name: 'Effect size',
          children: [
            { name: "Cohen's d" },
            { name: 'Eta²' },
          ],
        },
        { name: 'Confidence intervals (95%)' },
        {
          name: 'Interpretation',
          children: [
            { name: 'p-value → significance' },
            { name: 'Effect size → practical importance' },
          ],
        },
      ],
    },
    {
      name: '🔹 4. VALIDATION & ROBUSTNESS',
      children: [
        { name: 'Train/test split' },
        { name: 'Cross-validation (K-Fold)' },
        { name: 'Bootstrapping' },
        { name: 'Sensitivity analysis (avoid p-hacking)' },
      ],
    },
    {
      name: '🔹 5. COMMUNICATION & ETHICS',
      children: [
        { name: 'Business / practical impact' },
        {
          name: 'Bias & fairness audit',
          children: [
            { name: 'Subgroup analysis' },
            { name: 'Algorithmic bias detection' },
          ],
        },
        {
          name: 'Explainability',
          children: [{ name: 'SHAP / feature importance' }],
        },
        {
          name: 'Data storytelling',
          children: [{ name: 'Convert → insights for humans' }],
        },
      ],
    },
    {
      name: '✅ END → DECISION / ACTION',
    },
  ],
}
