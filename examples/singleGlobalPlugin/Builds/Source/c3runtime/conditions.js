const Lost = {"addonId":"LostPluginId"};

const C3 = globalThis.C3;
 C3.Plugins[Lost.addonId].Cnds = {
  onCondition: function onCondition() {
    return false;
  }
}