import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function CourseGraph() {
  const ref = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch departments and initial graph data on component mount
  useEffect(() => {
    // Fetch departments
    fetch('http://localhost:8000/api/department/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch departments');
        return res.json();
      })
      .then((data) => {
        // console.log('Departments loaded:', data);
        setDepartments(data);
      })
      .catch(err => {
        console.error("Failed to fetch departments:", err);
        setError("Failed to load departments. Please try again later.");
      })
      .finally(() => {
        // Fetch initial graph data regardless of department fetch result
        fetchGraphData('all');
      });
  }, []);

  // Fetch graph data when selected department changes
  useEffect(() => {
    fetchGraphData(selectedDepartment);
  }, [selectedDepartment]);

  const fetchGraphData = (department) => {
    // Clear selected node and set loading state
    setSelectedNode(null);
    setIsLoading(true);
    setError(null);

    // Build URL with query parameter if a specific department is selected
    let url = 'http://localhost:8000/api/graph/';
    if (department !== 'all') {
      url += `?department=${department}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch graph data');
        return res.json();
      })
      .then((data) => {
        // console.log('Graph data loaded:', data);
        setGraphData(data);
        // Check if the response has empty nodes array
        if (!data.nodes || data.nodes.length === 0) {
          console.log('No courses found for this department');
        }
      })
      .catch(err => {
        console.error("Failed to fetch graph data:", err);
        setError("Failed to load course data. Please try again later.");
        // Clear graph data on error
        setGraphData({ nodes: [], links: [] });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDepartmentChange = (event) => {
    const departmentId = event.target.value;
    // console.log('Switching to department:', departmentId);
    setSelectedDepartment(departmentId);
  };

  useEffect(() => {
    if (!isLoading) {
      drawGraph(graphData);
    }
  }, [graphData, isLoading]);

  const drawGraph = (graph) => {
    const width = 800;
    const height = 600;
    const nodeRadius = 35;

    // Define bounds with padding equal to the node radius
    const xBoundary = [nodeRadius, width - nodeRadius];
    const yBoundary = [nodeRadius, height - nodeRadius];

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    // Clear existing content
    svg.selectAll("*").remove();

    // Check for empty graph data explicitly
    if (!graph.nodes || graph.nodes.length === 0) {
      // Get the currently selected department name for better messaging
      // Get the currently selected department name for better messaging
      const departmentName = selectedDepartment === 'all'
        ? 'any department'
        : departments.find(d => String(d.dno) === String(selectedDepartment))?.dname || selectedDepartment;

      // Display a message with the department name
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", "18px")
        .text(`No courses available for ${departmentName}`);

      // Add smaller hint text
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#aaaaaa")
        .attr("font-size", "14px")
        .text("Try selecting a different department");

      return;
    }

    // Define arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 40)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#ffffff")
      .style("stroke", "none");

    // Define highlighted arrowhead marker with different color
    svg.append("defs").append("marker")
      .attr("id", "arrowhead-highlight")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 40)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#ffff00")
      .style("stroke", "none");

    // Create simulation with forces
    const simulation = d3.forceSimulation(graph.nodes)
      .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      // Add bounding box force
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      // Add collision detection to prevent node overlap
      .force("collision", d3.forceCollide().radius(nodeRadius + 5));

    // Build adjacency list for graph traversal
    const adjacencyList = buildAdjacencyList(graph);

    // Add links with arrowheads
    const link = svg.append("g")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", 2)
      .attr("stroke", d => d.type === "prereq" ? "#ffffff" : "#ff9c6e")
      .attr("marker-end", "url(#arrowhead)")
      .attr("class", d => {
        const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
        const targetId = typeof d.target === 'object' ? d.target.id : d.target;
        return `link source-${sourceId} target-${targetId}`;
      });

    // Create node groups for better organization
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr("class", d => `node-group node-${d.id}`);

    // Add circles to node groups
    const node = nodeGroup.append("circle")
      .attr("r", nodeRadius)
      .attr("fill", "#ff4d4f")
      .attr("class", "node-circle")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add text labels to node groups
    const label = nodeGroup.append("text")
      .text(d => d.id)
      .attr("fill", "#ffffff")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("pointer-events", "none");

    // Handle node highlighting on hover and click
    nodeGroup
      .on("mouseover", handleNodeHover)
      .on("mouseout", handleNodeUnhover)
      .on("click", handleNodeClick);

    // Keep track of click state
    let clickedNode = null;

    // Build adjacency list for the graph to enable DFS traversal
    function buildAdjacencyList(graph) {
      const adjacencyList = {};

      // Initialize empty adjacency lists for each node
      graph.nodes.forEach(node => {
        adjacencyList[node.id] = [];
      });

      // Populate adjacency lists with bidirectional connections
      graph.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        // Add connections in both directions to find all connected nodes
        adjacencyList[sourceId].push({
          nodeId: targetId,
          linkIndex: graph.links.indexOf(link)
        });
        adjacencyList[targetId].push({
          nodeId: sourceId,
          linkIndex: graph.links.indexOf(link)
        });
      });

      return adjacencyList;
    }

    // Find all connected nodes and edges using DFS
    function findConnectedNodes(startNodeId) {
      const connectedNodes = new Set();
      const connectedEdges = new Set();
      const visited = new Set();

      function dfs(nodeId) {
        if (visited.has(nodeId)) return;

        visited.add(nodeId);
        connectedNodes.add(nodeId);

        // Visit all neighbors
        adjacencyList[nodeId].forEach(neighbor => {
          connectedEdges.add(neighbor.linkIndex);
          dfs(neighbor.nodeId);
        });
      }

      // Start DFS from the given node
      dfs(startNodeId);

      return {
        nodes: connectedNodes,
        edges: connectedEdges
      };
    }

    function handleNodeHover(event, d) {
      // Skip hover effect if a node is already clicked
      if (clickedNode) return;

      highlightConnections(d);
    }

    function handleNodeUnhover(event, d) {
      // Skip unhover effect if a node is clicked
      if (clickedNode) return;

      resetHighlighting();
    }

    function handleNodeClick(event, d) {
      // If clicking the same node, reset
      if (clickedNode === d.id) {
        clickedNode = null;
        resetHighlighting();
        setSelectedNode(null); // Close the popup
      } else {
        clickedNode = d.id;
        highlightConnections(d);

        // Find the full node data from graphData
        const fullNodeData = graphData.nodes.find(node => node.id === d.id);
        console.log("Full node data for popup:", fullNodeData);

        // If d3 has modified the structure, reconstruct the node data
        const nodeForPopup = {
          ...d,  // Include all D3 properties like x, y
          ...fullNodeData  // Overlay with full API data
        };

        console.log("Combined node data for popup:", nodeForPopup);

        // Set the selected node data for the popup
        setSelectedNode(nodeForPopup);

        // Calculate popup position based on node position
        setPopupPosition({
          x: d.x,
          y: d.y
        });
      }

      // Prevent event propagation
      event.stopPropagation();
    }

    // Add click handler to svg background to reset highlighting
    svg.on("click", () => {
      if (clickedNode) {
        clickedNode = null;
        resetHighlighting();
        setSelectedNode(null); // Close the popup when clicking outside
      }
    });

    function highlightConnections(d) {
      // Find all connected nodes and edges using DFS
      const connected = findConnectedNodes(d.id);

      // Dim all nodes and links first
      nodeGroup.classed("dimmed", true);
      link.classed("dimmed", true);

      // Highlight the connected nodes
      nodeGroup.filter(node => connected.nodes.has(node.id))
        .classed("highlighted", true)
        .classed("dimmed", false);

      // Highlight the connected links
      link.each(function(l, i) {
        if (connected.edges.has(i)) {
          d3.select(this)
            .classed("highlighted", true)
            .classed("dimmed", false)
            .attr("marker-end", "url(#arrowhead-highlight)");
        }
      });
    }

    function resetHighlighting() {
      // Remove all highlighting and dimming classes
      nodeGroup.classed("highlighted", false).classed("dimmed", false);
      link.classed("highlighted", false).classed("dimmed", false)
        .attr("marker-end", "url(#arrowhead)");
    }

    simulation.on("tick", () => {
      // Constrain nodes to viewport boundaries
      graph.nodes.forEach(node => {
        node.x = Math.max(xBoundary[0], Math.min(xBoundary[1], node.x));
        node.y = Math.max(yBoundary[0], Math.min(yBoundary[1], node.y));
      });

      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      // Constrain dragged node to viewport boundaries
      d.fx = Math.max(xBoundary[0], Math.min(xBoundary[1], event.x));
      d.fy = Math.max(yBoundary[0], Math.min(yBoundary[1], event.y));
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add CSS for highlighting and dimming
    const style = document.createElement('style');
    style.textContent = `
      .node-group.highlighted .node-circle {
        fill: #ff3b5c;
        stroke: #ffffff;
        stroke-width: 3px;
      }
      .node-group.dimmed {
        opacity: 0.3;
      }
      line.highlighted {
        stroke: #ff3b5c;
        stroke-width: 3px;
      }
      line.dimmed {
        opacity: 0.2;
      }
      .course-popup {
        position: absolute;
        background-color: #fff;
        border: 2px solid #ff4d4f;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 300px;
        pointer-events: auto;
      }
      .course-popup h3 {
        margin-top: 0;
        color: #ff4d4f;
        border-bottom: 1px solid #eee;
        padding-bottom: 6px;
      }
      .course-popup p {
        margin: 6px 0;
      }
      .course-popup .close-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #666;
      }
      .course-popup .close-btn:hover {
        color: #ff4d4f;
      }
      .department-selector-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        width: 100%;
      }
      .department-selector {
        display: flex;
        align-items: center;
        background-color: rgba(45, 45, 45, 0.8);
        padding: 8px 16px;
        border-radius: 6px;
      }
      .department-selector label {
        margin-right: 10px;
        font-weight: bold;
        color: #ffffff;
      }
      .department-selector select {
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid #444;
        background-color: #333;
        color: #ffffff;
        font-size: 14px;
        min-width: 180px;
        outline: none;
      }
      .department-selector select:focus {
        border-color: #ff4d4f;
      }
      .department-selector select option {
        background-color: #333;
        color: #ffffff;
      }
      .loading-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ffffff;
        font-size: 18px;
      }
      .error-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff4d4f;
        font-size: 18px;
        text-align: center;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
      }
    `;
    document.head.appendChild(style);
  };

  // Component for the popup that displays course information
  const CoursePopup = ({ node, position, onClose }) => {
    if (!node) return null;

    // Log the node data for debugging
    console.log("Popup rendering with node:", node);
    console.log("Node properties:", Object.keys(node));

    // Calculate adjusted position to ensure popup stays within view
    const adjustedX = Math.min(position.x + 20, window.innerWidth - 320);
    const adjustedY = Math.min(position.y - 100, window.innerHeight - 200);

    // Helper function to safely display array data
    const displayArray = (arr) => {
      if (!arr) return 'None';
      if (!Array.isArray(arr)) return String(arr);
      if (arr.length === 0) return 'None';
      return arr.join(', ');
    };

    return (
      <div
        className="course-popup"
        style={{
          left: `${adjustedX}px`,
          top: `${adjustedY}px`,
          position: 'absolute',
          backgroundColor: 'white',
          border: '2px solid #ff4d4f',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          maxWidth: '300px',
          color: '#333'
        }}
      >
        <button
          className="close-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        <h3 style={{ color: '#ff4d4f', marginTop: '0' }}>{node.id}</h3>

        <div style={{ marginTop: '10px' }}>
          <p><strong>Department:</strong> {node.department || 'Not specified'}</p>
          <p><strong>Professor ID:</strong> {node.professor !== undefined ? node.professor : 'Not specified'}</p>
          <p><strong>Textbook ISBN:</strong> {node.textbook || 'None'}</p>
          <p><strong>Antirequisites:</strong> {displayArray(node.antirequisites)}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="department-selector-container">
        <div className="department-selector">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            disabled={isLoading}
          >
            <option value="all">All Departments</option>
            {departments.map(department => (
              <option key={department.dno} value={department.dno}>
                {department.dname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <svg ref={ref} width="800" height="600">
        {/* Default viewBox will be set in drawGraph */}
      </svg>

      {isLoading && (
        <div className="loading-indicator">Loading courses...</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {selectedNode && (
        <CoursePopup
          node={selectedNode}
          position={popupPosition}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

export default CourseGraph;
