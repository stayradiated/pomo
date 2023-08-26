<script lang="ts">
  import { scaleLinear, scaleBand } from 'd3';
  import { flip } from 'svelte/animate';

  export let data: Array<{
    label: string;
    frequency: number;
  }>

  const marginTop = 15; // top margin, in pixels
  const marginRight = 0; // right margin, in pixels
  const marginBottom = 20; // bottom margin, in pixels
  const marginLeft = 30; // left margin, in pixels
  const width = 700; // width of the chart, in pixels
  const height = 300; // height of the chart, in pixels
  const xPadding = 0.2; // padding between bars
  const yFormat = '%'; // unit to display on y-axis ticks
  const yLabel = '↑ Cost'; // label for the y-axis
  const color = 'steelblue'; // bar fill color
  const yScalefactor = 6; // number of ticks on y-yaxis

  // Sort data by default, ascending, or descending
  $: sortedData = data;
  $: reactiveShowSort = (input) => {
    if (input === 1) {
      return (sortedData = data.sort(
        (a, b) => a[x].charCodeAt(0) - b[x].charCodeAt(0)
      ));
    }
    if (input === 2) {
      return (sortedData = data.sort((a, b) => a[y] - b[y]));
    }
    if (input === 3) {
      return (sortedData = data.sort((a, b) => b[y] - a[y]));
    }
  };

  // Compute values X and Y value of Arrays
  const x = Object.keys(data[0])[0]; // given d in data, returns the (ordinal) x-value
  const y = Object.keys(data[0])[1]; // given d in data, returns the (quantitative) y-value
  $: reactiveXVals = sortedData.map((el) => el[x]);
  $: reactiveYVals = sortedData.map((el) => el[y]);

  // Compute default domains, and unique the x-domain.
  $: reactiveXDomain = reactiveXVals; // an array of (ordinal) x-values // sort by descending frequency
  $: reactiveYDomain = [0, Math.max(...reactiveYVals)]; // [ymin, ymax]

  // Construct scales, axes, and formats.
  const xRange = [marginLeft, width - marginRight]; // [left, right]
  const yRange = [height - marginBottom, marginTop * 2]; // [bottom, top]
  $: reactiveXScale = scaleBand(reactiveXDomain, xRange).padding(xPadding);
  $: reactiveYScale = scaleLinear(reactiveYDomain, yRange).nice();

  $: reactiveYTicks = reactiveYScale.ticks(yScalefactor);
  $: reactiveYTicksFormatted = reactiveYTicks.map((el) => el.toLocaleString("en-US"));
</script>

<div class="chart-container" dir="auto">
  <div>
    <select class="dropdown" on:change={reactiveShowSort(this.selectedIndex)}>
      <option disabled selected value> ---Sorting Method--- </option>
      <option value="1">Default</option>
      <option value="2">{y}, Ascending</option>
      <option value="3">{y}, Descending</option>
    </select>
  </div>

  <svg {width} {height} viewBox="0 0 {width} {height}">
    <g class="x-axis" transform="translate(0,{height - marginBottom})">
      <path class="domain" stroke="black" d="M{marginLeft}, 0.5 H{width}" />
      {#each reactiveXVals as xVal, i}
        <g class="tick" opacity="1" transform="translate({reactiveXScale(xVal)},0)">
          <line
            x1={reactiveXScale.bandwidth() / 2}
            x2={reactiveXScale.bandwidth() / 2}
            stroke="black"
            y2="6"
          />
          <text y={marginBottom} dx={reactiveXScale.bandwidth() / 4}>{xVal}</text>
        </g>
      {/each}
    </g>
    
    <g class="y-axis" transform="translate({marginLeft}, 0)">
      {#each reactiveYTicks as tick, i}
        <g class="tick" opacity="1" transform="translate(0, {reactiveYScale(tick)})">
          <line class="tick-start" stroke="black" stroke-opacity="1" x2="-6" />
          <line class="tick-grid" x2={width - marginLeft - marginRight} />
          <text x={-marginLeft} y="10">{yFormat === "%" ? reactiveYTicksFormatted[i] * 100 + yFormat : reactiveYTicksFormatted[i] + yFormat}</text>
        </g>
      {/each}
      <text x="-{marginLeft}" y={marginTop}>{yLabel}</text>
    </g>

    <g class="bars">
      {#each reactiveYVals as bar, i (bar)}
        <rect
          x={reactiveXScale(reactiveXVals[i])}
          y={reactiveYScale(reactiveYVals[i])}
          width={reactiveXScale.bandwidth()}
          height={reactiveYScale(0) - reactiveYScale(bar)}
          fill={color}
          animate:flip="{{duration: 1000}}"
        />
      {/each}
    </g>
  </svg>
</div>

<style>
  .chart-container {
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 50px;
    margin-left: 8
    0px;
  }

  select{
    color: black;
    padding: 5px;
    width: 190px;
  }

  svg {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }

  .y-axis {
    font-size: "10px";
    font-family: sans-serif;
    text-anchor: "end";
  }

  .x-axis {
    font-size: "10px";
    font-family: sans-serif;
    text-anchor: "end";
  }

  .tick {
    opacity: 1;
  }

  .tick-start {
    stroke: black;
    stroke-opacity: 1;
  }

  .tick-grid {
    stroke: black;
    stroke-opacity: 0.2;
    font-size: "11px";
    color: black;
  }

  .tick text {
    fill: black;
    text-anchor: start;
  }
</style>
