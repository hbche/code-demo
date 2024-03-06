/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Code } from './code';

const codeJson = `
# 部署时自动执行编译、日志、发布等功能
# 成功后通过飞书接口提示更新内容

image: deploy/base:v1 # 基于node构建的镜像，添加了npm登录信息，git信息，不校验host
stages:
  - publish
variables:
  # GIT_STRATEGY: clone # 使用clone方式获取代码库
  username: gitlab-ci
  useremail: ldsyzjb@163.com
  hookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/0190fe2a-7610-4648-ae04-bd7f7d1784a3'

publish:
  stage: publish
  tags:
    - docker # 只在docker标签的runner中运行
  only:
    - web # 只允许手动执行run pipline才能运行
    # - branches
  before_script:
    # 配置git账户
    - git config --global user.email
    - git config --global user.name
    - npm install @qt/tools -g
    # 重置 remote 地址，采用 assess_token 方式提交
    - project_url=$(echo $CI_PROJECT_URL | sed)
    - git remote set-url origin https://oauth2:$GITLAB_TOKEN@$project_url
    # 更新
    - git fetch
    - git checkout
    - git reset --hard origin/
    - git pull --tag
  script:
    #发布
    - npm install
    - npm run release
    - git push
    - git push --tag
  after_script:
    # 通知
    - npx -p @qt/tools notification $hookUrl

   `;

type State = {
  theme: string;
  editable: boolean;
};
export default class extends React.Component<any, State> {
  state = {
    theme: 'default',
    editable: true,
  };

  handleSelect = (value: string) => {
    this.setState({ ...this.state, theme: value });
  };

  handleEditable = (editable: boolean) => {
    this.setState({ ...this.state, editable });
  };

  render() {
    const { theme, editable } = this.state;
    const options = [
      {
        label: 'default',
        value: 'default',
      },
      {
        label: 'dark',
        value: 'dark',
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          <select
            value={theme}
            onChange={(e: any) => {
              this.handleSelect(e.target.value);
            }}
          >
            {options.map((option: any, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          <input
            type='checkbox'
            name='editable'
            checked={editable}
            onChange={(e: any) => {
              this.handleEditable(e.target.value);
            }}
          />
        </div>
        <Code
          mode='yaml'
          code={codeJson}
          editable={editable}
          lineWrap={true}
          theme={theme}
          placeholder='placeholder'
        />
      </div>
    );
  }
}
