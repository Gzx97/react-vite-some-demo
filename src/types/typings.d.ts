declare module "*.css";
declare module "*.less";
declare module "*.png";
declare module "*.jpg";
declare module "*.svg" {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;

  const url: string;
  export default url;
}

declare module "*.yml";
declare module "*.yaml";

// interface Response<T = any> {
//   data: T;
//   statue: {
//     code: string;
//   };
//   code?: number;
// }
