import subprocess
from collections import defaultdict
from datetime import datetime

def get_git_log(repo_path):
    """获取指定仓库的 git 提交历史"""
    try:
        log_command = ['git', '-C', repo_path, 'log', '--since="1 year ago"', '--pretty=format:%H %cd', '--date=short']
        result = subprocess.check_output(log_command, universal_newlines=True, encoding='utf-8')
        return result.splitlines()
    except subprocess.CalledProcessError as e:
        print(f"Error getting git log for {repo_path}: {e}")
        return []

def get_code_diff(repo_path, commit_hash):
    """获取指定 commit 的代码变化量（使用 --numstat）"""
    try:
        diff_command = ['git', '-C', repo_path, 'show', '--numstat', commit_hash]
        result = subprocess.check_output(diff_command, universal_newlines=True, encoding='utf-8')
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error getting git diff for commit {commit_hash} in {repo_path}: {e}")
        return ""

def calculate_code_changes(repo_path, commits):
    """计算每个提交的代码行数变化，并按日期聚合"""
    changes_by_date = defaultdict(lambda: {'added': 0, 'removed': 0})

    for commit in commits:
        commit_hash, commit_date = commit.split()
        diff = get_code_diff(repo_path, commit_hash)

        added_lines = 0
        removed_lines = 0

        # 解析代码差异，获取新增和删除的行数
        for line in diff.splitlines():
            # 只处理数值行，跳过其他信息行
            if line.strip() and not line.startswith("commit"):
                parts = line.split('\t')
                if len(parts) == 3:
                    added_lines += int(parts[0])  # 新增行
                    removed_lines += int(parts[1])  # 删除行

        # 记录到字典中，按日期聚合
        changes_by_date[commit_date]['added'] += added_lines
        changes_by_date[commit_date]['removed'] += removed_lines

    return changes_by_date

def aggregate_changes(repo1_path, repo2_path):
    """聚合两个仓库的代码变化量"""
    repo1_commits = get_git_log(repo1_path)
    repo2_commits = get_git_log(repo2_path)

    repo1_changes = calculate_code_changes(repo1_path, repo1_commits)
    repo2_changes = calculate_code_changes(repo2_path, repo2_commits)

    combined_changes = defaultdict(lambda: {'added': 0, 'removed': 0})

    # 合并两个仓库的代码变化量
    for date in set(repo1_changes.keys()).union(set(repo2_changes.keys())):
        combined_changes[date]['added'] = repo1_changes[date]['added'] + repo2_changes[date]['added']
        combined_changes[date]['removed'] = repo1_changes[date]['removed'] + repo2_changes[date]['removed']

    return combined_changes

def print_changes(changes):
    """输出每天的代码变化量，并计算总数"""
    total_added = 0
    total_removed = 0

    for date in sorted(changes.keys()):
        added = changes[date]['added']
        removed = changes[date]['removed']
        total_added += added
        total_removed += removed
        print(f"{date} - Added: {added} lines, Removed: {removed} lines")

    print("\nTotal added lines:", total_added)
    print("Total removed lines:", total_removed)

if __name__ == "__main__":
    # 设置项目路径
    repo1_path = r"D:\CodeProject\vue-admin-template"
    repo2_path = r"D:\CodeProject\springboot-admin"  # 修改为第二个项目路径

    # 聚合代码变化量
    combined_changes = aggregate_changes(repo1_path, repo2_path)

    # 输出结果
    print_changes(combined_changes)
