import { Tool } from "@modelcontextprotocol/sdk/types.js";

interface Plugin {
  name: string;
  description: string;
  execute: (input: any) => any;
  version: string;
}

class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin with name ${plugin.name} is already registered.`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  unregisterPlugin(name: string): void {
    if (!this.plugins.has(name)) {
      throw new Error(`Plugin with name ${name} is not registered.`);
    }
    this.plugins.delete(name);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  listPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  executePlugin(name: string, input: any): any {
    const plugin = this.getPlugin(name);
    if (!plugin) {
      throw new Error(`Plugin with name ${name} not found.`);
    }
    return plugin.execute(input);
  }

  updatePluginVersion(name: string, version: string): void {
    const plugin = this.getPlugin(name);
    if (!plugin) {
      throw new Error(`Plugin with name ${name} not found.`);
    }
    plugin.version = version;
  }
}

const PLUGIN_REGISTRY_TOOL: Tool = {
  name: "pluginRegistry",
  description: "A registry for managing and executing plugins.",
  inputSchema: {
    type: "object",
    properties: {
      pluginName: { type: "string", description: "The name of the plugin to execute" },
      input: { type: "object", description: "The input to pass to the plugin" },
    },
    required: ["pluginName", "input"],
  },
};

export { PluginRegistry, PLUGIN_REGISTRY_TOOL };
