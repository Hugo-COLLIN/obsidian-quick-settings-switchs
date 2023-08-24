import {App, Plugin} from "obsidian";
import * as fs from "fs";
import * as path from "path";
// import {PluginToggleSettingsTab} from "./settingsTab";

export default class MainPlugin extends Plugin {
	statusBarElement: HTMLSpanElement;

	onload() {
		this.updateLeftSidebar();
		// this.addSettingTab(new PluginToggleSettingsTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				// this.addToggleButtonsToLeftSidebar();
				this.registerDomEvent(
					document.querySelector('.app-container .side-dock-settings > :nth-of-type(3)'),
					'click',
					this.updateLeftSidebar.bind(this)
				);
			})
		);

		const styleElem = document.head.appendChild(document.createElement("style"));
		styleElem.innerHTML = ".plugin-switch { pointer-events: none; } .plugin-switch::before { pointer-events: all; }";


		// // internal
		// const internalPlugins: string[] = [];
		//
		// for (const pluginId in this.app.internalPlugins.plugins) {
		//   // console.log(pluginId)
		//   internalPlugins.push(pluginId);
		//   // const pluginManifest = this.app.internalPlugins.plugins[pluginId];
		// }
		//
		// console.log(internalPlugins);
	}

	onunload() {
		console.log('unloading plugin')
		const settingsSidebar = document.querySelector('.vertical-tab-header');
		this.removeAllEltsInSideList(settingsSidebar);
		settingsSidebar.querySelectorAll('.plugin-switch').forEach((elt) => elt.parentElement.remove());
	}

	updateLeftSidebar() {
		const settingsSidebar = document.querySelector('.vertical-tab-header');
		if (!settingsSidebar) return;
		this.removeAllEltsInSideList(settingsSidebar);

		for (const pluginId in this.app.plugins.manifests) {
			const pluginObject = this.app.plugins.manifests[pluginId];

			// if (this.manifest.id == pluginId) continue;

			const listPlugins = settingsSidebar.querySelectorAll(`.vertical-tab-nav-item`);

			let found = false;
			listPlugins.forEach((plugin) => {
				const toggle = plugin.querySelector(`.plugin-switch`);
				if (plugin.textContent == pluginObject.name) {
					found = true;
					if (toggle != null) return;
					this.createToggleBtn(plugin, pluginObject, pluginId);
					return;
				}
			});
			if (!found /*&& this.isEnabled(pluginObject)*/) {
				this.createSideListElt(settingsSidebar, pluginObject, pluginId);
			}
		}
	}

	private removeAllEltsInSideList(settingsSidebar: Element) {
		settingsSidebar.querySelectorAll('.qps-created-element').forEach((elt) => elt.remove());
	}

	private createSideListElt(settingsSidebar: Element, pluginObject: any, pluginId: string) {
		const sidelistInstalled = settingsSidebar.querySelectorAll('.vertical-tab-header-group-items')[2]
		const pluginElt = sidelistInstalled.createEl('div', {
			cls: 'vertical-tab-nav-item qps-created-element',
			text: pluginObject.name,
		});
		this.createToggleBtn(pluginElt, pluginObject, pluginId);
	}

	private createToggleBtn(plugin: Element, pluginObject: any, pluginId: string) {
		plugin.style.display = 'flex';
		plugin.style.justifyContent = 'space-between';
		plugin.style.width = '105%';
		const isEnabled = this.isEnabled(pluginObject);

		const containerBtn = plugin.createEl('div', {
			cls: 'checkbox-container' + (isEnabled ? ' is-enabled' : ''),
		});

		containerBtn.style.marginLeft = '2px';

		const switchButton = containerBtn.createEl('input', {
			type: 'checkbox',
			cls: 'plugin-switch',
		});
		switchButton.checked = isEnabled;
		switchButton.tabIndex = 0;

		containerBtn.addEventListener('click', async () => {
			switchButton.checked = !switchButton.checked; // needed, otherwise the action is not performed
			await this.pluginStateChange(switchButton.checked, pluginId);
		});
	}

	private isEnabled(pluginObject: any) {
		return Array.from(this.app.plugins.enabledPlugins).includes(pluginObject.id);
	}

	private async pluginStateChange(value: boolean, pluginId: string) {
		if (value) {
      // this.app.plugins.plugins[pluginId].load();
      this.app.plugins.enablePlugin(pluginId);
      this.app.plugins.enabledPlugins.add(pluginId);
			await new Promise((resolve) => setTimeout(resolve, 100)); //TODO: retry while not added
		} else {
      // this.app.plugins.plugins[pluginId].unload();
      this.app.plugins.disablePlugin(pluginId);
      this.app.plugins.enabledPlugins.delete(pluginId);
		}
		this.updateLeftSidebar();
		await this.savePluginState(this.app, pluginId, value);
	}


	async savePluginState(app: App, pluginId: string, enabled: boolean) {
		// Get the vault path
		const vaultPath = app.vault.adapter.getBasePath();
		const configDirName = app.vault.configDir;

		// Read the config file
		const configPath = path.join(vaultPath, configDirName, 'community-plugins.json');
		const configFile = await fs.promises.readFile(configPath, 'utf-8');
		const config = JSON.parse(configFile);

		// Update the list of enabled plugins
		if (enabled) {
			if (!config.includes(pluginId)) {
				config.push(pluginId);
			}
		} else {
			if (config.includes(pluginId)) {
				config.splice(config.indexOf(pluginId), 1);
			}
		}

		// Save the modified config file
		await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
	}
}
