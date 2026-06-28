# FD-003 Repository First

## Status
Accepted

## Decision

Repository 是 Health One 唯一事实来源。

项目判断顺序：

```
Repository
    ↓
Project Documents
    ↓
Git History
    ↓
AI Memory
```

任何 AI 在开始工作之前，必须先检查 Repository。

## Reason

避免聊天上下文与真实项目状态不一致。

## Applies To

- ChatGPT
- Claude Code
- 所有 Office
