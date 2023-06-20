import {
  ComponentProps,
  ComponentType,
  PropsWithoutRef,
  ReactNode,
} from 'react';

type TStringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

type TReactComponent = ComponentType<any>;

type TReactComponentProps<
  Component extends TReactComponent,
  Props
> = Props extends undefined
  ? PropsWithoutRef<
      Omit<
        ComponentProps<Component>,
        'key' | 'children' | 'className' | 'style'
      >
    >
  : Props;

type TReactComponentRenderProps<
  Component extends TReactComponent,
  Props
> = TReactComponentProps<Component, Props> & {
  children?: ReactNode;
  className?: string;
};

export type TRegistryComponent<
  Props,
  Component extends TReactComponent,
  Name
> = Component & {
  /** Component name */
  __crComponentName: Name;
  /** API types */
  __crComponentApiTypes: {
    key: string | number;
    componentName: Name;
    /** API props */
    props: TReactComponentProps<Component, Props>;
  };
  /** Renderer types */
  __crComponentRenderProps: {
    key: string | number;
    componentName: Name;
    /** API props */
    props: TReactComponentRenderProps<Component, Props>;
    /** Component instance */
    Component: ComponentType<ComponentProps<Component>>;
  };
};

/** Register a component for further usage in ComponentsRegistry */
export function registerComponent<Props = undefined>() {
  return function register<Component extends TReactComponent, Name>(
    component: Component,
    name: TStringLiteral<Name>
  ): TRegistryComponent<Props, Component, Name> {
    const Instance = component as TRegistryComponent<Props, Component, Name>;

    if (!Instance.displayName) {
      Instance.displayName = name;
    }

    Instance.__crComponentName = name;

    return Instance;
  };
}
