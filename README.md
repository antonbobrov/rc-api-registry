# React Components API Registry

## See [Docs](https://antonbobrov.github.io/rc-api-registry/)

## Installation

```bash
npm i rc-api-registry
```

## How to use

### components/Banner.tsx

```tsx
import React, { CSSProperties, FC, ReactNode } from 'react';
import cn from 'classnames';
import { registerComponent } from 'rc-api-registry';

interface IBannerProps {
  title: string;
  description: string;
}

interface IProps extends IBannerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  isLarge?: boolean;
}

const Component: FC<IProps> = ({
  className,
  style,
  title,
  description,
  isLarge,
  children,
}) => (
  <div
    className={cn(className, 'banner')}
    style={style}
  >
    <h1>
      {title} {isLarge && '(large)'}
    </h1>

    <p>{description}</p>

    {children}
  </div>
);

export const Banner = registerComponent<IBannerProps>()(Component, 'Banner');

```

### components/Quote.tsx

```tsx
import React, { FC, CSSProperties } from 'react';
import cn from 'classnames';
import { registerComponent } from 'rc-api-registry';

export interface IQuoteProps {
  quote: string;
}

export interface IProps extends IQuoteProps {
  className?: string;
  style?: CSSProperties;
}

const Component: FC<IProps> = ({ className, style, quote }) => (
  <div className={cn(className, 'quote')} style={style}>
    {quote}
  </div>
);

export const Quote = registerComponent()(Component, 'Quote');

```

### components/registry.ts

```ts
import { ComponentsRegistry } from 'rc-api-registry';
import { Banner } from './Banner';
import { Quote } from './Quote';

export const registry = new ComponentsRegistry([Banner, Quote]);

```

### App.tsx

```tsx
import React from 'react';
import { TRegistryComponentsAPI } from 'rc-api-registry';
import { registry } from './Components/registry';

const data: TRegistryComponentsAPI<typeof registry> = [
  {
    key: 0,
    componentName: 'Banner',
    props: {
      title: 'Title',
      description: 'Description',
    },
    children: [
      {
        key: 2,
        componentName: 'Quote',
        props: {
          quote: 'Some quote',
        },
      },
    ],
  },
  {
    key: 1,
    componentName: 'Quote',
    props: {
      quote: 'Some quote',
    },
  },
];

const App = () => (
  <>
    {registry.render(
      data,
      undefined,
      ({ key, componentName, Component, props }) => {
        if (componentName === 'Banner') {
          return (
            <Component key={key} {...props}>
              {props.children}

              <div>additional children</div>
            </Component>
          );
        }

        return <Component key={key} {...props} />;
      }
    )}
  </>
);

export default App;

```
