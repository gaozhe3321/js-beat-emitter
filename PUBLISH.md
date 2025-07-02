# NPM 发布指南

## 发布前检查清单

### ✅ 已完成的准备工作

1. **项目构建** - `npm run build` 成功
2. **测试通过** - 主要功能测试都通过
3. **包名检查** - `js-beat-emitter` 包名可用
4. **文件配置** - package.json 配置正确
5. **入口点** - main 和 types 字段指向正确路径
6. **npm 包内容** - 通过 `npm pack` 验证打包内容正确
7. **依赖关系** - 只有必要的 `tseep` 运行时依赖
8. **文档完善** - README.md 详细说明用法
9. **许可证** - MIT 许可证
10. **版本号** - 2.0.0（首次发布建议使用 2.0.0 突出功能完整性）

### 📋 发布步骤

#### 1. 登录 npm 账户
```bash
npm login
```
按提示输入：
- Username（用户名）
- Password（密码）
- Email（邮箱）
- 如果启用了两步验证，还需要输入 OTP 码

验证登录状态：
```bash
npm whoami
```

#### 2. 最终检查
```bash
# 确保代码是最新的
npm run build

# 检查打包内容（可选）
npm pack --dry-run

# 检查包信息
npm view js-beat-emitter
```

#### 3. 发布到 npm
```bash
npm publish
```

如果是第一次发布，建议加上 `--dry-run` 先预览：
```bash
npm publish --dry-run
```

#### 4. 验证发布成功
```bash
# 查看已发布的包信息
npm view js-beat-emitter

# 在另一个目录测试安装
mkdir test-install
cd test-install
npm init -y
npm install js-beat-emitter
```

### 🔧 package.json 关键配置

当前配置已经正确设置：

```json
{
  "name": "js-beat-emitter",
  "version": "2.0.0",
  "main": "dist/src/index.js",
  "types": "dist/src/index.d.ts",
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ],
  "dependencies": {
    "tseep": "^1.3.1"
  }
}
```

### 📦 包内容说明

发布的包将包含：
- `dist/` - 编译后的 JavaScript 和类型定义文件
- `src/` - TypeScript 源码（用于调试和贡献者参考）
- `README.md` - 使用文档
- `LICENSE` - MIT 许可证
- `package.json` - 包配置

### 🚀 发布后的验证

1. **安装测试**
   ```bash
   npm install js-beat-emitter
   ```

2. **导入测试**
   ```javascript
   const { BeatEmitter } = require('js-beat-emitter');
   // 或
   import { BeatEmitter } from 'js-beat-emitter';
   ```

3. **基本功能测试**
   ```javascript
   const emitter = new BeatEmitter({ mode: 'timer-based', bpm: 120 });
   emitter.on('beat', (data) => console.log('Beat!', data));
   emitter.start();
   ```

### 🔄 后续版本发布

当需要发布新版本时：

1. 更新版本号
   ```bash
   npm version patch  # 修复 bug (2.0.0 -> 2.0.1)
   npm version minor  # 新功能 (2.0.0 -> 2.1.0)
   npm version major  # 重大变更 (2.0.0 -> 3.0.0)
   ```

2. 更新 CHANGELOG.md

3. 构建和测试
   ```bash
   npm run build
   npm test
   ```

4. 发布
   ```bash
   npm publish
   ```

5. 推送到 GitHub
   ```bash
   git push origin main --tags
   ```

### 🛠️ 故障排除

**如果遇到权限错误：**
- 确保已登录：`npm whoami`
- 包名是否被占用：`npm view js-beat-emitter`

**如果遇到版本冲突：**
- 更新版本号：`npm version patch`

**如果遇到文件缺失：**
- 检查 package.json 的 files 字段
- 检查 .npmignore 文件

### 📊 推广建议

发布后可以：
1. 在 GitHub repo 中添加 npm 徽章
2. 更新 README.md 添加安装说明
3. 在相关社区分享（如 Reddit r/javascript）
4. 考虑创建示例项目

---

## 准备就绪！

所有准备工作已完成，您可以开始发布流程了！

首先运行：`npm login`
