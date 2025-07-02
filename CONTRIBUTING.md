# Contributing to JS Beat Emitter

感谢您对js-beat-emitter项目的贡献兴趣！

## 开发环境设置

1. Fork 这个仓库
2. Clone 你的 fork: `git clone https://github.com/yourusername/js-beat-emitter.git`
3. 安装依赖: `npm install`
4. 创建功能分支: `git checkout -b feature/your-feature-name`

## 开发流程

### 构建项目
```bash
npm run build
```

### 运行测试
```bash
npm test
npm run test:watch  # 监听模式
npm run test:coverage  # 生成覆盖率报告
```

### 代码检查
```bash
npm run lint
npm run lint:fix  # 自动修复
```

### 开发模式
```bash
npm run dev  # TypeScript 编译监听模式
```

## 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 添加适当的类型注解
- 编写测试用例
- 更新文档

## 提交规范

使用清晰的提交信息：

- `feat: 添加新功能`
- `fix: 修复bug`
- `docs: 更新文档`
- `style: 代码格式调整`
- `refactor: 重构代码`
- `test: 添加测试`
- `chore: 构建/工具相关`

## Pull Request 流程

1. 确保所有测试通过
2. 更新相关文档
3. 添加 CHANGELOG 条目
4. 创建 Pull Request
5. 等待代码审查

## 报告问题

使用 GitHub Issues 报告问题，请包含：

- 问题描述
- 重现步骤
- 预期行为
- 实际行为
- 环境信息

## 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下授权。
