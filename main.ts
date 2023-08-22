import {App, Notice, Plugin, PluginSettingTab, Setting} from "obsidian";

export default class ExamplePlugin extends Plugin {
	statusBarElement: HTMLSpanElement;

	onload() {
		console.log("Hey!");
		this.addSettingTab(new PluginToggleSettingsTab(this.app, this));

		console.log(this.app.internalPlugins.plugins)
		console.log(this.app.plugins.plugins)
		console.log(this.app.internalPlugins)
		console.log(this.app.plugins)
		// console.log(this.app.plugins.enabledPlugins)

	    for (const pluginsType of [this.app.internalPlugins.plugins, this.app.plugins.manifests]) {
          const pluginList: string[] = [];
          for (const pluginId in pluginsType) {
				// console.log(pluginId)
              pluginList.push(pluginId);
            }
          console.log(pluginList)
        }
		//
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
		//
		// // installed
		// const installedPlugins: string[] = [];
		//
		// for (const pluginId in this.app.plugins.manifests) {
		// 	console.log(pluginId)
		//     installedPlugins.push(pluginId);
		// 	// const pluginManifest = this.app.plugins.manifests[pluginId];
		// 	// installedPlugins.push(pluginManifest.name);
		// }
		//
		// console.log(installedPlugins);
	}
}

// interface PluginSetting {
// 	isFirstRun: boolean
// 	affectedPlugins: string[]
// }
//
// const DEFAULT_SETTINGS: PluginSetting = {
// 	isFirstRun: true,
// 	affectedPlugins: []
// }

// class PluginToggleSettingsTab extends PluginSettingTab {
// 	plugin: Plugin;
// 	settings: {
// 		isFirstRun: true,
// 		affectedPlugins: []
// 	};
//
// 	constructor(app: App, plugin: Plugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}
//
// 	display(): void {
// 		let { containerEl } = this;
//
// 		containerEl.empty();
//
// 		containerEl.createEl("h2", { text: "Plugin Toggle Settings" });
//
//
// 		// Object.values(this.app.internalPlugins.plugins).forEach((plugin : Object) => {
// 		// 	// console.log(plugin)
// 		// 	new Setting(containerEl)
// 		// 		.setName(plugin.instance.name)
// 		// 		.addToggle((toggle) => {
// 		// 			toggle.setValue(plugin.enabled).onChange(async (value) => {
// 		// 				if (value) {
// 		// 					// await this.app.plugins.enable(plugin.id);
// 		// 					plugin.enabled = true;
// 		// 					plugin._loaded = true;
// 		// 				} else {
// 		// 					// await this.app.plugins.disable(plugin.id);
// 		// 					plugin.enabled = false;
// 		// 					plugin._loaded = false;
// 		// 				}
// 		// 				console.log(plugin)
// 		// 				this.app.internalPlugins.saveSettings();
// 		// 			});
// 		// 		});
// 		// });
//
//       for (const pluginsType of [this.app.internalPlugins.plugins, this.app.plugins.manifests]) {
//         containerEl.createEl("h2", { text: "Sep Plugins" });
//         const pluginList: string[] = [];
//         for (const pluginId in pluginsType) {
//           pluginList.push(pluginId);
// 		  const pluginObject = pluginsType[pluginId];
// 		  //const pluginObject = pluginsType == this.app.plugins.manifests
//           // 			? this.app.plugins.plugins[pluginId]
//           // 			: pluginsType[pluginId];
//           //           console.log(pluginObject)
//           console.log(pluginObject)
//
//           // new Setting(containerEl)
//           //   .setName(plugin.manifest.name)
//           //   .addToggle((toggle) => {
//           //     const isEnabled = Array.from(this.app.plugins.enabledPlugins).includes(plugin.manifest.id);
//           //     console.log(Array.from(this.app.plugins.enabledPlugins))
//           //     console.log(plugin.manifest.id)
//           //     console.log(isEnabled)
//           //     toggle.setValue(isEnabled).onChange(async (value) => {
//           //       if (value) {
//           //         try {
//           //           this.app.plugins.disablePlugin(plugin.manifest.id)
//           //           // @ts-ignore
//           //           this.settings.affectedPlugins.push(plugin.manifest.id)
//           //         } catch (error) {
//           //           new Notice(`Error: ${error}`)
//           //         }
//           //       } else {
//           //         // await this.app.plugins.disable(plugin.id);
//           //         plugin.enabled = false;
//           //         plugin._loaded = false;
//           //       }
//           //       console.log(plugin)
//           //       this.app.internalPlugins.saveSettings();
//           //     });
//           //   });
//         }
//         console.log(pluginList)
//
//
//       }
//
// 		// Object.values(this.app.plugins.plugins).forEach((plugin : Object) => {
// 		// 	// console.log(plugin)
// 		// 	new Setting(containerEl)
// 		// 		.setName(plugin.manifest.name)
// 		// 		.addToggle((toggle) => {
// 		// 			const isEnabled = Array.from(this.app.plugins.enabledPlugins).includes(plugin.manifest.id);
// 		// 			console.log(Array.from(this.app.plugins.enabledPlugins))
// 		// 			console.log(plugin.manifest.id)
// 		// 			console.log(isEnabled)
// 		// 			toggle.setValue(isEnabled).onChange(async (value) => {
// 		// 				if (value) {
// 		// 					try {
// 		// 						this.app.plugins.disablePlugin(plugin.manifest.id)
// 		// 						// @ts-ignore
// 		// 						this.settings.affectedPlugins.push(plugin.manifest.id)
// 		// 					} catch (error) {
// 		// 						new Notice(`Error: ${error}`)
// 		// 					}
// 		// 				} else {
// 		// 					// await this.app.plugins.disable(plugin.id);
// 		// 					plugin.enabled = false;
// 		// 					plugin._loaded = false;
// 		// 				}
// 		// 				console.log(plugin)
// 		// 				this.app.internalPlugins.saveSettings();
// 		// 			});
// 		// 		});
// 		// });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// 		// console.log(Object.values(this.app.plugins.plugins))
// 		// Object.values(this.app.plugins.plugins).forEach((plugin : Object) => {
// 		// 	new Setting(containerEl)
// 		// 		.setName(plugin.instance.name)
// 		// 		.addToggle((toggle) => {
// 		// 			toggle.setValue(plugin.enabled).onChange(async (value) => {
// 		// 				if (value) {
// 		// 					await this.app.plugins.enable(plugin.id);
// 		// 				} else {
// 		// 					await this.app.plugins.disable(plugin.id);
// 		// 				}
// 		// 			});
// 		// 		});
// 		// });
// 	}
// }

class PluginToggleSettingsTab extends PluginSettingTab {
  plugin: Plugin;
  settings: {
    isFirstRun: true,
    affectedPlugins: []
  };

  constructor(app: App, plugin: Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Plugin Toggle Settings" });

    for (const pluginsType of [/*this.app.internalPlugins.plugins,*/ this.app.plugins.manifests]) {
      containerEl.createEl("h2", { text: "Sep Plugins" });
      const pluginList: string[] = [];
      for (const pluginId in pluginsType) {
        pluginList.push(pluginId);
        const pluginObject = pluginsType[pluginId];

        if (this.plugin.manifest.id == pluginId) continue;
        // Create a list item for each plugin
        new Setting(containerEl)
			.setName(pluginObject.name)
			.addToggle((toggle) => {
				const isEnabled = Array.from(this.app.plugins.enabledPlugins).includes(pluginObject.id);
				// console.log(Array.from(this.app.plugins.enabledPlugins))
				// console.log(plugin.manifest.id)
				// console.log(isEnabled)
				toggle.setValue(isEnabled).onChange(async (value) => {
					if (value) {
                      this.app.plugins.enablePlugin(pluginId);
                      this.app.plugins.enabledPlugins.add(pluginId);
					} else {
                      this.app.plugins.disablePlugin(pluginId);
					  this.app.plugins.enabledPlugins.delete(pluginId);
					}
					// console.log(plugin)
					// this.app.internalPlugins.saveSettings();
				});
			});
      }
      console.log(pluginList);
    }
  }
}
