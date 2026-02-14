# Project Roadmap

## Goals
- [ ] Initialize Project

## Implemented
- [x] Phase 8: Gatekeeper (Intent Classification)
- [x] Phase 7: Symbol Graph (Memory Core)
- [x] Phase 6: Native File Tools & Strict Schema (v0.6.2)

## Todo
- [ ] Phase 8: Smart Edit (Refactoring) - 实现引用感知重构 (Refactoring)。当修改核心定义时，根据 Registry 自动同步更新所有引用该定义的文件。


## Engineering Standards
1. 启动时校验文件架构。
2. 维护原创符号注册表。
3. 每次 Session 结束自动更新日志。