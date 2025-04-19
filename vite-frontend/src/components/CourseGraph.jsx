import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function CourseGraph() {
  const ref = useRef();

  useEffect(() => {
    fetch('http://localhost:8000/api/graph/')
      .then((res) => res.json())
      .then((graph) => drawGraph(graph));
  }, []);

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
      } else {
        clickedNode = d.id;
        highlightConnections(d);
      }

      // Prevent event propagation
      event.stopPropagation();
    }

    // Add click handler to svg background to reset highlighting
    svg.on("click", () => {
      if (clickedNode) {
        clickedNode = null;
        resetHighlighting();
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
    `;
    document.head.appendChild(style);
  };

  return (
    <svg ref={ref}></svg>
  );
}

export default CourseGraph;
