import { ComponentType } from 'react';
import { CurveType, Props as CurveProps } from '../shape/Curve';
import { ImplicitLabelListType } from '../component/LabelList';
import { StackId } from '../util/ChartUtils';
import { ActiveDotType, AnimationDuration, AnimationTiming, DataKey, DotType, LegendType, NullableCoordinate, TickItem, TooltipType } from '../util/types';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors';
import { ChartData } from '../state/chartDataSlice';
import { ComputedArea } from '../state/selectors/areaSelectors';
import { AreaSettings } from '../state/types/AreaSettings';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { AxisId } from '../state/cartesianAxisSlice';
import { StackDataPoint } from '../util/stacks/stackTypes';
/**
 * @inline
 */
export type BaseValue = number | 'dataMin' | 'dataMax';
/**
 * External props, intended for end users to fill in
 */
interface AreaProps extends ZIndexable {
    /**
     * The dot is shown when user enter an area chart and this chart has tooltip.
     * If false set, no active dot will not be drawn.
     * If true set, active dot will be drawn which have the props calculated internally.
     * If object set, active dot will be drawn which have the props merged by the internal calculated props and the option.
     * If ReactElement set, the option can be the custom active dot element.
     * If set a function, the function will be called to render customized active dot.
     *
     * @defaultValue true
     */
    activeDot?: ActiveDotType;
    /**
     * Specifies when the animation should begin, the unit of this option is ms.
     * @defaultValue 0
     */
    animationBegin?: number;
    /**
     * Specifies the duration of animation, the unit of this option is ms.
     * @defaultValue 1500
     */
    animationDuration?: AnimationDuration;
    /**
     * The type of easing function.
     * @defaultValue 'ease'
     */
    animationEasing?: AnimationTiming;
    /**
     * Baseline of the area:
     * - number: uses the corresponding axis value as a flat baseline;
     * - an array of coordinates: describes a custom baseline path.
     */
    baseLine?: number | ReadonlyArray<NullableCoordinate>;
    baseValue?: BaseValue;
    className?: string;
    /**
     * Whether to connect the area across null points.
     * @defaultValue false
     */
    connectNulls?: boolean;
    data?: ChartData;
    /**
     * Decides how to extract the value of this Area from the data:
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the value of this Area.
     *
     * If undefined, it will reuse the dataKey of YAxis.
     */
    dataKey: DataKey<any>;
    /**
     * If false set, dots will not be drawn.
     * If true set, dots will be drawn which have the props calculated internally.
     * If object set, dots will be drawn which have the props merged by the internal calculated props and the option.
     * If ReactElement set, the option can be the custom dot element.
     * If set a function, the function will be called to render customized dot.
     * @defaultValue false
     */
    dot?: DotType;
    /**
     * @defaultValue false
     */
    hide?: boolean;
    /**
     * Unique identifier of this component.
     * Used as a HTML attribute `id`, and also to identify this element internally.
     *
     * If undefined, Recharts will generate a unique ID automatically.
     */
    id?: string;
    /**
     * If set false, animation of area will be disabled.
     * If set "auto", the animation will be disabled in SSR and enabled in browser.
     * @defaultValue 'auto'
     */
    isAnimationActive?: boolean | 'auto';
    isRange?: boolean;
    /**
     * Renders one label for each data point. Options:
     * - `true`: renders default labels;
     * - `false`: no labels are rendered;
     * - `object`: the props of LabelList component;
     * - `ReactElement`: a custom label element;
     * - `function`: a render function of custom label.
     *
     * @defaultValue false
     */
    label?: ImplicitLabelListType;
    /**
     * The type of icon in legend.
     * If set to 'none', no legend item will be rendered.
     * @defaultValue 'line'
     */
    legendType?: LegendType;
    /**
     * The name of data.
     * This option will be used in tooltip and legend to represent this graphical item.
     * If no value was set to this option, the value of dataKey will be used alternatively.
     */
    name?: string | number;
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    /**
     * When two Areas have the same axisId and same stackId, then the two Areas are stacked in the chart.
     */
    stackId?: StackId;
    /**
     * The stroke color. If "none", no line will be drawn.
     * @defaultValue '#3182bd'
     */
    stroke?: string;
    /**
     * The width of the stroke
     * @defaultValue 1
     */
    strokeWidth?: string | number;
    tooltipType?: TooltipType;
    /**
     * The interpolation type of curve. Allows custom interpolation function.
     *
     * @defaultValue linear
     * @link https://github.com/d3/d3-shape#curves
     * @see {@link https://recharts.github.io/en-US/examples/CardinalAreaChart/ An AreaChart which has two area with different interpolation.}
     */
    type?: CurveType;
    /**
     * The unit of data. This option will be used in tooltip.
     */
    unit?: string | number;
    /**
     * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
     * @defaultValue 0
     */
    xAxisId?: AxisId;
    /**
     * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
     * @defaultValue 0
     */
    yAxisId?: AxisId;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue 100
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
}
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */
type AreaSvgProps = Omit<CurveProps, 'points' | 'ref' | 'layout' | 'path' | 'pathRef' | 'baseLine' | 'dangerouslySetInnerHTML'>;
export type Props = AreaSvgProps & AreaProps;
export declare const defaultAreaProps: {
    readonly activeDot: true;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly connectNulls: false;
    readonly dot: false;
    readonly fill: "#3182bd";
    readonly fillOpacity: 0.6;
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly legendType: "line";
    readonly stroke: "#3182bd";
    readonly strokeWidth: 1;
    readonly type: "linear";
    readonly label: false;
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly zIndex: 100;
};
export declare const getBaseValue: (layout: "horizontal" | "vertical", chartBaseValue: BaseValue | undefined, itemBaseValue: BaseValue | undefined, xAxis: BaseAxisWithScale, yAxis: BaseAxisWithScale) => number;
export declare function computeArea({ areaSettings: { connectNulls, baseValue: itemBaseValue, dataKey }, stackedData, layout, chartBaseValue, xAxis, yAxis, displayedData, dataStartIndex, xAxisTicks, yAxisTicks, bandSize, }: {
    areaSettings: AreaSettings;
    stackedData: ReadonlyArray<StackDataPoint> | undefined;
    layout: 'horizontal' | 'vertical';
    chartBaseValue: BaseValue | undefined;
    xAxis: BaseAxisWithScale;
    yAxis: BaseAxisWithScale;
    displayedData: ChartData;
    dataStartIndex: number;
    xAxisTicks: TickItem[];
    yAxisTicks: TickItem[];
    bandSize: number;
}): ComputedArea;
/**
 * @provides LabelListContext
 * @consumes CartesianChartContext
 */
export declare const Area: ComponentType<Props>;
export {};
