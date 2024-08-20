import React, { useEffect, useRef, useState } from 'react';
import G6 from '@antv/g6';
import { Card, Space, Table, Typography } from 'antd';
import './WholeGraph.css'
import api from './Components/Api';

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

const WholeGraph = (props) => {
    const textId = props.textId
    const [text, setText] = useState()
    const [json, setJson] = useState()
    const [textList, setTextList] = useState()
    const [fileList, setFileList] = useState()
    const [nodesList, setNodesList] = useState()
    const [edgesList, setEdgesList] = useState()
    const [fileJson, setFileJson] = useState()

    const fetchFileList = async() => {
        const data = await api.getFileList()
        console.log(data.data)
        const fileInfo = data.data.map(file => ({
            id: file.info.id,
            created_by: file.info.created_by,
            created_at: file.info.created_at,
            file_url: file.file_url,
            name: file.info.name,
            json_created: file.info.json_created,
            time: file.info.time
        }))
        console.log(fileInfo)
        setFileJson(fileInfo)
        return fileInfo
    } 

    const fetchTextList = async() => {
        const data = await api.getTextList()
        return data.data
    } 

    useEffect(() => {
        const getTextList = async() => {
            const textListFromServer = await fetchTextList()
            setTextList(textListFromServer)
        }

        getTextList()
    }, [])

    useEffect(() => {
        const getFileList = async() => {
            const fileListFromServer = await fetchFileList()
            setFileList(fileListFromServer)
        }

        getFileList()
    }, [])

    const containerRef = useRef(null);

    useEffect(() => {
        const nodes =[]
        const edges = []
        const style1 = {
            fill: '#ff6666',
            stroke: '#ff3333',
            lineWidth: 2
        }

        const style2 = {
            fill: '#a6e3e9',
            stroke: '#71c9ce',
            lineWidth: 2
        }

        if (textList && textList.length > 1) {
            textList.slice(1).forEach((list => {
                console.log(list.json_created.triples)
                const triples = list.json_created
                
                triples.forEach((item => {
                    console.log(item)
                    nodes.push({id:item.entity1, label:item.entity1, style: style2});
                    nodes.push({id:item.entity2, label:item.entity2, style: style2});
                    edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                }))
            }))
        }

        if (fileList && fileList.length > 1) {
            fileList.slice(1).forEach((file => {
                const triples = file.json_created

                triples.forEach((item => {
                    nodes.push({id:item.entity1, label:item.entity1});
                    nodes.push({id:item.entity2, label:item.entity2});
                    edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                }))
            }))
        }

        if (textList && textList.length > 0) {
            if (fileList && fileList.length > 0) {
                console.log(textList[0].time)
                console.log(fileList[0].time)

                if (textList[0].time > fileList[0].time) {
                    const triples = textList[0].json_created
                    triples.forEach((item => {
                        console.log(item)
                        nodes.push({id:item.entity1, label:item.entity1, style: style1});
                        nodes.push({id:item.entity2, label:item.entity2, style: style1});
                        edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                    }))

                    const triples1 = fileList[0].json_created
                    triples1.forEach((item => {
                        console.log(item)
                        nodes.push({id:item.entity1, label:item.entity1, style: style2});
                        nodes.push({id:item.entity2, label:item.entity2, style: style2});
                        edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                    }))
                }
                else {
                    const triples1 = fileList[0].json_created
                    triples1.forEach((item => {
                        console.log(item)
                        nodes.push({id:item.entity1, label:item.entity1, style: style1});
                        nodes.push({id:item.entity2, label:item.entity2, style: style1});
                        edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                    }))

                    const triples = textList[0].json_created
                    triples.forEach((item => {
                        console.log(item)
                        nodes.push({id:item.entity1, label:item.entity1, style: style2});
                        nodes.push({id:item.entity2, label:item.entity2, style: style2});
                        edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                    }))
                }
            }
            else {
                console.log(textList[0].json_created)
                console.log("no file")
                const triples = textList[0].json_created
                triples.forEach((item => {
                    console.log(item)
                    nodes.push({id:item.entity1, label:item.entity1, style: style1});
                    nodes.push({id:item.entity2, label:item.entity2, style: style1});
                    edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                }))
            }
        }
        else {
            if (fileList && fileList.length > 0) {
                console.log(fileList[0].json_created)
                console.log("no text")
                const triples = fileList[0].json_created
                triples.forEach((item => {
                    console.log(item)
                    nodes.push({id:item.entity1, label:item.entity1, style: style1});
                    nodes.push({id:item.entity2, label:item.entity2, style: style1});
                    edges.push({source: item.entity1, target:item.entity2, label:item.relationship});
                }))
            }
            else {
                console.log("no text, no file")
            }
        }

        setEdgesList(edges)
        setNodesList(nodes)
        console.log(edges)

        const graph = new G6.Graph({
            container: containerRef.current,
            fitView: true,
            width: 650,
            height: 600,
            size: 10,
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
    }, [textList]);

    return (
      <div className='graph-box-design'>
        <Space>
          <Card style = {{width: 700, height: 750}}>
            <div className='knowledge-graph-title'>
              <Typography.Title type="danger" level={4}>知识图谱</Typography.Title>
            </div>
            <div ref={containerRef} />
          </Card>

          
          <Card style = {{width: 700, height: 750}}>
          <div className='knowledge-graph-title'>
              <Typography.Title type="danger" level={4}>三元组列表</Typography.Title>
            </div>
            <Table 
                pagination={{showSizeChanger: false}}
              columns={columns} 
              dataSource={edgesList}
              style = {{width: 650, minHeight: 700}}>
            </Table>
          </Card>
        </Space>
      </div>    
    )
};

export default WholeGraph;