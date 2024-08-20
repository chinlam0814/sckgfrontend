import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network';

const GraphVisualization = ({ graphData }) => {
  const networkContainer = useRef(null);

  useEffect(() => {
    if (graphData) {
      const { nodes, edges } = graphData;
      const visNodes = new DataSet(nodes);
      const visEdges = new DataSet(edges);

      const container = networkContainer.current;
      const data = { nodes: visNodes, edges: visEdges };
      const options = {}; // 根据需要配置 vis.js 图形的选项

      const network = new Network(container, data, options);

      // 可以根据需要监听 vis.js 图形事件
      // network.on('click', function(params) {
      //   console.log('click event:', params);
      // });

      return () => {
        network.destroy(); // 在组件卸载时销毁 vis.js 图形
      };
    }
  }, [graphData]);

  return <div ref={networkContainer} style={{ width: '100%', height: '500px' }} />;
};

export default GraphVisualization;