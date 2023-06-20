import { ValueOf } from 'ts-essentials';
import { ReactNode } from 'react';
import { ComponentsRegistry } from './ComponentsRegistry';

/** Components registry with any component */
type TRegistryAny = ComponentsRegistry<any>;

/** External API schema for a single component */
export type TRegistryComponentAPI<T extends TRegistryAny> = ValueOf<
  T['components']
>['__crComponentApiTypes'];

/** External API schema for all components */
export type TRegistryComponentsAPI<T extends TRegistryAny> =
  (TRegistryComponentAPI<T> & {
    children?: null | TRegistryComponentsAPI<T>;
  })[];

/** Render method */
export type TRegistryRenderProps<T extends TRegistryAny> = {
  cssModule?: any;
  order?: ValueOf<T['components']>['__crComponentName'][];
};

/** Custom render method props */
export type TRegistryCustomRendererProps<T extends TRegistryAny> = ValueOf<
  T['components']
>['__crComponentRenderProps'];

/** Render method */
export type TRegistryCustomRenderer<T extends TRegistryAny> = (
  props: TRegistryCustomRendererProps<T>
) => ReactNode;
