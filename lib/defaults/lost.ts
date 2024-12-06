type DefaultLost = {
    varName: string;
    value: string;
}

export function getDefaultLost(addonId: string): DefaultLost {
    const Lost: ILost = { addonId };

    const varName = 'Lost';
    return {
        varName,
        value: `const ${varName} = ${JSON.stringify({
            addonId
        })};`
    }
}