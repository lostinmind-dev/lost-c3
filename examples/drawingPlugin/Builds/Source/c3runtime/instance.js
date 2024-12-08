const Lost = {"addonId":"LostPluginId"};
class LostDrawingInstance extends globalThis.ISDKWorldInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Plugins[Lost.addonId].Cnds;
    }
    _release() {
        super._release();
    }
    _draw(renderer) {
        const imageInfo = this.objectType.getImageInfo();
        const texture = imageInfo.getTexture(renderer);
        if (!texture)
            return; // dynamic texture load which hasn't completed yet; can't draw anything
        let quad = this.getBoundingQuad();
        const rcTex = imageInfo.getTexRect();
        renderer.setTexture(texture);
        if (this.runtime.isPixelRoundingEnabled) {
            const ox = Math.round(this.x) - this.x;
            const oy = Math.round(this.y) - this.y;
            if (ox !== 0 && oy !== 0) {
                quad = new DOMQuad(new DOMPoint(quad.p1.x + ox, quad.p1.y + oy), new DOMPoint(quad.p2.x + ox, quad.p2.y + oy), new DOMPoint(quad.p3.x + ox, quad.p3.y + oy), new DOMPoint(quad.p4.x + ox, quad.p4.y + oy));
            }
        }
        renderer.quad3(quad, rcTex);
    }
}
export {};

globalThis.C3.Plugins["LostPluginId"].Instance = LostDrawingInstance;