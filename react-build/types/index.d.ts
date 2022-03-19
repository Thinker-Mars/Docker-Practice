export {};

declare global {
  interface Window {
    vendor: {
      react: any,
      reactDom: any,
      redux: any,
      reactRedux: any,
      reactRouterDom: any,
      reduxThunk: any,
      reduxActions: any
    },
    vendorUtils?: any,
    vendorHelpers?: any,
    vendorHooks?: any,
    vendorConstants?: any
  }
}