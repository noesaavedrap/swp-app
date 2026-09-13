"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

export interface DayData {
  label: string;
  date: Date;
  ingresos: number;
  egresos: number;
}

interface ActivityChartProps {
  data: DayData[];
  height?: number;
}

export default function ActivityChart({ data, height = 220 }: ActivityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Format money for tooltips
  const formatMoney = useMemo(
    () =>
      new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        maximumFractionDigits: 0,
      }),
    []
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const margin = { top: 20, right: 12, bottom: 36, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .paddingInner(0.25)
      .paddingOuter(0.1);

    const x1 = d3
      .scaleBand()
      .domain(["ingresos", "egresos"])
      .range([0, x0.bandwidth()])
      .padding(0.12);

    const maxY = d3.max(data, (d) => Math.max(d.ingresos, d.egresos)) || 1;
    const y = d3
      .scaleLinear()
      .domain([0, maxY * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Color scale matching brand
    const color = d3
      .scaleOrdinal<string>()
      .domain(["ingresos", "egresos"])
      .range(["#10b981", "#f87171"]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-dasharray", "3,3")
          .attr("stroke-opacity", 0.8)
      );

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => {
            const v = Number(d);
            if (v >= 1000) return `S/${(v / 1000).toFixed(1)}k`;
            return `S/${v}`;
          })
      )
      .call((g) => g.select(".domain").attr("stroke", "#e5e7eb"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#a6a6a6")
          .attr("font-size", "11px")
          .attr("font-family", "system-ui, sans-serif")
      )
      .call((g) => g.selectAll(".tick line").attr("stroke", "#e5e7eb"));

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .call((g) => g.select(".domain").attr("stroke", "#e5e7eb"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#545454")
          .attr("font-size", "11px")
          .attr("font-weight", "500")
          .attr("font-family", "system-ui, sans-serif")
      )
      .call((g) => g.selectAll(".tick line").remove());

    // Bars group
    const dayGroups = g
      .selectAll(".day")
      .data(data)
      .join("g")
      .attr("class", "day")
      .attr("transform", (d) => `translate(${x0(d.label)},0)`);

    // Tooltip
    const tooltip = d3
      .select(container)
      .selectAll<"div", unknown>(".d3-tooltip")
      .data([null])
      .join("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("background", "#181b25")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("line-height", "1.4")
      .style("box-shadow", "0 8px 24px rgba(0,0,0,0.18)")
      .style("z-index", "50")
      .style("transition", "opacity 0.15s ease");

    // Draw bars with animation
    dayGroups
      .selectAll("rect")
      .data((d) => [
        { key: "ingresos", value: d.ingresos, full: d },
        { key: "egresos", value: d.egresos, full: d },
      ])
      .join("rect")
      .attr("x", (d) => x1(d.key)!)
      .attr("width", x1.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", (d) => color(d.key))
      .attr("rx", 4)
      .attr("ry", 4)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("opacity", 0.85);

        const [mx, my] = d3.pointer(event, container);
        tooltip
          .style("opacity", "1")
          .html(
            `<div style="font-weight:600;margin-bottom:4px">${d.full.label}</div>
             <div style="color:#34d399">↑ Ingresos: ${formatMoney.format(d.full.ingresos)}</div>
             <div style="color:#f87171">↓ Egresos: ${formatMoney.format(d.full.egresos)}</div>`
          )
          .style("left", `${mx + 12}px`)
          .style("top", `${my - 10}px`);
      })
      .on("mousemove", function (event) {
        const [mx, my] = d3.pointer(event, container);
        tooltip.style("left", `${mx + 12}px`).style("top", `${my - 10}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", "0");
      })
      .transition()
      .duration(700)
      .delay((_, i) => i * 40)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerHeight - y(d.value));

    // Cleanup tooltip on unmount
    return () => {
      d3.select(container).selectAll(".d3-tooltip").remove();
    };
  }, [data, height, formatMoney]);

  // Resize observer for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      // Trigger re-render by forcing a tiny state change via data dependency
      // The main effect already depends on container width via clientWidth
      // We force a redraw by dispatching a resize event on the svg
      if (svgRef.current) {
        const event = new Event("resize");
        window.dispatchEvent(event);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      <svg ref={svgRef} className="w-full overflow-visible" />
    </div>
  );
}
