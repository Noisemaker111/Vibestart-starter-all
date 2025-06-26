export type Integration = {
  key: string;
  label: string;
};

export type SpecificationResponse = {
  specification: string;
  integrations: Integration[];
}; 