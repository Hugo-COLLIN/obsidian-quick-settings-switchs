import {Plugin} from "obsidian";

export default class ExamplePlugin extends Plugin {
	statusBarElement: HTMLSpanElement;
	onload() {
		console.log("Hey!")
		this.statusBarElement = this.addStatusBarItem().createEl('span');
		this.taskbarLineCountUpdate();

		this.app.workspace.on("active-leaf-change", async () => {
			this.taskbarLineCountUpdate();
		});


		this.app.workspace.on('editor-change', editor => {
			const content = editor.getDoc().getValue();
			this.updateLineCount(content);
		})
	}

	private updateLineCount(fileContent?: string)
	{
		const count = fileContent ? fileContent.split(/\r\n|\r|\n/).length : 0;

		const linesWord = count === 1 ? "line" : "lines";

		this.statusBarElement.textContent = `${count} ${linesWord}`;
	}

	private async taskbarLineCountUpdate() {
		const file = this.app.workspace.getActiveFile();

		if (file)
		{
			const content = await this.app.vault.read(file);
			// console.log(content);
			this.updateLineCount(content);
		}
		else
		{
			this.updateLineCount(undefined);
		}
	}


}
