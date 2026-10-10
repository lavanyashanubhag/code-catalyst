
import ast
import re


def analyze_code(code: str) -> list[dict]:
    findings = []
    lines = code.splitlines()

    def add(severity, category, title, line, evidence,
            explanation, suggestion, rule_id):
        findings.append({
            "rule_id": rule_id,
            "severity": severity,
            "category": category,
            "title": title,
            "line": line,
            "evidence": evidence,
            "explanation": explanation,
            "suggestion": suggestion,
            "status": "Open"
        })

    try:
        tree = ast.parse(code)
    except SyntaxError as error:
        line_no = error.lineno or 1
        evidence = (
            lines[line_no - 1].strip()
            if 1 <= line_no <= len(lines) else ""
        )
        add(
            "High", "Bug Risk", "Python syntax error",
            line_no, evidence, error.msg,
            "Correct the syntax error and review the code again.",
            "PY-SYNTAX-001"
        )

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in {"eval", "exec"}:
                    line_no = node.lineno
                    add(
                        "High", "Security", f"Use of {node.func.id}()",
                        line_no, lines[line_no - 1].strip(),
                        "Dynamic code execution can be dangerous "
                        "when input is untrusted.",
                        "Avoid dynamic execution or validate input.",
                        "PY-SEC-001"
                    )

        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Div):
            if (
                isinstance(node.right, ast.Constant)
                and isinstance(node.right.value, (int, float))
                and not isinstance(node.right.value, bool)
                and node.right.value == 0
            ):
                line_no = node.lineno
                add(
                    "High", "Bug Risk", "Division by zero",
                    line_no, lines[line_no - 1].strip(),
                    "This expression divides by zero and will "
                    "raise an exception when executed.",
                    "Correct the denominator or validate it first.",
                    "PY-BUG-001"
                )

        if isinstance(node, ast.ExceptHandler) and node.type is None:
            line_no = node.lineno
            add(
                "Medium", "Maintainability", "Bare except clause",
                line_no, lines[line_no - 1].strip(),
                "Catching all exceptions can hide unexpected errors.",
                "Catch the specific exceptions that are expected.",
                "PY-MAINT-001"
            )

    secret_pattern = re.compile(
        r"""(?i)\b(password|passwd|secret|api_key|access_token)
        \b\s*=\s*(['"])[^'"]+\2""",
        re.VERBOSE
    )

    for line_no, line in enumerate(lines, start=1):
        if secret_pattern.search(line):
            add(
                "High", "Security", "Possible hard-coded secret",
                line_no, line.strip(),
                "A credential-like value appears directly in source.",
                "Use an environment variable or secret manager.",
                "PY-SEC-002"
            )

    for line_no, line in enumerate(lines, start=1):
        if (
            re.search(r"(?i)\b(SELECT|INSERT|UPDATE|DELETE)\b", line)
            and "+" in line
        ):
            add(
                "High", "Security", "Possible unsafe SQL construction",
                line_no, line.strip(),
                "SQL text may be combined using string concatenation.",
                "Use parameterized SQL queries.",
                "PY-SEC-003"
            )

    unique = {}
    for finding in findings:
        key = (finding["rule_id"], finding["line"])
        unique[key] = finding

    return list(unique.values())
