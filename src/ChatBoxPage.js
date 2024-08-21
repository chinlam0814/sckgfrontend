import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './Components/Api';
import Graph from './Components/Graph'
import '@chatui/core/es/styles/index.less';
import { Card, CardTitle, CardActions } from '@chatui/core';
import Chat, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';
import './ChatBoxPage.css'
import axios from 'axios'
import Cookies from 'js-cookie';
import { Alert, Space, message, Upload, List, Form, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import OpenAI from 'openai';

var cosineSimilarity = require('compute-cosine-similarity')

const client = new OpenAI({
    apiKey: 'sk-proj-3ulLVu675fEXo9Md8cVXT3BlbkFJkDVUgy73QPQG8Fra3ufR',
    dangerouslyAllowBrowser: true
});

const ChatBoxPage = () => {
    const navigate = useNavigate()
    const userId = Cookies.get('id')
    const username = Cookies.get('username')
    let loginType = Cookies.get('user')
    const [gender, setGender] = useState()
    const [account, setAccount] = useState([])
    const [admin, setAdmin] = useState([])
    const { messages, appendMsg, setTyping } = useMessages([]);
    const [tableData, setTableData] = useState([])
    const [file, setFile] = useState(null)
    const [fileText, setFileText] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fileResponse, setFileResponse] = useState('')
    const [triples, setTriples] = useState()
    const [similar, setSimilar] = useState([])
    const [node, setNode] = useState([])
    var textId = 0
    var value
    //var textId = 0;
    var flag = false
    
    const fetchAccount = async() => {
      if(loginType === 'Account'){
          const data = await api.getAccount(userId)
          setGender(data.data[0].gender)
      }
    }

    const fetchTriples = async() => {
        const data = await api.getTriples()
        console.log(data.data)
        //setTriples(data.data)
        return data.data
    }

    useEffect(() => {
        const getAccount = async() => {
            const accountFromServer = await fetchAccount()
            setAccount(accountFromServer)
        }

        getAccount()
    }, [])

    useEffect(() => {
        const getTriples = async() => {
            const triplesFromServer = await fetchTriples()
            setTriples(triplesFromServer)
        }

        getTriples()
    }, [])

    const handleUploadText = async(text, edges) => {
        var data
        const ty = 'text'
        console.log(value)
        
        data = await api.createText(text, username, edges)

        if(data.errorCode === 0){
            textId = data.data[0].id
            message.success('上传成功！')

            const target = `/chatbox/${ty}/${textId}`;

            window.location.href = target
            //console.log("textId :" + textId)
        }
        else{
            textId = 0
            message.error('上传失败，请重新上传！')
        }
    }

    async function getEmbedding(text) {
        try {
            const response = await client.embeddings.create({
                model: 'text-embedding-3-large',
                input: [text]
            });
            return response.data[0].embedding;
        } 
        catch (error) {
            console.error('Error fetching embedding:', error);
            return null;
        }
    }

    async function checkSimilarity(newTriples) {
        const similarityResults = [];
      
        for (const newTriple of newTriples) {
          const newEmbedding = await getEmbedding(`${newTriple.entity1}${newTriple.relationship}${newTriple.entity2}`);
          
          let highestSimilarity = -1;
          let mostSimilarTriple = null;
      
          for (const triple of triples) {
            const existingEmbedding = await getEmbedding(`${triple.entity1}${triple.relationship}${triple.entity2}`);
            
            if (newEmbedding && existingEmbedding) {
              const similarity = cosineSimilarity(newEmbedding, existingEmbedding);
              
              if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                mostSimilarTriple = triple;
              }
            }
          }
      
          if (highestSimilarity > 0.95) {
            similarityResults.push({
                newTriple,
                highestSimilarity,
                mostSimilarTriple
            });
          }
        }
      
        console.log(similarityResults)
        return similarityResults
    }

    async function handleSend(type, val) {
        console.log('type:', type)
        value = val
        if (type === 'text' && val.trim()) {
            
            if (gender === 'woman') {
                appendMsg({
                    type: 'text',
                    people: 'user',
                    user: { avatar: 'https://cdn2.iconfinder.com/data/icons/avatars-60/5985/16-Artist-256.png' },
                    content: { text: val },
                    position: 'right',
                });
            }
            else {
                appendMsg({
                    type: 'text',
                    people: 'user',
                    user: { avatar: 'https://cdn2.iconfinder.com/data/icons/avatars-60/5985/40-School_boy-512.png' },
                    content: { text: val },
                    position: 'right',
                });
            }
            
            setTyping(true);
    
            const response = await callAi(val, type);
            console.log(response)
            console.log(value)
            setTableData(response)
            const messageType = response === '无三元组' ? 'text' : 'repeatTriples';
            setTimeout(() => {
                appendMsg({
                    type: messageType,
                    people: 'robot',
                    user: {avatar: 'https://cdn0.iconfinder.com/data/icons/chatbot-10/128/bot-chat-chatbot-face-virtual-robot-chatting-256.png'},
                    content: { text: JSON.stringify(response), value: value},
                });
            }, 1000);  
        }
        else if (type === 'file') {
            console.log(val)

            if (gender === 'woman') {
                appendMsg({
                    type: 'text',
                    people: 'user',
                    user: { avatar: 'https://cdn2.iconfinder.com/data/icons/avatars-60/5985/16-Artist-256.png' },
                    content: { text: val },
                    position: 'right',
                });
            }
            else {
                appendMsg({
                    type: 'text',
                    people: 'user',
                    user: { avatar: 'https://cdn2.iconfinder.com/data/icons/avatars-60/5985/40-School_boy-512.png' },
                    content: { text: val },
                    position: 'right',
                });
            }
            
            setTyping(true);

            appendMsg({
                type: 'file',
                people: 'robot',
                user: {avatar: 'https://cdn0.iconfinder.com/data/icons/chatbot-10/128/bot-chat-chatbot-face-virtual-robot-chatting-256.png'},
                content: { text: val },
            });
        }
        else if (type === 'donefile' || type === 'donetext') {
            setTyping(true);

            appendMsg({
                type: 'donefile',
                people: 'robot',
                user: {avatar: 'https://cdn0.iconfinder.com/data/icons/chatbot-10/128/bot-chat-chatbot-face-virtual-robot-chatting-256.png'},
                content: { text: val },
            });
        }
    }

    const prompt_template = {
        "description": "请根据提供文本，提取出所有的三元组信息，找出所有相关的人、事和概念。每个句子都要提取三元组。文本包含主语、谓语和宾语。实体1(entity1)为主语，关系(relationship)为谓语，实体2(entity2)为宾语。实体1称为entity1,实体2称为entity2,关系称为relationship",
        "format": "确保返回标准的 JSON 格式，包含实体1、关系、实体2。如果没有三元组，只需要返回‘无三元组’，不需要输出别的句子",
        "example": "例如：智慧城市包含智能交通，智慧能源，智慧环境。",
        "output_example": {
            "triples": [
                {"entity1": "智慧城市", "relationship": "包含", "entity2": "智能交通"},
                {"entity1": "智慧城市", "relationship": "包含", "entity2": "智慧能源"},
                {"entity1": "智慧城市", "relationship": "包含", "entity2": "智慧环境"}
            ]
        }
    };

    function isJson(str) {
        try {
            JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    const callAi = async (input, type) => {  
        try {
            const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages:[
                    {
                        "role" : "system",
                        "content" : JSON.stringify(prompt_template),
                    },
                    {
                        "role" : "user",
                        "content" : input,
                    },
                ],
                max_tokens: 1000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-proj-3ulLVu675fEXo9Md8cVXT3BlbkFJkDVUgy73QPQG8Fra3ufR'
                }
            }
            );
    
            const aiResponse = response.data.choices[0].message.content;
            console.log(aiResponse)

            if (!isJson(aiResponse)) {
                JSON.stringify(aiResponse)
            }

            if (aiResponse === '无三元组') {
                textId = 0
                flag = false;
                // if (type !== 'text') {
                //     handleSend('donefile', aiResponse)
                // }
            }
            else {
                const triples = JSON.parse(aiResponse)
                const edges =[]
    
                triples.triples.forEach((triple => {
                    console.log(triple.entity1)
                    edges.push({entity1: triple.entity1, relationship:triple.relationship, entity2:triple.entity2});
                }))

                flag = true

                console.log(edges)

                setNode(edges)
                console.log('value', value)
                console.log('node', node)

                if (type === 'text') {
                    var similarityResults = await checkSimilarity(edges)
                    
                    if (similarityResults.length != 0) {
                        const similarList = []

                        similarityResults.forEach((similar => {
                            console.log(similar.mostSimilarTriple)
                            similarList.push({newTriple: similar.newTriple, highestSimilarity:similar.highestSimilarity, mostSimilarTriple:similar.mostSimilarTriple});
                        }))

                        return similarList
                    }
                    else {
                        handleUploadText(value, edges)
                    }
                    // handleUploadText(value, edges)
                }
                else {
                    console.log('here')
                    setFileResponse(aiResponse)

                    var similarityResults = await checkSimilarity(edges)
                    
                    if (similarityResults.length != 0) {
                        const similarList = []

                        similarityResults.forEach((similar => {
                            console.log(similar.mostSimilarTriple)
                            similarList.push({newTriple: similar.newTriple, highestSimilarity:similar.highestSimilarity, mostSimilarTriple:similar.mostSimilarTriple});
                        }))

                        return similarList
                    }
                    else {
                        handleUploadFile(edges)
                    }

                    // handleUploadFile(edges)
                }
            }

            return aiResponse
        } 
        catch (e) {
            return e.message
        }
    };

    const extractText = async() => {
        const formData = new FormData()
        formData.append('file', file);

        var data

        data = await api.extractFile(formData)

        const pdfText = data.data.data[0]
        setFileText(pdfText)
        console.log(pdfText)

        const response = await callAi(pdfText, 'file')
        const messageType = response === '无三元组' ? 'text' : 'repeatTriples';
        setTimeout(() => {
            appendMsg({
                type: messageType,
                people: 'robot',
                user: {avatar: 'https://cdn0.iconfinder.com/data/icons/chatbot-10/128/bot-chat-chatbot-face-virtual-robot-chatting-256.png'},
                content: { text: JSON.stringify(response), value: pdfText},
            });
        }, 1000);  

        console.log(response)
    }

    const handleUploadFile = async(edges) => {
        const formData = new FormData()
        formData.append('file', file, fileText);
        const fileName = file.name;
        console.log(file)
        console.log(fileName)
        setLoading(true)

        var data

        data = await api.createFileInfo(fileName, username, edges)
        //console.log(user.data[0])
        console.log(data.errorCode)

        if(data.errorCode === 0){
            const ty = 'file'
            const fileData = await api.uploadFile(data.data[0].id, formData)
            console.log(fileData)
            //message.success('上传成功！')
            // handleSend('donefile', '上传成功')
            // setTimeout(function(){
            //     window.location.reload();
            // }, 1800);

            const target = `/chatbox/${ty}/${data.data[0].id}`;

            window.location.href = target
        }
        else{
            //message.error('上传失败，请重新上传')
            handleSend('donefile', '上传失败，文件名重复')
        }
    }
  
    function renderMessageContent(msg) {
        const { type, people, content } = msg;
        // console.log(textId)

        if (type === 'text') {
            if (textId === 0) {
                return (
                    <Bubble content={content.text}/>
                )
            }
        }
        else if (type === 'repeatTriples') {
            if (textId === 0) {
                const list = JSON.parse(content.text)
                console.log(list)
                if (list.length > 0) {
                    return (
                        <Bubble>
                            <Card>
                                <Alert message="已有相似的三元组，点击确认以继续添加该三元组，注意避免三元组重复！" type="warning" showIcon/>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={list}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Form>
                                                <Form.Item label="新三元组">
                                                    {`(${item.newTriple.entity1}, ${item.newTriple.relationship}, ${item.newTriple.entity2})`}
                                                </Form.Item>
    
                                                <Form.Item label="已有三元组">
                                                    {`(${item.mostSimilarTriple.entity1}, ${item.mostSimilarTriple.relationship}, ${item.mostSimilarTriple.entity2})`}
                                                </Form.Item>
                                            </Form>
                                        </List.Item>
                                    )}
                                />
                                <Button type='primary' danger onClick={() => handleUploadText(content.value, node)}>确认</Button>
                            </Card>
                        </Bubble>
                    )
                }
                else {
                    return (
                        <Bubble content={content.text}/>
                    )
                }
            }
        }
        else if (type === 'donefile') {
            if (textId === 0) {
                return <Bubble content={content.text}/>;
            }
        }
        else {
            return (
                <Bubble>
                    <Card size="l">
                        <CardTitle>上传文件</CardTitle>
                        <CardActions>
                            <Upload {...props}><Button icon={<UploadOutlined />} danger>选择文件</Button></Upload>
                        </CardActions>
                        {file ?<Button type="primary" onClick={extractText}>上传</Button> :<></>}
                    </Card>
                </Bubble>
            )
        }
    }

    const defaultQuickReplies = [
        {
            name: '上传文件',
            isHighlight: true,
        },
    ];

    const props = {
        onRemove: () => {
            setFile(null)
        },
        beforeUpload: (file) => {
            setFile(file);
            return false;
        },
        fileList: file ? [file] : [],
    }

    function handleQuickReplyClick(item) {
        if (item.name === '上传文件') {
            setFile(null)
            handleSend('file', item.name)
        }
    }
  
    return (
        <Space direction='vertical'>
            <div className='chat-box-display-design'>
            <Chat
                style={{width: 400}}
                navbar={{title: '智能问答'}}
                messages={messages}
                renderMessageContent={renderMessageContent}
                quickReplies={defaultQuickReplies}
                onQuickReplyClick={handleQuickReplyClick}
                onSend={handleSend}
                />
            </div>
        </Space>
    );
}

export default ChatBoxPage