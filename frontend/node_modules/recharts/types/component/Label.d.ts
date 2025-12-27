import * as React from 'react';
import { ReactElement, ReactNode, SVGProps } from 'react';
import { RenderableText, TextAnchor, TextVerticalAnchor } from './Text';
import { DataKey, Percent, PolarViewBoxRequired, TrapezoidViewBox, ViewBox } from '../util/types';
import { ZIndexable } from '../zIndex/ZIndexLayer';
/**
 * @inline
 */
export type LabelContentType = ReactElement | ((props: Props) => RenderableText | ReactElement);
type CartesianLabelPosition = 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideBottomLeft' | 'insideTopRight' | 'insideBottomRight' | 'insideStart' | 'insideEnd' | 'end' | 'center' | 'centerTop' | 'centerBottom' | 'middle' | {
    x?: number | Percent;
    y?: number | Percent;
};
type PolarLabelPosition = 'insideStart' | 'insideEnd' | 'end';
/**
 * @inline
 */
export type LabelPosition = CartesianLabelPosition | PolarLabelPosition;
/**
 * @inline
 */
export type LabelFormatter = (label: RenderableText) => RenderableText;
interface LabelProps extends ZIndexable {
    /**
     * The box of viewing area. Used for positioning.
     * If undefined, viewBox will be calculated based on surrounding context.
     */
    viewBox?: ViewBox;
    parentViewBox?: ViewBox;
    /**
     * The formatter function of label value which has only one parameter - the value of label.
     */
    formatter?: LabelFormatter;
    /**
     * The value of label can be set as children or as the `value` prop
     *
     * @example <Label value="foo" />
     */
    value?: RenderableText;
    /**
     * The offset to the specified "position". Direction of the offset depends on the position.
     *
     * @defaultValue 5
     */
    offset?: number;
    /**
     * The position of label relative to the view box.
     *
     * @defaultValue middle
     */
    position?: LabelPosition;
    /**
     * The value of label can be set as children or as the `value` prop
     *
     * @example <Label>foo</Label>
     */
    children?: RenderableText;
    className?: string;
    /**
     * If set a React element, the option is the custom react element of rendering label.
     * If set a function, the function will be called to render label content.
     *
     * @example <Label content={CustomizedLabel} />
     * @example
     * const renderCustomLabel = (props) => <text {...props}>Custom Label</text>;
     * <Label content={renderCustomLabel} />
     */
    content?: LabelContentType;
    /**
     * @defaultValue false
     */
    textBreakAll?: boolean;
    /**
     * Text rotation angle in degrees.
     * The text will be rotated around the (x, y) coordinates as the pivot point.
     * Positive values rotate clockwise, negative values rotate counterclockwise.
     *
     * @defaultValue 0
     */
    angle?: number;
    index?: number;
    labelRef?: React.RefObject<SVGTextElement> | null;
    /**
     * @since 3.4
     * @defaultValue 2000
     */
    zIndex?: number;
    /**
     * The unique id of this component, which will be used to generate unique clip path id internally. This props is suggested to be set in SSR.
     */
    id?: string;
}
export type Props = Omit<SVGProps<SVGTextElement>, 'viewBox'> & LabelProps;
export type ImplicitLabelType = boolean | string | number | ReactElement<SVGElement> | ((props: any) => RenderableText | ReactElement) | (Props & {
    dataKey?: DataKey<any>;
});
export declare const CartesianLabelContextProvider: ({ x, y, upperWidth, lowerWidth, width, height, children, }: TrapezoidViewBox & {
    children: ReactNode;
}) => React.JSX.Element;
export declare const PolarLabelContextProvider: ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise, children, }: PolarViewBoxRequired & {
    children: ReactNode;
}) => React.JSX.Element;
export declare const usePolarLabelContext: () => PolarViewBoxRequired | undefined;
export declare const isLabelContentAFunction: (content: unknown) => content is (props: Props) => React.ReactNode;
export type CartesianLabelPositionInput = {
    parentViewBox?: ViewBox;
    offset: number;
    position?: CartesianLabelPosition;
};
export type LabelPositionAttributes = {
    x: number;
    y: number;
    textAnchor: TextAnchor;
    verticalAnchor: TextVerticalAnchor;
    width?: number;
    height?: number;
};
export declare const getAttrsOfCartesianLabel: (props: CartesianLabelPositionInput, viewBox: TrapezoidViewBox) => LabelPositionAttributes;
export declare const defaultLabelProps: {
    readonly angle: 0;
    readonly offset: 5;
    readonly zIndex: 2000;
    readonly position: "middle";
    readonly textBreakAll: false;
};
/**
 * @consumes CartesianViewBoxContext
 * @consumes PolarViewBoxContext
 * @consumes CartesianLabelContext
 * @consumes PolarLabelContext
 */
export declare function Label(outerProps: Props): React.JSX.Element | null;
export declare namespace Label {
    var displayName: string;
}
export declare function CartesianLabelFromLabelProp({ label, labelRef, }: {
    label: ImplicitLabelType | undefined;
    labelRef?: React.RefObject<SVGTextElement> | null;
}): React.JSX.Element | null;
export declare function PolarLabelFromLabelProp({ label }: {
    label: ImplicitLabelType | undefined;
}): React.JSX.Element | null;
export {};
