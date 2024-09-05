#!/bin/bash
set -euoo pipefail posix
cd "$(dirname "$0")"

# 
mkdir -p \
	./docs/data \
	./docs/data/locale

curl -s 'https://splatoon3.ink/data/schedules.json' \
	| jq -cM '.data.coopGroupingSchedule' \
	> ./docs/data/coop-grouping-schedule.json
curl -s 'https://splatoon3.ink/data/locale/ja-JP.json' \
	> ./docs/data/locale/ja-JP.json
