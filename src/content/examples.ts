import type { ReplLine } from "@/components/ReplBlock";

export type Example = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  overview: string;
  code: string;
  output: ReplLine[];
  dataset: { name: string; rows: string; columns: string[] };
};

export const examples: Example[] = [
  {
    slug: "csv-cleaning",
    title: "CSV Cleaning",
    summary: "Load a messy CSV, assess quality and export a cleaned copy.",
    tags: ["CSV", "assess", "fix"],
    overview:
      "The canonical EazyDataFix workflow — read a CSV, understand what is wrong with it, then apply the automatic cleaning pipeline and export the result.",
    dataset: {
      name: "employees.csv",
      rows: "1,204 rows × 12 columns",
      columns: ["id", "name", "email", "department", "salary", "hire_date", "..."],
    },
    code: `import eazydatafix as edf\n\nreport = edf.assess("employees.csv")\nreport.summary()\n\nresult = edf.fix("employees.csv", strategy="safe")\nresult.applied_fixes\nresult.to_csv("employees.clean.csv")`,
    output: [
      { kind: "in", text: 'report = edf.assess("employees.csv")' },
      { kind: "in", text: "report.summary()" },
      { kind: "out", text: "QualityReport(employees.csv) score=94.0" },
      { kind: "blank" },
      { kind: "in", text: 'result = edf.fix("employees.csv")' },
      { kind: "in", text: "result.applied_fixes" },
      { kind: "out", text: "['strip_whitespace', 'coerce_numeric', 'drop_duplicates(6)']" },
    ],
  },
  {
    slug: "excel-cleaning",
    title: "Excel Cleaning",
    summary: "Handle merged cells, blank rows and inconsistent columns from .xlsx workbooks.",
    tags: ["Excel", "fix"],
    overview:
      "Excel exports frequently contain merged header rows, stray notes and inconsistent dtypes. This example shows the recommended pipeline.",
    dataset: {
      name: "sales_q3.xlsx",
      rows: "3,411 rows × 8 columns",
      columns: ["order_id", "customer", "region", "amount", "date", "..."],
    },
    code: `import eazydatafix as edf\n\nresult = edf.fix(\n    "sales_q3.xlsx",\n    strategy="auto",\n    fill_missing="median",\n)\nresult.to_excel("sales_q3.clean.xlsx")`,
    output: [
      { kind: "in", text: 'result = edf.fix("sales_q3.xlsx")' },
      { kind: "out", text: "FixResult(rows=3,407, fixes=5)" },
    ],
  },
  {
    slug: "hospital",
    title: "Hospital Dataset",
    summary: "Assess a hospital admissions dataset with mixed dtypes and PII.",
    tags: ["healthcare", "profile"],
    overview:
      "A realistic hospital admissions extract with 30,000 rows. Combine profile() and assess() to plan a safe cleaning strategy.",
    dataset: {
      name: "hospital.csv",
      rows: "30,000 rows × 21 columns",
      columns: ["patient_id", "age", "gender", "admission_date", "diagnosis", "..."],
    },
    code: `import pandas as pd\nimport eazydatafix as edf\n\ndf = pd.read_csv("hospital.csv")\nprof = edf.profile(df, sample=10_000)\nreport = edf.assess(df)\nreport.summary()`,
    output: [
      { kind: "in", text: 'prof = edf.profile(df, sample=10_000)' },
      { kind: "in", text: "prof.columns['age']" },
      { kind: "out", text: "ColumnProfile(age) min=0 max=104 mean=42.3" },
    ],
  },
  {
    slug: "hr",
    title: "HR Dataset",
    summary: "Detect duplicate employee records and normalise department names.",
    tags: ["HR", "duplicates"],
    overview:
      "Small HR extract with department name variants ('Eng', 'Engineering', ' engineering'). Fixes strip whitespace and canonicalise categories.",
    dataset: {
      name: "hr.csv",
      rows: "812 rows × 9 columns",
      columns: ["employee_id", "name", "department", "role", "start_date", "..."],
    },
    code: `import eazydatafix as edf\n\nresult = edf.fix("hr.csv", strategy="aggressive")\nresult.diff()`,
    output: [
      { kind: "in", text: "result.diff()" },
      { kind: "out", text: "  department: 4 canonicalised, 12 stripped" },
      { kind: "out", text: "  duplicates: 3 dropped" },
    ],
  },
  {
    slug: "sales",
    title: "Sales Dataset",
    summary: "Reconcile daily sales with missing amounts and currency mismatches.",
    tags: ["sales", "assess"],
    overview:
      "Daily sales log with occasional missing amount values and mixed currency codes. Use custom thresholds to surface issues early.",
    dataset: {
      name: "sales.csv",
      rows: "44,120 rows × 10 columns",
      columns: ["order_id", "customer_id", "sku", "amount", "currency", "date", "..."],
    },
    code: `report = edf.assess(\n    "sales.csv",\n    thresholds={"missing": 0.02},\n    verbose=True,\n)`,
    output: [
      { kind: "in", text: 'report = edf.assess("sales.csv", thresholds={"missing": 0.02})' },
      { kind: "out", text: "  amount: 3.1% missing  ⚠ above threshold" },
      { kind: "out", text: "  currency: 4 distinct values" },
    ],
  },
  {
    slug: "student",
    title: "Student Dataset",
    summary: "Prepare a public education dataset for downstream modelling.",
    tags: ["education", "profile"],
    overview:
      "Public student performance dataset with categorical grades and mixed nulls. Ideal for showcasing profile() output.",
    dataset: {
      name: "students.csv",
      rows: "1,000 rows × 33 columns",
      columns: ["id", "gender", "age", "grade_math", "grade_reading", "..."],
    },
    code: `prof = edf.profile("students.csv")\nprof.to_html("students-profile.html")`,
    output: [
      { kind: "in", text: 'prof = edf.profile("students.csv")' },
      { kind: "in", text: 'prof.to_html("students-profile.html")' },
      { kind: "out", text: "wrote students-profile.html (218 KB)" },
    ],
  },
  {
    slug: "titanic",
    title: "Titanic Dataset",
    summary: "The classic tutorial dataset — clean, profile and export.",
    tags: ["tutorial", "fix"],
    overview:
      "The classic Kaggle Titanic dataset. Runs the full pipeline in six lines and prints an audit trail suitable for reproducible notebooks.",
    dataset: {
      name: "titanic.csv",
      rows: "891 rows × 12 columns",
      columns: ["PassengerId", "Pclass", "Sex", "Age", "SibSp", "Fare", "..."],
    },
    code: `import eazydatafix as edf\n\nreport = edf.assess("titanic.csv")\nresult = edf.fix("titanic.csv")\nresult.to_csv("titanic.clean.csv")\nprint(result.applied_fixes)`,
    output: [
      { kind: "in", text: 'result = edf.fix("titanic.csv")' },
      { kind: "in", text: "print(result.applied_fixes)" },
      { kind: "out", text: "['impute_missing(Age, median)', 'coerce_numeric', 'drop_duplicates(0)']" },
    ],
  },
];

export function findExample(slug: string) {
  return examples.find((e) => e.slug === slug);
}
