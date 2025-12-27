import * as React from 'react';
import { ReactElement, SVGAttributes, SVGProps } from 'react';
import { DataKey, Padding } from '../util/types';
import { OnBrushUpdate } from '../context/brushUpdateContext';
type BrushTravellerType = ReactElement<SVGElement> | ((props: TravellerProps) => ReactElement<SVGElement>);
type BrushTickFormatter = (value: any, index: number) => number | string;
interface BrushProps {
    /**
     * The x-coordinate of brush.
     * If left undefined, it will be computed from the chart's offset and margins.
     */
    x?: number;
    /**
     * The y-coordinate of brush.
     * If left undefined, it will be computed from the chart's offset and margins.
     */
    y?: number;
    dy?: number;
    /**
     * The width of brush.
     * If undefined, defaults to the chart width.
     */
    width?: number;
    className?: string;
    ariaLabel?: string;
    /**
     * The height of brush in pixels.
     *
     * @defaultValue 40
     */
    height?: number;
    /**
     * The width of each traveller.
     *
     * @defaultValue 5
     */
    travellerWidth?: number;
    traveller?: BrushTravellerType;
    /**
     * Number of data points to skip between chart refreshes.
     *
     * @defaultValue 1
     */
    gap?: number;
    padding?: Padding;
    /**
     * Decides how to extract the value of this Brush from the data:
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the value of this Brush.
     */
    dataKey?: DataKey<any>;
    /**
     * The default start index of brush.
     * If the option is not set, the start index will be 0.
     */
    startIndex?: number;
    /**
     * The default end index of brush.
     * If the option is not set, the end index will be calculated by the length of data.
     */
    endIndex?: number;
    /**
     * The formatter function of ticks.
     */
    tickFormatter?: BrushTickFormatter;
    children?: ReactElement;
    /**
     * The handler of changing the active scope of brush.
     */
    onChange?: OnBrushUpdate;
    onDragEnd?: OnBrushUpdate;
    /**
     * @defaultValue 1000
     */
    leaveTimeOut?: number;
    /**
     * @defaultValue false
     */
    alwaysShowText?: boolean;
}
export type Props = Omit<SVGProps<SVGElement>, 'onChange' | 'onDragEnd' | 'ref'> & BrushProps;
type TravellerProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: SVGAttributes<SVGElement>['stroke'];
};
export declare const defaultBrushProps: {
    readonly height: 40;
    readonly travellerWidth: 5;
    readonly gap: 1;
    readonly fill: "#fff";
    readonly stroke: "#666";
    readonly padding: {
        readonly top: 1;
        readonly right: 1;
        readonly bottom: 1;
        readonly left: 1;
    };
    readonly leaveTimeOut: 1000;
    readonly alwaysShowText: false;
};
export declare function Brush(outsideProps: Props): React.JSX.Element;
export declare namespace Brush {
    var displayName: string;
}
export {};
