import { ValueOf } from 'ts-essentials';
import cn from 'classnames';
import React from 'react';
import { TRegistryComponent } from './registerComponent';
import { getComponentName } from '../utils/getComponentName';
import {
  TRegistryComponentsAPI,
  TRegistryCustomRenderer,
  TRegistryRenderProps,
} from './types';
import { camelToSnakeCase } from '../utils/camelToSnakeCase';

/** Extract a single component by its name */
type TExtractComponentByName<
  Names,
  Components extends { __crComponentName: Names },
  Name
> = Components extends { __crComponentName: Name } ? Components : never;

/** Components Registry */
export class ComponentsRegistry<T extends TRegistryComponent<any, any, any>[]> {
  /** Array of components */
  private _components: T;

  /** Get all registered components */
  get components() {
    return this._components;
  }

  constructor(components: T) {
    const names: string[] = [];

    const componentsList = components.map((component) => {
      // check if component is registered and has a name
      if (!component.__crComponentName) {
        // eslint-disable-next-line no-console
        console.error(
          `Component "${getComponentName(component)}" has not been registered`
        );

        return null;
      }

      // check if component already exists
      if (names.includes(component.__crComponentName)) {
        // eslint-disable-next-line no-console
        console.error(
          `Component "${component.__crComponentName}" already exists in the registry`
        );

        return null;
      }

      names.push(component.__crComponentName);

      return component;
    });

    const validComponents = componentsList.filter(
      (component) => !!component
    ) as typeof components;

    this._components = validComponents;
  }

  /** Get component by name */
  getComponentByName<GetName extends ValueOf<T>['__crComponentName']>(
    name: GetName
  ): TExtractComponentByName<
    ValueOf<T>['__crComponentName'],
    ValueOf<typeof this.components>,
    GetName
  > {
    const component = this._components.find(
      (item) => item.__crComponentName === name
    );

    return component as any;
  }

  /** Check if API has a component */
  apiHas(
    apiComponents: TRegistryComponentsAPI<this>,
    name: ValueOf<T>['__crComponentName']
  ) {
    return !!apiComponents.find(({ componentName }) => componentName === name);
  }

  /** Render components */
  render(
    apiComponentsProp: TRegistryComponentsAPI<this>,
    { cssModule, order }: TRegistryRenderProps<this> = {},
    render?: TRegistryCustomRenderer<this>
  ) {
    let components = apiComponentsProp;

    // sort components
    if (order) {
      components = [];

      // sort components that are listed in the `order`
      order.forEach((name) => {
        components.push(
          ...apiComponentsProp.filter(
            ({ componentName }) => componentName === name
          )
        );
      });

      // add components that are not listed in the `order`
      apiComponentsProp.forEach((component) => {
        if (!order.includes(component.componentName)) {
          components.push(component);
        }
      });
    }

    return (
      <>
        {components.map(
          ({
            key,
            componentName,
            props: startProps,
            children: childrenProp,
          }) => {
            const Component = this.getComponentByName(componentName) as any;

            const children = childrenProp
              ? this.render(childrenProp, { cssModule, order }, render)
              : undefined;

            const props = {
              ...startProps,
              children,
              className: cn(
                startProps.className,
                cssModule && cssModule[camelToSnakeCase(componentName)]
              ),
            };

            if (!Component) {
              return (
                <div key={key}>
                  Unregistered component `{componentName as string}`
                </div>
              );
            }

            if (render) {
              const result = render({
                key,
                componentName,
                props,
                Component,
              });

              if (typeof result === 'undefined') {
                throw new Error('Render method should return something!');
              }

              return result;
            }

            return (
              <Component
                key={key}
                {...props}
                className={cn(
                  props.className,
                  cssModule && cssModule[camelToSnakeCase(componentName)]
                )}
              />
            );
          }
        )}
      </>
    );
  }
}
