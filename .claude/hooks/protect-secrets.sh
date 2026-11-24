#!/usr/bin/env bash
# PreToolUse: запрещает чтение/правку .env* (кроме .env.example)
f=$(jq -r '.tool_input.file_path // .tool_input.path // ""')
case "$(basename "$f")" in
  .env.example) exit 0;;
  .env|.env.*) echo "Доступ к $f заблокирован (секреты)" >&2; exit 2;;
esac
exit 0
