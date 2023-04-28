import React, { FC, Suspense, lazy, LazyExoticComponent } from 'react';

const LazyConfig: FC<any> = (comp:any) => (
  <Suspense fallback={<div>loading...</div>}>
    {React.createElement(lazy(comp))}
  </Suspense>
)

const LazyImportComponent = (props: {
  lazyChildren: LazyExoticComponent<() => JSX.Element>;
}) => {
  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <props.lazyChildren />
    </React.Suspense>
  );
};

export default LazyImportComponent;
