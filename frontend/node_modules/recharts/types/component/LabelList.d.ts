import * as React from 'react';
import { PropsWithoutRef, SVGProps } from 'react';
import { LabelContentType, LabelPosition, LabelFormatter } from './Label';
import { CartesianViewBoxRequired, DataKey, PolarViewBoxRequired, TrapezoidViewBox } from '../util/types';
import { LabelProps } from '../index';
import { ZIndexable } from '../zIndex/ZIndexLayer';
interface BaseLabelListEntry {
    /**
     * Value is what renders in the UI as the label content.
     * If undefined, then the LabelList will pull it from the payload using the dataKey.
     */
    value: number | string | Array<number | string> | undefined;
    /**
     * Payload is the source data object for this entry. The shape of this depends on what the user has passed
     * as the data prop to the chart.
     */
    payload: unknown;
    fill: string | undefined;
}
/**
 * This is public API because we expose it as the valueAccessor parameter.
 *
 * The properties of "viewBox" are repeated as the root props of the entry object.
 * So it doesn't matter if you read entry.x or entry.viewBox.x, they are the same.
 *
 * It's not necessary to pass redundant data, but we keep it for backward compatibility.
 */
export interface CartesianLabelListEntry extends BaseLabelListEntry, TrapezoidViewBox {
    /**
     * The bounding box of the graphical element that this label is attached to.
     * This will be an individual Bar for example.
     */
    viewBox: TrapezoidViewBox;
    parentViewBox?: CartesianViewBoxRequired;
}
export interface PolarLabelListEntry extends BaseLabelListEntry {
    viewBox: PolarViewBoxRequired;
    parentViewBox?: PolarViewBoxRequired;
    clockWise?: boolean;
}
interface LabelListProps extends ZIndexable {
    /**
     * The unique id of this component, which will be used to generate unique clip path id internally. This props is suggested to be set in SSR.
     */
    id?: string;
    /**
     * The accessor function to get the value of each label. Is ignored if dataKey is specified.
     * @param entry
     * @param index
     */
    valueAccessor?: (entry: CartesianLabelListEntry | PolarLabelListEntry, index: number) => string | number | undefined;
    /**
     * The parameter to calculate the view box of label in radial charts.
     */
    clockWise?: boolean;
    /**
     *
     * Decides how to extract the value of each label from the data:
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the value of each label.
     *
     * If set, then valueAccessor will be ignored.
     *
     * Scatter requires this prop to be set.
     * Other graphical components will show the same value as the dataKey of the component by default.
     */
    dataKey?: DataKey<Record<string, any>>;
    /**
     * If set a React element, the option is the customized React element of rendering each label.
     * If set a function, the function will be called to render each label content.
     */
    content?: LabelContentType;
    textBreakAll?: boolean;
    /**
     * The position of label relative to the view box.
     */
    position?: LabelPosition;
    /**
     * The offset to the specified "position".
     * Direction of the offset depends on the position.
     */
    offset?: LabelProps['offset'];
    /**
     * Text rotation angle in degrees.
     * The text will be rotated around the (x, y) coordinates as the pivot point.
     * Positive values rotate clockwise, negative values rotate counterclockwise.
     *
     * @defaultValue 0
     */
    angle?: number;
    /**
     * The formatter function of label value which has only one parameter - the value of label.
     */
    formatter?: LabelFormatter;
}
/**
 * LabelList props do not allow refs because the same props are reused in multiple elements so we don't have a good single place to ref to.
 */
type SvgTextProps = PropsWithoutRef<SVGProps<SVGTextElement>>;
export type Props = Omit<SvgTextProps, 'children'> & LabelListProps;
/**
 * This is the type accepted for the `label` prop on various graphical items.
 * It accepts:
 *
 * boolean:
 *    true = labels show,
 *    false = labels don't show
 * React element:
 *    will be cloned with extra props
 * function:
 *    is used as <Label content={function} />, so this will be called once for each individual label (so typically once for each data point)
 * object:
 *    the props to be passed to a LabelList component
 *
 * @inline
 */
export type ImplicitLabelListType = boolean | LabelContentType | Props;
export declare const CartesianLabelListContextProvider: React.Provider<readonly CartesianLabelListEntry[] | undefined>;
export declare const PolarLabelListContextProvider: React.Provider<readonly PolarLabelListEntry[] | undefined>;
/**
 * @consumes LabelListContext
 */
export declare function LabelList({ valueAccessor, ...restProps }: Props): React.JSX.Element | null;
export declare namespace LabelList {
    var displayName: string;
}
export declare function LabelListFromLabelProp({ label }: {
    label?: ImplicitLabelListType;
}): React.JSX.Element | null;
export {};
