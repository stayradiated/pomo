export default function (pollen) {
  return {
    output: './src/routes/pollen.css',
    modules: {
      font: {
        ...pollen.font,
        sans: `Nunito Sans, ${pollen.font.sans}`,
      }
    }
  }
}
