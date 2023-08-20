<script lang="ts">
  import * as dateFns from 'date-fns'

  export let numberOfDaysInWeek: number
  export let startOfWeek: number

  $: dateList = Array.from({ length: numberOfDaysInWeek }, (_, i) => {
    const date = dateFns.addDays(startOfWeek, i)
    return {
      dayOfWeek: dateFns.format(date, 'EEE'),
      dayOfMonth: dateFns.format(date, 'd'),
    }
  })
</script>

<div class="column-container">
  {#each dateList as { dayOfWeek, dayOfMonth }}
    <div class="column">
      <div class="day-of-week">{dayOfWeek}</div>
      <div class="day-of-month">{dayOfMonth}</div>
    </div>
  {/each}
</div>

<div class="row-container">
  <div class="row"><div class="label" /></div>
  <div class="row"><div class="label">01:00</div></div>
  <div class="row"><div class="label">02:00</div></div>
  <div class="row"><div class="label">03:00</div></div>
  <div class="row"><div class="label">04:00</div></div>
  <div class="row"><div class="label">05:00</div></div>
  <div class="row"><div class="label">06:00</div></div>
  <div class="row"><div class="label">07:00</div></div>
  <div class="row"><div class="label">08:00</div></div>
  <div class="row"><div class="label">09:00</div></div>
  <div class="row"><div class="label">10:00</div></div>
  <div class="row"><div class="label">11:00</div></div>
  <div class="row"><div class="label">12:00</div></div>
  <div class="row"><div class="label">13:00</div></div>
  <div class="row"><div class="label">14:00</div></div>
  <div class="row"><div class="label">15:00</div></div>
  <div class="row"><div class="label">16:00</div></div>
  <div class="row"><div class="label">17:00</div></div>
  <div class="row"><div class="label">18:00</div></div>
  <div class="row"><div class="label">19:00</div></div>
  <div class="row"><div class="label">20:00</div></div>
  <div class="row"><div class="label">21:00</div></div>
  <div class="row"><div class="label">22:00</div></div>
  <div class="row"><div class="label">23:00</div></div>
</div>

<style>
  .column-container {
    position: absolute;
    top: 0;
    left: 50px;
    right: 0;
    bottom: 0;
    display: flex;
  }
  .column {
    flex: 1;
    border-right: 1px solid #ccc;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .day-of-week {
    font-size: 0.8rem;
    text-transform: uppercase;
  }
  .day-of-month {
    font-size: 1.4rem;
    font-weight: bold;
  }
  .column:first-of-type {
    border-left: 1px solid #ccc;
  }

  .row-container {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .row {
    position: relative;
    box-sizing: border-box;
    height: 60px;
    display: flex;
  }
  .label {
    width: 100%;
    height: 100%;
    line-height: 0;
    font-size: 0.8rem;
  }
  .label::after {
    content: '';
    display: block;
    position: absolute;
    height: 1px;
    left: 45px;
    right: 0;
    bottom: 0;
    background: #ccc;
  }
  .row:first-of-type .label::before {
    content: '';
    display: block;
    position: absolute;
    height: 1px;
    left: 45px;
    right: 0;
    top: 0;
    background: #ccc;
  }
</style>
