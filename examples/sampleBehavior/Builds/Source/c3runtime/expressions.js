const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;

C3.Behaviors[Lost.addonId].Exps = {
  MyExpression: function MyExpression() {
    return 1337;
  }
}