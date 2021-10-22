import { personUserLoader } from './personUserLoader';
import { companyLoader } from './companyLoader';
import { jumpDataLoader, jumpPropertiesLoader } from './jumpLoader';
import { airportLoader } from './airportLoader';
import { jumperMetadataLoader } from './jumperLoader';

// Use this to only instantiate loaders as we need them
export const getLoaderInstance = () => ({
  company: lazyLoader(companyLoader),
  personUser: lazyLoader(personUserLoader),
  hotelProperties: lazyLoader(jumpPropertiesLoader),
  hotelData: lazyLoader(jumpDataLoader),
  airport: lazyLoader(airportLoader),
  travelerMetadata: lazyLoader(jumperMetadataLoader),
});

export type Loaders = ReturnType<typeof getLoaderInstance>;

const lazyLoader = <T>(loaderFn: () => T): (() => T) => {
  let loader: T | undefined = undefined;
  return () => {
    if (!loader) {
      loader = loaderFn();
    }
    return loader;
  };
};
