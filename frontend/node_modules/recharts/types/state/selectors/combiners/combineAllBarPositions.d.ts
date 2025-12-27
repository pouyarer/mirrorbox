import { BarWithPosition, SizeList } from '../barSelectors';
export declare const combineAllBarPositions: (sizeList: SizeList, globalMaxBarSize: number, barGap: string | number, barCategoryGap: string | number, barBandSize: number, bandSize: number, childMaxBarSize: number | undefined) => ReadonlyArray<BarWithPosition> | undefined;
