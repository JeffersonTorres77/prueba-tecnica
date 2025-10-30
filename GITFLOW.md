Git Flow quickstart

Branches:
- main (production)
- develop (integration)
- feature/*
- release/*
- hotfix/*

Common commands (using git-flow extension):
- git flow init
- git flow feature start my-feature
- git flow feature finish my-feature
- git flow release start 1.0.0
- git flow hotfix start fix-issue

If you don't use extension:
- create branches manually: git checkout -b feature/my-feature develop

Recommended hooks/tools:
- use Husky to run linters before commits
