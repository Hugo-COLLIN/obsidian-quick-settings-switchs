import {App, Notice, Plugin, PluginSettingTab, Setting} from "obsidian";
import * as fs from "fs";
import * as path from "path";

export default class MainPlugin extends Plugin {
	statusBarElement: HTMLSpanElement;

	onload() {
		this.addSettingTab(new PluginToggleSettingsTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on('layout-change', () => {
        // this.addToggleButtonsToLeftSidebar();
        this.registerDomEvent(
          document.querySelector('.app-container .side-dock-settings > :nth-of-type(3)'),
          'click',
          this.addToggleButtonsToLeftSidebar.bind(this)
        );
      })
    );


    // console.log(this.app.internalPlugins.plugins)
		// console.log(this.app.plugins.plugins)
		// console.log(this.app.internalPlugins)
		// console.log(this.app.plugins)
		// // console.log(this.app.plugins.enabledPlugins)
    //
	  //   for (const pluginsType of [this.app.internalPlugins.plugins, this.app.plugins.manifests]) {
    //       const pluginList: string[] = [];
    //       for (const pluginId in pluginsType) {
		// 		// console.log(pluginId)
    //           pluginList.push(pluginId);
    //         }
    //       console.log(pluginList)
    //     }
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

  addToggleButtonsToLeftSidebar() {
    console.log("YO")
    const settingsSidebar = document.querySelector('.vertical-tab-header');
    if (!settingsSidebar) return;

    console.log("HEY")
    for (const pluginId in this.app.plugins.manifests) {
      const pluginObject = this.app.plugins.manifests[pluginId];
      console.log(pluginObject)

      if (this.manifest.id == pluginId) continue;

      const listPlugins = settingsSidebar.querySelectorAll(`.vertical-tab-nav-item`);
      // console.log(listPlugins)
      listPlugins.forEach((plugin) => {
        const toggle = plugin.querySelector(`.plugin-switch`);
        if (plugin.textContent == pluginObject.name && toggle == null) {
          console.log(plugin)
          plugin.style.display = 'flex';
          plugin.style.justifyContent = 'space-between';
          const isEnabled = Array.from(this.app.plugins.enabledPlugins).includes(pluginObject.id);

          const switchButton = plugin.createEl('input', {
            type: 'checkbox',
            cls: 'plugin-switch' + (isEnabled ? ' is-enabled' : ''),
          });
          switchButton.checked = isEnabled;
          // switchButton.style.marginLeft = 'auto';

          console.log(switchButton)

          switchButton.addEventListener('change', async () => {
            await this.pluginStateChange(switchButton.checked, pluginId);
          });
        }
        return;
      });
    }
  }

  private async pluginStateChange(value: boolean, pluginId: string) {
    if (value) {
      this.app.plugins.enablePlugin(pluginId);
      this.app.plugins.enabledPlugins.add(pluginId);
      await new Promise((resolve) => setTimeout(resolve, 100)); //TODO: retry while not added
      this.addToggleButtonsToLeftSidebar();
    } else {
      this.app.plugins.disablePlugin(pluginId);
      this.app.plugins.enabledPlugins.delete(pluginId);
    }
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
				toggle.setValue(isEnabled).onChange(async (value) => {
          await this.plugin.pluginStateChange(value, pluginId);
        });
			});
      }
      console.log(pluginList);
    }
  }
}
