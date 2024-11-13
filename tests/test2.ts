import { Property } from '../mod.ts';

const a = new Property<SDK.ITypeBase | SDKEditorInstanceClass>({
    Type: 'link',
    Id: 'my-link',
    Name: '',
    CallbackType: 'once-for-type',
    Callback: (sdkType) => {
        console.log(sdkType)
    }
})