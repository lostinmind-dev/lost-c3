import { PackageBundler } from "./package-manager.ts";

type BundlePackageOptions = {
    readonly type: 'npm' | 'jsr';
    readonly packageName: string;
}

export default async function bundlePackage(opts: BundlePackageOptions) {

    await PackageBundler.bundle(opts.packageName);

}