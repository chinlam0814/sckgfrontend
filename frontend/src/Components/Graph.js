import React, { useEffect, useRef, useState } from 'react';
import G6 from '@antv/g6';
import { Tag, Avatar, Card, Space, Table, Typography } from 'antd';
import './Graph.css'
import api from './Api';
import { UserOutlined } from '@ant-design/icons';
const { Text, Title } = Typography

const Graph = (props) => {
    const textId = props.textId
    const type = props.type
    const [text, setText] = useState()
    const [file, setFile] = useState()
    const [json, setJson] = useState()
    const [fileUrl, setFileUrl] = useState()
    const [edgesList, setEdgesList] = useState([])
    const [input, setInput] = useState([])

    const fetchText = async() => {
        if (type === 'text') {
            console.log(textId)
            const data = await api.getText(textId)
            setInput(data.data[0].text)
            setJson(data.data[0].json_created)
            return data.data[0].json_created
        }
    }

    const fetchFile = async() => {
        if (type === 'file') {
            console.log(textId)
            const data = await api.getFile(textId)
            console.log(data.data)
            setInput(data.data[0].info.name)
            setFileUrl(data.data[0].file_url)
            setJson(data.data[0].info.json_created)
            return data
          }
    }

    useEffect(() => {
        const getText = async() => {
            const textFromServer = await fetchText()
            setText(textFromServer)
        }

        getText()
    }, [textId])

    useEffect(() => {
        const getFile = async() => {
            const fileFromServer = await fetchFile()
            setFile(fileFromServer)
        }

        getFile()
    }, [textId])

    const columns = [
      {
          title: '实体1',
          align: 'center',
          dataIndex: 'source',
          key: 'entity1',
          renderItem: (entity1) => <a>{entity1}</a>
      },
      {
          title: '关系',
          align: 'center',
          dataIndex: 'label',
          key: 'relationship',
          renderItem: (relationship) => <a>{relationship}</a>
      },
      {
        title: '实体2',
        align: 'center',
        dataIndex: 'target',
        key: 'entity2',
        renderItem: (entity2) => <a>{entity2}</a>
      },
  ]

    const containerRef = useRef(null);

    useEffect(() => {
      const nodes =[]
      const edges = []

      if(json && json.length > 0){
          json.forEach((item => {
            console.log(item)
            nodes.push({id:item.entity1, label:item.entity1});
            nodes.push({id:item.entity2, label:item.entity2});
            edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
          }))
      }

      setEdgesList(edges)

      const graph = new G6.Graph({
          container: containerRef.current,
          fitView: true,
          width: 500,
          height: 350,
          size: 12,
          modes: {
              default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
          },
          defaultEdge: {
            shape: 'edge-arrow',
            style: {
                endArrow: true,
            },
          },
          defaultNode: {
            labelCfg: {
                position: 'bottom',
            },
            style: {
                fill: '#a6e3e9',
                stroke: '#71c9ce',
                lineWidth: 2,
            },
            edgeLabelCfg: {
                position: 'top',
            },
          },
          layout: {
              type: 'circular',
              fitView: true,
          }
      });
      

      graph.read({nodes, edges});
      return () => {
        graph.destroy();
      };

    }, [json]);

    return (
      <div className='graph-box-design'>
        <Space direction='vertical'>
        <Space direction='vertical' style={{ width: 800 }} align='end'>
            <Space type='vertical'>
            {type === 'file' ? (
              <Tag style={{ width: 500, whiteSpace: 'normal' }} color="geekblue">
                <a href={fileUrl} style={{ textDecoration: 'underline', color: 'red' }} download>
                  <h3>{input}</h3>
                </a>
              </Tag>
            ) : (
              <Tag style={{ width: 500, whiteSpace: 'normal' }} color="geekblue">
                <h3>{input}</h3>
              </Tag>
            )}
            <Avatar size="large" src="https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_User-Avatar-Profile-Photo-01-256.png" />
              <Avatar size="large" src='https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_User-Avatar-Profile-Photo-01-256.png' />
            </Space>
        </Space>

        <Space direction='veritical'style={{ width: 800 }} align='end'>
            <Space style={{margin: 20}}>
              <Avatar size="large" src='https://cdn0.iconfinder.com/data/icons/chatbot-10/128/bot-chat-chatbot-face-virtual-robot-chatting-256.png' />
                <Card style = {{width: 600}}>
                <Title type='danger' level={5}>知识图谱</Title>
                    <div ref={containerRef} />

                    <Title type='danger' level={5}>三元组列表</Title>
                    <Table 
                      className='table-card-design'
                      pagination={{showSizeChanger: false}}
                      columns={columns} 
                      dataSource={edgesList}
                      style = {{minHeight: 400}}>
                    </Table>
                </Card>
            </Space>

          </Space>
        </Space>
      </div>     
    )
};

export default Graph;