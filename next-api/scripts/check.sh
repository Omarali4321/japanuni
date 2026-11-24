#!/usr/bin/env bash
# Проверка без AI: типы, линт, сборка. Запуск: bash next-api/scripts/check.sh [--no-build]
set -u
cd "$(dirname "$0")/.."
fail=0
echo "== tsc";   npx tsc --noEmit || fail=1
echo "== eslint"; npx eslint . --quiet || fail=1
if [ "${1:-}" != "--no-build" ]; then echo "== build"; npm run build >/tmp/japanuni-build.log 2>&1 && echo ok || { tail -30 /tmp/japanuni-build.log; fail=1; }; fi
exit $fail
