import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';

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
    setSelectedDepartment(departmentId);
  };

  useEffect(() => {
    if (!isLoading) {
      drawGraph(graphData);
    }
  }, [graphData, isLoading]);

  const drawGraph = (graph) => {
    const width = 1850;
    const height = 700;
    const nodeRadius = 35;

    // Clear existing content
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Set SVG dimensions
    svg
      .attr("width", width)
      .attr("height", height);

    // Check for empty graph data explicitly
    if (!graph.nodes || graph.nodes.length === 0) {
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

    // Create a new dagre-d3 renderer
    const render = new dagreD3.render();

    // Create a new directed graph
    const g = new dagreD3.graphlib.Graph().setGraph({
      rankdir: "LR",  // Direction of graph layout (left to right)
      marginx: 50,    // Margin in x-direction
      marginy: 50,    // Margin in y-direction
      ranksep: 150,   // Separation between ranks
      nodesep: 50,    // Separation between nodes
      edgesep: 10,    // Separation between edges
      acyclicer: "greedy", // Optional: used to handle cycles in the graph
      ranker: "network-simplex" // Algorithm for determining node positions
    });

    // Default to assign an edge to follow node paths
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes to the graph
    graph.nodes.forEach(node => {
      g.setNode(node.id, {
        label: node.id,
        width: nodeRadius * 2,
        height: nodeRadius * 2,
        rx: nodeRadius,
        ry: nodeRadius,
        shape: 'circle',
        style: 'fill: #ff4d4f',
        labelStyle: 'fill: #ffffff; font-size: 14px',
        originalData: node // Store original data for later use
      });
    });

    // Add edges to the graph
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      // Add this to your edge settings when creating edges
      g.setEdge(sourceId, targetId, {
        curve: d3.curveBasis,
        style: link.type === "prereq"
          ? "stroke: #ffffff; stroke-width: 2px; fill: none;"
          : "stroke: #ff9c6e; stroke-width: 2px; fill: none;",
        arrowheadStyle: "fill: #ffffff",
        class: `edge source-${sourceId} target-${targetId}`,
        linkType: link.type,
        originalData: link
      });
    });

    // Create SVG group for the graph
    const svgGroup = svg.append("g");

    // Define arrowhead marker with proper fill
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", nodeRadius + 2)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#ffffff");

    // Define highlighted arrowhead marker - identical to regular one except color
    svg.append("defs").append("marker")
      .attr("id", "arrowhead-highlight")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", nodeRadius + 2) // Exactly the same as above
      .attr("refY", 0)              // Exactly the same as above
      .attr("orient", "auto")
      .attr("markerWidth", 6)       // Exactly the same as above
      .attr("markerHeight", 6)      // Exactly the same as above
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5") // Exactly the same as above
      .attr("fill", "#ffff00");         // Only the color changes

    // Run the renderer
    render(svgGroup, g);

    // Add zoom behavior
    const zoom = d3.zoom()
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Center the graph
    const initialScale = 0.8;
    const graphWidth = g.graph().width || width;
    const graphHeight = g.graph().height || height;
    const zoomX = (width - graphWidth * initialScale) / 2;
    const zoomY = (height - graphHeight * initialScale) / 2;

    svg.call(zoom.transform, d3.zoomIdentity
      .translate(zoomX, zoomY)
      .scale(initialScale));

    // Build adjacency list for graph traversal
    const adjacencyList = buildAdjacencyList(graph);

    // Select all node elements
    const nodeElements = svgGroup.selectAll("g.node");
    const edgeElements = svgGroup.selectAll("g.edgePath");

    // Add hover and click events to nodes
    let clickedNode = null;

    nodeElements
      .on("mouseover", handleNodeHover)
      .on("mouseout", handleNodeUnhover)
      .on("click", handleNodeClick);

    // Build adjacency list for the graph to enable traversal
    function buildAdjacencyList(graph) {
      const adjacencyList = {};

      // Initialize empty adjacency lists for each node
      graph.nodes.forEach(node => {
        adjacencyList[node.id] = [];
      });

      // Populate adjacency lists with bidirectional connections
      graph.links.forEach((link, index) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        // Add connections in both directions to find all connected nodes
        adjacencyList[sourceId].push({
          nodeId: targetId,
          linkIndex: index
        });
        adjacencyList[targetId].push({
          nodeId: sourceId,
          linkIndex: index
        });
      });

      return adjacencyList;
    }

    // Find all connected nodes and edges using DFS
    // Find all prerequisite nodes using DFS (backwards traversal)
    function findPrerequisiteNodes(startNodeId) {
      const prerequisites = new Set();
      const prerequisiteEdges = new Set();
      const visited = new Set();

      function dfsBackwards(nodeId) {
        if (visited.has(nodeId)) return;

        visited.add(nodeId);
        prerequisites.add(nodeId);

        // Find all prerequisite edges (only go backwards through prereq links)
        graph.links.forEach((link, index) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;

          // Only follow prerequisite links (type === "prereq")
          if (link.type === "prereq" && targetId === nodeId) {
            // This is a prerequisite relationship where sourceId is a prerequisite for nodeId
            prerequisiteEdges.add(index);
            // Continue recursion to this prerequisite's prerequisites
            dfsBackwards(sourceId);
          }
        });
      }

      // Start DFS from the given node
      dfsBackwards(startNodeId);

      return {
        nodes: prerequisites,
        edges: prerequisiteEdges
      };
    }

    function handleNodeHover(event, d) {
      // Skip hover effect if a node is already clicked
      if (clickedNode) return;

      const nodeId = d;
      highlightConnections(nodeId);
    }

    function handleNodeUnhover(event, d) {
      // Skip unhover effect if a node is clicked
      if (clickedNode) return;

      resetHighlighting();
    }

    function handleNodeClick(event, d) {
      const nodeId = d;

      // If clicking the same node, reset
      if (clickedNode === nodeId) {
        clickedNode = null;
        resetHighlighting();
        setSelectedNode(null); // Close the popup
      } else {
        clickedNode = nodeId;
        highlightConnections(nodeId);

        // Find the original node data
        const nodeData = g.node(nodeId).originalData;

        // Set the selected node data for the popup
        setSelectedNode(nodeData);

        // Use the actual click event coordinates for positioning
        const svgRect = svg.node().getBoundingClientRect();

        // Set popup position based on click event coordinates
        setPopupPosition({
          x: event.clientX, // Use the mouse x position
          y: event.clientY  // Use the mouse y position
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

    function highlightConnections(nodeId) {
      // Find all prerequisite nodes and edges using recursive backwards traversal
      const prerequisites = findPrerequisiteNodes(nodeId);

      // Dim all nodes and edges first
      nodeElements.classed("dimmed", true);
      edgeElements.classed("dimmed", true);

      // Highlight the selected node itself
      nodeElements.filter(function() {
        const id = d3.select(this).datum();
        return id === nodeId || prerequisites.nodes.has(id);
      })
        .classed("highlighted", true)
        .classed("dimmed", false);

      // Highlight the prerequisite edges
      edgeElements.each(function(d, i) {
        const edge = d3.select(this);
        const paths = edge.selectAll("path");

        // Get the edge's source and target IDs from the edge's class
        const edgeClass = edge.attr("class") || "";
        const sourceMatch = /source-([^ ]+)/.exec(edgeClass);
        const targetMatch = /target-([^ ]+)/.exec(edgeClass);

        if (sourceMatch && targetMatch) {
          const sourceId = sourceMatch[1];
          const targetId = targetMatch[1];

          // Check if this edge is part of the prerequisite edges
          const linkIndex = graph.links.findIndex(link => {
            const s = typeof link.source === 'object' ? link.source.id : link.source;
            const t = typeof link.target === 'object' ? link.target.id : link.target;
            return s === sourceId && t === targetId;
          });

          if (prerequisites.edges.has(linkIndex)) {
            edge.classed("highlighted", true)
              .classed("dimmed", false);

            // Instead of changing the marker-end reference completely, 
            // just add a class to the edge for styling
            edge.classed("highlight-arrow", true);
          }
        }
      });
    }

    function resetHighlighting() {
      // Remove all highlighting and dimming classes
      nodeElements.classed("highlighted", false).classed("dimmed", false);
      edgeElements.classed("highlighted", false).classed("dimmed", false);
      edgeElements.classed("highlight-arrow", false);
    }

    // Add this specific CSS selector to style edge paths without affecting arrowheads
    const style = document.createElement('style');
    style.textContent = `
      .node.highlighted rect,
      .node.highlighted circle {
        fill: #ff3b5c !important;
        stroke: #ffffff !important;
        stroke-width: 3px !important;
      }
      .node.dimmed rect,
      .node.dimmed circle {
        opacity: 0.3;
      }
      /* Style the path but not markers/arrowheads */
      .edgePath path.path {
        fill: none !important;
        stroke-width: 2px;
      }
      /* Make sure arrowheads are filled */
      marker#arrowhead path,
      marker#arrowhead-highlight path {
        fill: #ffffff !important;
      }
      .edgePath.highlighted path {
        stroke: #ff3b5c !important;
        stroke-width: 3px !important;
      }
      .edgePath.dimmed path {
        opacity: 0.2;
      }
    `;
    document.head.appendChild(style);
  };

  // Component for the popup that displays course information
  const CoursePopup = ({ node, position, onClose }) => {
    const [professorName, setProfessorName] = React.useState('Loading...');
    const [textbookTitle, setTextbookTitle] = React.useState('Loading...');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
      // Only fetch data if we have valid IDs
      if (node) {
        setIsLoading(true);

        // Fetch professor name if professor ID exists
        if (node.professor) {
          fetch(`http://localhost:8000/api/teaching-staff/${node.professor}/`)
            .then(res => {
              if (!res.ok) throw new Error('Failed to fetch professor');
              return res.json();
            })
            .then(data => {
              // Handle the actual structure of your API response
              if (data && data.professor_details && data.professor_details.employee) {
                // For professor type
                setProfessorName(`${data.professor_details.employee.fname} ${data.professor_details.employee.lname}`);
              } else if (data && data.graduate_students && data.graduate_students.length > 0) {
                // For graduate teaching assistant
                const ta = data.graduate_students[0];
                setProfessorName(`${ta.fname} ${ta.lname} (TA)`);
              } else {
                setProfessorName('Unknown');
              }
            })
            .catch(err => {
              console.error("Failed to fetch professor data:", err);
              setProfessorName('Unknown');
            })
            .finally(() => setIsLoading(false));
        } else {
          setProfessorName('Not assigned');
          setIsLoading(false);
        }
        // Fetch textbook title if ISBN exists
        if (node.textbook) {
          fetch(`http://localhost:8000/api/textbook/${node.textbook}/`)
            .then(res => res.json())
            .then(data => {
              setTextbookTitle(data.title);
            })
            .catch(err => {
              console.error("Failed to fetch textbook data:", err);
              setTextbookTitle('Unknown');
            })
            .finally(() => setIsLoading(false));
        } else {
          setTextbookTitle('None');
        }
      }
    }, [node]);

    if (!node) return null;

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
          <p><strong>Professor:</strong> {isLoading && node.professor ? 'Loading...' : professorName}</p>

          {/* Show textbook title and ISBN in parentheses if available */}
          <p>
            <strong>Textbook:</strong> {isLoading && node.textbook ? 'Loading...' : textbookTitle}
            {node.textbook && textbookTitle !== 'None' && textbookTitle !== 'Unknown' ? ` (ISBN: ${node.textbook})` : ''}
          </p>

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
        {/* SVG content will be added by dagre-d3 */}
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

      <style>
        {`
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
        `}
      </style>
    </div>
  );
}

export default CourseGraph;
