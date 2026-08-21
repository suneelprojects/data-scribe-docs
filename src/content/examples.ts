import type { ReplLine } from "@/components/ReplBlock";

export type Example = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  overview: string;
  code: string;
  output: ReplLine[];
  dataset: {
    name: string;
    rows: string;
    columns: string[];
    downloadUrl: string;
    note: string;
  };
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
      rows: "12 rows × 8 columns",
      columns: [
        "employee_id",
        "name",
        "email",
        "department",
        "salary",
        "hire_date",
        "active",
        "city",
      ],
      downloadUrl: "/datasets/employees.csv",
      note: "Synthetic sample with missing markers, whitespace and one duplicate row.",
    },
    code: `import eazydatafix as edf\n\nconfig = edf.FixConfig(\n    missing_markers=("", "N/A", "null"),\n)\nreport = edf.assess("employees.csv")\nresult = edf.fix("employees.csv", config)\nresult.save("employees.clean.csv")\n\nprint(f"Quality before: {report.quality.score:.2f}")\nprint(result.applied_fixes)`,
    output: [
      { kind: "in", text: 'report = edf.assess("employees.csv")' },
      { kind: "in", text: 'result = edf.fix("employees.csv", config)' },
      { kind: "out", text: "Quality before: 82.76" },
      { kind: "blank" },
      { kind: "in", text: "print(result.applied_fixes)" },
      {
        kind: "out",
        text: "['Trimmed leading/trailing whitespaces.', 'Removed 1 duplicate row(s).', \"Filled numeric column 'salary' using median.\"]",
      },
    ],
  },
  {
    slug: "excel-cleaning",
    title: "Excel Cleaning",
    summary: "Clean missing values, whitespace and duplicate rows from an .xlsx workbook.",
    tags: ["Excel", "fix"],
    overview:
      "Excel exports frequently contain missing values, duplicated records and inconsistent text spacing. This example applies the v1.0 controlled cleaning pipeline and writes a clean workbook.",
    dataset: {
      name: "sales_q3.xlsx",
      rows: "12 rows × 8 columns",
      columns: [
        "order_id",
        "customer",
        "region",
        "amount",
        "date",
        "currency",
        "discount",
        "status",
      ],
      downloadUrl: "/datasets/sales_q3.xlsx",
      note: "Synthetic formatted workbook with missing amounts, whitespace and a duplicate row.",
    },
    code: `import eazydatafix as edf\n\nconfig = edf.FixConfig(\n    missing_markers=("", "N/A"),\n)\nresult = edf.fix("sales_q3.xlsx", config)\nresult.dataset.to_excel(\n    "sales_q3.clean.xlsx", index=False\n)\n\nprint(result.dataset.shape)\nprint(result.applied_fixes)`,
    output: [
      { kind: "in", text: 'result = edf.fix("sales_q3.xlsx", config)' },
      { kind: "out", text: "(11, 8)" },
      {
        kind: "out",
        text: "['Trimmed leading/trailing whitespaces.', 'Removed 1 duplicate row(s).', \"Filled numeric column 'amount' using median.\"]",
      },
    ],
  },
  {
    slug: "hospital",
    title: "Hospital Dataset",
    summary: "Profile a synthetic hospital admissions dataset with mixed values and nulls.",
    tags: ["healthcare", "profile"],
    overview:
      "A compact synthetic hospital admissions extract. Combine profile() and assess() to understand its structure and quality before choosing a cleaning strategy.",
    dataset: {
      name: "hospital.csv",
      rows: "15 rows × 8 columns",
      columns: [
        "patient_id",
        "age",
        "gender",
        "admission_date",
        "diagnosis",
        "length_of_stay",
        "insurance",
        "readmitted",
      ],
      downloadUrl: "/datasets/hospital.csv",
      note: "Synthetic teaching data; it contains no real patient information.",
    },
    code: `import eazydatafix as edf\n\nprofile = edf.profile("hospital.csv")\nreport = edf.assess("hospital.csv")\n\nprint(profile.rows, profile.columns)\nprint(f"Quality score: {report.quality.score:.2f}")\nprint(\n    "Missing values:",\n    report.completeness.total_missing_values,\n)`,
    output: [
      { kind: "in", text: 'profile = edf.profile("hospital.csv")' },
      { kind: "out", text: "15 8" },
      { kind: "out", text: "Quality score: 89.89" },
      { kind: "out", text: "Missing values: 3" },
    ],
  },
  {
    slug: "hr",
    title: "HR Dataset",
    summary: "Trim inconsistent text spacing and remove duplicate employee records.",
    tags: ["HR", "duplicates"],
    overview:
      "A small synthetic HR extract with leading/trailing whitespace and one duplicated employee record. The default controlled fix removes both safely.",
    dataset: {
      name: "hr.csv",
      rows: "12 rows × 7 columns",
      columns: [
        "employee_id",
        "name",
        "department",
        "role",
        "start_date",
        "employment_type",
        "location",
      ],
      downloadUrl: "/datasets/hr.csv",
      note: "Synthetic HR data with whitespace inconsistencies and a duplicate row.",
    },
    code: `import eazydatafix as edf\n\nresult = edf.fix("hr.csv")\nresult.save("hr.clean.csv")\n\nprint(result.dataset.shape)\nprint(result.applied_fixes)`,
    output: [
      { kind: "in", text: 'result = edf.fix("hr.csv")' },
      { kind: "out", text: "(11, 7)" },
      {
        kind: "out",
        text: "['Trimmed leading/trailing whitespaces.', 'Removed 1 duplicate row(s).']",
      },
    ],
  },
  {
    slug: "sales",
    title: "Sales Dataset",
    summary: "Assess a daily sales extract with missing amounts and mixed currencies.",
    tags: ["sales", "assess"],
    overview:
      "A synthetic daily sales log with missing amount values and both INR and USD transactions. Start with a deterministic quality assessment before defining business-specific currency rules.",
    dataset: {
      name: "sales.csv",
      rows: "15 rows × 8 columns",
      columns: [
        "order_id",
        "customer_id",
        "sku",
        "amount",
        "currency",
        "order_date",
        "channel",
        "region",
      ],
      downloadUrl: "/datasets/sales.csv",
      note: "Synthetic sales data with three missing amount values and two currency codes.",
    },
    code: `import eazydatafix as edf\n\nreport = edf.assess("sales.csv")\n\nprint(\n    "Missing values:",\n    report.completeness.total_missing_values,\n)\nprint(\n    "Completeness:",\n    report.completeness.completeness_score,\n)`,
    output: [
      { kind: "in", text: 'report = edf.assess("sales.csv")' },
      { kind: "out", text: "Missing values: 3" },
      { kind: "out", text: "Completeness: 97.5" },
    ],
  },
  {
    slug: "student",
    title: "Student Dataset",
    summary: "Profile and assess a synthetic student dataset before modelling.",
    tags: ["education", "profile"],
    overview:
      "A compact synthetic student performance dataset with numeric grades, attendance and missing values. Use profile() for structure and assess() for a shareable quality report.",
    dataset: {
      name: "students.csv",
      rows: "15 rows × 8 columns",
      columns: [
        "student_id",
        "gender",
        "age",
        "department",
        "attendance_pct",
        "grade_math",
        "grade_reading",
        "study_hours_week",
      ],
      downloadUrl: "/datasets/students.csv",
      note: "Synthetic education data; it contains no real student information.",
    },
    code: `import eazydatafix as edf\n\nprofile = edf.profile("students.csv")\nreport = edf.assess("students.csv")\nreport.to_html("students-quality.html")\n\nprint(profile.rows, profile.columns)\nprint(f"Quality score: {report.quality.score:.2f}")`,
    output: [
      { kind: "in", text: 'profile = edf.profile("students.csv")' },
      { kind: "out", text: "15 8" },
      { kind: "out", text: "Quality score: 88.01" },
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
      downloadUrl: "/datasets/titanic.csv",
      note: "An anonymized copy of the classic Titanic tutorial dataset; names and ticket IDs are replaced with synthetic identifiers.",
    },
    code: `import eazydatafix as edf\n\nreport = edf.assess("titanic.csv")\nresult = edf.fix("titanic.csv")\nresult.save("titanic.clean.csv")\n\nprint(f"Quality before: {report.quality.score:.2f}")\nprint(result.applied_fixes)`,
    output: [
      { kind: "in", text: 'result = edf.fix("titanic.csv")' },
      { kind: "out", text: "Quality before: 88.59" },
      { kind: "in", text: "print(result.applied_fixes)" },
      {
        kind: "out",
        text: "['Normalized column names.', \"Filled numeric column 'age' using median.\"]",
      },
    ],
  },
];

export function findExample(slug: string) {
  return examples.find((e) => e.slug === slug);
}
