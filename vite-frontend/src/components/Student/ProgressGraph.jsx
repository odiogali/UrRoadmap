import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ProgressGraph({ takenCourses = [], allCourses = [], links = [] }) {
  const ref = useRef();

  useEffect(() => {
    if (!allCourses.length) return;

    const width = 1000;
    const height = 700;
    const nodeRadius = 25;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .append('rect')
      .attr('x', 5)
      .attr('y', 5)
      .attr('width', width - 10)
      .attr('height', height - 10)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 2);

    const nodes = allCourses.map(course => ({
      id: course.course_code,
      title: course.course_title || '',
    }));

    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const validLinks = links.filter(link => nodeMap.has(link.source) && nodeMap.has(link.target));

    const prereqLinks = validLinks.filter(l => l.type === 'prereq');
    const antireqLinks = validLinks.filter(l => l.type === 'antireq');

    // Reachability logic
    const reachableSet = new Set(takenCourses);
    const queue = [...takenCourses];

    while (queue.length > 0) {
      const current = queue.shift();
      for (const link of prereqLinks) {
        if (link.source === current && !reachableSet.has(link.target)) {
          const allPre = prereqLinks.filter(l => l.target === link.target).map(l => l.source);
          if (allPre.every(p => reachableSet.has(p))) {
            reachableSet.add(link.target);
            queue.push(link.target);
          }
        }
      }
    }

    const nodeStatus = (node) => {
      if (takenCourses.includes(node.id)) return 'completed';
      if (antireqLinks.some(l => l.target === node.id && takenCourses.includes(l.source))) return 'blocked';
      if (reachableSet.has(node.id)) return 'reachable';
      return 'locked';
    };

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(validLinks).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(nodeRadius + 10));

    // Arrowheads
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", nodeRadius + 5)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#ccc");

    const link = svg.append("g")
      .selectAll("line")
      .data(validLinks)
      .enter()
      .append("line")
      .attr("stroke", d => d.type === 'antireq' ? '#9c27b0' : '#ccc')
      .attr("stroke-dasharray", d => d.type === 'antireq' ? '4,2' : 'none')
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd));

    nodeGroup.append("circle")
      .attr("r", nodeRadius)
      .attr("fill", d => {
        const status = nodeStatus(d);
        if (status === 'completed') return '#4caf50';
        if (status === 'reachable') return '#ffc107';
        if (status === 'blocked') return '#f44336';
        return '#607d8b'; // locked
      });

    nodeGroup.append("text")
      .text(d => d.id)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "10px");

    simulation.on("tick", () => {
      nodes.forEach(node => {
        node.x = Math.max(nodeRadius, Math.min(width - nodeRadius, node.x));
        node.y = Math.max(nodeRadius, Math.min(height - nodeRadius, node.y));
      });

      link
        .attr("x1", d => nodeMap.get(d.source.id || d.source)?.x)
        .attr("y1", d => nodeMap.get(d.source.id || d.source)?.y)
        .attr("x2", d => nodeMap.get(d.target.id || d.target)?.x)
        .attr("y2", d => nodeMap.get(d.target.id || d.target)?.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragStart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => simulation.stop();

  }, [takenCourses, allCourses, links]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <svg ref={ref}></svg>
    </div>
  );
}
