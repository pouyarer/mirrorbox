import * as React from 'react';
import { ReactElement } from 'react';
import { Props as DotProps } from '../shape/Dot';
import { ImplicitLabelType } from '../component/Label';
import { IfOverflow } from '../util/IfOverflow';
import { ZIndexable } from '../zIndex/ZIndexLayer';
interface ReferenceDotProps extends ZIndexable {
    /**
     * The radius of the dot.
     *
     * @defaultValue 10
     */
    r?: number;
    /**
     * @defaultValue discard
     */
    ifOverflow?: IfOverflow;
    /**
     * The x-coordinate of the center of the dot.
     * It should match a value from the XAxis, so if the XAxis is a number axis, this should be a number.
     * If the XAxis is a category axis, this should be a string.
     */
    x?: number | string;
    y?: number | string;
    className?: number | string;
    /**
     * The id of y-axis which the dot should be attached to.
     *
     * @defaultValue 0
     */
    yAxisId?: number | string;
    /**
     * The id of x-axis which the dot should be attached to.
     *
     * @defaultValue 0
     */
    xAxisId?: number | string;
    shape?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>);
    label?: ImplicitLabelType;
    /**
     * @defaultValue 600
     */
    zIndex?: number;
}
export type Props = DotProps & ReferenceDotProps;
export declare const referenceDotDefaultProps: {
    readonly ifOverflow: "discard";
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly r: 10;
    readonly fill: "#fff";
    readonly stroke: "#ccc";
    readonly fillOpacity: 1;
    readonly strokeWidth: 1;
    readonly zIndex: 600;
};
/**
 * @provides CartesianLabelContext
 */
export declare function ReferenceDot(outsideProps: Props): React.JSX.Element;
export declare namespace ReferenceDot {
    var displayName: string;
}
export {};
