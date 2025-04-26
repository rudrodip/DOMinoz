export type ComponentFunction = (props: any) => VNode;

export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string)[];
  key?: string | number;
}

export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> = {},
  ...children: (VNode | string | null | undefined | boolean | number | any[])[]
): VNode {
  const key = props?.key;
  
  const flatChildren = children
    .flat(Infinity)
    .filter(child => child !== null && child !== undefined && child !== false)
    .map(child => 
      typeof child === 'object' && child !== null ? child : String(child)
    ) as (VNode | string)[];
  
  const newProps = { ...props };
  if (key !== undefined) {
    delete newProps.key;
  }
  
  return {
    type,
    props: newProps,
    children: flatChildren,
    key
  };
}
