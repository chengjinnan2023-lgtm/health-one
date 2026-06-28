# FD-002: Development Gate Rule
# FD-002：研发进入规则

## Status
Accepted

## Date
2026-06-28

## Decision

任何代码进入 health-one 主仓库，必须遵循以下顺序：

```
Constitution
    ↓
Governance
    ↓
ADR
    ↓
RFC
    ↓
PRD
    ↓
Task
    ↓
Code
    ↓
QA
    ↓
Release
```

未经 ADR / RFC / PRD / Task 明确的功能，不得进入开发。

Claude Code 只负责执行已批准任务，不负责 Founder、Product 或 Architecture 决策。

## Reason

防止：
- MVP 范围膨胀
- Claude Code 自行决策
- 未经设计直接编码
- Legacy 技术债污染新系统
- 项目方向被局部功能带偏

## Applies To

- Development Office
- Architecture Office
- Product Office
- QA Office
- Claude Code
- 所有未来代码提交
