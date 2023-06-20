export function getComponentName(component: any) {
  if ('displayName' in component) {
    return component.displayName;
  }

  if ('name' in component) {
    return component.name;
  }

  return 'Unknown Component';
}
