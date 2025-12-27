/**
 * @fileOverview Curve
 */
import * as React from 'react';
import { Ref } from 'react';
import { CurveFactory } from 'victory-vendor/d3-shape';
import { LayoutType, PresentationAttributesWithProps, NullableCoordinate, RechartsMouseEventHandler } from '../util/types';
/**
 * @inline
 */
export type CurveType = 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bump' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | CurveFactory;
interface CurveProps {
    className?: string;
    /**
     * The interpolation type of curve. Allows custom interpolation function.
     *
     * @defaultValue linear
     * @link https://github.com/d3/d3-shape#curves
     * @see {@link https://recharts.github.io/en-US/examples/CardinalAreaChart/|An AreaChart which has two area with different interpolation.}
     */
    type?: CurveType;
    /**
     * This option affects the interpolation algorithm when the `type` prop is set to 'monotone'.
     * It also specifies the type of baseline when the curve is closed.
     */
    layout?: LayoutType;
    /**
     * Baseline of the area:
     * - number: uses the corresponding axis value as a flat baseline;
     * - an array of coordinates: describes a custom baseline path.
     */
    baseLine?: number | ReadonlyArray<NullableCoordinate>;
    /**
     * The coordinates of all the points in the curve.
     */
    points?: ReadonlyArray<NullableCoordinate>;
    /**
     * Whether to connect the curve across null points.
     *
     * @defaultValue false
     */
    connectNulls?: boolean;
    path?: string;
    pathRef?: Ref<SVGPathElement>;
}
export type CurveMouseEventHandler = RechartsMouseEventHandler<Props, SVGPathElement>;
type CurveMouseEvents = {
    /**
     * The customized event handler of click on the curve
     */
    onClick?: CurveMouseEventHandler;
    /**
     * The customized event handler of mouseenter on the curve
     */
    onMouseEnter?: CurveMouseEventHandler;
    /**
     * The customized event handler of mouseleave on the curve
     */
    onMouseLeave?: CurveMouseEventHandler;
    /**
     * The customized event handler of mousedown on the curve
     */
    onMouseDown?: CurveMouseEventHandler;
    /**
     * The customized event handler of mouseup on the curve
     */
    onMouseUp?: CurveMouseEventHandler;
    /**
     * The customized event handler of mousemove on the curve
     */
    onMouseMove?: CurveMouseEventHandler;
    /**
     * The customized event handler of mouseover on the curve
     */
    onMouseOver?: CurveMouseEventHandler;
    /**
     * The customized event handler of mouseout on the curve
     */
    onMouseOut?: CurveMouseEventHandler;
};
export type Props = Omit<PresentationAttributesWithProps<CurveProps, SVGPathElement>, 'type' | 'points' | 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onMouseDown' | 'onMouseUp' | 'onMouseMove' | 'onMouseOver' | 'onMouseOut'> & CurveMouseEvents & CurveProps;
type GetPathProps = Pick<Props, 'type' | 'points' | 'baseLine' | 'layout' | 'connectNulls'>;
/**
 * Calculate the path of curve. Returns null if points is an empty array.
 * @return path or null
 */
export declare const getPath: ({ type, points, baseLine, layout, connectNulls, }: GetPathProps) => string | null;
export declare const Curve: React.FC<Props>;
export {};
