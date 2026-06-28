# FD-005 Legacy Freeze

## Status
Accepted

## Decision

* 3号工程、1号工程永久冻结（Legacy Freeze）。
* 不再新增功能。
* 不再修复 Bug。
* 不再作为开发仓库。
* 仅作为历史资产和迁移参考。

Legacy Runtime：
/www/server/xixi/

仍作为运行事实参考。

Health One 为唯一开发仓库。

## Reason

避免开发资源分散。

保证所有新工作集中在 Health One 单一仓库。

Legacy Runtime 仅作为事实参考保留，不作为开发目标。

## Rule

* 禁止修改 Legacy 工程代码。
* 禁止向 Legacy 仓库提交。
* Legacy 运行环境仅用于参考现有流程。
* 所有新功能、修复、开发活动仅限 Health One 仓库。

## Applies To

- ChatGPT
- Claude Code
- 所有 Office
- 所有未来开发者
