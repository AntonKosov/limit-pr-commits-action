# Limit Pull Request Commits

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/AntonKosov/limit-pr-commits-action/blob/master/LICENSE.md)
[![Tests](https://github.com/AntonKosov/limit-pr-commits-action/actions/workflows/tests.yaml/badge.svg)](https://github.com/AntonKosov/limit-pr-commits-action/actions/workflows/tests.yaml)
[![Coverage Status](https://coveralls.io/repos/github/AntonKosov/limit-pr-commits-action/badge.svg?branch=master)](https://coveralls.io/github/AntonKosov/limit-pr-commits-action?branch=master)

This GitHub Action automatically checks the number of commits in a pull request and fails the check if it exceeds a specified limit.

## Motivation

Keeping pull requests to a single, well-scoped commit offers several benefits:

* **Simplified Rollbacks**: If a merged pull request introduces a bug or issue, reverting a single commit is a straightforward and less error-prone operation than trying to selectively revert changes across multiple commits. This minimizes the risk of unintended consequences during the rollback process.   
* **Improved Bisectability**: `git bisect` is a powerful tool for identifying the commit that introduced a bug. With single-commit pull requests, each commit represents a logical unit of change. This makes the bisect process more precise and efficient, as you're testing well-defined changesets rather than potentially tangled modifications across multiple commits.
* **Enhanced Understanding of Changes**: A single, well-crafted commit message that summarizes the entire pull request makes it easier to understand the "why" behind the changes in the future. When looking back at the Git history, a single commit with a clear message provides a concise narrative of the feature or fix that was implemented.   
* **Easier Cherry-Picking**: If you need to apply a specific feature or fix to a different branch, cherry-picking a single commit is much simpler and less likely to introduce conflicts than cherry-picking a series of related but independent commits.
* **Reduced Cognitive Load**: For developers examining the Git history or trying to understand the evolution of the codebase, dealing with a series of small, focused commits from individual pull requests can be mentally taxing. Single-commit merges present a more consolidated and digestible view of how features and fixes were integrated.   
* **Streamlined Release Management**: When preparing releases, having features and fixes grouped into single commits can simplify the process of tagging releases and understanding what changes are included.
* **Better Alignment with Atomic Changes**: Encouraging single-commit pull requests often promotes the practice of creating smaller, more focused changes. This aligns with the principle of atomic commits, where each commit represents a single logical change, making the codebase easier to understand and maintain in the long run.

This action helps enforce this practice, encouraging developers to squash their commits before merging.

## Usage

To use this action, create a new workflow file (e.g., `.github/workflows/commits-limit.yml`) in your repository with the following content:

```yaml
name: Check Commit Limit

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  check_commits:
    runs-on: ubuntu-latest
    steps:
      - name: Check Commit Count
        uses: AntonKosov/limit-pr-commits-action@v1.0.0
        with:
          max_commits: 1 # Optional: Set the maximum number of allowed commits (default is 1)