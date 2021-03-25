// @ts-nocheck
// Typescriptで書くのがしんどかったので、一旦tsのチェックを外している。
// d3.jsに慣れて来たら修正するかも

import React, { useEffect } from 'react';
import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export interface Edge extends d3.SimulationLinkDatum<Node> {
  cnt: number;
}

type Props = {
  id: string;
  nodes: Node[];
  edges: Edge[];
  onDblclick?: (userCd: string) => void
}


const Network: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    const nodesData = props.nodes;
    const linksData = props.edges;
    const svg = d3.select(`#${props.id}`)
    svg.selectAll('*').remove();
    const container = svg.append('g');
    const link = container.append("g").attr("class", "links")
      .selectAll("line")
      .data(linksData)
      .enter()
      .append("line")
      .attr("stroke-width", d => d.cnt)
      .attr("stroke", '#aaeeee');
    const node = container.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(nodesData)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d: Node) => { return d.color })
    const dblclick = (d: Node) => {
      if (!props.onDblclick) {
        return;
      }
      props.onDblclick(d.id);
    }
    node.on("dblclick ", dblclick)
    node.call(
      d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
    const image = container.append("g").attr("class", "imageNodes")
      .selectAll("image")
      .data(nodesData)
      .enter()
      .append("image")
      .attr('xlink:href', d => d.icon)
      .attr('clip-path', d => `url(#node-${d.id})`)
      .style('width', 20)
      .style('height', 20);
    image.on("dblclick ", dblclick)
    image.call(
      d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
    const label = container.append("g").attr("class", "labelNodes")
      .selectAll("text")
      .data(nodesData)
      .enter()
      .append("text")
      .text(function (d, i) { return d.label; })
      .style("fill", "#555")
      .style("font-family", "Arial")
      .style("font-size", 12)
      .style("pointer-events", "none");

    // 3. forceSimulation設定
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(200, 150));

    function ticked() {
      link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
      node
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
      label
        .attr("x", function (d) { return d.x - 15; })
        .attr("y", function (d) { return d.y + 25; });
      image
        .attr("x", function (d) { return d.x - 10; })
        .attr("y", function (d) { return d.y - 15; });
    }

    simulation
      .nodes(nodesData)
      .on("tick", ticked);

    simulation.force("link")
      .links(linksData);

    function dragstarted(d: d3.SimulationNodeDatum) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [props]);

  return (
    <svg className="pnet-network" id={props.id} />
  )
}

export default Network
