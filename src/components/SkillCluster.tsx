
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface SkillClusterProps {
  skills: string[];
}

const SkillCluster: React.FC<SkillClusterProps> = ({ skills }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || skills.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Create nodes for skills
    const nodes = skills.map((skill, i) => ({
      id: i,
      name: skill,
      radius: 40 + Math.random() * 20, // Random circle size
    }));
    
    // Create mock relationships between skills
    const links = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        if (Math.random() > 0.3) { // 70% chance to create a link
          links.push({
            source: i,
            target: j,
            value: Math.random()
          });
        }
      }
    }
    
    // Create a force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 10));

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(139, 92, 246, 0.2)")
      .attr("stroke-width", 2);

    // Add a group for each node
    const node = svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for each node
    node.append("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", "url(#gradient)")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("stroke-width", 2)
      .attr("opacity", 0.7);

    // Add text labels
    node.append("text")
      .attr("dy", ".3em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .text((d: any) => d.name);

    // Create gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8B5CF6");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3B82F6");

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => Math.max(30, Math.min(width - 30, d.source.x)))
        .attr("y1", (d: any) => Math.max(30, Math.min(height - 30, d.source.y)))
        .attr("x2", (d: any) => Math.max(30, Math.min(width - 30, d.target.x)))
        .attr("y2", (d: any) => Math.max(30, Math.min(height - 30, d.target.y)));

      node
        .attr("transform", (d: any) => `translate(${Math.max(d.radius, Math.min(width - d.radius, d.x))},${Math.max(d.radius, Math.min(height - d.radius, d.y))})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [skills]);

  if (skills.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">No skills selected yet.</p>
      </div>
    );
  }

  return (
    <svg ref={svgRef} width="100%" height="100%" className="overflow-visible"></svg>
  );
};

export default SkillCluster;
