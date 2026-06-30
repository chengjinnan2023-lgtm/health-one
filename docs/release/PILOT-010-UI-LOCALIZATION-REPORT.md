# PILOT-010 — Chinese UI Localization Report

Document ID : PILOT-010
Title       : Store Workbench Chinese Localization for Internal Pilot
Version     : 1.0
Status      : Complete
Owner       : Release Office
Created     : 2026-06-30
Scope       : All user-facing UI text → Simplified Chinese

---

## 1. Modification Summary

| # | Screen | File | Status |
|---|--------|------|--------|
| 1 | Login | `LoginScreen.tsx` | ✅ 中文化 |
| 2 | S1: Customer Search/Create | `CustomerSearchScreen.tsx` | ✅ 中文化 |
| 3 | S2: Customer Summary | `CustomerSummaryScreen.tsx` | ✅ 中文化 |
| 4 | S3: Concern Intake | `ConcernIntakeScreen.tsx` | ✅ 中文化 |
| 5 | S4: Service Record | `ServiceRecordScreen.tsx` | ✅ 中文化 |
| 6 | S5: Feedback Record | `FeedbackRecordScreen.tsx` | ✅ 中文化 |
| 7 | S6: Follow-Up | `FollowUpScreen.tsx` | ✅ 中文化 |
| 8 | Base Layout (Nav) | `BaseLayout.tsx` | ✅ 中文化 |

---

## 2. Term Standardization

| English | Chinese | Applied In |
|---------|---------|-----------|
| Health Identity | 健康元 | S2, S3 |
| Health Profile | 健康档案 | S2, S3 |
| Service Session | 服务记录 | S4 |
| Service Record | 服务记录 | S4 |
| Feedback | 服务反馈 | S5 |
| Follow-Up | 随访 | S6 |
| Summary | 总览 | S2 |
| Search | 搜索 | S1 |
| Create / New | 新建 | S1 |
| Save | 保存 | S3, S4, S5, S6 |
| Cancel | 取消 | S3 |
| Back | 返回 | S4 |
| Skip | 跳过 | S5, S6 |
| Complete | 完成 | S6 |
| Login / Sign In | 登录 | Login |
| Logout | 退出登录 | Nav |
| Customers | 客户管理 | Nav |
| Store Workbench | 门店工作台 | Login |
| Activate | 激活 | S2 |
| Record Concern | 记录健康关注 | S2 |
| New Service | 新建服务 | S2 |

### Status Labels

| API Value | English | Chinese |
|-----------|---------|---------|
| pending | pending | 待激活 |
| active | active | 已激活 |
| archived | archived | 已归档 |
| completed | completed | 已完成 |
| in progress | in progress | 进行中 |

### Satisfaction / Feedback Labels

| English | Chinese |
|---------|---------|
| Improved / Same / Worse | 改善 / 不变 / 变差 |
| Satisfied / Neutral / Dissatisfied | 满意 / 一般 / 不满意 |
| Yes / Maybe / No | 愿意 / 可能 / 不愿意 |

### Follow-Up Labels

| English | Chinese |
|---------|---------|
| Service follow-up | 服务随访 |
| Health check | 健康检查 |
| Concern review | 关注回顾 |
| General check-in | 常规问候 |
| Phone / WeChat / SMS / In-Store | 电话 / 微信 / 短信 / 到店 |

---

## 3. Page-by-Page Audit

### Login
- [x] 标题: Health One
- [x] 副标题: 门店工作台
- [x] 用户名字段: 用户名
- [x] 密码字段: 密码
- [x] 按钮: 登录 / 登录中…
- [x] 错误: 用户名或密码错误，请重试

### S1: Customer Search / Create
- [x] 页面标题: 客户搜索 / 新建
- [x] 搜索框 placeholder: 输入客户姓名搜索…
- [x] 新建按钮: + 新建客户
- [x] 表单标题: 新建客户
- [x] 姓名字段: 姓名 *
- [x] 提交按钮: 创建客户 / 创建中…
- [x] 取消按钮: 取消
- [x] 搜索中: 搜索中…
- [x] 空结果: 未找到 "{query}" 相关客户
- [x] 空结果 CTA: 新建客户
- [x] 状态标签: 待激活 / 已激活 / 已归档
- [x] 错误: 搜索失败，请重试 / 创建失败，请重试

### S2: Customer Summary
- [x] 激活按钮: 激活健康元
- [x] 关注按钮: 记录健康关注
- [x] 服务按钮: 新建服务
- [x] 健康档案 section: 健康档案
- [x] 服务历史 section: 服务历史
- [x] 随访 section: 随访
- [x] 动态 section: 最近动态
- [x] 加载中: 加载中…
- [x] 空档案: 暂无健康档案
- [x] 空服务: 暂无服务记录
- [x] 空随访: 暂无随访任务
- [x] 空动态: 暂无动态
- [x] 完成标签: ✓ 已完成 / 进行中
- [x] 随访状态: 已完成 / 进行中
- [x] 计划时间: 计划:
- [x] 错误: 客户未找到 / 加载失败 / 激活失败

### S3: Concern Intake
- [x] 页面标题: 健康关注录入
- [x] 副标题: 记录客户的健康关注。不是医疗诊断。
- [x] 类别字段: 关注类别 *
- [x] 自述字段: 客户自述 *
- [x] 自述 placeholder: 客户说了什么？
- [x] 观察字段: 员工观察备注
- [x] 观察 placeholder: 可选，员工观察记录
- [x] 手机号: 手机号
- [x] 健康目标: 健康目标
- [x] 目标 placeholder: 客户希望达成什么？
- [x] 出生年份: 出生年份
- [x] 性别: 性别 / 不透露 / 男 / 女
- [x] 保存按钮: 保存 / 保存中…
- [x] 取消按钮: 取消
- [x] 提示: 必填：类别 + 自述 ≤ 4 项

### S4: Service Record
- [x] 页面标题: 服务记录
- [x] 副标题: 记录为客户提供的门店服务。
- [x] 类型字段: 服务类型 *
- [x] 人员字段: 服务人员
- [x] 前备注: 服务前备注
- [x] 前备注 placeholder: 服务前客户状态
- [x] 内容字段: 服务内容 *
- [x] 内容 placeholder: 提供了什么服务？
- [x] 下一步: 建议下一步
- [x] 下一步 placeholder: 例如：建议 3 天后随访
- [x] 保存按钮: 保存服务记录 / 保存中…
- [x] 返回按钮: 返回
- [x] 提示: 必填：服务类型 + 内容 ≤ 5 项

### S5: Feedback
- [x] 页面标题: 服务反馈
- [x] 副标题: 快速记录反馈，不是长问卷。
- [x] 感受字段: 即时感受 *
- [x] 感受 placeholder: 客户现在感觉怎么样？
- [x] 舒适度: 舒适度变化 / 改善 / 不变 / 变差
- [x] 满意度: 满意度 * / 满意 / 一般 / 不满意
- [x] 回访意愿: 回访意愿 * / 愿意 / 可能 / 不愿意
- [x] 问题字段: 客户问题或疑虑
- [x] 问题 placeholder: 客户提出的问题
- [x] 随访方式: 首选随访方式
- [x] 保存按钮: 保存反馈 / 保存中…
- [x] 跳过按钮: 跳过
- [x] 提示: 必填：感受 + 满意度 + 回访意愿 ≤ 3 项
- [x] 成功标题: ✓ 反馈已记录
- [x] 成功描述: 客户反馈已保存至服务记录。
- [x] 成功后按钮: 返回客户总览 / 创建随访 →

### S6: Follow-Up
- [x] 页面标题: 随访任务
- [x] 副标题: 确保服务不因客户离店而结束。
- [x] 原因字段: 随访原因 / 服务随访 / 健康检查 / 关注回顾 / 常规问候
- [x] 方式字段: 随访方式 *
- [x] 时间字段: 计划时间 *
- [x] 人员字段: 负责员工
- [x] 备注字段: 备注
- [x] 备注 placeholder: 随访话术或备注
- [x] 创建按钮: 创建随访 / 创建中…
- [x] 跳过按钮: 跳过
- [x] 成功标题: ✓ 随访已创建
- [x] 成功状态: 状态: 待执行
- [x] 结果字段: 随访结果（可选）
- [x] 结果 placeholder: 记录随访结果
- [x] 完成按钮: 标记完成 / 保存中…
- [x] 返回按钮: 返回总览

### Base Layout (Nav)
- [x] 导航: 客户管理
- [x] 退出: 退出登录

---

## 4. Not Localized (Intentionally)

| Item | Reason |
|------|--------|
| API field names | Backend contract — not user-facing |
| data-testid attributes | Automation contract — not user-facing |
| event_type in Timeline | Technical identifier — displayed as-is |
| OpenAPI /docs | Developer tool — not store-facing |
| Error messages from backend | Already returned in Chinese by API routers |
| "Health One" brand name | Keep as brand identifier |

---

## 5. Recommendation

### ✅ Ready for Store Pilot

All 8 screens (Login + S1–S6 + Nav) fully localized to simplified Chinese. All buttons, labels, placeholders, error messages, success messages, empty states, and navigation text are now in Chinese with consistent terminology.

The store staff can now operate the entire system in their native language without encountering English text.

### Build Verification

```
npm run build: ✓ built in 95ms
tsc --noEmit:  No errors
```

---

## 6. End of Document

PILOT-010 completes the Chinese UI localization for the internal pilot. All screens ready for store staff use.
