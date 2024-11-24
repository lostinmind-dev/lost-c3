export default function getDefaultLost(addonId: string) {
    const Lost: ILost = { addonId };

    return `const Lost = ${JSON.stringify(Lost)};`
}