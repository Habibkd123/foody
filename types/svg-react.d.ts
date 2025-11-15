declare module '*.svg?react' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const Default: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Default;
}
