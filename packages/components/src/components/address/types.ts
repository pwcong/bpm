export interface IValueItem {
  id: string;
  name: string;
  department?: string
  avatar?: string;
}

export type IValue = Array<IValueItem>;

export interface IApi {
  search: (keyword: string) => Promise<IValue>;
}

export interface IOptions {
  api: IApi;
}
