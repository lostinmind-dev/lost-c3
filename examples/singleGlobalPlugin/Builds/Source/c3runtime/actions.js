const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;

C3.Plugins[Lost.addonId].Acts = {
  doAction: function doAction() {
    console.log('hello');
    console.log('hello');
    console.log('hello');
    console.log('hello');
    console.log('hello');
  }
}