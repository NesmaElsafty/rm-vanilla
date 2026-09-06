from pathlib import Path

t = Path(r"d:\Projects\rana\ranamosaad-vanilla\assets\js\detail-pages.js").read_text(encoding="utf-8")

# Track brace depth ignoring strings/templates/comments roughly
depth = 0
in_s = None  # ', ", `
escape = False
i = 0
lines = t.splitlines(keepends=True)
line_no = 1
col = 0
history = []

while i < len(t):
    ch = t[i]
    if ch == "\n":
        line_no += 1
        col = 0
        i += 1
        continue
    col += 1

    if in_s:
        if escape:
            escape = False
        elif ch == "\\" and in_s != "`":
            escape = True
        elif ch == in_s:
            in_s = None
        elif in_s == "`" and ch == "$" and i + 1 < len(t) and t[i + 1] == "{":
            # enter expression in template
            depth += 1
            history.append((line_no, col, depth, "${"))
            i += 2
            col += 1
            continue
        i += 1
        continue

    # not in string
    if ch in "'\"`":
        in_s = ch
        i += 1
        continue
    if ch == "/" and i + 1 < len(t):
        nxt = t[i + 1]
        if nxt == "/":
            while i < len(t) and t[i] != "\n":
                i += 1
            continue
        if nxt == "*":
            i += 2
            while i + 1 < len(t) and not (t[i] == "*" and t[i + 1] == "/"):
                if t[i] == "\n":
                    line_no += 1
                i += 1
            i += 2
            continue

    if ch == "{":
        depth += 1
        history.append((line_no, col, depth, "{"))
    elif ch == "}":
        depth -= 1
        history.append((line_no, col, depth, "}"))
        if depth < 0:
            print("NEGATIVE at", line_no, col)
            break
    i += 1

print("final depth", depth)
# print last places where depth high
for item in history[-30:]:
    print(item)

# find first time depth goes weird near end
for idx, item in enumerate(history):
    if item[2] == 0 and item[3] == "}" and idx < len(history) - 1:
        pass
print("--- closes to zero near end ---")
for item in history:
    if item[0] > 600:
        print(item)
