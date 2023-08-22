import {App, Notice, Plugin, PluginSettingTab, Setting} from "obsidian";
import * as fs from "fs";
import * as path from "path";

export default class MainPlugin extends Plugin {
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
      if (config.includes(pluginId))
      {
        config.splice(config.indexOf(pluginId), 1);
      }
    }

    // Save the modified config file
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
  }
}

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
          // await this.plugin.saveSettings(Array.from(this.app.plugins.enabledPlugins));
          // await this.app.internalPlugins.saveSettings();
          await this.plugin.savePluginState(this.app, pluginId, value);
				});
			});
      }
      console.log(pluginList);
    }
  }
}
