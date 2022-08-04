import {Breadcrumb, Tag} from "antd";
import {GithubOutlined, SyncOutlined} from "@ant-design/icons";
import React from "react";

const PageTags = () => {
    return (
        <Breadcrumb
            style={{
                margin: '16px 0',
            }}
        >
            <Breadcrumb.Item>
                    <span className="project">
                            <span className="font">
                                <a href="https://github.com/LockGit/gochat" target="_blank">
                                    <GithubOutlined/> LockGit/gochat
                                </a>
                            </span>
                    </span>
                <span style={{margin: "0 0 0 20px"}}>
                        <Tag icon={<SyncOutlined spin/>} color="processing">gochat</Tag>
                        <Tag color="magenta">IM</Tag>
                        <Tag color="orange">Golang</Tag>
                        <Tag color="red">WebSocket</Tag>
                        <Tag color="gold">TCP</Tag>
                        <Tag color="purple">Distributed</Tag>
                        <Tag color="volcano">Pure Go</Tag>
                        <Tag color="green">Docker</Tag>
                        <Tag color="cyan">Etcd</Tag>
                        <Tag color="blue">Rpcx</Tag>
                        <Tag color="blue">Cache</Tag>
                        <Tag color="geekblue">Queue</Tag>
                    </span>
            </Breadcrumb.Item>
        </Breadcrumb>
    )
}
export default PageTags;