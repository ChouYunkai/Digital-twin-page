# 机械旋转平台监控系统

## 项目简介
这是一个基于 Vue 3 + TypeScript + Vite 开发的机械旋转平台监控系统。该系统提供了实时监控、数据可视化和设备管理等功能，使用现代化的技术栈和工具链，为机械设备的监控和管理提供了完整的解决方案。

## 技术栈
- 前端框架：Vue 3
- 开发语言：TypeScript
- 构建工具：Vite
- UI 组件库：Arco Design Vue
- 状态管理：Pinia
- 路由管理：Vue Router
- 3D 渲染：Three.js
- 数据可视化：Highcharts
- HTTP 客户端：Axios
- 后端：Express + MSSQL

## 功能特性
- 实时设备监控
- 3D 可视化展示
- 数据图表分析
- 设备状态管理
- 实时数据更新
- 响应式设计

## 开发环境要求
- Node.js >= 14.0.0
- pnpm >= 6.0.0 (推荐) 或 yarn >= 1.22.0

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
cd mf-turbinemonitor2
```

2. 安装依赖
```bash
pnpm install
# 或
yarn install
```

3. 启动开发服务器
```bash
pnpm dev
# 或
yarn dev
```

4. 构建生产版本
```bash
pnpm build
# 或
yarn build
```

## 项目结构
```
├── src/                # 源代码目录
├── public/            # 静态资源
├── backend/           # 后端服务
├── docs/             # 打包后的文件
└── screenshot/       # 项目截图
```

## 开发规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 StyleLint 进行样式检查
- 遵循 Git Commit 规范

## 命令说明
- `pnpm dev`: 启动开发服务器
- `pnpm build`: 构建生产版本
- `pnpm preview`: 预览生产构建
- `pnpm lint`: 运行 ESLint 检查
- `pnpm lint:style`: 运行 StyleLint 检查
- `pnpm prettier:format`: 运行 Prettier 格式化

## 浏览器支持
- Chrome >= 87
- Firefox >= 78
- Safari >= 13
- Edge >= 88

## 贡献指南
1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证
[MIT License](LICENSE)

