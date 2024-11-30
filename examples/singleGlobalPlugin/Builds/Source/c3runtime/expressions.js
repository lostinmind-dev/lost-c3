const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;

C3.Plugins[Lost.addonId].Exps = {
  GetValue: function GetValue() {
    return 2;
  }
}