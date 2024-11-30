const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;

C3.Behaviors[Lost.addonId].Cnds = {
  onCondition: function onCondition() {
    return false;
  }
}