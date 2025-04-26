import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';

export default function ProgressGraph({ selectedCourses }) {
  const ref = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/api/graph/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch graph data');
        return res.json();
      })
      .then((data) => setGraphData(data))
      .catch((err) => {
        console.error('Failed to fetch graph data:', err);
        setGraphData({ nodes: [], links: [] });
      });
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0 && selectedCourses.length > 0) {
      drawGraph(selectedCourses, graphData);
    } else {
      clearGraph();
    }
  }, [selectedCourses, graphData]);

  const clearGraph = () => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
  };

  const drawGraph = (selected, data) => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const width = 1850;
    const height = 700;
    svg.attr('width', width).attr('height', height);

    const g = new dagreD3.graphlib.Graph().setGraph({
      rankdir: 'LR',
      marginx: 50,
      marginy: 50,
      ranksep: 150,
      nodesep: 50,
      edgesep: 10,
      acyclicer: 'greedy',
      ranker: 'network-simplex'
    });
    g.setDefaultEdgeLabel(() => ({}));

    const selectedSet = new Set(selected);
    const includedNodes = new Set();
    const openClasses = new Set();

    data.nodes.forEach((node) => {
      if (selectedSet.has(node.id)) {
        g.setNode(node.id, {
          label: node.id,
          shape: 'circle',
          style: 'fill: #4caf50',
          labelStyle: 'fill: #fff',
          originalData: node
        });
        includedNodes.add(node.id);
      }
    });

    data.links.forEach((link) => {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;

      if (selectedSet.has(target)) {
        g.setNode(source, {
          label: source,
          shape: 'circle',
          style: 'fill: #2196f3',
          labelStyle: 'fill: #fff',
          originalData: { id: source }
        });
        g.setEdge(source, target, {
          style: 'stroke: #ffffff; stroke-width: 2px;',
          arrowheadStyle: 'fill: #ffffff'
        });
        includedNodes.add(source);
      } else if (selectedSet.has(source) && !selectedSet.has(target)) {
        openClasses.add(target);
        g.setNode(target, {
          label: target,
          shape: 'circle',
          style: 'fill: #FFD700',
          labelStyle: 'fill: #000',
          originalData: { id: target }
        });
        g.setEdge(source, target, {
          style: 'stroke: #FFD700; stroke-width: 2px;',
          arrowheadStyle: 'fill: #FFD700'
        });
      }
    });

    const render = new dagreD3.render();
    const svgGroup = svg.append('g');
    render(svgGroup, g);

    const zoom = d3.zoom().on('zoom', (event) => svgGroup.attr('transform', event.transform));
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(100, 50).scale(0.8));

    const nodeElements = svgGroup.selectAll('g.node');
    nodeElements
      .on('click', function (event, id) {
        const nodeData = g.node(id).originalData;
        setSelectedNode(nodeData);
        setPopupPosition({ x: event.clientX, y: event.clientY });
        event.stopPropagation();
      });

    svg.on('click', () => {
      setSelectedNode(null);
    });
  };

  const CoursePopup = ({ node, position, onClose }) => {
    if (!node) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: position.y,
          left: position.x,
          background: 'white',
          border: '1px solid #ccc',
          padding: '12px',
          borderRadius: '6px',
          zIndex: 1000,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        }}
      >
        <h4>{node.id}</h4>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', paddingLeft: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#4caf50', border: '1px solid white' }}></div>
          <span style={{ color: 'white' }}>Completed Course</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2196f3', border: '1px solid white' }}></div>
          <span style={{ color: 'white' }}>Required Prerequisite</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFD700', border: '1px solid white' }}></div>
          <span style={{ color: 'white' }}>Prereqs are Met</span>
        </div>
      </div>

      <svg ref={ref}></svg>
      {selectedNode && (
        <CoursePopup node={selectedNode} position={popupPosition} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}