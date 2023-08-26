<script lang="ts">
  import { quantize, interpolatePlasma, pie, arc } from 'd3';

  export let data: Array<{
    label: string;
    frequency: number;
  }>

  const width = 1000 // the outer width of the chart, in pixels
  const height = width // the outer height of the chart, in pixels
  const fontSize = 22; // the font size of the x and y values
  const strokeWidth = 10; // the width of stroke separating wedges
  const strokeLinejoin = 'round'; // line join style of stroke separating wedges
  const outerRadius = Math.min(width, height) * 0.5 - 60; // the outer radius of the circle, in pixels
  const innerRadius = 201; // the inner radius of the chart, in pixels
  const labelPosition = 0.1; // the position of the label offset from center
  const labelRadius = (innerRadius * labelPosition + outerRadius * 0.6); // center radius of labels
  const strokeColorWOR = 'white'; //stroke color when inner radius is greater than 0
  const strokeColorWIR = 'none'; //stroke color when inner radius is 0
  const stroke = innerRadius > 0 ? strokeColorWIR : strokeColorWOR; // stroke separating widths
  const padAngle = stroke === 'none' ? 1 / outerRadius : 0; // angular separation between wedges

  const x = 'label'
  const y = 'frequency'

  $: xVals = data.map((el) => el[x]);
  $: yVals = data.map((el) => Number(el[y]))
  $: iVals = data.map((_el, i) => i);

  // colors can be adjusted manually by creating a color array which length matches length of data set.
  $: colors = quantize(t => interpolatePlasma(t * 0.7 + 0.3), xVals.length);

  $: wedges = pie().
    padAngle(padAngle).
    sort(null).
    value(i => yVals[i])(iVals);

  $: arcPath = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  $: arcLabel = arc()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);
</script>
  
<svg {width} {height} viewBox="{-width / 2} {-height / 2} {width} {height}">
  {#each wedges as wedge, i}
    <path fill={colors[i]} d={arcPath(wedge)} stroke={stroke} stroke-width={strokeWidth} stroke-linejoin={strokeLinejoin} />
    <g text-anchor='middle' transform='translate({arcLabel.centroid(wedge)})'>
      <text font-size={fontSize}>
        <tspan font-weight='bold'>{xVals[i]}</tspan>
        <tspan x = '0' dy='1.1em'>{`${(yVals[i] * 100).toFixed(2)}%`}</tspan>
      </text>
    </g>
  {/each}
</svg>
    
<style>  
</style>
