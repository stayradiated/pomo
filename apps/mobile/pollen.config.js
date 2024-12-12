export default function (pollen) {
  return {
    output: './src/routes/pollen.css',
    modules: {
      font: {
        ...pollen.font,
        sans: `Nunito Sans, ${pollen.font.sans}`,
      },
      weight: {
        // light: 300,
        regular: 400,
        // medium: 500,
        // semibold: 600
        bold: 700,
        // extraBold: 800,
        // black: 900
      },
    },
  }
}
