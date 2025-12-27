/**
 * @fileOverview Dot
 */
import * as React from 'react';
import { PresentationAttributesWithProps, RechartsMouseEventHandler } from '../util/types';
interface DotProps {
    className?: string;
    /**
     * The x-coordinate of center.
     */
    cx?: number;
    /**
     * The y-coordinate of center.
     */
    cy?: number;
    /**
     * The radius of dot.
     */
    r?: number | string;
    clipDot?: boolean;
    /**
     * The customized event handler of click in this chart.
     */
    onClick?: RechartsMouseEventHandler<Props>;
}
export type Props = PresentationAttributesWithProps<DotProps, SVGCircleElement> & DotProps;
export declare const Dot: React.FC<Props>;
export {};
