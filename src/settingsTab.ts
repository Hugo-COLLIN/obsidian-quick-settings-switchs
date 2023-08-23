import {App, Plugin, PluginSettingTab, Setting} from "obsidian";

// TODO: This is for testing only
export class PluginToggleSettingsTab extends PluginSettingTab {
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
    let {containerEl} = this;

    containerEl.empty();

    containerEl.createEl("h2", {text: "Plugin Toggle Settings"});

    for (const pluginsType of [/*this.app.internalPlugins.plugins,*/ this.app.plugins.manifests]) {
      containerEl.createEl("h2", {text: "Sep Plugins"});
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
