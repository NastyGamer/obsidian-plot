import {Plugin} from 'obsidian';
import functionPlot from "function-plot";
import Globals from "function-plot/dist/globals";

export default class MyPlugin extends Plugin {

	functionRegex: RegExp = /f\((.*)\)/
	vectorRegex: RegExp = /v\((.*),(.*)\)/
	vectorOffsetRegex: RegExp = /v\((.*),(.*),(.*),(.*)\)/

	async onload() {
		this.registerMarkdownCodeBlockProcessor("plot", (src, el) => {
			const rows: Array<string> = src.split("\n").filter((row) =>
				row.length > 0 && (this.functionRegex.test(row) || this.vectorRegex.test(row) || this.vectorOffsetRegex.test(row))
			);
			const plot = functionPlot({
				//@ts-ignore
				target: el,
				data: rows.map((row) => {
					if (this.functionRegex.test(row)) {
						return {fn: row.match(this.functionRegex)[1]}
					} else if (this.vectorOffsetRegex.test(row)) {
						return {
							vector: [parseFloat(row.match(this.vectorOffsetRegex)[1]), parseFloat(row.match(this.vectorOffsetRegex)[2])],
							offset: [parseFloat(row.match(this.vectorOffsetRegex)[3]), parseFloat(row.match(this.vectorOffsetRegex)[4])],
							graphType: "polyline",
							fnType: "vector"
						}
					} else return {
						vector: [parseFloat(row.match(this.vectorRegex)[1]), parseFloat(row.match(this.vectorRegex)[2])],
						graphType: "polyline",
						fnType: "vector"
					}
				}),
				grid: true,
				tip: {
					xLine: true,
					yLine: true
				}
			})
			const div = el.createEl("div")
			plot.options.data.map((data) => {
				return data.fn
			}).forEach((fn, index) => {
				div.innerHTML = div.innerHTML + `<p><span class='square' style="background-color: ${Globals.COLORS[index]} !important;"></span>${fn}</p>`
			})
		})
	}
}
