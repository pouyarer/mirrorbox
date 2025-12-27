import * as React from 'react';
import { Props as TrapezoidProps } from '../shape/Trapezoid';
import { ImplicitLabelListType } from '../component/LabelList';
import { ActiveShape, AnimationDuration, AnimationTiming, CartesianViewBoxRequired, ChartOffsetInternal, Coordinate, DataKey, LegendType, PresentationAttributesAdaptChildEvent, TooltipType, TrapezoidViewBox } from '../util/types';
import { TooltipPayload } from '../state/tooltipSlice';
import { GraphicalItemId } from '../state/graphicalItemsSlice';
export type FunnelTrapezoidItem = TrapezoidProps & TrapezoidViewBox & {
    value?: number | string;
    payload?: any;
    tooltipPosition: Coordinate;
    name: string;
    labelViewBox: TrapezoidViewBox;
    parentViewBox: CartesianViewBoxRequired;
    val: number | ReadonlyArray<number>;
    tooltipPayload: TooltipPayload;
};
/**
 * External props, intended for end users to fill in
 */
interface FunnelProps {
    activeShape?: ActiveShape<FunnelTrapezoidItem, SVGPathElement>;
    /**
     * @defaultValue 400
     */
    animationBegin?: number;
    /**
     * @defaultValue 1500
     */
    animationDuration?: AnimationDuration;
    /**
     * @defaultValue ease
     */
    animationEasing?: AnimationTiming;
    className?: string;
    data?: any[];
    dataKey: DataKey<any>;
    /**
     * @defaultValue false
     */
    hide?: boolean;
    id?: string;
    /**
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    label?: ImplicitLabelListType;
    /**
     * @defaultValue triangle
     */
    lastShapeType?: 'triangle' | 'rectangle';
    /**
     * @defaultValue rect
     */
    legendType?: LegendType;
    /**
     * @defaultValue name
     */
    nameKey?: DataKey<any>;
    onAnimationEnd?: () => void;
    onAnimationStart?: () => void;
    reversed?: boolean;
    shape?: ActiveShape<FunnelTrapezoidItem, SVGPathElement>;
    tooltipType?: TooltipType;
}
type FunnelSvgProps = Omit<PresentationAttributesAdaptChildEvent<any, SVGElement> & TrapezoidProps, 'ref'>;
export type Props = FunnelSvgProps & FunnelProps;
type RealFunnelData = unknown;
export declare const defaultFunnelProps: {
    readonly animationBegin: 400;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly fill: "#808080";
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly lastShapeType: "triangle";
    readonly legendType: "rect";
    readonly nameKey: "name";
    readonly reversed: false;
    readonly stroke: "#fff";
};
export declare function computeFunnelTrapezoids({ dataKey, nameKey, displayedData, tooltipType, lastShapeType, reversed, offset, customWidth, graphicalItemId, }: {
    dataKey: Props['dataKey'];
    nameKey: Props['nameKey'];
    offset: ChartOffsetInternal;
    displayedData: ReadonlyArray<RealFunnelData>;
    tooltipType?: TooltipType;
    lastShapeType?: Props['lastShapeType'];
    reversed?: boolean;
    customWidth: number | string | undefined;
    graphicalItemId: GraphicalItemId;
}): ReadonlyArray<FunnelTrapezoidItem>;
export declare function Funnel(outsideProps: Props): React.JSX.Element;
export declare namespace Funnel {
    var displayName: string;
}
export {};
